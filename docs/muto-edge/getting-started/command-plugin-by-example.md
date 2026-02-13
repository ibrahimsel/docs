---
id: command-plugin-by-example
title: Command Plugin By Example
sidebar_label:  Command Plugin By Example
sidebar_position: 2
---

In this section, we will quickly describe how to create and get familiar with Muto Command Plugins and their implementation.

### Prerequisites
- [MQTTX](https://mqttx.app/)
- [Docker or Podman](https://docs.docker.com/engine/install/)
- ROS 2 Humble

## Developing a command plugin

Let's start by designing the command.

In your `config/muto.yaml`, add a new command entry under the `commands` section:

```yaml title="config/muto.yaml"
/**:
  ros__parameters:
    # ... other parameters ...

    commands:
      command1:
        name: ros/topic
        service: rostopic_list
        plugin: CommandPlugin
      # Add your custom command:
      custom_command:
        name: bcx/rc
        service: bcx_remotecontrol
        plugin: CommandPlugin
```

*Our command is: bcx/rc*

## The Code

Create a ROS 2 package for your command plugin. If you need guidance on creating ROS 2 packages, refer to the [ROS 2 Creating Packages tutorial](https://docs.ros.org/en/humble/Tutorials/Beginner-Client-Libraries/Creating-Your-First-ROS2-Package.html).

### Plugin structure

```
my_command_plugin/
├── my_command_plugin/
│   ├── __init__.py
│   └── bcx_commandplugin.py
├── package.xml
├── setup.py
├── setup.cfg
└── resource/
    └── my_command_plugin
```

### Plugin implementation

Here is the main layout of the command plugin using ROS 2 (`rclpy`):

```python title="bcx_commandplugin.py"
import rclpy
from rclpy.node import Node
from std_msgs.msg import String, Int32MultiArray
from ackermann_msgs.msg import AckermannDriveStamped
from muto_msgs.srv import CommandPlugin
import json


class BcxCommandPlugin(Node):
    def __init__(self):
        super().__init__('bcx_commandplugin')

        # Create service
        self.srv = self.create_service(
            CommandPlugin, 'bcx_remotecontrol', self.handle_remotecontrol
        )

        # Create publishers
        self.pubkey = self.create_publisher(String, '/key', 1)
        self.pubmux = self.create_publisher(Int32MultiArray, '/mux', 1)
        self.drivepub = self.create_publisher(AckermannDriveStamped, '/drive', 10)

        self.get_logger().info('BCX Command Plugin started')

    def handle_remotecontrol(self, request, response):
        payload = json.loads(request.payload)
        control_type = payload.get("control", "")

        if control_type == "keyboard":
            msg = Int32MultiArray(data=[0, 1, 0, 0, 0, 0])
            self.pubmux.publish(msg)

        elif control_type == "navigator":
            msg = Int32MultiArray(data=[0, 0, 0, 0, 1, 0])
            self.pubmux.publish(msg)

        elif control_type == "joystick":
            x = payload["x"] / 100.0
            y = payload["y"] / 100.0
            desired_velocity = 7 * y
            desired_steer = -0.4189 * x

            drive_msg = AckermannDriveStamped()
            drive_msg.drive.speed = desired_velocity
            drive_msg.drive.steering_angle = desired_steer
            self.drivepub.publish(drive_msg)

        elif control_type == "reset":
            msg = Int32MultiArray(data=[0, 0, 0, 0, 0, 0])
            self.pubmux.publish(msg)

        response.output = json.dumps({"status": "ok"})
        return response


def main(args=None):
    rclpy.init(args=args)
    node = BcxCommandPlugin()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()
```

This plugin registers a service named `bcx_remotecontrol`, which should match the string set in `muto.yaml`. When the plugin receives a command with a JSON payload, it publishes a message to the relevant topic (`/key`, `/mux`, or `/drive`).

The payload structure:

```json
{
    "control": "navigator"
}
```

### Control modes

- **Keyboard**: Requires `control`, `type`, `direction` fields
- **Joystick**: Requires `control`, `x` and `y` fields
- **Navigator**: Autopilot mode, no additional input data required

You can change the desired speed of your vehicle with the following formula (max velocity and steering angle are hardcoded):

```python
desired_velocity = 7 * y
desired_steer = -0.4189 * x
```

### Setup entry point

In your `setup.py`, register the executable:

```python title="setup.py"
entry_points={
    'console_scripts': [
        'bcx_commandplugin = my_command_plugin.bcx_commandplugin:main',
    ],
},
```

### Launch file integration

Create a ROS 2 launch file that includes your plugin alongside the Muto system:

```python title="launch/example.launch.py"
from launch import LaunchDescription
from launch_ros.actions import Node
from launch.actions import IncludeLaunchDescription
from launch.launch_description_sources import PythonLaunchDescriptionSource
import os


def generate_launch_description():
    muto_launch = IncludeLaunchDescription(
        PythonLaunchDescriptionSource(
            os.path.join('launch', 'muto.launch.py')
        )
    )

    bcx_plugin = Node(
        package='my_command_plugin',
        executable='bcx_commandplugin',
        name='bcx_commandplugin',
        output='screen',
    )

    return LaunchDescription([
        muto_launch,
        bcx_plugin,
    ])
```

### Building and running

```bash
# Build the workspace
cd ~/muto_ws
colcon build --symlink-install

# Source and launch
source /opt/ros/$ROS_DISTRO/setup.bash
source install/setup.bash
ros2 launch launch/example.launch.py \
    vehicle_namespace:=org.eclipse.muto.sandbox \
    vehicle_name:=my-f1tenth-01
```

You should see the confirmation:

```
[INFO] [bcx_commandplugin]: BCX Command Plugin started
[INFO] [muto_agent-1]: Muto Agent started successfully
[INFO] [mqtt-2]: MQTT connection established to sandbox.composiv.ai:1883
```

Please pay extra attention to the `name:` of the service in the YAML file — it must be identical to the service name registered in your plugin node. The plugin will publish data to `/drive`, `/key`, or `/mux` topics depending on the command it receives.

### Testing with MQTTX

Use [MQTTX](https://mqttx.app/) to send commands to the agent and observe that your vehicle acts accordingly:

1. Connect to `mqtt://sandbox.composiv.ai:1883`
2. Subscribe to `#` to see all messages
3. Send a command payload to trigger your plugin
4. Observe the vehicle response in Foxglove or the Dashboard

Follow the steps in [Muto by Example](./by-example) to set up the full system, then use MQTTX to send commands and observe the vehicle behavior.
