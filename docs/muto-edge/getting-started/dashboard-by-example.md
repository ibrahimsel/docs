---
id: dashboard-by-example
title: Dashboard By Example
sidebar_label:  Dashboard By Example
sidebar_position: 3
---

In this quick start section, we will demonstrate how to use and extend the Muto Dashboard for managing Eclipse Muto devices and stacks.

## Prerequisites
- [MQTTX](https://mqttx.app/)
- [Docker or Podman](https://docs.docker.com/engine/install/)
- [Node.js and npm](https://nodejs.org/)

## Definition

Muto Dashboard is a web-based user interface for managing and monitoring Eclipse Muto concepts such as **Edge Devices** (vehicles/robots) and the **Stacks** (ROS software) running on these devices. The Dashboard communicates with Muto-driven vehicles and their Digital Twins. An example [Muto Dashboard](../../muto-dashboard) that works with [Muto Sandbox](https://sandbox.composiv.ai) is available at [https://dashboard.composiv.ai](https://dashboard.composiv.ai).

### Using the hosted Dashboard

The fastest way to get started is using the hosted dashboard at [https://dashboard.composiv.ai](https://dashboard.composiv.ai). This connects to the Muto sandbox and shows all registered vehicles and stacks.

1. **Start Muto** with your vehicle connected to the sandbox (see [Getting Started](./index)):

```bash
podman run --rm -it \
    -e MUTO_LAUNCH=/work/launch/muto.launch.py \
    -e MUTO_LAUNCH_ARGS="vehicle_namespace:=org.eclipse.muto.test vehicle_name:=test-robot-001 enable_symphony:=true" \
    -v $(pwd)/launch:/work/launch:ro \
    -v $(pwd)/config:/work/config:ro \
    --network host \
    ghcr.io/eclipse-muto/muto:ros2-humble
```

2. **Open the Dashboard** at [https://dashboard.composiv.ai](https://dashboard.composiv.ai)

You will be greeted by the **summary screen**:

<p align="center">
    <img src="../../../img/summary_screen.png" style={{scale:0.5}}/>
</p>

### Running the Dashboard locally

Clone the Dashboard source code from the GitHub repository:

```bash
git clone https://github.com/eclipse-muto/dashboard
```

Install npm dependencies and start:
```bash
cd dashboard
npm install
npm start
```

You should see:

```
Compiled successfully.
```

The server starts and you will be greeted by a page similar to the hosted dashboard.

<p align="center">
    <img src="../../../img/summary_screen.png" style={{scale:0.5}}/>
</p>

## Dashboard features

### Vehicle management

Navigate to the **Vehicle List** to see all registered vehicles and their online status. Click on a vehicle to see its details, running nodes, and configuration.

### Stack deployment

From the vehicle detail page, navigate to **Stacks** to:
- **Set** a stack to assign it to the vehicle
- **Start** to deploy the selected stack
- **Stop** to halt the running stack

### Telemetry monitoring

Navigate to **Topics** to view real-time data streams from the vehicle's ROS topics. Click **echo** on any topic to see live data.

### MQTT message inspection

You can inspect MQTT messages between the Dashboard and Eclipse Muto components using [MQTTX](https://mqttx.app/). Connect to `mqtt://sandbox.composiv.ai:1883` and subscribe to `#`. You should see messages as you interact with the vehicle through the Dashboard.

<p align="center">
    <img src="../../../img/mqttfor.png" style={{scale:0.5}}/>
</p>

<p align="center">
    <img src="../../../img/mqttback.png" style={{scale:0.5}}/>
</p>

<p align="center">
    <img src="../../../img/mqttleft.png" style={{scale:0.5}}/>
</p>

<p align="center">
    <img src="../../../img/mqttright.png" style={{scale:0.5}}/>
</p>

## Customizing the Dashboard

The Dashboard is a React application that can be extended with custom pages and components. To add new features:

1. **Clone the repository** and install dependencies as shown above
2. **Create new components** in the `src/` directory
3. **Add routes** in `src/containers/routes.tsx` for new pages
4. **Connect to Muto** using the existing MQTT and Ditto client libraries

For more information about the Dashboard architecture, see the [Dashboard documentation](../../muto-dashboard).
