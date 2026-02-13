---
id: mutoagent
title: Muto Agent
sidebar_label: Agent
sidebar_position: 3
---

# Muto Agent

**Muto Agent** is the agnostic communication bridge within Eclipse Muto's declarative orchestrator for ROS software stacks on edge devices. As the robot's secure gateway to any cloud backend, it features a pluggable architecture that makes Muto fundamentally agnostic to external systems, enabling interoperability with various cloud orchestrators and communication standards.

## Overview

The Agent's defining characteristic is a **pluggable architecture** that decouples Muto's core logic from particular cloud orchestrators or communication standards, providing **interoperability** and **flexibility**.

The Agent's primary function is to securely and reliably bridge the vehicle and the cloud, delivering the desired **"state"** from any backend system to the Composer for on-vehicle reconciliation. By default, it comes with Eclipse Ditto and MQTT plugins, but can easily be extended to work with other systems like Eclipse Symphony, Zenoh, or uProtocol through its plugin system.

## Agent Features

- **Eclipse Ditto/MQTT Gateway**: Secure bidirectional communication with cloud-based digital twin systems
- **Command Execution Framework**: Plugin-based architecture for executing remote commands
- **Message Routing**: Intelligent routing of messages between Muto components
- **Configuration Management**: Dynamic parameter handling integrated with ROS 2 parameter system
- **Parsing**: Flexible command/topic structure parsing for different plugin deployments
- **ROS 2 Integration**: Native integration with ROS 2 ecosystem for seamless robotics development

## Agent Structure

The Agent package consists of the following main components:

### Core Agent
- **Muto Agent**: Main coordinator node managing component lifecycle and message routing
- **Ditto/MQTT Gateway**: Handles secure cloud connectivity and message translation
- **Message Handlers**: Process and route different message types between components

### Command System
- **Command Executor**: Framework for executing commands through plugins
- **Command Registry**: Manages available commands and their configurations
- **Command Plugins**: Extensible plugins for different command types (ROS tools, system commands, etc.)

### Configuration Management
- **Config Manager**: Handles parameter loading and validation
- **Parser**: Parses and manages topic structures for multi-vehicle scenarios

## Device Telemetry

Agent is capable of publishing data streams up to the Twin Server, such as data that streams in ROS topics. Stream of data mapped from edge device to virtual one could represent instant telemetry information and/or any other device-specific details.

This kind of data is useful for monitoring devices and algorithmic parameters with adjustable-frequency updates. Data such as odometry, speed, localization, goal, or any other drive and device-related information can be broadcast via declarative models.

## Command Relay

Agent relays commands from the twin server to Composer running on the edge device. This type of information may be related to:
- Lifecycle of ROS nodes that constitute the software stack
- Lifecycle actions (start, stop, update, etc.) that trigger the Composer to respond

## Configuration

### muto.yaml

The Agent is configured through `muto.yaml`:

```yaml
/**:
  ros__parameters:
    prefix: muto
    namespace: org.eclipse.muto.sandbox
    name: mytest_vehicle_001

    # Topic mappings
    stack_topic: "stack"
    twin_topic: "twin"
    agent_to_gateway_topic: "agent_to_gateway"
    gateway_to_agent_topic: "gateway_to_agent"
    agent_to_commands_topic: "agent_to_command"
    commands_to_agent_topic: "command_to_agent"
    thing_messages_topic: "thing_messages"

    # Connection settings
    twin_url: "http://ditto:ditto@sandbox.composiv.ai"
    host: sandbox.composiv.ai
    port: 1883
    keep_alive: 60
    anonymous: false
    type: real_car
    attributes: '{"brand": "muto", "model": "agent"}'

    # Command plugins
    commands:
      command1:
        name: ros/topic
        service: rostopic_list
        plugin: CommandPlugin

      command2:
        name: ros/topic/info
        service: rostopic_info
        plugin: CommandPlugin

      command3:
        name: ros/node
        service: rosnode_list
        plugin: CommandPlugin
```

## Launching the Agent

To launch the Agent as part of the full Muto system:

```bash
source /opt/ros/$ROS_DISTRO/setup.bash && source install/setup.bash
ros2 launch launch/muto.launch.py \
    vehicle_namespace:=org.eclipse.muto.test \
    vehicle_name:=test-robot-001
```

## Sending Commands

Agent listens for command execution requests through ROS 2 services and MQTT messages:

```bash
# Example: List available ROS topics
ros2 service call /muto/agent/execute_command \
    muto_msgs/srv/CommandPlugin \
    "{method: 'ros/topic', payload: '', meta: {}}"
```

## Plugins

Agent's command execution functionality can be extended through plugins. The default command plugins provide:

- **ROS Topic Commands**: List, info, and echo operations on ROS topics
- **ROS Node Commands**: List and info operations on ROS nodes
- **ROS Parameter Commands**: List and get operations on ROS parameters

### Adding a Plugin

To add a new command plugin:

1. **Create the Plugin Service**: Define your plugin service interface in `muto_msgs/srv`
2. **Implement the Plugin Node**: Create a ROS 2 node that provides the service interface
3. **Update the Configuration**: Add your plugin to the `commands` section in `muto.yaml`
4. **Register the Plugin**: Add the plugin executable to the package's setup.py

## Message Handling

Agent processes several types of messages:

| Message Type | Description |
|-------------|-------------|
| **Gateway Messages** | Bidirectional communication with cloud digital twins |
| **Command Messages** | Remote command execution requests and responses |
| **Composer Messages** | Software deployment and lifecycle management |
| **Twin Messages** | Digital twin state synchronization |

The message routing system ensures proper delivery to the appropriate Muto components based on message type and content.

## Eclipse Ditto/MQTT Integration

Agent provides secure MQTT connectivity for cloud integration:

- **Authentication**: Supports username/password and anonymous authentication
- **Topic Management**: Dynamic topic subscription based on vehicle namespace
- **Message Translation**: Converts between MQTT payloads and ROS 2 messages
- **Connection Management**: Automatic reconnection and error handling

## Symphony Integration

The Agent can integrate with Eclipse Symphony for cloud orchestration:

- **Symphony Provider**: Handles communication with Symphony control plane
- **Target Registration**: Registers the edge device as a Symphony target
- **Solution Deployment**: Receives and processes solution/instance definitions

Enable Symphony integration when launching:

```bash
ros2 launch launch/muto.launch.py \
    vehicle_namespace:=org.eclipse.muto.test \
    vehicle_name:=test-robot-001 \
    enable_symphony:=true
```

## Related Documentation

- [Muto Edge Overview](./index)
- [Composer Documentation](./composer)
- [Core Documentation](./core)
- [Getting Started Guide](./getting-started)
