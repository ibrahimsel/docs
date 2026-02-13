---
id: gap-follower
title: Gap Follower OTA Demo
sidebar_label: Gap Follower
sidebar_position: 2
---

# Gap Follower OTA Demo

This demo showcases Eclipse Muto's Over-The-Air (OTA) update capabilities with automatic rollback on failure. It deploys three variants of a gap follower ROS node to demonstrate version management and fault recovery.

## Overview

The demo includes three gap follower variants with different speed configurations:

| Variant | Version | MAX_SPEED | Behavior |
|---------|---------|-----------|----------|
| **slow** | 0.0.1 | 0.5 m/s | Works normally |
| **medium** | 0.0.2 | 1.0 m/s | Works normally |
| **fast** | 0.0.3 | 2.0 m/s | **Fails intentionally** to trigger rollback |

The fast variant is designed to fail after startup, demonstrating Muto's automatic rollback capability.

## Prerequisites

- Docker and Docker Compose
- ROS 2 Humble (for local testing)
- Python 3.10+
- `colcon` build tools

## Directory Structure

```
gap_follower_demo/
├── README.md
├── create-packages.sh           # Creates artifact packages
├── check-status.sh              # Checks deployment status
├── slow/
│   └── run.sh                   # Slow variant startup script
├── medium/
│   └── run.sh                   # Medium variant startup script
├── fast/
│   └── run.sh                   # Fast variant (fails for demo)
├── stacks/
│   ├── gap_follower_slow.json   # Stack definition v0.0.1
│   ├── gap_follower_medium.json # Stack definition v0.0.2
│   └── gap_follower_fast.json   # Stack definition v0.0.3
└── artifacts/                   # Generated tar.gz packages
```

## Quick Start

### 1. Create Artifact Packages

Generate the artifact packages for each variant:

```bash
cd docs/samples/gap_follower_demo
./create-packages.sh
```

This creates:
- `artifacts/gap_follower_slow.tar.gz`
- `artifacts/gap_follower_medium.tar.gz`
- `artifacts/gap_follower_fast.tar.gz`

### 2. Start the Artifact Server

Serve the artifacts via HTTP:

```bash
cd artifacts
python3 -m http.server 8080
```

### 3. Start Muto

In a separate terminal:

```bash
cd /path/to/muto
source /opt/ros/humble/setup.bash
source install/setup.bash
ros2 launch launch/muto.launch.py
```

### 4. Deploy Stacks

Deploy the slow variant first:

```bash
cat stacks/gap_follower_slow.json
# Send to Muto agent or Symphony API
```

## Demo Flow: Rollback on Failure

This demonstrates automatic rollback when a deployment fails.

### Step 1: Deploy Slow Variant (v0.0.1)

Deploy the initial working version. Check status:

```bash
./check-status.sh
```

Expected output:
```
Stack: gap_follower_slow
  Status:           running
  Current Version:  0.0.1
  Previous Version: N/A
```

### Step 2: Upgrade to Medium Variant (v0.0.2)

Deploy the medium speed version. Check status:

```bash
./check-status.sh
```

Expected output:
```
Stack: gap_follower_medium
  Status:           running
  Current Version:  0.0.2
  Previous Version: 0.0.1
```

### Step 3: Upgrade to Fast Variant (v0.0.3) - TRIGGERS ROLLBACK

Deploy the fast variant, which is designed to fail.

**What happens:**
1. Muto downloads and extracts the fast variant
2. The `run.sh` script starts but exits with error after 3 seconds
3. Muto detects the failure
4. Automatic rollback to v0.0.2 (medium) is triggered
5. The medium variant is redeployed

Check status:
```bash
./check-status.sh
```

Expected output:
```
Stack: gap_follower_medium
  Status:           rolled_back
  Current Version:  0.0.2
  Previous Version: 0.0.3
  Rollback Count:   1
```

## State Persistence

Muto persists deployment state to `~/.muto/state/<stack_name>/state.json`.

### State File Structure

```json
{
  "stack_id": "gap_follower_medium",
  "stack_name": "gap_follower_medium",
  "current_version": "0.0.2",
  "previous_version": "0.0.3",
  "current_stack": { /* full stack definition */ },
  "previous_stack": { /* previous stack for rollback */ },
  "status": "rolled_back",
  "deployed_at": "2025-01-19T12:00:00Z",
  "last_updated": "2025-01-19T12:05:00Z",
  "rollback_count": 1
}
```

### Status Values

| Status | Description |
|--------|-------------|
| `pending` | Deployment queued |
| `deploying` | Deployment in progress |
| `running` | Successfully deployed and running |
| `failed` | Deployment failed |
| `rolled_back` | Rolled back to previous version |
| `stopped` | Stack stopped |

## Stack JSON Format

Stack definitions use the `stack/archive` content type:

```json
{
  "metadata": {
    "name": "gap_follower_medium",
    "description": "Gap Follower - Medium variant",
    "content_type": "stack/archive",
    "version": "0.0.2"
  },
  "launch": {
    "url": "http://artifact-server:8080/gap_follower_medium.tar.gz",
    "properties": {
      "algorithm": "sha256",
      "checksum": "<sha256-hash>",
      "launch_file": "run.sh",
      "flatten": true
    }
  },
  "runtime": {
    "start_command": "./run.sh",
    "stop_command": "pkill -f gap_follower",
    "working_directory": "."
  }
}
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Symphony/Cloud                          │
└─────────────────────┬───────────────────────────────────────┘
                      │ Stack Definition
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                       Muto Agent                             │
│                   (MQTT/Ditto Bridge)                        │
└─────────────────────┬───────────────────────────────────────┘
                      │ StackRequestEvent
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                     Muto Composer                            │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │   Stack     │  │ Orchestration│  │   Pipeline       │   │
│  │  Manager    │──│   Manager    │──│   Engine         │   │
│  └─────────────┘  └──────────────┘  └──────────────────┘   │
│         │                │                    │             │
│         │         ┌──────┴──────┐             │             │
│         │         │  Rollback   │             │             │
│         │         │   Logic     │             │             │
│         │         └─────────────┘             │             │
│         ▼                                     ▼             │
│  ┌─────────────┐                    ┌──────────────────┐   │
│  │   State     │                    │    Plugins       │   │
│  │ Persistence │                    │ (Provision/Launch│   │
│  └─────────────┘                    └──────────────────┘   │
│         │                                     │             │
└─────────┼─────────────────────────────────────┼─────────────┘
          │                                     │
          ▼                                     ▼
   ~/.muto/state/                      ~/.muto/workspaces/
   └── gap_follower/                   └── gap_follower/
       └── state.json                      ├── src/
                                           ├── build/
                                           └── install/
```

## Troubleshooting

### Artifacts not downloading

1. Verify the artifact server is running:
```bash
curl http://localhost:8080/gap_follower_slow.tar.gz -I
```

2. Check the URL in the stack JSON matches your server address

### Rollback not triggering

1. Ensure a previous version was deployed first
2. Check the state file exists:
```bash
ls ~/.muto/state/
```

3. Verify `previous_stack` is populated in state.json

### Checking logs

View Muto composer logs:
```bash
ros2 topic echo /muto/composer/events
```

## Next Steps

- **Integrate with Symphony**: Connect to Eclipse Symphony for cloud-based orchestration
- **Add more variants**: Create additional speed profiles or algorithms
- **Multi-device demo**: Deploy to multiple edge devices simultaneously
