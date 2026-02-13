---
id: blueprint
title: Blueprints
sidebar_label: Blueprints
sidebar_position: 1
---

# Eclipse Muto Blueprints

Blueprints are ready-to-use demo implementations that showcase Eclipse Muto's capabilities. Each blueprint demonstrates specific features and use cases, providing practical examples you can explore, modify, and learn from.

## Available Blueprints

| Blueprint | Description | Key Features |
|-----------|-------------|--------------|
| **[Gap Follower OTA Demo](./gap-follower)** | OTA updates with automatic rollback | Version management, failure recovery |
| **[ROS Racer](./ros-racer)** | Multi-agent autonomous racing | F1Tenth simulation, multi-vehicle orchestration |
| **[Talker-Listener](./talker-listener)** | Symphony integration example | Solution/instance management, stack formats |

## Gap Follower OTA Demo

Demonstrates Eclipse Muto's Over-The-Air (OTA) update capabilities with automatic rollback on failure.

**Highlights:**
- Deploy three variants of a gap follower ROS node
- Automatic rollback when deployment fails
- State persistence and version tracking

[Explore the Gap Follower Demo →](./gap-follower)

## ROS Racer Blueprint

An Eclipse SDV Blueprint showcasing multi-agent autonomous racers running F1Tenth.org software, orchestrated by Eclipse Muto.

**Highlights:**
- Multi-agent ROS 2 simulation
- F1Tenth gym environment integration
- Docker and native deployment options

[Explore ROS Racer →](./ros-racer)

## Talker-Listener Symphony Demo

A practical example demonstrating Muto integration with Eclipse Symphony for cloud orchestration.

**Highlights:**
- Two stack formats: JSON and archive
- Symphony solution/instance management
- Automated demo script

[Explore Talker-Listener Demo →](./talker-listener)

## Running Blueprints

### Prerequisites

All blueprints require:
- ROS 2 Humble or later
- Eclipse Muto installed and configured
- Docker (for some blueprints)

### General Steps

1. **Start Muto**: Launch the Muto system
2. **Start Symphony** (if needed): For cloud orchestration demos
3. **Deploy the stack**: Use the blueprint's stack definition
4. **Observe**: Monitor the deployment and behavior

## Creating Your Own Blueprints

Use these demos as templates for your own implementations:

1. Study the stack definition format
2. Understand the deployment pipeline
3. Modify for your ROS nodes and configurations
4. Test with Muto's local deployment

## Related Resources

- [Getting Started Guide](../muto-edge/getting-started)
- [Stack Definition Format](../muto-edge/composer#working-with-stacks)
- [Symphony Integration](../muto-edge/agent#symphony-integration)
