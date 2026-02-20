---
sidebar_position: 4
sidebar_label: Writing Health Probes
---

# Writing Health Probes

Muto's health monitoring system is designed to be extensible. While the built-in probe types (topic frequency, topic staleness, process health, custom script) cover common cases, you may need to create custom probes for application-specific health checks.

## The HealthProbe Base Class

All probes extend the abstract `HealthProbe` class from `muto_core`:

```python
from abc import ABC, abstractmethod
from muto_core.models.health import HealthState, ProbeResult
from muto_core.health.probe import HealthProbe, ProbeConfig

class HealthProbe(ABC):
    """Base class for all health probes."""

    def __init__(self, config: ProbeConfig):
        self.config = config
        self.last_result: ProbeResult | None = None

    async def execute(self) -> ProbeResult:
        """Execute the probe with error handling and timing."""
        try:
            result = await self._do_check()
            self.last_result = result
            return result
        except Exception as e:
            result = ProbeResult(
                probe_id=self.config.probe_id,
                state=HealthState.FAILED,
                message=f"Probe error: {e}",
                timestamp=time.time(),
            )
            self.last_result = result
            return result

    @abstractmethod
    async def _do_check(self) -> ProbeResult:
        """Subclasses implement this method."""
        ...
```

The `execute()` wrapper handles:
- Exception catching — if your probe throws, it reports FAILED
- Result storage — the last result is always accessible
- Timing — the health engine tracks how long each probe takes

You only need to implement `_do_check()`.

## Example: Battery Level Probe

A probe that checks battery state of charge:

```python
import time
from muto_core.models.health import HealthState, ProbeResult
from muto_core.health.probe import HealthProbe, ProbeConfig


class BatteryLevelProbe(HealthProbe):
    """Checks battery state of charge."""

    def __init__(self, config: ProbeConfig, battery_topic: str):
        super().__init__(config)
        self.battery_topic = battery_topic
        self._last_battery_pct: float | None = None

    def update_battery(self, percentage: float):
        """Called by a ROS 2 subscriber callback."""
        self._last_battery_pct = percentage

    async def _do_check(self) -> ProbeResult:
        if self._last_battery_pct is None:
            return ProbeResult(
                probe_id=self.config.probe_id,
                state=HealthState.UNKNOWN,
                message="No battery data received yet",
                timestamp=time.time(),
            )

        pct = self._last_battery_pct

        if pct < 10:
            state = HealthState.FAILED
            message = f"Critical battery: {pct:.1f}%"
        elif pct < 25:
            state = HealthState.DEGRADED
            message = f"Low battery: {pct:.1f}%"
        else:
            state = HealthState.HEALTHY
            message = f"Battery OK: {pct:.1f}%"

        return ProbeResult(
            probe_id=self.config.probe_id,
            state=state,
            message=message,
            timestamp=time.time(),
            value=pct,  # Numeric value for dashboards
        )
```

## Example: Network Latency Probe

A probe that checks round-trip time to a gateway:

```python
import asyncio
import time
from muto_core.models.health import HealthState, ProbeResult
from muto_core.health.probe import HealthProbe, ProbeConfig


class NetworkLatencyProbe(HealthProbe):
    """Checks network latency to a gateway."""

    def __init__(self, config: ProbeConfig, host: str, max_latency_ms: float):
        super().__init__(config)
        self.host = host
        self.max_latency_ms = max_latency_ms

    async def _do_check(self) -> ProbeResult:
        start = time.monotonic()
        try:
            reader, writer = await asyncio.wait_for(
                asyncio.open_connection(self.host, 80),
                timeout=self.max_latency_ms / 1000,
            )
            writer.close()
            await writer.wait_closed()
        except (asyncio.TimeoutError, OSError) as e:
            return ProbeResult(
                probe_id=self.config.probe_id,
                state=HealthState.FAILED,
                message=f"Cannot reach {self.host}: {e}",
                timestamp=time.time(),
            )

        latency_ms = (time.monotonic() - start) * 1000

        if latency_ms > self.max_latency_ms * 0.8:
            state = HealthState.DEGRADED
            message = f"High latency to {self.host}: {latency_ms:.0f}ms"
        else:
            state = HealthState.HEALTHY
            message = f"Latency to {self.host}: {latency_ms:.0f}ms"

        return ProbeResult(
            probe_id=self.config.probe_id,
            state=state,
            message=message,
            timestamp=time.time(),
            value=latency_ms,
        )
```

## Registering Custom Probes

To use a custom probe, register it with the health engine in the agent:

```python
from muto_core.health.probe import ProbeConfig

# Create probe config
config = ProbeConfig(
    probe_id="battery_level",
    probe_type="custom",
    critical=True,  # Will trigger SAFE_STOP on failure
)

# Create and register probe
battery_probe = BatteryLevelProbe(config, battery_topic="/battery/state")
health_engine.register_probe(battery_probe)

# Set up ROS 2 subscriber to feed data to the probe
node.create_subscription(
    BatteryState,
    "/battery/state",
    lambda msg: battery_probe.update_battery(msg.percentage),
    10,
)
```

## Probe Design Guidelines

### Return Values

| State | When to Return |
|-------|---------------|
| `HEALTHY` | Everything is working within normal parameters |
| `DEGRADED` | Working but approaching limits — attention needed |
| `FAILED` | Not working — immediate action required |
| `UNKNOWN` | Not enough data to determine (e.g., first run, no data yet) |

### The `value` Field

The `ProbeResult.value` field is an optional `float` for numeric metrics:

| Probe Type | value Contains |
|-----------|---------------|
| Topic frequency | Measured frequency in Hz |
| Topic staleness | Staleness in milliseconds |
| Battery | State of charge in percent |
| Network | Latency in milliseconds |
| Disk | Available space in bytes |

Dashboards and monitoring tools can trend these values over time.

### Performance

Probes run at 10 Hz by default (every 100 ms). Keep your `_do_check()` fast:

- Avoid blocking I/O — use `asyncio` versions of network calls
- Cache expensive computations
- If a probe needs to wait for data (e.g., sensor readings), check the cached value rather than querying the sensor directly
- If a probe takes longer than the interval, it will delay subsequent probes

### Error Handling

The `execute()` wrapper catches exceptions and returns FAILED. But it is better to handle errors explicitly in `_do_check()` so you can provide meaningful error messages:

```python
async def _do_check(self) -> ProbeResult:
    try:
        value = await self._read_sensor()
    except SensorError as e:
        return ProbeResult(
            probe_id=self.config.probe_id,
            state=HealthState.FAILED,
            message=f"Sensor read error: {e}",
            timestamp=time.time(),
        )
    # ... evaluate value ...
```

### Testing

Test probes in isolation:

```python
import pytest
from muto_core.health.probe import ProbeConfig

@pytest.mark.asyncio
async def test_battery_probe_healthy():
    config = ProbeConfig(probe_id="battery", probe_type="custom")
    probe = BatteryLevelProbe(config, "/battery")
    probe.update_battery(80.0)

    result = await probe.execute()
    assert result.state == HealthState.HEALTHY
    assert result.value == 80.0

@pytest.mark.asyncio
async def test_battery_probe_critical():
    config = ProbeConfig(probe_id="battery", probe_type="custom")
    probe = BatteryLevelProbe(config, "/battery")
    probe.update_battery(5.0)

    result = await probe.execute()
    assert result.state == HealthState.FAILED
    assert "Critical" in result.message
```
