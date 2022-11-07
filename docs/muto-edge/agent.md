---
id: mutoagent
title: Muto Agent
sidebar_label: Agent
sidebar_position: 3
---

## Definition & Features: 
Muto Agent is a runtime ROS component (Node) acting as a transceiver between the edge device and the twin server (Eclipse Ditto). Agent acts as a gateway between the device and remote management capabilities with support for asynchronous communication capabilities via MQTT. It acts as a communication bridge between edge devices and their respective virtual twins. The main aspects of data transported by Agent are as follows:
- Vehicle(device) authentication and activation
- Remote management capabilities, i.e. Eclipse Ditto Twins
- Bidirectional information flow (cloud <-> edge)
- Relays messages to Composer for stack lifecycle management 
- Streams edge device information
- Asynchronous capabilties

## Device Telemetry
Agent is capable of publishing data streams up to the Twin Server, such as data that streams in ROS topics. Stream of data mapped from edge device to virtual one, could represent instant telemetry information and/or any other device specific details. This kind of data is useful for monitoring devices and algorithmic parameters with adjustable-frequency updates. Data such as odometry, speed, localization, goal or any other drive and device related can be broadcasted via declarative models. This kind of fast paced, high frequency data moving up to digital twins is also read by Muto Dashboard to provide a graphical interface and an adequate representation of aforementioned data.

## Command Relay
Agent relays commands from the twin server to Composer running on the edge device. This type of information may be related to the lifecycle of ROS nodes that constitute the software stack actively running on the edge device as well as the lifecycle actions (start, stop, update etc) that may trigger the composer to respond.


