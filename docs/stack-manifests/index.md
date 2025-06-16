---
id: stack-manifests
title: Stack Manifests
sidebar_label: Stack Manifests
sidebar_position: 2
---

## Manifest Elements

* **name**: Name of the stack for visualization purposes
* **context**: Optional context information (e.g. FactoryB)
* **stackId**: A unique id that follows Eclipse Ditto's [convention](https://eclipse.dev/ditto/basic-namespaces-and-names.html)
* **composable**
  * **name**
  * **namespace**
  * **package**
  * **executable**
* **node**
  * **name**
  * **pkg**
  * **exec**
  * **param**
  
* **[arg](./args/index.md)**: While writing stack manifests, you might find yourself repeating too many expressions. Args are here to prevent that.

## Example Stack

Below stack provides example usage for every element listed in [Manifest Elements](#manifest-elements)

## Publishing an example stack to Eclipse Ditto

