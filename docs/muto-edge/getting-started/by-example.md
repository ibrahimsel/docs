---
id: by-example
title: Muto By Example
sidebar_label:  Muto By Example
sidebar_position: 1
---

In this section, we will quickly describe how to start and get familiar with using Muto runtime by the way of examples.

### Prerequisites

- [Docker or Podman](https://docs.docker.com/engine/install/)
- ROS 2 Humble (for local testing)
- [MQTTX](https://mqttx.app/) (optional, for inspecting MQTT messages)

## Starting a device with Muto

### Step 1: Clone the repository and prepare configuration

```bash
git clone --recurse-submodules https://github.com/eclipse-muto/muto.git
cd muto
```

### Step 2: Edit your Muto configuration

Open `config/muto.yaml` and customize the vehicle identity and connection settings:

```diff title="config/muto.yaml"
  /**:
    ros__parameters:
      prefix: muto
      namespace: org.eclipse.muto.sandbox
-     name: mytest_vehicle_001
+     name: my-f1tenth-01

      # Topic mappings
      stack_topic: "stack"
      twin_topic: "twin"
      agent_to_gateway_topic: "agent_to_gateway"
      gateway_to_agent_topic: "gateway_to_agent"
      agent_to_commands_topic: "agent_to_command"
      commands_to_agent_topic: "command_to_agent"
      thing_messages_topic: "thing_messages"

      # Connection settings
-     twin_url: "https://ditto:ditto@sandbox.composiv.ai"
+     twin_url: "http://ditto:ditto@sandbox.composiv.ai"
      host: sandbox.composiv.ai
      port: 1883
      keep_alive: 60
      anonymous: true
      type: simulator
      attributes: '{"brand": "f1tenth.org", "model": "f1tenth-simulation"}'

      # Commands
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

### Step 3: Launch Muto in a container

```bash
podman run --name muto-demo --rm -it \
   -e MUTO_LAUNCH=/work/launch/muto.launch.py \
   -e MUTO_LAUNCH_ARGS="vehicle_namespace:=org.eclipse.muto.sandbox vehicle_name:=my-f1tenth-01 enable_symphony:=true" \
   -v $(pwd)/launch:/work/launch:ro \
   -v $(pwd)/config:/work/config:ro \
   --network host \
   ghcr.io/eclipse-muto/muto:ros2-humble
```

### What happened?

When the container starts, the following happens:

- Muto Agent, Muto Composer, and Muto Core launched on the vehicle
- The agent connects to the MQTT broker and subscribes to the vehicle's digital twin topic
- The device registers with the Ditto twin server at sandbox.composiv.ai

You should see output similar to:

```
[INFO] [muto_agent-1]: Muto Agent started successfully
[INFO] [mqtt-2]: MQTT connection established to sandbox.composiv.ai:1883
[INFO] [twin-4]: Device registered successfully
```

### Step 4: Verify the system

In a separate terminal, check the running nodes:

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

### Deploying a stack via the Dashboard

Open the [Muto Dashboard](https://dashboard.composiv.ai/) in your browser.

Here you are greeted by the **summary screen**. This screen shows all the vehicles and stacks that are registered.

<p align="center">
    <img src="../../../img/summary_screen.png" style={{scale:0.5}}/>
</p>

Navigate to the **Vehicle List**. You can see the vehicles registered and their online status. To try out, you can stop the container and restart a new one to experiment.

<p align="center">
    <img src="../../../img/vehicles.png" style={{scale:0.5}}/>
</p>

Click on **Vehicle Detail** to see the console output and device information.

<p align="center">
    <img src="../../../img/vehicle_detail.png" style={{scale:0.5}}/>
</p>

If you open **muto agent** from plugins, you can see the services supported by muto agent. The node information matches the corresponding entries in the YAML configuration file.

<p align="center">
    <img src="../../../img/agent_nodes.png" style={{scale:0.5}}/>
</p>

### Working with stacks

Navigate to the **Stacks** tab. These are the stacks stored in the Ditto twin server. Any stack can be deployed if provisioning is available.

If you navigate to the stacks tab you see the `set` and `apply` buttons. If you press set, you can see activity in the console. If not, this may be a refresh issue due to synchronization — navigate back to the vehicle list and return.

<p align="center">
    <img src="../../../img/stackset.png" style={{scale:0.5}}/>
</p>

After setting the stack, the **current stack id** updates:

<p align="center">
    <img src="../../../img/currentstack.png" style={{scale:0.5}}/>
</p>

When the list updates you'll see `start` and `stop` buttons. `start` executes the stack and `stop` stops the execution. When you press start you'll see activity in the console. Navigate to the node list to see all nodes that Muto Composer launched.

If you wish to see the parameters used by the system, navigate to the `parameters` tab.

### Visualization with Foxglove Studio

Navigate to [Foxglove Studio](https://studio.foxglove.dev/). Click on **Open Connection** and configure the WebSocket connection to your device.

You can import the [Foxglove layout](FoxgloveLayout-F1Tenth.json) for pre-configured visualization panels.

<p align="center">
    <img src="../../../img/foxglove_1.png" style={{scale:0.5}}/>
</p>

<p align="center">
    <img src="../../../img/foxglove_2.png" style={{scale:0.5}}/>
</p>

### Observing telemetry

Navigate to the vehicle page, click on **Topics** and select a topic (e.g., `/drive`) to view telemetry data such as Ackermann messages.

<p align="left">
    <img src="../../../img/drivetopic.png" style={{scale:0.5}}/>
</p>

Click **echo** to see real-time telemetry output:

<p align="center">
    <img src="../../../img/addtelemetry.png" style={{scale:0.5}}/>
</p>

<p align="center">
    <img src="../../../img/drivetopicinternal.png" style={{scale:0.5}}/>
</p>

Since this runs over MQTT, anyone who connects to your MQTT broker can subscribe to the published data.

_You'll start to see the data when you click on drive and start respectively._

### RECAP

1. We configured `config/muto.yaml` with the `/**:` / `ros__parameters:` format for our vehicle identity and connection settings
2. We launched Muto in a container using `ghcr.io/eclipse-muto/muto:ros2-humble` with `MUTO_LAUNCH` and `MUTO_LAUNCH_ARGS` environment variables
3. We used the Dashboard to monitor the vehicle, set and deploy stacks
4. We observed telemetry data from the device topics
5. We visualized data using Foxglove Studio
