---
id: y-example
title: Muto By Example
sidebar_label:  Muto By Example
sidebar_position: 1
---

In this section, we will quickly describe how to start and get familiar with using Muto runtime by the way of examples.

### Prerequisites

- [docker](https://docs.docker.com/engine/install/ "Heading link")<br/>
- [npm >= 5](https://www.npmjs.com/get-npm/ "Heading link")<br/>

## Starting a device with muto and F1Tenth simulator example

### Edit your muto configuration

Open `index.js` under the src folder and edit to initialize the the host app with the LiveUI config:

```diff title="example.yaml"
  muto:
    stack_topic: /stack
    twin_topic: /twin
    type: simulator
-   twin_url: "http://localhost:8080"
+   twin_url: "http://ditto:ditto@sandbox.composiv.ai"
    commands:
        - name: ros/topic
          service: rostopic_list
          plugin: CommandPlugin
        - name: ros/topic/info
          service: rostopic_info
          plugin: CommandPlugin
        - name: ros/topic/echo
          service: rostopic_echo
          plugin: CommandPlugin
        - name: ros/node
          service: rosnode_list
          plugin: CommandPlugin
        - name: ros/node/info
          service: rosnode_info
          plugin: CommandPlugin
        - name: ros/param
          service: rosparam_list
          plugin: CommandPlugin
        - name: ros/param/get
          service: rosparam_get
          plugin: CommandPlugin
        - name: bcx/rc
          service: bcx_remotecontrol
          plugin: CommandPlugin
    pipelines:
        - name:  start
          pipeline:
            - sequence:
              - service: muto_compose
                plugin: ComposePlugin
              - service: muto_start_stack
                plugin: ComposePlugin
          compensation:
            - service: muto_kill_stack
              plugin: ComposePlugin   
        - name:  kill
          pipeline:
            - sequence:
              - service: muto_compose
                plugin: ComposePlugin
              - service: muto_kill_stack
                plugin: ComposePlugin
          compensation:
            - service: muto_kill_stack
              plugin: ComposePlugin 
        - name:  apply
          pipeline:
            - sequence:
              - service: muto_compose
                plugin: ComposePlugin
              - service: muto_apply_stack
                plugin: ComposePlugin
          compensation:
            - service: muto_kill_stack
              plugin: ComposePlugin 
    mqtt:
-     host: localhost 
+     host: sandbox.composiv.ai
      port: 1883
      keep_alive: 60
      user: none
      password: none
    thing:
      namespace: org.eclipse.muto.sandbox.f1tenth # subject to change
      anonymous: False  # Use this for automatically generated id (uuid based)
      #   if anonymous is True or anynoymous param is missing, name/id will be auto generated
      # TODO: edit the name below
+     name: bcx-f1tenth-01
```

### Launch a simulated muto device in a docker container

TODO. Describe the contents

```sh
docker run --name muto-demo --rm -it \
   -v $(pwd)/example.yaml:/home/muto/launch/config/muto.yaml  \
   -p 7777:7777 -p 11311:11311  \
   composiv/muto-demo:noetic-ros-base-focal  \
   /bin/bash -c "source devel/setup.bash && roslaunch launch/demo.launch"
```

### What happened

After launch, which should present you with a help message listing all available commands.

