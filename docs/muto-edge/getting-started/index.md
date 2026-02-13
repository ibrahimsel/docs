---
id: edgegettingstarted
title: Getting Started
sidebar_label: Getting Started
sidebar_position: 1
---

# Getting Started with Eclipse Muto

This guide will help you get Eclipse Muto up and running on your system. Choose the deployment option that best fits your needs.

## Deployment Options

Eclipse Muto supports multiple deployment approaches:

| Option | Best For | Prerequisites |
|--------|----------|---------------|
| **Container Deployment** | Production, consistent deployments | Docker/Podman |
| **Source Build** | Development, customization | ROS 2 Humble, Python 3.10+ |
| **Development Container** | Development, VS Code users | Docker, VS Code |

## Quick Start with Containers (Recommended)

The fastest way to get started is using pre-built container images.

### Prerequisites

- Docker or Podman installed
- Docker Compose (optional, for multi-container setup)

### Steps

1. **Pull the Muto container image**:

```bash
docker pull ghcr.io/eclipse-muto/muto:ros2-humble
```

2. **Run Muto**:

```bash
docker run -it --rm \
    -e MUTO_LAUNCH=/work/launch/muto.launch.py \
    -e MUTO_LAUNCH_ARGS="vehicle_namespace:=org.eclipse.muto.test vehicle_name:=test-robot-001 enable_symphony:=true" \
    -v $(pwd)/launch:/work/launch:ro \
    -v $(pwd)/config:/work/config:ro \
    --network host \
    ghcr.io/eclipse-muto/muto:ros2-humble
```

## Building from Source

For development or customization, build Muto from source.

### Prerequisites

- **ROS 2 Humble** or later
- **Python 3.10** or later
- **colcon** and **rosdep** for building and dependency management

```bash
# Install colcon and rosdep
sudo apt update
sudo apt install python3-colcon-common-extensions python3-rosdep
```

### Steps

1. **Clone the repository**:

```bash
mkdir -p ~/muto_ws/src
cd ~/muto_ws/src
git clone --recurse-submodules https://github.com/eclipse-muto/muto.git
```

2. **Install dependencies**:

```bash
cd ~/muto_ws
rosdep update
rosdep install --from-paths src --ignore-src -r -y
```

3. **Build the workspace**:

```bash
cd ~/muto_ws
colcon build --symlink-install --cmake-args -DCMAKE_BUILD_TYPE=Release
```

4. **Source the workspace**:

```bash
source /opt/ros/$ROS_DISTRO/setup.bash
source install/setup.bash
```

## Configuration

Create the configuration files for your deployment.

### muto.yaml

Create `config/muto.yaml`:

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

    # Connection settings
    twin_url: "http://ditto:ditto@sandbox.composiv.ai"
    host: sandbox.composiv.ai
    port: 1883
    keep_alive: 60
    anonymous: false

    # Commands
    commands:
      command1:
        name: ros/topic
        service: rostopic_list
        plugin: CommandPlugin
```

## Launching Muto

Start the full Muto system:

```bash
cd ~/muto_ws
source /opt/ros/$ROS_DISTRO/setup.bash
source install/setup.bash
ros2 launch launch/muto.launch.py \
    vehicle_namespace:=org.eclipse.muto.test \
    vehicle_name:=test-robot-$(shuf -i 1000-9999 -n 1)
```

### With Symphony Integration

To enable Eclipse Symphony cloud orchestration:

```bash
ros2 launch launch/muto.launch.py \
    vehicle_namespace:=org.eclipse.muto.test \
    vehicle_name:=test-robot-001 \
    enable_symphony:=true \
    log_level:=INFO
```

## Verify Installation

Check that all Muto nodes are running:

```bash
ros2 node list | grep muto
```

Expected output:
```
/muto/agent
/muto/commands_plugin
/muto/compose_plugin
/muto/core_twin
/muto/gateway
/muto/launch_plugin
/muto/muto_composer
/muto/provision_plugin
```

## Using the Sandbox

The Muto team provides a sandbox for testing without setting up your own infrastructure:

- **Ditto Sandbox**: [https://sandbox.composiv.ai](https://sandbox.composiv.ai)
- **Dashboard**: [https://dashboard.composiv.ai](https://dashboard.composiv.ai)

Connect your Muto instance to the sandbox by using the default configuration values.

## Next Steps

Now that you have Muto running:

- **[By Example](./by-example)**: Walk through practical deployment examples
- **[Blueprints](../../blueprint)**: Explore demo implementations
- **[Agent Documentation](../agent)**: Learn about the communication bridge
- **[Composer Documentation](../composer)**: Understand stack management

## Troubleshooting

### Nodes not starting

1. Verify ROS 2 is sourced:
```bash
source /opt/ros/$ROS_DISTRO/setup.bash
```

2. Verify the workspace is built and sourced:
```bash
source install/setup.bash
```

### Connection issues

1. Check MQTT broker connectivity:
```bash
mosquitto_pub -h sandbox.composiv.ai -t test -m "hello"
```

2. Verify network access to the twin server:
```bash
curl http://sandbox.composiv.ai/status
```

### Build failures

1. Ensure rosdep is initialized:
```bash
rosdep update
rosdep install --from-paths src --ignore-src -r -y
```

2. Clean and rebuild:
```bash
rm -rf build/ install/ log/
colcon build --symlink-install
```
