---
sidebar_position: 4
sidebar_label: Health Monitoring
---

# Health Monitoring Guide

This guide covers practical usage of Muto's health monitoring system — how to query health, interpret results, define probes in your stacks, and respond to failures.

## Querying Health

### Quick Summary

```bash
muto health
```

This shows:
- **Overall health** — The aggregate state across all stacks
- **Per-stack health** — Each stack's aggregate state
- **Critical probes** — Any probes in FAILED state
- **Degraded probes** — Any probes in DEGRADED state

### Streaming Health Events

For real-time monitoring:

```bash
muto logs --follow --source health
```

Or via gRPC for programmatic monitoring:

```python
stub = agent_pb2_grpc.AgentServiceStub(channel)

# Stream all health events
for event in stub.StreamHealth(agent_pb2.StreamHealthRequest()):
    print(f"[{event.source}] {event.previous} → {event.current}")
    print(f"  Probe: {event.probe.probe_id} = {event.probe.state}")

# Stream only critical events
for event in stub.StreamHealth(
    agent_pb2.StreamHealthRequest(critical_only=True)
):
    print(f"CRITICAL: {event.source} is {event.current}")
```

### Running a Probe Manually

Trigger a specific probe on demand:

```python
result = stub.RunProbe(agent_pb2.RunProbeRequest(probe_id="camera_health"))
print(f"State: {result.result.state}")
print(f"Message: {result.result.message}")
print(f"Value: {result.result.value}")  # e.g., frequency in Hz
```

## Defining Health Probes

Health probes are defined in your stack YAML under each component. Here are examples for each probe type:

### Topic Frequency Probe

Checks that a topic publishes at a minimum rate:

```yaml
health_probes:
  - probe_id: camera_health
    type: topic_frequency
    topic: /camera/image_raw
    min_frequency_hz: 25
```

**When to use:** For sensor drivers and data producers that should publish at a steady rate.

**What it reports:**
- HEALTHY — Publishing at or above 25 Hz
- DEGRADED — Publishing but below 25 Hz
- FAILED — No messages received

The `value` field in the probe result contains the measured frequency.

### Topic Staleness Probe

Checks that the latest message on a topic is recent:

```yaml
health_probes:
  - probe_id: detection_health
    type: topic_staleness
    topic: /perception/detections
    max_staleness_ms: 200
```

**When to use:** For processing nodes that publish at variable rates. A detection node might publish only when it sees something, but the latest result should never be older than 200 ms.

**What it reports:**
- HEALTHY — Latest message is less than 200 ms old
- FAILED — Latest message is older than 200 ms (or no messages ever received)

The `value` field contains the staleness in milliseconds.

### Process Health Probe

Checks that a process is alive and responsive:

```yaml
health_probes:
  - probe_id: planner_health
    type: process_health
    timeout_ms: 5000
```

**When to use:** For critical processes that must always be running. This catches hung or crashed processes.

**What it reports:**
- HEALTHY — Process responded within timeout
- FAILED — Process did not respond within 5000 ms

### Custom Script Probe

Runs a custom script for application-specific checks:

```yaml
health_probes:
  - probe_id: gpu_temp_health
    type: custom_script
    script: /opt/muto/checks/gpu_temp.sh
    timeout_ms: 3000
```

The script should exit with:
- **Code 0** — HEALTHY
- **Code 1** — DEGRADED
- **Code 2** — FAILED

**When to use:** For hardware-specific checks (GPU temperature, battery level, network connectivity).

## Understanding Aggregation

Health states aggregate upward through the hierarchy:

```
Individual Probes → Stack Health → Overall Health
```

The rule is conservative (worst-case wins):

| Probe States | Aggregate |
|-------------|-----------|
| All HEALTHY | HEALTHY |
| Any DEGRADED, none FAILED | DEGRADED |
| Any FAILED | FAILED |
| No data yet | UNKNOWN |

This means a single failed probe makes the entire stack (and potentially the overall health) report as FAILED.

## Responding to Health Failures

### Automatic Responses

Muto handles some failures automatically:

1. **Restart policies** — Components with `restart_policy` are automatically restarted when they fail
2. **Mode fallback** — If a `required_health` probe fails, the agent transitions to the `on_fail` mode (typically SAFE_STOP)

### Manual Investigation

When you see a health failure:

```bash
# 1. Check what is failing
muto health

# 2. Look at the logs for context
muto logs --source perception --tail 50

# 3. Check the ROS 2 graph for topology issues
muto graph

# 4. Check resource usage for overloads
# (via daemon)
```

### Common Failure Patterns

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Topic frequency drops | Node overloaded, missed deadlines | Check CPU/memory, adjust resource limits |
| Topic staleness | Upstream node crashed or stuck | Check dependent nodes, restart stack |
| Process health timeout | Process hung or deadlocked | Restart the component |
| All probes UNKNOWN | Health engine not started | Check agent logs, verify startup |

## Health Probe Design Tips

1. **Be specific with probe IDs** — Use descriptive names like `camera_driver_frequency` not just `health`
2. **Set realistic thresholds** — A camera rated at 30 Hz should have a `min_frequency_hz` of 25, not 30 — leave margin for jitter
3. **Mark safety-critical probes** — Put them in `required_health` for the appropriate modes
4. **Use staleness for variable-rate publishers** — Not everything publishes at a fixed rate
5. **Set timeouts appropriately** — A GPU inference node may need a longer `timeout_ms` than a simple driver
