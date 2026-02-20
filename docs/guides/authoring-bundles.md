---
sidebar_position: 1
sidebar_label: Authoring Bundles
---

# Authoring Bundles

This guide walks you through creating a Muto bundle from scratch — from writing the stack YAML definition to producing a signed, deployable `.tar.gz` bundle.

## Overview

The bundle authoring workflow has four steps:

```mermaid
graph LR
    A["1. Write<br/>muto-stack.yaml"] --> B["2. Generate<br/>signing keys"]
    B --> C["3. Build<br/>muto-compose build"]
    C --> D["4. Verify<br/>muto-compose verify"]
```

## Step 1: Write a Stack YAML

Create a file called `muto-stack.yaml` in a new directory. This file is the human-readable definition of your deployment.

### Minimal Example

The simplest possible stack definition:

```yaml
name: my-robot-stack
version: 0.1.0

target:
  ros_distro:
    - humble
  arch:
    - amd64
  os:
    - ubuntu22.04

stacks:
  core:
    entrypoint: ros2 launch my_robot core.launch.py
    components:
      - name: state_manager
        type: process
```

### Full-Featured Example

A production-ready stack definition with modes, health probes, restart policies, and resource limits:

```yaml
name: delivery-robot-stack
version: 2.1.0

target:
  ros_distro:
    - humble
    - iron
  arch:
    - amd64
    - arm64
  os:
    - ubuntu22.04

runtime:
  rmw: rmw_cyclonedds_cpp
  ros_domain_id: 42
  dds_profile_path: /opt/muto/config/cyclone_profile.xml

modes:
  STANDBY:
    enabled_stacks:
      - core
    on_fail: SAFE_STOP

  AUTONOMOUS:
    enabled_stacks:
      - core
      - perception
      - navigation
      - control
    required_health:
      - localization_health
      - perception_health
      - controller_health
    on_fail: SAFE_STOP

  TELEOP:
    enabled_stacks:
      - core
      - teleop
    required_health:
      - joystick_health
    on_fail: STANDBY

  DIAGNOSTIC:
    enabled_stacks:
      - core
      - diagnostics
    on_fail: STANDBY

stacks:
  core:
    entrypoint: ros2 launch my_robot core.launch.py
    components:
      - name: state_manager
        type: process
        lifecycle: true
        health_probes:
          - probe_id: state_manager_health
            type: process_health
            timeout_ms: 5000
        restart_policy:
          max_restarts: 3
          window_sec: 60
          backoff: exponential

      - name: logger
        type: process
        lifecycle: false
        resource_limits:
          memory_limit_bytes: 134217728  # 128 MB
          cpu_shares: 512

  perception:
    entrypoint: ros2 launch perception perception.launch.py
    components:
      - name: camera_driver
        type: process
        lifecycle: true
        required_topics:
          - /camera/image_raw
        health_probes:
          - probe_id: camera_health
            type: topic_frequency
            topic: /camera/image_raw
            min_frequency_hz: 25
          - probe_id: perception_health
            type: topic_staleness
            topic: /perception/detections
            max_staleness_ms: 200

      - name: lidar_driver
        type: process
        lifecycle: true
        required_topics:
          - /lidar/points
        health_probes:
          - probe_id: lidar_health
            type: topic_frequency
            topic: /lidar/points
            min_frequency_hz: 10

      - name: detector
        type: container
        lifecycle: true
        resource_limits:
          memory_limit_bytes: 4294967296  # 4 GB for ML model
          cpu_shares: 2048

  navigation:
    entrypoint: ros2 launch navigation navigation.launch.py
    components:
      - name: global_planner
        type: process
        lifecycle: true
        health_probes:
          - probe_id: localization_health
            type: process_health
            timeout_ms: 10000

      - name: local_planner
        type: process
        lifecycle: true
        required_topics:
          - /planning/trajectory
        health_probes:
          - probe_id: local_planner_health
            type: topic_staleness
            topic: /planning/trajectory
            max_staleness_ms: 100

  control:
    entrypoint: ros2 launch control control.launch.py
    components:
      - name: vehicle_controller
        type: process
        lifecycle: true
        required_topics:
          - /control/cmd_vel
        health_probes:
          - probe_id: controller_health
            type: topic_frequency
            topic: /control/cmd_vel
            min_frequency_hz: 50
        restart_policy:
          max_restarts: 2
          window_sec: 30
          backoff: none

  teleop:
    entrypoint: ros2 launch teleop teleop.launch.py
    components:
      - name: joy_node
        type: process
        lifecycle: false
        health_probes:
          - probe_id: joystick_health
            type: topic_staleness
            topic: /joy
            max_staleness_ms: 500

      - name: teleop_twist
        type: process
        lifecycle: false

  diagnostics:
    entrypoint: ros2 launch diagnostics diagnostics.launch.py
    components:
      - name: diagnostic_aggregator
        type: process
        lifecycle: false

      - name: rosbag_recorder
        type: process
        lifecycle: false
        resource_limits:
          memory_limit_bytes: 536870912  # 512 MB
```

## YAML Field Reference

### Top Level

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Bundle name (lowercase, alphanumeric, dots, hyphens, underscores) |
| `version` | Yes | Semantic version (e.g., `1.0.0`, `2.1.0-beta.1`) |
| `target` | Yes | Platform compatibility constraints |
| `runtime` | No | DDS and middleware configuration |
| `modes` | No | Vehicle mode definitions |
| `stacks` | Yes | Stack definitions (at least one) |

### Target

| Field | Values |
|-------|--------|
| `ros_distro` | `humble`, `iron`, `jazzy`, `rolling` |
| `arch` | `amd64`, `arm64`, `armhf` |
| `os` | Any string (e.g., `ubuntu22.04`) |

### Health Probes

| Field | Required | Description |
|-------|----------|-------------|
| `probe_id` | Yes | Unique identifier for this probe |
| `type` | Yes | One of: `topic_frequency`, `topic_staleness`, `process_health`, `custom_script` |
| `topic` | For topic probes | ROS 2 topic name to monitor |
| `min_frequency_hz` | For frequency | Minimum acceptable publish rate |
| `max_staleness_ms` | For staleness | Maximum age of last message |
| `timeout_ms` | For process | Maximum time to wait for response |
| `script` | For custom | Path to script to execute |

## Step 2: Generate Signing Keys

```bash
muto-compose keygen --output ./keys
```

:::caution
Keep `muto.key` secret. Add `*.key` to your `.gitignore`. Only distribute `muto.pub` to vehicles.
:::

## Step 3: Build the Bundle

```bash
muto-compose build ./my-stacks \
    --key ./keys/muto.key \
    --output ./bundles
```

The output file will be named `<name>-<version>.tar.gz` (e.g., `delivery-robot-stack-2.1.0.tar.gz`).

### Building Without Signing

For development, you can build unsigned bundles:

```bash
muto-compose build ./my-stacks --output ./bundles
```

The bundle will be created without a signature. The daemon will report `signature_valid=false` during verification.

## Step 4: Verify the Bundle

Confirm the bundle is properly signed and the schema is valid:

```bash
# Verify signature
muto-compose verify ./bundles/delivery-robot-stack-2.1.0.tar.gz \
    --key ./keys/muto.pub

# Validate schema
muto-compose validate ./bundles/delivery-robot-stack-2.1.0.tar.gz

# Inspect contents
muto-compose inspect ./bundles/delivery-robot-stack-2.1.0.tar.gz
```

## Common Patterns

### Shared Core Stack

Almost every configuration includes a `core` stack that runs in all modes:

```yaml
modes:
  STANDBY:
    enabled_stacks: [core]
  AUTONOMOUS:
    enabled_stacks: [core, perception, navigation, control]
  TELEOP:
    enabled_stacks: [core, teleop]
```

### Safety-Critical Components

For components where failure is dangerous, use aggressive health probes and tight restart policies:

```yaml
- name: vehicle_controller
  type: process
  lifecycle: true
  health_probes:
    - probe_id: controller_health
      type: topic_frequency
      topic: /control/cmd_vel
      min_frequency_hz: 50    # Must publish at 50 Hz
  restart_policy:
    max_restarts: 2           # Only 2 retries
    window_sec: 30            # In 30 seconds
    backoff: none             # Restart immediately
```

### ML/GPU Components

For components that load large models or use GPU, set resource limits:

```yaml
- name: detector
  type: container
  lifecycle: true
  resource_limits:
    memory_limit_bytes: 4294967296  # 4 GB
    cpu_shares: 2048
    pids_limit: 100
```

## Next Steps

- [Deploying Bundles](deploying-bundles) — Upload and install your bundle on a vehicle
- [Manifest Schema Reference](../reference/manifest-schema) — Complete schema documentation
