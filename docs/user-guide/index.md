---
id: user-guide
title: User Guide
sidebar_label: User Guide
sidebar_position: 5
---

# Eclipse Muto User Guide

Welcome to the Eclipse Muto User Guide! This comprehensive guide will help you understand, deploy, and use Eclipse Muto for managing ROS software stacks on edge devices.

## What You'll Find Here

This user guide is organized into focused sections:

### Getting Started
- **[Introduction](../muto)**: Overview of Eclipse Muto and its capabilities
- **[Quick Start](../muto-edge/getting-started)**: Fastest path to get Eclipse Muto running
- **[Blueprints](../blueprint)**: Demo implementations and examples

### Core Concepts

#### Declarative Stack Management
Eclipse Muto uses declarative stack definitions that describe the desired state of your ROS system. Instead of imperative scripts, you define what you want running, and Muto handles the how.

#### Cloud Orchestration - Eclipse Symphony
[Eclipse Symphony](https://github.com/eclipse-symphony/symphony) is a powerful service orchestration engine that enables the organization of multiple intelligent edge services into a seamless, end-to-end experience.

Symphony provides an example portal launched with the quick start guide. Visit `http://localhost:3000/s` for more details.

#### Edge Orchestration
Muto brings cloud-native orchestration principles to edge robotics:
- Remote fleet management
- Automated state reconciliation
- Version control and rollbacks
- Centralized configuration management

#### Digital Twin Integration - Eclipse Ditto
Each device managed by Muto has a digital twin representation that maintains real-time state synchronization with cloud orchestration platforms.

[Eclipse Ditto](https://eclipse.dev/ditto) is a technology implementing the "digital twins" software pattern, mirroring millions of digital twins with physical "Things".

## Who Should Use This Guide

This guide is designed for:

- **Robotics Engineers**: Deploying ROS applications in production environments
- **DevOps Engineers**: Managing robot fleet deployments and operations
- **System Administrators**: Setting up and maintaining Muto infrastructure
- **Researchers**: Experimenting with robot software orchestration
- **Students**: Learning modern robotics deployment practices

## Prerequisites

Before using this guide, you should have:

- Basic understanding of ROS (Robot Operating System) concepts
- Familiarity with Linux command line operations
- Knowledge of Docker/containers (for containerized deployment)
- Understanding of YAML configuration files
- Basic networking concepts for distributed systems

## Deployment Options

### Container Deployment (Recommended)
**Best for: Production environments, consistent deployments, multi-architecture support**

- Pre-built container images available
- Supports AMD64 and ARM64 architectures
- Integrated Eclipse Symphony orchestration
- Minimal host system dependencies

### Source Build Deployment
**Best for: Development, customization, latest features**

- Full source code access and customization
- Latest development features
- Deep debugging capabilities
- Direct ROS 2 integration

### Development Container
**Best for: Development, testing, contribution**

- Pre-configured development environment
- VS Code integration with devcontainers
- All dependencies pre-installed

## Using the Sandbox

The Muto team provides sandbox environments for testing:

### Ditto Sandbox
Visit [https://sandbox.composiv.ai](https://sandbox.composiv.ai)

**Note**: This sandbox is not highly available and may be reset without notice.

### Dashboard
Visit [https://dashboard.composiv.ai](https://dashboard.composiv.ai) to browse robots registered with the sandbox.

## Navigation Guide

### New Users
1. Read the **[Introduction](../muto)** to understand Eclipse Muto
2. Follow the **[Quick Start](../muto-edge/getting-started)** guide
3. Explore **[Blueprints](../blueprint)** to see Muto in action

### Operational Reference
- **[Agent Documentation](../muto-edge/agent)**: Communication bridge details
- **[Composer Documentation](../muto-edge/composer)**: Stack management
- **[Digital Twins](../muto-twins)**: Ditto integration

## Next Steps

- **[Getting Started Guide](../muto-edge/getting-started)**
- **[Developer Guide](../developer-guide)**: For contributing to Muto
- **[Reference Documentation](../muto-edge)**: Technical deep dive
