---
id: mutocore
title: Muto Core
sidebar_label: Core
sidebar_position: 2
---

# Muto Core

**Muto Core** provides foundational classes, interfaces, and utilities for device and digital twin management within the Eclipse Muto ecosystem. It serves as the central/common library for other Muto components.

## Overview

Core incorporates essential functionality that is shared across Muto components:

- Digital Twin implementation and connectivity
- Twin Services for cloud integration
- Common utilities and base classes
- Configuration management
- ROS message definitions and interfaces

## Features

### Digital Twin Connectivity

Core provides Eclipse Ditto device twin connectivity with the following capabilities:

- **Registration**: Device registration and authentication with the twin server
- **Stack Accessors/Mutators**: Read and write stack definitions to digital twins
- **Introspection**: Query and inspect twin state
- **Telemetry Operations**: Retrieve, save, and revoke telemetry data
- **Vehicle Introspection**: Query device/vehicle specific information

### ROS Node Introspection

Common features for ROS node introspection:

- Query active nodes in the ROS graph
- Inspect node parameters and topics
- Monitor node lifecycle states

### Data Transfer Objects

Muto and ROS-specific data transfer objects:

| Object | Description |
|--------|-------------|
| **Args** | Launch arguments and configurations |
| **Node** | ROS node definitions |
| **Param** | Parameter definitions |
| **Stack** | Stack manifest definitions |
| **Edge Device** | Device representation |

## Twin Service

The Twin service (`core_twin`) provides the interface between Muto and the digital twin server:

```python
# Twin node is launched as part of the Muto system
node_twin = Node(
    namespace=LaunchConfiguration("muto_namespace"),
    name="core_twin",
    package="core",
    executable="twin",
    output="screen",
    parameters=[
        muto_params,
        {"namespace": LaunchConfiguration("vehicle_namespace")},
        {"name": LaunchConfiguration("vehicle_name")},
    ],
)
```

## Configuration

Core uses the shared `muto.yaml` configuration file:

```yaml
/**:
  ros__parameters:
    # Twin server connection
    twin_url: "http://ditto:ditto@sandbox.composiv.ai"

    # Device identification
    namespace: org.eclipse.muto.sandbox
    name: mytest_vehicle_001
    type: real_car
    attributes: '{"brand": "muto", "model": "core"}'

    # Topic mappings
    twin_topic: "twin"
    thing_messages_topic: "thing_messages"
```

## Message Types

Core defines several ROS message types used throughout Muto:

### MutoAction.msg
Central action message supporting multiple stack formats:
- JSON stack definitions
- Binary (archive) stack definitions
- URL-based stack references

### StackManifest.msg
Complete stack definition including:
- Metadata (name, version, description)
- Node definitions
- Parameter configurations
- Launch context

### Thing.msg & ThingHeaders.msg
Digital twin representation:
- Device identity and attributes
- Twin state and features
- Message headers and metadata

### Gateway.msg
Gateway communication protocol:
- Inbound/outbound message routing
- Protocol-specific payloads

## Service Definitions

Core provides service interfaces:

| Service | Description |
|---------|-------------|
| `CoreTwin.srv` | Digital twin service interface |
| `ComposePlugin.srv` | Composition service for stack management |
| `LaunchPlugin.srv` | Launch system service interface |
| `CommandPlugin.srv` | Command execution service |
| `ProvisionPlugin.srv` | Provisioning service interface |

## Usage

Core is typically not used directly but provides the foundation for Agent and Composer:

```bash
# Core twin is launched as part of the full Muto system
ros2 launch launch/muto.launch.py \
    vehicle_namespace:=org.eclipse.muto.test \
    vehicle_name:=test-robot-001
```

## Integration with Eclipse Ditto

Core provides seamless integration with Eclipse Ditto for digital twin management:

1. **Device Registration**: Automatically registers edge devices with the twin server
2. **State Synchronization**: Keeps device state in sync with digital twin
3. **Feature Management**: Manages Ditto features for stacks, telemetry, and commands
4. **Policy Integration**: Works with Ditto policies for access control

### Ditto Thing Structure

Muto devices are represented as Ditto Things:

```json
{
  "thingId": "org.eclipse.muto.sandbox:test-robot-001",
  "policyId": "org.eclipse.muto.sandbox:test-robot-001",
  "attributes": {
    "brand": "muto",
    "model": "core",
    "type": "real_car"
  },
  "features": {
    "stack": {
      "properties": {
        "current": { /* current stack definition */ },
        "status": "running"
      }
    },
    "telemetry": {
      "properties": {
        "odometry": { /* odom data */ },
        "battery": { /* battery status */ }
      }
    }
  }
}
```

## Related Documentation

- [Muto Edge Overview](./index)
- [Agent Documentation](./agent)
- [Composer Documentation](./composer)
- [Digital Twins](../muto-twins)
