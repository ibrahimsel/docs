---
id: talker-listener
title: Talker-Listener Symphony Demo
sidebar_label: Talker-Listener
sidebar_position: 4
---

# Talker-Listener Symphony Demo

This demo showcases Eclipse Muto integration with Eclipse Symphony for cloud orchestration. It uses a simple ROS 2 talker/listener stack to demonstrate solution/instance management and different stack formats.

## Overview

The demo demonstrates:
- How to start Muto locally (native or container)
- How to start Symphony services (Docker Compose)
- How to register solutions and create instances using helper scripts
- Two ways to represent a stack: plain JSON (`stack/json`) and packaged archive (`stack/archive`)

## Prerequisites

- ROS 2 Humble or later and `colcon` (for native Muto)
- Docker and Docker Compose for Symphony
- `curl`, `jq`, and `base64` for helper scripts

## Quick Start

### 1. Start Muto Locally

Build and source your workspace:

```bash
source /opt/ros/humble/setup.bash
colcon build --symlink-install
source install/setup.bash
```

Launch Muto with Symphony enabled:

```bash
ros2 launch launch/muto.launch.py \
    vehicle_namespace:=org.eclipse.muto.test \
    vehicle_name:=test-robot-debug \
    enable_symphony:=true \
    log_level:=INFO
```

### 2. Start Symphony (Docker Compose)

From the samples directory:

```bash
cd docs/samples/symphony
docker compose up -d
```

Verify services:

```bash
# Symphony API
curl http://localhost:8082/v1alpha2/greetings

# Symphony Portal GUI - visit in browser
open http://localhost:3000

# MQTT broker: tcp://localhost:1883
```

### 3. Run the Automated Demo

Use the `run-demo.sh` script for an end-to-end experience:

```bash
cd docs/samples/talker-listener
./run-demo.sh
```

The script:
1. Checks prerequisites (`curl`, `jq`, `base64`, `ros2`)
2. Waits for Symphony API to be ready
3. Waits for Muto nodes to appear
4. Defines the solution
5. Creates the instance
6. Provides next steps

## Stack Formats

### Option A: Plain JSON Stack (`stack/json`)

Simple stack definitions using JSON:

```json
{
  "metadata": {
    "name": "talker-listener",
    "description": "Simple talker-listener demo",
    "content_type": "stack/json",
    "version": "1.0.0"
  },
  "launch": {
    "node": [
      {
        "name": "talker",
        "pkg": "demo_nodes_cpp",
        "exec": "talker"
      },
      {
        "name": "listener",
        "pkg": "demo_nodes_cpp",
        "exec": "listener"
      }
    ]
  }
}
```

### Option B: Packaged Archive (`stack/archive`)

For self-contained deployments with custom code:

```json
{
  "metadata": {
    "name": "talker-listener-archive",
    "description": "Talker-listener as archive",
    "content_type": "stack/archive",
    "version": "1.0.0"
  },
  "launch": {
    "data": "<base64-encoded-tar.gz>",
    "properties": {
      "algorithm": "sha256",
      "checksum": "<sha256-hash>",
      "launch_file": "launch/talker_listener.launch.py",
      "flatten": true
    }
  }
}
```

## Creating Stack Archives

Use `create_archive.sh` to package a directory:

```bash
cd docs/samples/talker-listener
./create_archive.sh sample-stack .
```

This creates a JSON manifest with:
- `metadata`: Name, description, content type
- `launch.data`: Base64-encoded tar.gz of the directory
- `launch.properties`: Checksum, launch file, and other metadata

## Symphony Operations

### Define a Solution

```bash
cd docs/samples/symphony
./define-solution.sh ../talker-listener/talker-listener-json.json
```

Or for archive-based:
```bash
./define-solution.sh ../talker-listener/talker-listener-xarchive.json
```

### Create an Instance

```bash
./define-instance.sh ../talker-listener/talker-listener-json-instance.json
```

Or for archive-based:
```bash
./define-instance.sh ../talker-listener/talker-listener-xarchive-instance.json
```

### Verify Deployment

Check Symphony API:
```bash
curl -H "Content-Type: application/json" http://localhost:8082/v1alpha2/instances
curl -H "Content-Type: application/json" http://localhost:8082/v1alpha2/solutions
```

Check ROS topics:
```bash
ros2 topic list
ros2 topic echo /chatter
```

### Delete an Instance

```bash
./delete-instance.sh ../talker-listener/talker-listener-json-instance.json
```

## Files in the Demo

| File | Description |
|------|-------------|
| `talker-listener-json.json` | Stack definition (plain JSON) |
| `talker-listener-json-instance.json` | Instance for JSON stack |
| `talker-listener-xarchive.json` | Stack archive manifest |
| `talker-listener-xarchive-instance.json` | Instance for archive stack |
| `sample-stack/` | Example directory to package |
| `run-demo.sh` | Automated end-to-end demo |
| `create_archive.sh` | Creates archive manifests |

## Symphony Portal

Access the Symphony Portal at `http://localhost:3000`:

- **Username**: admin
- **Password**: (empty)

From the portal you can:
- View registered targets (edge devices)
- Manage solutions and instances
- Monitor deployment status

## Required Muto Nodes

The demo expects these nodes to be running:

```
/muto/agent
/muto/commands_plugin
/muto/compose_plugin
/muto/core_twin
/muto/gateway
/muto/launch_plugin
/muto/muto_composer
/muto/muto_symphony_provider
/muto/provision_plugin
```

Verify with:
```bash
ros2 node list | grep muto
```

## Troubleshooting

### Symphony not responding

Verify Docker services are running:
```bash
docker compose ps
```

Restart if needed:
```bash
docker compose restart
```

### Muto nodes not appearing

1. Ensure ROS 2 and workspace are sourced
2. Verify `enable_symphony:=true` in launch command
3. Check MQTT connectivity

### Stack not deploying

1. Verify solution is defined in Symphony
2. Check instance targets the correct device
3. Review Muto logs for errors

## Summary

This demo shows both plain JSON and archive-based stack formats with Symphony integration. Use:
- `define-solution.sh` to publish stacks to Symphony
- `define-instance.sh` to bind them to targets (robots)
- `create_archive.sh` to package directories into archive manifests

## Related Resources

- [Eclipse Symphony](https://github.com/eclipse-symphony/symphony)
- [Muto Agent - Symphony Integration](../muto-edge/agent#symphony-integration)
- [Stack Definition Format](../muto-edge/composer#working-with-stacks)
