---
sidebar_position: 4
sidebar_label: Core Library
---

# Core Library (muto_core)

The **core library** (`muto_core`) is the shared foundation used by the daemon, agent, and composer. It defines data models, policy logic, and health primitives — the vocabulary that all Muto components speak.

## Why a Shared Library?

Without a shared library, each component would define its own version of "what is a manifest?" or "what is a health state?" — leading to subtle incompatibilities. The core library ensures:

- **Consistency** — A `Manifest` object means the same thing in the daemon, agent, and composer
- **Validation** — Models use [Pydantic](https://docs.pydantic.dev/) for runtime type checking and validation
- **Single source of truth** — Business rules (like valid mode transitions) are defined once

## Package Structure

```
muto_core/
├── muto_core/
│   ├── models/
│   │   ├── manifest.py      # Bundle manifest model
│   │   ├── mode.py           # Vehicle mode definitions
│   │   ├── stack.py          # Stack and component models
│   │   ├── component.py      # Component definitions
│   │   └── health.py         # Health state primitives
│   └── health/
│       ├── probe.py           # Base health probe class
│       ├── engine.py          # Policy engine
│       └── aggregator.py      # Health aggregation logic
```

## Data Models

### Manifest

The `Manifest` model is a Pydantic model representing the complete bundle manifest:

```python
class Manifest(BaseModel):
    schema_version: str = "1.0"
    bundle_id: str              # sha256:<64 hex chars>
    name: str
    version: str
    build: Optional[BuildInfo]
    target: TargetSpec
    security: SecuritySpec
    runtime: RuntimeSpec
    modes: dict[str, ModeDefinition]
    stacks: dict[str, StackDefinition]
```

Key methods:
- `compute_canonical_hash()` — Computes the SHA-256 hash of the RFC 8785 canonical JSON representation (excluding `bundle_id` and `security` fields)
- `get_stacks_for_mode(mode)` — Returns the stacks enabled for a given mode
- `validate_stack_dependencies()` — Checks that all stacks referenced in modes actually exist

### VehicleMode

The `VehicleMode` enum and transition rules:

```python
class VehicleMode(Enum):
    BOOT = "BOOT"
    STANDBY = "STANDBY"
    AUTONOMOUS = "AUTONOMOUS"
    TELEOP = "TELEOP"
    DIAGNOSTIC = "DIAGNOSTIC"
    SAFE_STOP = "SAFE_STOP"
    UPDATE = "UPDATE"
    UNKNOWN = "UNKNOWN"

VALID_TRANSITIONS = {
    VehicleMode.BOOT: {VehicleMode.STANDBY},
    VehicleMode.STANDBY: {
        VehicleMode.AUTONOMOUS,
        VehicleMode.TELEOP,
        VehicleMode.DIAGNOSTIC,
        VehicleMode.UPDATE,
        VehicleMode.SAFE_STOP,
    },
    VehicleMode.AUTONOMOUS: {VehicleMode.STANDBY, VehicleMode.SAFE_STOP},
    VehicleMode.TELEOP: {VehicleMode.STANDBY, VehicleMode.SAFE_STOP},
    VehicleMode.DIAGNOSTIC: {VehicleMode.STANDBY, VehicleMode.SAFE_STOP},
    VehicleMode.UPDATE: {VehicleMode.STANDBY, VehicleMode.SAFE_STOP},
    VehicleMode.SAFE_STOP: {VehicleMode.STANDBY},
}
```

The `is_valid_transition(from_mode, to_mode)` function checks whether a transition is allowed.

### Stack

```python
class Stack(BaseModel):
    name: str
    entrypoint: str
    components: list[Component]
    state: StackState = StackState.STOPPED

class StackState(Enum):
    STOPPED = "stopped"
    STARTING = "starting"
    RUNNING = "running"
    STOPPING = "stopping"
    FAILED = "failed"
```

Useful methods:
- `get_all_probe_ids()` — Returns all health probe IDs across all components
- `get_all_required_topics()` — Returns all required topics across all components
- `has_lifecycle_components()` — Whether any component supports lifecycle management

### Component

```python
class Component(BaseModel):
    name: str
    type: ComponentType            # "process" or "container"
    lifecycle: bool = False
    required_topics: list[str] = []
    health_probes: list[ProbeConfig] = []
    restart_policy: Optional[RestartPolicy] = None
    resource_limits: Optional[ResourceLimits] = None

class RestartPolicy(BaseModel):
    max_restarts: int = 3
    window_sec: int = 60
    backoff: str = "exponential"    # "none", "linear", "exponential"

class ResourceLimits(BaseModel):
    cpu_shares: Optional[int] = None
    memory_limit_bytes: Optional[int] = None
    pids_limit: Optional[int] = None
```

### Health

```python
class HealthState(Enum):
    UNKNOWN = "unknown"
    HEALTHY = "healthy"
    DEGRADED = "degraded"
    FAILED = "failed"

class ProbeResult(BaseModel):
    probe_id: str
    state: HealthState
    message: str = ""
    timestamp: float                # Unix timestamp
    value: Optional[float] = None   # Numeric metric (Hz, ms, etc.)
```

The `aggregate()` function implements the worst-case aggregation rule:

```python
def aggregate(states: list[HealthState]) -> HealthState:
    if any(s == HealthState.FAILED for s in states):
        return HealthState.FAILED
    if any(s == HealthState.DEGRADED for s in states):
        return HealthState.DEGRADED
    if all(s == HealthState.HEALTHY for s in states):
        return HealthState.HEALTHY
    return HealthState.UNKNOWN
```

## Health Probes

The core library defines the base `HealthProbe` abstract class:

```python
class HealthProbe(ABC):
    def __init__(self, config: ProbeConfig):
        self.config = config
        self.last_result: Optional[ProbeResult] = None

    async def execute(self) -> ProbeResult:
        """Execute the probe with timing and error handling."""
        try:
            result = await self._do_check()
            self.last_result = result
            return result
        except Exception as e:
            return ProbeResult(
                probe_id=self.config.probe_id,
                state=HealthState.FAILED,
                message=str(e),
                timestamp=time.time(),
            )

    @abstractmethod
    async def _do_check(self) -> ProbeResult:
        """Subclasses implement the actual health check."""
        ...
```

The agent provides concrete implementations:
- `TopicStalenessProbe` — Checks message freshness on a ROS 2 topic
- `TopicFrequencyProbe` — Checks publishing frequency on a ROS 2 topic
- `ProcessHealthProbe` — Checks process liveness and responsiveness

## Design Decisions

### Why Pydantic?

The core models use Pydantic v2 for:
- **Runtime validation** — Catch invalid data at model creation time, not deep in business logic
- **Serialization** — Convert between JSON, dicts, and model instances with `model_dump()` / `model_validate()`
- **Documentation** — Type annotations serve as living documentation
- **Immutability** — Models can be frozen to prevent accidental mutation

### Why Enum-Based Modes?

Vehicle modes use a Python enum rather than free-form strings because:
- The set of valid modes is finite and known at compile time
- Typos are caught immediately (`VehicleMode.AUTONMOUS` → error)
- IDE autocompletion works
- The transition table can be exhaustively defined

### No ROS 2 Dependency

The core library has **no dependency on ROS 2**. This is intentional:
- The daemon imports `muto_core` but does not import `rclpy`
- The composer imports `muto_core` for manifest handling
- Only the agent imports both `muto_core` and `rclpy`

This means `muto_core` can be tested, used, and distributed without a ROS 2 installation.
