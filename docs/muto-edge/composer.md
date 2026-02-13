---
id: mutocomposer
title: Muto Composer
sidebar_label: Composer
sidebar_position: 4
slug: composer
---

# Muto Composer

**Muto Composer** is a ROS 2 package designed to organize and automate the software deployment process to a fleet of vehicles. It is the intelligent engine that enforces the desired state on the vehicle, operating a continuous **reconciliation loop** which is the heart of the orchestration process.

## Overview

Composer automates the deployment process of ROS 2 systems by handling the orchestration of different services and plugins. It receives deployment actions from [Muto Agent](./agent), processes stack definitions, resolves expressions from stacks, and executes pipelines to manage the lifecycle of software stacks on vehicles.

The Composer can be thought of as a smart launch manager that:
1. **Inspects** the current state of the live ROS system
2. **Compares** this live state to the desired state model received from the Agent
3. **Acts** to close any gap by executing precise lifecycle operations using a pipeline of commands

This loop ensures the vehicle's software configuration is self-healing and always converging towards the intended state.

## Features

- **Automated Deployment Pipelines**: Define and execute custom deployment pipelines
- **Plugin Architecture**: Easily extend functionality with custom plugins
- **Software Stack Management**: Handle stack definitions, including cloning repositories, building workspaces, managing dependencies, and updating/upgrading stacks
- **ROS 2 Integration**: Leverage ROS 2 services and messaging for communication between components
- **Introspection Tools**: Visualize and analyze launch descriptions and pipeline executions
- **State Reconciliation**: Continuous monitoring and convergence to desired state

## Architecture

The Composer package consists of the following main components:

### Workflow
- **Router**: Routes incoming actions to the appropriate pipeline
- **Pipeline**: Manages the execution of sequences of steps defined in the pipeline configuration

### Plugins
- **Compose Plugin**: Parses and publishes stack manifests
- **Provision Plugin**: Handles workspace preparation, including cloning repositories and building
- **Launch Plugin**: Manages the launching and killing of stacks

### Introspection Tools
Tools for visualizing and debugging launch descriptions and pipelines.

## Plugins in Detail

### Compose Plugin
Processes incoming stacks and publishes composed stacks. It handles:
- Stack parsing and validation
- Manifest generation
- Stack expression resolution

### Provision Plugin
Handles the deployment management side:
- **Repository Cloning**: Clone Git repositories for stack dependencies
- **Build Orchestration**: Automated build pipeline execution
- **Asset Management**: Configuration file and resource management
- **Version Control**: Stack versioning with rollback capabilities

### Launch Plugin
Manages the ROS 2 launch system:
- **Stack Orchestration**: Complete ROS stack lifecycle management
- **Launch Generation**: Automatic ROS 2 launch description creation from declarative models
- **Node Management**: Individual ROS node start/stop/load operations
- **Parameter Resolution**: Dynamic parameter and argument resolution with expression support

## Pipeline System

The pipeline system provides:
- **Workflow Engine**: Multi-step pipeline execution with context preservation
- **Compensation Logic**: Automated failure recovery with compensation mechanisms
- **Plugin Architecture**: Extensible plugin system for custom operations
- **Safe Evaluation**: Secure script execution with sandboxing capabilities

### Pipeline Configuration

Composer uses a configuration file `pipeline.yaml` to define pipelines and their steps:

```yaml
pipelines:
  deploy:
    steps:
      - name: compose
        plugin: compose_plugin
        action: compose
      - name: provision
        plugin: provision_plugin
        action: provision
      - name: launch
        plugin: launch_plugin
        action: start

  kill:
    steps:
      - name: stop
        plugin: launch_plugin
        action: kill
```

## Working with Stacks

Stacks are central to Composer's deployment process. A stack definition includes:

- Repository URL and branch
- Launch description source
- Scripts to run on start and kill
- Arguments and environment variables

### Stack Definition Example

```json
{
  "metadata": {
    "name": "my-ros-stack",
    "description": "Example ROS 2 stack",
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

### Stack Archive Format

For packaged deployments, use the `stack/archive` format:

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

## Launching the Composer

To launch Composer as part of the full Muto system:

```bash
source /opt/ros/$ROS_DISTRO/setup.bash && source install/setup.bash
ros2 launch launch/muto.launch.py \
    vehicle_namespace:=org.eclipse.muto.test \
    vehicle_name:=test-robot-001
```

## Sending Deployment Actions

Composer listens for `MutoAction` messages on the specified stack topic. You can send deployment actions via:

1. **Agent/Symphony**: Recommended for production deployments
2. **ROS 2 CLI**: For testing and development

```bash
# Example using ros2 topic pub
ros2 topic pub /muto/stack muto_msgs/msg/MutoAction "{...}"
```

## Introspection Tools

Composer provides tools for introspection and debugging:

- **Launch Description Visualizer**: Visualize the structure of your launch descriptions
- **Pipeline Execution Monitor**: Monitor the execution of pipelines and steps

## State Persistence

Muto persists deployment state to track current and previous deployments:

```
~/.muto/
├── state/
│   └── <stack_name>/
│       └── state.json
└── workspaces/
    └── <stack_name>/
        ├── src/
        ├── build/
        └── install/
```

### State File Structure

```json
{
  "stack_id": "my-stack",
  "stack_name": "my-stack",
  "current_version": "1.0.0",
  "previous_version": "0.9.0",
  "current_stack": { /* full stack definition */ },
  "previous_stack": { /* previous stack for rollback */ },
  "status": "running",
  "deployed_at": "2025-01-19T12:00:00Z",
  "last_updated": "2025-01-19T12:05:00Z",
  "rollback_count": 0
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

## Adding a Plugin

To add a new plugin:

1. **Create the Plugin File**: Place your plugin in the `plugins` directory
2. **Define the Service Interface**: Ensure your plugin has a corresponding service definition in `muto_msgs/srv`
3. **Update the Pipeline Configuration**: Add your plugin to the `pipeline.yaml` configuration file

## Related Documentation

- [Muto Edge Overview](./)
- [Agent Documentation](./agent)
- [Core Documentation](./core)
- [Getting Started Guide](./getting-started)
- [Blueprints](../blueprint) - See practical examples
