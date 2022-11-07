---
id: mutocomposer
title: Muto Composer
sidebar_label: Composer
sidebar_position: 4
---

## Definition & Features: 
Muto Composer is a runtime ROS component (Node) that is responsible for the life cycle of a stack; Composer uses various ROS packages and APIs to launch ROS Nodes defined by the software stacks. It can be thought of as a smart launch manager. Composer uses the stack information model and computes the delta between the current and the desired state of the ROS graph and manages the lifecycle of ROS nodes accordingly. Composer incorporates the following main features:
- Composes and manage life cycle of ROS nodes defined by the Stack (model)
- Node graph algebra
- Stack introspection
- Stack difference (node graph delta computation)
- Node Lifecycle actions
- Interaction with the parameter server

