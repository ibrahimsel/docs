---
sidebar_position: 1
sidebar_label: Manifest Schema
---

# Manifest Schema Reference

The bundle manifest (`manifest.json`) is validated against a JSON Schema (Draft 2020-12) defined in `schemas/manifest.schema.json`. This page documents every field, type, and constraint.

## Schema Overview

```
manifest.json
├── schema_version        (required, const "1.0")
├── bundle_id             (required, sha256:<64 hex>)
├── name                  (required, string)
├── version               (required, semver)
├── build                 (optional, object)
├── target                (required, object)
│   ├── ros_distro        (required, array)
│   ├── arch              (required, array)
│   └── os                (required, array)
├── security              (required, object)
│   ├── signature_alg     (required, enum)
│   └── manifest_hash     (required, sha256:<64 hex>)
├── runtime               (optional, object)
│   ├── rmw               (optional, enum)
│   ├── ros_domain_id     (optional, integer)
│   └── dds_profile_path  (optional, string)
├── modes                 (optional, object)
│   └── <MODE_NAME>       (ModeDefinition)
└── stacks                (required, object, min 1)
    └── <stack_name>      (StackDefinition)
```

## Top-Level Fields

### schema_version

| Property | Value |
|----------|-------|
| Type | `string` |
| Constraint | `const: "1.0"` |
| Required | Yes |

Must be exactly `"1.0"`. Used for future schema evolution.

### bundle_id

| Property | Value |
|----------|-------|
| Type | `string` |
| Pattern | `^sha256:[a-f0-9]{64}$` |
| Required | Yes |
| Example | `"sha256:a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2"` |

The SHA-256 hash of the canonical manifest bytes (computed by the Composer). This is a **content-addressed identifier** — changing any field in the manifest changes the bundle_id.

### name

| Property | Value |
|----------|-------|
| Type | `string` |
| Min length | 1 |
| Max length | 128 |
| Pattern | `^[a-z0-9][a-z0-9._-]*$` |
| Required | Yes |
| Example | `"delivery-robot-stack"` |

Lowercase alphanumeric with dots, hyphens, and underscores. Must start with a letter or digit.

### version

| Property | Value |
|----------|-------|
| Type | `string` |
| Pattern | `^[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9.]+)?$` |
| Required | Yes |
| Example | `"2.1.0"`, `"1.0.0-beta.1"` |

Semantic versioning with optional pre-release suffix.

### build

| Property | Value |
|----------|-------|
| Type | `object` |
| Required | No |

Optional build metadata:

| Field | Type | Description |
|-------|------|-------------|
| `git_sha` | string | Git commit hash |
| `built_at_unix_ms` | integer | Build timestamp |
| `builder` | string | Build tool identifier |

## target (Required)

Platform compatibility constraints.

| Field | Type | Allowed Values | Required |
|-------|------|---------------|----------|
| `ros_distro` | array of strings | `"humble"`, `"iron"`, `"jazzy"`, `"rolling"` | Yes (min 1) |
| `arch` | array of strings | `"amd64"`, `"arm64"`, `"armhf"` | Yes (min 1) |
| `os` | array of strings | Any string (e.g., `"ubuntu22.04"`) | Yes (min 1) |

```json
{
  "target": {
    "ros_distro": ["humble", "iron"],
    "arch": ["amd64", "arm64"],
    "os": ["ubuntu22.04"]
  }
}
```

## security (Required)

Cryptographic security information.

| Field | Type | Allowed Values | Required |
|-------|------|---------------|----------|
| `signature_alg` | string | `"ecdsa-p256-sha256"`, `"ed25519"` | Yes |
| `manifest_hash` | string | Pattern: `^sha256:[a-f0-9]{64}$` | Yes |

```json
{
  "security": {
    "signature_alg": "ecdsa-p256-sha256",
    "manifest_hash": "sha256:f6e5d4c3b2a1..."
  }
}
```

## runtime (Optional)

DDS and middleware configuration.

| Field | Type | Allowed Values | Required |
|-------|------|---------------|----------|
| `rmw` | string | `"rmw_cyclonedds_cpp"`, `"rmw_fastrtps_cpp"` | No |
| `ros_domain_id` | integer | 0-232 | No |
| `dds_profile_path` | string | File path | No |

## modes (Optional)

Vehicle mode definitions. Keys must be one of: `BOOT`, `STANDBY`, `AUTONOMOUS`, `TELEOP`, `DIAGNOSTIC`, `SAFE_STOP`, `UPDATE`.

### ModeDefinition

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `enabled_stacks` | array of strings | Yes (min 1) | Stack names to enable in this mode |
| `required_health` | array of strings | No | Probe IDs that must be HEALTHY |
| `on_fail` | string | No | Mode to transition to on failure: `"SAFE_STOP"`, `"STANDBY"`, `"DIAGNOSTIC"` |

```json
{
  "modes": {
    "AUTONOMOUS": {
      "enabled_stacks": ["core", "perception", "planning", "control"],
      "required_health": ["localization_health", "perception_health"],
      "on_fail": "SAFE_STOP"
    }
  }
}
```

## stacks (Required)

Stack definitions. Keys must match pattern `^[a-z][a-z0-9_]*$`. At least one stack is required.

### StackDefinition

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `entrypoint` | string | Yes | Command to start the stack (e.g., `ros2 launch ...`) |
| `components` | array of ComponentDefinition | Yes (min 1) | Components in this stack |

### ComponentDefinition

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `name` | string | Yes | — | Component name |
| `type` | string | Yes | — | `"process"` or `"container"` |
| `lifecycle` | boolean | No | `false` | Whether this component supports ROS 2 lifecycle management |
| `required_topics` | array of strings | No | `[]` | Topics this component needs to subscribe to |
| `health_probes` | array of ProbeDefinition | No | `[]` | Health probes for this component |
| `restart_policy` | RestartPolicy | No | — | Automatic restart configuration |
| `resource_limits` | ResourceLimits | No | — | Resource constraints |

### ProbeDefinition

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `probe_id` | string | Yes | Unique identifier for this probe |
| `type` | string | Yes | `"topic_staleness"`, `"topic_frequency"`, `"process_health"`, `"custom_script"` |
| `topic` | string | For topic probes | ROS 2 topic name |
| `max_staleness_ms` | integer (min 1) | For staleness | Maximum age of last message |
| `min_frequency_hz` | number (min 0) | For frequency | Minimum publish rate |
| `script` | string | For custom | Script path |
| `timeout_ms` | integer (min 1) | For process | Response timeout |

### RestartPolicy

| Field | Type | Allowed Values |
|-------|------|---------------|
| `max_restarts` | integer (min 0) | Number of restart attempts |
| `window_sec` | integer (min 1) | Time window for counting restarts |
| `backoff` | string | `"none"`, `"linear"`, `"exponential"` |

### ResourceLimits

| Field | Type | Description |
|-------|------|-------------|
| `cpu_shares` | integer | CPU weight (relative to other containers) |
| `memory_limit_bytes` | integer | Maximum memory in bytes |
| `pids_limit` | integer | Maximum number of processes |

## Complete Example

```json
{
  "schema_version": "1.0",
  "bundle_id": "sha256:a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
  "name": "delivery-robot-stack",
  "version": "2.1.0",
  "build": {
    "git_sha": "abc123def456",
    "built_at_unix_ms": 1708444800000,
    "builder": "muto-compose/0.1.0"
  },
  "target": {
    "ros_distro": ["humble"],
    "arch": ["amd64", "arm64"],
    "os": ["ubuntu22.04"]
  },
  "security": {
    "signature_alg": "ecdsa-p256-sha256",
    "manifest_hash": "sha256:f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3b2a1f6e5"
  },
  "runtime": {
    "rmw": "rmw_cyclonedds_cpp",
    "ros_domain_id": 42,
    "dds_profile_path": "/opt/config/cyclone.xml"
  },
  "modes": {
    "STANDBY": {
      "enabled_stacks": ["core"],
      "on_fail": "SAFE_STOP"
    },
    "AUTONOMOUS": {
      "enabled_stacks": ["core", "perception", "control"],
      "required_health": ["camera_health", "controller_health"],
      "on_fail": "SAFE_STOP"
    }
  },
  "stacks": {
    "core": {
      "entrypoint": "ros2 launch core core.launch.py",
      "components": [
        {
          "name": "state_manager",
          "type": "process",
          "lifecycle": true,
          "health_probes": [
            {
              "probe_id": "state_mgr_health",
              "type": "process_health",
              "timeout_ms": 5000
            }
          ],
          "restart_policy": {
            "max_restarts": 3,
            "window_sec": 60,
            "backoff": "exponential"
          }
        }
      ]
    },
    "perception": {
      "entrypoint": "ros2 launch perception perception.launch.py",
      "components": [
        {
          "name": "camera_driver",
          "type": "process",
          "lifecycle": true,
          "required_topics": ["/camera/image_raw"],
          "health_probes": [
            {
              "probe_id": "camera_health",
              "type": "topic_frequency",
              "topic": "/camera/image_raw",
              "min_frequency_hz": 25
            }
          ]
        }
      ]
    }
  }
}
```
