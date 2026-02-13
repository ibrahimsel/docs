---
id: muto-twins
title: Digital Twins
sidebar_label: Digital Twins
sidebar_position: 3
---

# Digital Twins with Eclipse Ditto

Eclipse Muto uses **Eclipse Ditto** to implement digital twins for edge devices. A digital twin is a virtual, cloud-based representation of a real-world device (robot, vehicle, etc.), enabling remote monitoring, management, and synchronization.

## What is Eclipse Ditto?

[Eclipse Ditto](https://eclipse.dev/ditto) is a technology in the IoT implementing the "digital twins" software pattern. It mirrors potentially millions of digital twins residing in the digital world with physical "Things".

This simplifies developing IoT solutions for software developers as they do not need to know how or where exactly the physical "Things" are connected. With Ditto, a thing can be used as any other web service via its digital twin.

## How Muto Uses Digital Twins

Each edge device managed by Muto has a corresponding digital twin that:

1. **Represents Device State**: Current software stack, configuration, and status
2. **Enables Remote Management**: Send commands and updates via the twin
3. **Synchronizes Bidirectionally**: Changes on device reflect in twin and vice versa
4. **Provides APIs**: REST and WebSocket APIs for integration

## Ditto Thing Structure

Muto devices are represented as Ditto "Things":

```json
{
  "thingId": "org.eclipse.muto.sandbox:test-robot-001",
  "policyId": "org.eclipse.muto.sandbox:test-robot-001",
  "attributes": {
    "brand": "muto",
    "model": "robot",
    "type": "real_car"
  },
  "features": {
    "stack": {
      "properties": {
        "current": {
          "metadata": {
            "name": "navigation-stack",
            "version": "1.0.0"
          },
          "status": "running"
        },
        "previous": null
      }
    },
    "telemetry": {
      "properties": {
        "odometry": {
          "position": {"x": 0.0, "y": 0.0, "z": 0.0},
          "velocity": {"linear": 0.0, "angular": 0.0}
        },
        "battery": {
          "percentage": 85,
          "voltage": 12.4
        }
      }
    },
    "commands": {
      "properties": {
        "available": ["ros/topic", "ros/node", "ros/param"]
      }
    }
  }
}
```

### Thing ID Format

Thing IDs follow the pattern: `{namespace}:{name}`

- **namespace**: Organization identifier (e.g., `org.eclipse.muto.sandbox`)
- **name**: Device identifier (e.g., `test-robot-001`)

### Attributes

Static device information:
- Brand, model, type
- Hardware specifications
- Location information

### Features

Dynamic device capabilities:

| Feature | Description |
|---------|-------------|
| `stack` | Current and previous software stack state |
| `telemetry` | Real-time sensor data and metrics |
| `commands` | Available remote commands |

## Muto Sandbox

The Muto team provides a public sandbox for testing:

### Ditto Sandbox

**URL**: [https://sandbox.composiv.ai](https://sandbox.composiv.ai)

The sandbox provides:
- Pre-configured Ditto instance
- Test namespaces for experimentation
- API access for development

**Note**: The sandbox may experience downtimes and is reset periodically without notice.

### Connecting to the Sandbox

Configure your Muto instance:

```yaml
/**:
  ros__parameters:
    twin_url: "http://ditto:ditto@sandbox.composiv.ai"
    host: sandbox.composiv.ai
    port: 1883
    namespace: org.eclipse.muto.sandbox
    name: my-robot-001
```

## Twin Operations

### Device Registration

When Muto starts, it automatically registers the device with the twin server:

1. Creates or updates the Thing in Ditto
2. Sets initial attributes and features
3. Establishes MQTT connection for updates

### State Synchronization

**Device → Twin**:
- Stack status changes
- Telemetry updates
- Command execution results

**Twin → Device**:
- Stack deployment requests
- Configuration changes
- Remote commands

### Telemetry Publishing

Agent publishes ROS topic data to the twin:

```yaml
# Configure telemetry topics in muto.yaml
telemetry:
  - topic: /odom
    feature: telemetry/odometry
    rate: 10  # Hz
  - topic: /battery_state
    feature: telemetry/battery
    rate: 1
```

## API Access

### REST API

Query device state:
```bash
curl -u ditto:ditto \
  "https://sandbox.composiv.ai/api/2/things/org.eclipse.muto.sandbox:my-robot"
```

Update a feature:
```bash
curl -X PUT -u ditto:ditto \
  -H "Content-Type: application/json" \
  "https://sandbox.composiv.ai/api/2/things/org.eclipse.muto.sandbox:my-robot/features/stack" \
  -d '{"properties": {"status": "deploying"}}'
```

### WebSocket API

Subscribe to changes:
```javascript
const ws = new WebSocket('wss://sandbox.composiv.ai/ws/2');
ws.send(JSON.stringify({
  topic: 'org.eclipse.muto.sandbox/my-robot/things/twin/commands/retrieve',
  path: '/'
}));
```

### MQTT Protocol

Muto communicates with Ditto via MQTT:

- **Publish**: `{namespace}/{name}/things/twin/commands/modify`
- **Subscribe**: `{namespace}/{name}/things/twin/events`

## Running Your Own Ditto Instance

For production deployments, run your own Ditto:

### Docker Compose

```yaml
version: '3'
services:
  ditto:
    image: eclipse/ditto:latest
    ports:
      - "8080:8080"
    environment:
      - DITTO_LOGGING_DISABLE_SYSOUT_LOG=false
```

### Configure Muto

Update configuration to point to your instance:

```yaml
/**:
  ros__parameters:
    twin_url: "http://ditto:ditto@localhost:8080"
    host: localhost
    port: 1883
```

## Integration with Symphony

When using Eclipse Symphony for orchestration, Symphony interacts with device twins to:

1. Query device state and capabilities
2. Deploy solutions to targets
3. Monitor deployment status
4. Synchronize desired state

## Best Practices

1. **Namespace Organization**: Use meaningful namespaces for device grouping
2. **Feature Design**: Keep features focused and well-structured
3. **Telemetry Rates**: Balance update frequency with network overhead
4. **Security**: Use proper authentication in production

## Related Resources

- [Eclipse Ditto Documentation](https://www.eclipse.dev/ditto/intro-overview.html)
- [Muto Core Documentation](../muto-edge/core)
- [Agent MQTT Integration](../muto-edge/agent#eclipse-dittomqtt-integration)
- [Dashboard](../muto-dashboard)
