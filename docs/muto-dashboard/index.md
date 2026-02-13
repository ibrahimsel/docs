---
id: muto-dashboard
title: Muto Dashboard
sidebar_label: Dashboard
sidebar_position: 4
---

# Muto Dashboard

Muto Dashboard is a web-based user interface for managing and monitoring Eclipse Muto concepts such as edge devices (robots/vehicles) and the software stacks running on them. The Dashboard communicates with Muto-driven vehicles through their digital twins.

## Live Dashboard

An example Muto Dashboard connected to the Muto Sandbox is available at:

**[https://dashboard.composiv.ai](https://dashboard.composiv.ai)**

This dashboard works with the [Muto Sandbox](https://sandbox.composiv.ai) and allows you to:
- Browse registered edge devices
- View device status and telemetry
- Manage software stacks
- Monitor deployments

<p align="center">
    <img src="../../img/muto-dashboard.png" alt="Muto Dashboard" />
</p>

## Features

### Device Management

- **Device List**: View all registered edge devices
- **Device Status**: Real-time status indicators
- **Device Details**: Detailed view of device attributes and features
- **Connection Status**: Monitor device connectivity

### Stack Management

- **Stack Library**: Browse available software stacks
- **Stack Deployment**: Deploy stacks to devices
- **Stack Status**: Monitor deployment progress
- **Version Management**: Track stack versions

### Telemetry Visualization

- **Real-time Data**: View live telemetry from devices
- **Historical Data**: Access historical metrics
- **Custom Dashboards**: Configure display widgets

### ROS Integration

The dashboard provides graphical interfaces for common ROS operations:

- **Node Graph**: Visualize running ROS nodes
- **Topic Monitor**: View active topics and messages
- **Parameter Browser**: Inspect ROS parameters

## Stacks Panel

The Stacks Panel allows you to:

1. **Browse Stacks**: View all available stack definitions
2. **Stack Details**: Inspect stack metadata, nodes, and configuration
3. **Deploy**: Send stack to selected devices
4. **Compare**: View differences between stack versions

### Stack Card

Each stack is displayed as a card showing:
- Stack name and version
- Description
- Content type (JSON/archive)
- Action buttons

## Edge Devices

The Edge Devices view displays:

1. **Device List**: All registered devices with status indicators
2. **Filters**: Filter by namespace, status, or type
3. **Quick Actions**: Common operations for each device

### Device Status Indicators

| Status | Description |
|--------|-------------|
| 🟢 Online | Device connected and responsive |
| 🟡 Deploying | Stack deployment in progress |
| 🔴 Offline | Device not connected |
| ⚪ Unknown | Status cannot be determined |

## Device Details

Clicking a device opens the details view:

### Overview Tab
- Device ID and namespace
- Type and attributes
- Current stack information
- Connection status

### Stack Tab
- Currently deployed stack
- Deployment history
- Rollback options

### Telemetry Tab
- Real-time sensor data
- Configurable update rate
- Data visualization widgets

### Commands Tab
- Available ROS commands
- Command execution interface
- Response viewer

## Device Telemetry

The telemetry view provides real-time data visualization:

### Supported Data Types

- **Odometry**: Position, velocity, orientation
- **Sensor Data**: LiDAR, camera, IMU
- **System Metrics**: CPU, memory, battery
- **Custom Topics**: Any ROS topic data

### Visualization Options

- Line charts for time-series data
- Gauges for current values
- Maps for position data
- Custom widgets

## Symphony Integration

When using Eclipse Symphony, the dashboard shows:

- **Solutions**: Available Symphony solutions
- **Instances**: Deployed instances
- **Targets**: Registered targets (devices)

Access Symphony Portal directly at `http://localhost:3000` when running locally.

## Architecture

The Dashboard uses a micro-frontend architecture built with [LiveUI](../LiveUI/):

```
┌─────────────────────────────────────────┐
│            Dashboard Shell              │
├─────────────┬─────────────┬─────────────┤
│   Devices   │   Stacks    │  Telemetry  │
│   Plugin    │   Plugin    │   Plugin    │
└─────────────┴─────────────┴─────────────┘
        │             │             │
        ▼             ▼             ▼
┌─────────────────────────────────────────┐
│          Eclipse Ditto API              │
└─────────────────────────────────────────┘
```

## Configuration

### Connecting to Your Ditto Instance

Configure the Dashboard to connect to your Ditto server:

```javascript
// dashboard.config.js
export default {
  ditto: {
    url: 'https://your-ditto-server.com',
    username: 'your-username',
    password: 'your-password'
  },
  namespace: 'your.namespace'
};
```

### Customization

The Dashboard supports customization through:

- **Themes**: Light/dark mode, custom colors
- **Layouts**: Configurable dashboard layouts
- **Plugins**: Add custom functionality via LiveUI plugins

## Running Locally

### With Docker

```bash
docker run -p 3000:3000 \
  -e DITTO_URL=https://sandbox.composiv.ai \
  ghcr.io/eclipse-muto/dashboard:latest
```

### From Source

```bash
git clone https://github.com/eclipse-muto/dashboard.git
cd dashboard
npm install
npm start
```

## Extending the Dashboard

Create custom plugins using LiveUI:

```javascript
// my-plugin/index.js
export default {
  name: 'my-custom-plugin',
  component: MyComponent,
  routes: [
    { path: '/my-feature', component: MyFeature }
  ]
};
```

See [LiveUI Documentation](../LiveUI/) for detailed plugin development guide.

## Troubleshooting

### Dashboard not loading

1. Check browser console for errors
2. Verify Ditto server is accessible
3. Check CORS configuration

### Devices not appearing

1. Verify devices are registered with Ditto
2. Check namespace configuration
3. Ensure proper authentication

### Telemetry not updating

1. Check device is connected
2. Verify telemetry topics are configured
3. Check browser WebSocket connection

## Related Resources

- [Digital Twins Documentation](../muto-twins)
- [LiveUI Framework](../LiveUI/)
- [Eclipse Ditto API](https://www.eclipse.dev/ditto/http-api-doc.html)
