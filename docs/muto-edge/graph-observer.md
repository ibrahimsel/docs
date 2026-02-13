---
id: graph-observer
title: Graph Observer
sidebar_label: Graph Observer
sidebar_position: 5
---

# Graph Observer

The Graph Observer is a two-process subsystem that continuously monitors the live ROS 2 computational graph, compares it against the desired state from the deployed stack manifest, detects drift, and exposes the state to external tools. The observation loop runs in the **Muto Daemon** (`muto_daemon`), a dedicated C++ node built with rclcpp for deterministic timing on edge devices. Reconciliation decisions are handled by the **Muto Composer** (`muto_composer`). See [MEP-0001](../contributing/mep/MEP-0001) for the full design proposal.

:::info Status
This feature is proposed in [MEP-0001](../contributing/mep/MEP-0001) and is not yet implemented. This page documents the planned API for early feedback and integration planning.
:::

## Overview

After a stack is deployed, the Graph Observer:

1. **Probes** the live ROS 2 graph every 5 seconds via the Daemon (configurable)
2. **Compares** the actual running nodes against the desired state from the stack manifest
3. **Detects** drift (missing nodes, unexpected nodes, parameter changes)
4. **Publishes** the full graph state and change events to ROS topics
5. **Syncs** graph state to the Eclipse Ditto digital twin for cloud-side observability
6. **Reconciles** drift via the Composer by restarting individual nodes or escalating to full redeploy

```mermaid
graph LR
    subgraph "muto_daemon (C++)"
        GO[Graph Observer]
    end
    GO -->|probe| RG[ROS 2 Graph]
    GO -->|publish| T1[/muto/graph_state]
    GO -->|publish| T2[/muto/graph_events]
    GO -->|publish| T3[/muto/graph_state_json]
    GO -->|publish| T4[/muto/graph_drift]
    T4 --> COMP[Muto Composer]
    COMP -->|sync| DT[Ditto Digital Twin]
    T1 --> DB[Dashboard]
    T2 --> DB
    T3 --> WEB[Web UI via rosbridge]
    DT --> CLOUD[Cloud Dashboard]
```

## ROS Topics

### `/muto/graph_state`

Full graph snapshot published every probe cycle.

- **Type:** `muto_msgs/GraphSnapshot`
- **QoS:** Reliable, Transient Local, depth 1
- **Frequency:** Every 5 seconds (configurable via `graph_observer_interval`)

Transient Local durability ensures that a subscriber connecting after the Observer has started immediately receives the most recent snapshot without waiting for the next cycle.

### `/muto/graph_events`

Change events published only when the graph state changes.

- **Type:** `muto_msgs/GraphEvent`
- **QoS:** Reliable, Keep Last 50

Event types:

| `event_type` | Description |
|---|---|
| `node_appeared` | A new node was detected in the live graph |
| `node_disappeared` | A previously running node is no longer present |
| `node_crashed` | A Muto-managed node crashed (exit code detected) |
| `drift_detected` | Desired vs. actual mismatch found |
| `drift_resolved` | Previously detected drift has been corrected |
| `reconciliation_started` | Corrective action is being taken |
| `reconciliation_completed` | Corrective action finished |

### `/muto/graph_drift`

Current drift status. Empty lists indicate a converged graph.

- **Type:** `muto_msgs/GraphDrift`
- **QoS:** Reliable, Transient Local, depth 1

### `/muto/graph_state_json`

JSON-stringified graph snapshot for easy consumption by web dashboards that cannot deserialize ROS message types directly.

- **Type:** `std_msgs/String`
- **QoS:** Reliable, Transient Local, depth 1

## ROS Services

### `/muto/get_graph_state` (Daemon)

On-demand graph state query. Triggers an immediate probe cycle. Served by the Daemon.

- **Type:** `muto_msgs/GetGraphState`

```
# Request
string stack_name    # Optional filter; empty = current active stack

# Response
GraphSnapshot snapshot
bool success
string error_message
```

### `/muto/reconcile_now` (Composer)

Force an immediate reconciliation cycle. Supports dry-run mode for observing what actions would be taken without executing them. Served by the Composer (since reconciliation requires access to the launch infrastructure).

- **Type:** `muto_msgs/ReconcileNow`

```
# Request
string stack_name
bool dry_run         # If true, report actions without executing

# Response
GraphDrift detected_drift
string[] actions_taken
bool success
string error_message
```

## Message Types

### `muto_msgs/NodeState`

Represents the observed state of a single ROS node.

```
string name                  # Node name, e.g. "talker"
string namespace             # Namespace, e.g. "/demo"
string fully_qualified_name  # Full path, e.g. "/demo/talker"
string package_name          # ROS package, if known from manifest
string executable            # Executable name, if known
string status                # running | missing | unexpected | crashed
string[] publisher_topics    # Topics this node publishes to
string[] subscriber_topics   # Topics this node subscribes to
string[] service_names       # Services this node provides
bool managed_by_muto         # True if launched by Muto
```

### `muto_msgs/GraphSnapshot`

Complete graph state at a point in time.

```
builtin_interfaces/Time timestamp
string stack_name
string stack_id
string status                # converged | drifted | reconciling | unknown
NodeState[] desired_nodes
NodeState[] actual_nodes
GraphDrift drift
```

### `muto_msgs/GraphDrift`

Diff between desired and actual graph.

```
string[] missing_nodes       # Desired but not running
string[] unexpected_nodes    # Running but not in manifest
string[] parameter_drifts    # JSON-encoded parameter diffs
builtin_interfaces/Time timestamp
```

### `muto_msgs/GraphEvent`

Published on state changes for event-driven UIs.

```
builtin_interfaces/Time timestamp
string event_type
string stack_name
string node_name
string node_namespace
string details               # JSON-encoded event details
```

## JSON Schema

The `/muto/graph_state_json` topic publishes a `std_msgs/String` containing:

```json
{
  "timestamp": "2026-02-13T10:30:00Z",
  "stack_name": "demo_talker_listener",
  "stack_id": "org.eclipse.muto.sandbox:example-01",
  "status": "converged",
  "desired_nodes": [
    {
      "name": "talker",
      "namespace": "/demo",
      "fully_qualified_name": "/demo/talker",
      "package_name": "demo_nodes",
      "executable": "talker",
      "status": "running",
      "publisher_topics": ["/chatter"],
      "subscriber_topics": [],
      "service_names": [],
      "managed_by_muto": true
    }
  ],
  "actual_nodes": [
    {
      "name": "talker",
      "namespace": "/demo",
      "fully_qualified_name": "/demo/talker",
      "package_name": "",
      "executable": "",
      "status": "running",
      "publisher_topics": ["/chatter", "/rosout"],
      "subscriber_topics": ["/parameter_events"],
      "service_names": [
        "/demo/talker/describe_parameters",
        "/demo/talker/get_parameters"
      ],
      "managed_by_muto": true
    }
  ],
  "drift": {
    "missing_nodes": [],
    "unexpected_nodes": [],
    "parameter_drifts": [],
    "timestamp": "2026-02-13T10:30:00Z"
  }
}
```

## Subscribing from External Tools

### Python (rclpy)

```python
import rclpy
from rclpy.node import Node
from muto_msgs.msg import GraphSnapshot

class GraphMonitor(Node):
    def __init__(self):
        super().__init__('graph_monitor')
        self.subscription = self.create_subscription(
            GraphSnapshot,
            '/muto/graph_state',
            self.graph_callback,
            rclpy.qos.QoSProfile(
                reliability=rclpy.qos.ReliabilityPolicy.RELIABLE,
                durability=rclpy.qos.DurabilityPolicy.TRANSIENT_LOCAL,
                depth=1
            )
        )

    def graph_callback(self, msg):
        self.get_logger().info(
            f'Stack: {msg.stack_name} | Status: {msg.status} | '
            f'Desired: {len(msg.desired_nodes)} | '
            f'Actual: {len(msg.actual_nodes)} | '
            f'Missing: {len(msg.drift.missing_nodes)}'
        )
```

### C++ (rclcpp)

```cpp
#include "rclcpp/rclcpp.hpp"
#include "muto_msgs/msg/graph_snapshot.hpp"

class GraphMonitor : public rclcpp::Node {
public:
    GraphMonitor() : Node("graph_monitor") {
        auto qos = rclcpp::QoS(1)
            .reliable()
            .transient_local();

        subscription_ = create_subscription<muto_msgs::msg::GraphSnapshot>(
            "/muto/graph_state", qos,
            [this](const muto_msgs::msg::GraphSnapshot::SharedPtr msg) {
                RCLCPP_INFO(get_logger(),
                    "Stack: %s | Status: %s | Missing: %zu",
                    msg->stack_name.c_str(),
                    msg->status.c_str(),
                    msg->drift.missing_nodes.size());
            });
    }

private:
    rclcpp::Subscription<muto_msgs::msg::GraphSnapshot>::SharedPtr subscription_;
};
```

### Web Dashboard (via rosbridge)

For web-based dashboards, subscribe to the JSON topic via [rosbridge_suite](https://github.com/RobotWebTools/rosbridge_suite):

```javascript
const ros = new ROSLIB.Ros({ url: 'ws://localhost:9090' });

const graphTopic = new ROSLIB.Topic({
  ros: ros,
  name: '/muto/graph_state_json',
  messageType: 'std_msgs/String'
});

graphTopic.subscribe((message) => {
  const graphState = JSON.parse(message.data);
  console.log(`Status: ${graphState.status}`);
  console.log(`Missing nodes: ${graphState.drift.missing_nodes}`);

  // Update your dashboard visualization
  renderGraph(graphState.desired_nodes, graphState.actual_nodes);
});
```

## Ditto Digital Twin Integration

The graph state is automatically synced to the device's digital twin in Eclipse Ditto as the `graph` feature. This enables cloud-side observability without direct ROS topic access.

### Reading Graph State

```bash
# Get current graph state for a device
curl -u user:password \
  "https://ditto.example.com/api/2/things/org.eclipse.muto.sandbox:example-01/features/graph/properties"
```

### Subscribing to Changes

Use Ditto's Server-Sent Events (SSE) API to get real-time updates:

```bash
curl -N -u user:password \
  "https://ditto.example.com/api/2/things/org.eclipse.muto.sandbox:example-01/features/graph" \
  -H "Accept: text/event-stream"
```

### Querying Fleet Graph Status

Find all devices with graph drift:

```bash
curl -u user:password \
  "https://ditto.example.com/api/2/search/things?filter=not(eq(features/graph/properties/status,'converged'))"
```

## Configuration

Configuration is split across the Daemon and Composer nodes.

### Daemon Parameters (`muto_daemon`)

| Parameter | Type | Default | Description |
|---|---|---|---|
| `graph_observer_interval` | float | `5.0` | Seconds between graph probes |
| `graph_observer_enabled` | bool | `true` | Enable/disable the observation loop |

### Composer Parameters (`muto_composer`)

| Parameter | Type | Default | Description |
|---|---|---|---|
| `reconciliation_enabled` | bool | `true` | Enable/disable reconciliation actions |
| `reconciliation_mode` | string | `"auto"` | `auto`: detect and fix; `notify_only`: detect only; `disabled`: off |
| `reconciliation_max_retries` | int | `3` | Max restart attempts per node before escalating |
| `reconciliation_cooldown_sec` | float | `30.0` | Minimum seconds between reconciliation attempts |
| `graph_observer_stabilization_sec` | float | `15.0` | Seconds to wait after deployment before learning desired state |

### Example Launch Configuration

```python
from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    return LaunchDescription([
        # Daemon: C++ observation loop
        Node(
            package='muto_daemon',
            executable='muto_daemon',
            parameters=[{
                'graph_observer_interval': 10.0,  # Probe every 10 seconds
            }]
        ),
        # Composer: Python reconciliation
        Node(
            package='muto_composer',
            executable='muto_composer',
            parameters=[{
                'reconciliation_enabled': True,
                'reconciliation_mode': 'notify_only',  # Start with monitoring only
            }]
        ),
    ])
```

## Architecture

The Graph Observer is split across two processes for performance and fault isolation:

| Process | Language | Role |
|---|---|---|
| `muto_daemon` | C++ (rclcpp) | Graph probing, drift detection, state publishing, `GetGraphState` service |
| `muto_composer` | Python (rclpy) | Reconciliation decisions, corrective actions, `ReconcileNow` service, Ditto sync |

The Daemon uses C++ to eliminate Python GIL/GC overhead on edge devices. It communicates with the Composer exclusively via ROS topics and services. See [MEP-0001](../contributing/mep/MEP-0001#daemon-architecture) for the full architectural rationale.

## Related

- [MEP-0001: Live ROS Graph Orchestration](../contributing/mep/MEP-0001) -- Full design proposal
- [Composer Documentation](./composer) -- Stack lifecycle management and reconciliation
- [Agent Documentation](./agent) -- Communication bridge
- [Core Documentation](./core) -- Digital twin connectivity
