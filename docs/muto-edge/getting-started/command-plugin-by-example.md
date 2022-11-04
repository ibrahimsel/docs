---
id: command-plugin-by-example
title: Command Plugin By Example
sidebar_label:  Command Plugin By Example
sidebar_position: 1
---

In this section, we will quickly describe how to create and get familiar with Muto Command Plugins and their implementation.

### Prerequisites
- [mqttx](https://mqttx.app/ "Heading link")<br/>
- [docker](https://docs.docker.com/engine/install/ "Heading link")<br/>
- [npm >= 5](https://www.npmjs.com/get-npm/ "Heading link")<br/>

## Developing a command plugin


Let's start by designing the command.

If you navigate to `example.yaml` (see previous example)

We'll add the following section.


```sh
plugin: CommandPlugin
        - name: bcx/rc
          service: bcx_remotecontrol
          plugin: CommandPlugin
```

*Our command is : bcx/rc*


- Create an empty src folder.
- Clone the bcx ROS package for python into your src folder.
- Add bcx_commandplugin.py

## The Code


*If you wish to create your own `package`, you can find the corresponding guide [here](http://wiki.ros.org/ROS/Tutorials/CreatingPackage/ "Heading link")<br/>*
*If you wish to create your own package `workspace`, you can find the corresponding guide [here](http://wiki.ros.org/catkin/workspaces/ "Heading link")<br/>*


You can find information regarding the ROS node in `package.xml` and `cmake list`.

If you face any issues, refer to the ROS tutorial above for solutions.

**--REDACTED--**

You can access the entire code [here](bcx_commandplugin.py)



This is the main layout of our code. It's basically a package with a .json payload which includes data such as `control type`, `type`, `direction`, `x and y data`, `velocity`.

```yaml
{
    "control": "navigator",
}
```

This plugin reggisters a service named `bcx_remotecontrol`, which should map the string that you set in the example.yaml.  When the plugin recieves a command with the payload that is defined above, it will publish a message to the relevant topic (in this case one of /key, /mux or /drive).

```py

if __name__ == '__main__': 
  try:
    
    rospy.init_node('bcx_commandplugin')
    bcx_remotecontrol = rospy.Service(
            "bcx_remotecontrol", muto_srv.CommandPlugin, handle_remotecontrol)
    pubkey = rospy.Publisher('/key', String, queue_size=1)
    pubmux = rospy.Publisher('/mux', Int32MultiArray, queue_size=1)
    drivepub = rospy.Publisher('/drive', AckermannDriveStamped, queue_size=10)
    rospy.spin()
    
  except rospy.ROSInterruptException:
    pass

```

### Control Logic

When the plugin receives a command with a payload, it uses the following logic to control the car.  (e.g. control/type/direction etc. in the payload). Control modes and reqiured data types are: 
- Keyboard : `control type` `type` `direction`
- Joystick : `control type` `x and y`
- Navigator : Since it's the autopilot mode it doens't require us to send any input data.


You can find additional infomation regarding these control types in the F1Tenth files.

```py
if controlType == "keyboard" :
      msg = Int32MultiArray(data=[0,1,0,0,0,0])
      pubmux.publish(msg)

  if controlType == "navigator" :
      msg = Int32MultiArray(data=[0,0,0,0,1,0])
      pubmux.publish(msg)

  if controlType == "joystick":
      x = payload["x"]/100.0
      y = payload["y"]/100.0

  if controlType == "reset" :
      msg = Int32MultiArray(data=[0,0,0,0,0,0])
      pubmux.publish(msg)   
```



You can change the desired speed of your vehicle by the following simple formula ( max velocity and steering angle are hardcoded) :

```py
desired_velocity = 7 * y
desired_steer = -0.4189 * x

```

**Modes and reqiured data types : **

- Keyboard : `control type` `type` `direction` `x and y`

- Joystick : `control type` `type` `x and y`

- Navigator : Since it's the autopilot mode it doens't require us to send any input data.


You can find additional infomation regarding these control types in the F1Tenth files.

Now create a dedicated workspace for docker operations. For the sake of this example we'll call that workspace `junk`.

```bash
mkdir JUNK
cd JUNK
mkdir src
```


create a file named : `example.launch`
```launch
<?xml version="1.0"?>
<launch>

    <arg name="muto" default="$(dirname)/.." />

    <node pkg="muto_agent" name="muto_agent" type="muto_agent.py" output="screen">
        <rosparam command="load" file="$(arg muto)/launch/config/muto.yaml" />
    </node>

    <node pkg="muto_composer" name="muto_composer" type="muto_composer.py" output="screen">
        <rosparam command="load" file="$(arg muto)/launch/config/muto.yaml" />
    </node>


    <node pkg="muto_composer" name="composer_plugin" type="composer_plugin.py" output="screen">
        <rosparam command="load" file="$(arg muto)/launch/config/muto.yaml" />
    </node>

    <node pkg="muto_composer" name="launch_plugin" type="launch_plugin.py" output="screen">
        <rosparam command="load" file="$(arg muto)/launch/config/muto.yaml" />
    </node>

    <include file="$(find rosbridge_server)/launch/rosbridge_websocket.launch">
        <arg name="port" value="7777"/>
    </include>

    <node pkg="mutoexamples_bcxcommands" name="bcx_commandplugin" type="bcx_commandplugin.py" output="screen">
    </node>

</launch>
```
create a file named : `example.yaml`
Copy the contents of `example.yaml` into it (see previous examples)

within your workspace run 

```sh
docker run --name muto-demo --rm -it \
   -v $(pwd)/example.yaml:/home/muto/launch/config/muto.yaml  \
   -v $(pwd)/example.launch:/home/muto/launch/example.launch  \
   -v $(pwd)/src/mutoexamples_bcxcommands:/home/muto/src/mutoexamples_bcxcommands  \
   -p 7777:7777 -p 11311:11311  \
   composiv/muto-demo:noetic-ros-base-focal  \
   /bin/bash -c "source devel/setup.bash && catkin_make && roslaunch launch/example.launch"

```
You should see the confirmation line

```bash
Connected with result code Success
Subscribed to:  org.eclipse.muto.sandbox.f1tenth:docs-bcx-01/#

```
The ROS workspace in the docker image is /home/muto.
Please pay extra attention to the `name:` of our service. It needs to be identical to the name in the `.yaml` file.
We'll publish data either to `/drive`,`/key` or `/mux ` topics depending on the command that this channel recieves.



