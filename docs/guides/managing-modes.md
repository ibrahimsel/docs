---
sidebar_position: 3
sidebar_label: Managing Vehicle Modes
---

# Managing Vehicle Modes

Vehicle modes control which software stacks are running at any given time. This guide shows you how to query, change, and monitor modes using the CLI and gRPC API.

## Viewing the Current Mode

```bash
muto mode get
```

Output includes:
- **Current mode** — The active mode (e.g., STANDBY, AUTONOMOUS)
- **Previous mode** — The mode before the current one
- **Mode since** — How long the vehicle has been in this mode
- **Transition in progress** — Whether a mode change is currently happening

## Changing Modes

To request a mode transition:

```bash
muto mode set AUTONOMOUS --reason "Starting delivery mission"
```

The agent will:
1. Validate the transition (STANDBY → AUTONOMOUS must be allowed)
2. Start the stacks required by AUTONOMOUS mode (perception, planning, control)
3. Verify that all required health probes are passing
4. Complete the transition

If any step fails, the agent reverts to the previous mode.

### Available Modes

| Mode | When to Use |
|------|-------------|
| `STANDBY` | Vehicle is idle, waiting for commands |
| `AUTONOMOUS` | Full self-driving operation |
| `TELEOP` | Human operator remotely controlling the vehicle |
| `DIAGNOSTIC` | Running diagnostics and data collection |
| `UPDATE` | Software update in progress |

You cannot set `BOOT` or `SAFE_STOP` manually — BOOT is only the startup state, and SAFE_STOP is triggered automatically by health failures.

### Valid Transitions

Not all mode changes are allowed. Here is the transition map:

| From | Allowed Targets |
|------|----------------|
| STANDBY | AUTONOMOUS, TELEOP, DIAGNOSTIC, UPDATE, SAFE_STOP |
| AUTONOMOUS | STANDBY, SAFE_STOP |
| TELEOP | STANDBY, SAFE_STOP |
| DIAGNOSTIC | STANDBY, SAFE_STOP |
| UPDATE | STANDBY, SAFE_STOP |
| SAFE_STOP | STANDBY |

If you request an invalid transition (e.g., TELEOP → AUTONOMOUS), the agent rejects it:

```bash
muto mode set AUTONOMOUS --reason "switch to auto"
# Error: Invalid transition from TELEOP to AUTONOMOUS
```

You must first go through STANDBY:

```bash
muto mode set STANDBY --reason "ending teleop"
muto mode set AUTONOMOUS --reason "starting autonomous"
```

## Monitoring Transitions

Mode transitions are not instantaneous — they involve starting stacks and verifying health. You can monitor the transition progress:

```bash
# Get the transition ID from the mode set command
muto mode set AUTONOMOUS --reason "mission start"
# Output: transition_id=t-abc123

# Check transition status (via gRPC)
```

The transition goes through these steps:

| Step | What Happens |
|------|-------------|
| `validate_preconditions` | Check the transition is allowed |
| `prepare_target_mode` | Start required stacks |
| `execute_handler` | Run any custom transition handler |
| `finalize` | Complete the transition, notify listeners |

Each step reports its status: `pending`, `running`, `done`, or `failed`.

## Automatic Mode Changes

The agent can automatically change modes in two scenarios:

### Health Failure

If a health probe listed in the current mode's `required_health` fails, the agent automatically transitions to the mode's `on_fail` target:

```yaml
AUTONOMOUS:
  required_health: [perception_health, controller_health]
  on_fail: SAFE_STOP
```

If `perception_health` fails while in AUTONOMOUS → automatic transition to SAFE_STOP.

### Clearing a Fault

After the vehicle enters SAFE_STOP, an operator must manually clear the fault:

```bash
muto mode set STANDBY --reason "fault cleared, systems verified"
```

The vehicle will not leave SAFE_STOP on its own.

## Mode-Aware Operations

When building integrations, always check the current mode before performing operations:

```python
from muto.agent.v1 import agent_pb2, agent_pb2_grpc
from muto.shared.v1 import common_pb2

channel = grpc.insecure_channel("localhost:50052")
stub = agent_pb2_grpc.AgentServiceStub(channel)

# Check current mode
mode_resp = stub.GetMode(agent_pb2.GetModeRequest())
if mode_resp.current_mode == common_pb2.MODE_SAFE_STOP:
    print("Vehicle is in SAFE_STOP - cannot proceed")
elif mode_resp.transition_in_progress:
    print("Mode transition in progress - wait before acting")
else:
    print(f"Current mode: {mode_resp.current_mode}")
```

## Best Practices

1. **Always provide a reason** — Mode transitions are audited. A clear reason helps with debugging later.
2. **Go through STANDBY** — When switching between operational modes (e.g., AUTONOMOUS → TELEOP), always pass through STANDBY first.
3. **Verify health before entering AUTONOMOUS** — Use `muto health` to check that all required probes are healthy before starting a mission.
4. **Do not rush SAFE_STOP recovery** — When the vehicle enters SAFE_STOP, investigate the cause before clearing the fault.
