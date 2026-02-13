---
id: developer-guide
title: Developer Guide
sidebar_label: Developer Guide
sidebar_position: 6
---

# Eclipse Muto Developer Guide

Welcome to the Eclipse Muto Developer Guide! This guide provides everything you need to contribute to, extend, and develop with Eclipse Muto.

## What You'll Find Here

This developer guide covers all aspects of Eclipse Muto development:

### Development Setup
- Building from source
- Development environment configuration
- Testing frameworks and tools

### Contributing
- Code contribution guidelines
- Pull request process
- Community engagement

## Who Should Use This Guide

This guide is designed for:

- **Software Developers**: Contributing to Eclipse Muto core components
- **Platform Engineers**: Extending Muto for custom use cases
- **Researchers**: Understanding and modifying Muto's architecture
- **DevOps Engineers**: Custom deployment and integration scenarios
- **Open Source Contributors**: Contributing to the Eclipse Muto project

## Prerequisites

Before diving into development, you should have:

- **Strong ROS 2 Experience**: Understanding of ROS 2 concepts, launch systems, and node development
- **Python Proficiency**: Most Muto components are written in Python 3.10+
- **Linux Expertise**: Development is primarily on Ubuntu 20.04/22.04
- **Git/GitHub Skills**: Version control and collaborative development
- **Container Knowledge**: Docker/Podman for testing and deployment
- **Networking Basics**: MQTT, HTTP protocols for distributed systems

## Development Environment

### Native Development Setup

1. **Install ROS 2 Humble**:
```bash
# Follow ROS 2 installation guide
sudo apt update
sudo apt install ros-humble-desktop
```

2. **Clone the repository**:
```bash
mkdir -p ~/muto_ws/src
cd ~/muto_ws/src
git clone --recurse-submodules https://github.com/eclipse-muto/muto.git
```

3. **Install dependencies**:
```bash
cd ~/muto_ws
rosdep update
rosdep install --from-paths src --ignore-src -r -y
```

4. **Build**:
```bash
colcon build --symlink-install --cmake-args -DCMAKE_BUILD_TYPE=Debug
```

### Development Containers

For VS Code devcontainer integration:

1. Open repository in VS Code
2. Install "Dev Containers" extension
3. Click "Reopen in Container"

## Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Agent         │    │   Composer       │    │   Core          │
│   - Message     │────┤   - Stack Mgmt   │────┤   - Twin        │
│   - MQTT        │    │   - Pipelines    │    │   - Services    │
│   - Symphony    │    │   - Plugins      │    │   - Utils       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌──────────────────┐
                    │   Messages       │
                    │   - ROS Types    │
                    │   - Services     │
                    │   - Interfaces   │
                    └──────────────────┘
```

## Key Development Patterns

### Plugin Architecture
Muto uses extensive plugin patterns for extensibility:
- **Protocol Plugins**: MQTT, HTTP, future Zenoh/uProtocol
- **Compose Plugins**: Stack composition and deployment
- **Launch Plugins**: ROS launch system integration
- **Command Plugins**: Command execution and routing

### Message-Driven Architecture
All communication uses ROS 2 message patterns:
- **Publisher/Subscriber**: Asynchronous communication
- **Service/Client**: Synchronous request/response
- **Action/Client**: Long-running operations with feedback

### State Management
Declarative state management with reconciliation loops:
- **Desired State**: JSON/binary stack definitions
- **Current State**: Real-time system status
- **Reconciliation**: Continuous convergence processes

## Code Quality Standards

### Python Code Style
- **PEP 8**: Standard Python style guide compliance
- **Type Hints**: Full type annotation for all functions
- **Documentation**: Comprehensive docstrings and comments
- **Error Handling**: Robust exception handling and logging

### ROS 2 Best Practices
- **Node Lifecycle**: Proper initialization and cleanup
- **Parameter Handling**: Use ROS parameters for configuration
- **Topic Design**: Efficient and scalable topic structures
- **Service Design**: Well-defined service interfaces

## Testing

### Running Tests

```bash
cd ~/muto_ws
colcon test
colcon test-result --verbose
```

### Test Coverage

```bash
colcon build --cmake-args -DCMAKE_BUILD_TYPE=Debug -DCOVERAGE=ON
colcon test
```

## Contributing

### Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally
3. **Create** a feature branch
4. **Implement** your changes
5. **Test** thoroughly
6. **Submit** a pull request

### Pull Request Process

1. Ensure all tests pass
2. Update documentation if needed
3. Follow commit message conventions
4. Request review from maintainers

### Commit Messages

Follow conventional commits:
```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Development Tools

### Recommended Tools
- **VS Code**: Primary IDE with ROS extensions
- **Git**: Version control
- **Docker**: Container development
- **ROS 2 Tools**: `colcon`, `rosdep`, `ros2` CLI
- **Python Tools**: `pytest`, `black`, `mypy`, `flake8`

### Useful VS Code Extensions
- ROS
- Python
- Docker
- YAML
- Markdown All in One

## Community

- **GitHub Repository**: [https://github.com/eclipse-muto/muto](https://github.com/eclipse-muto/muto)
- **Issue Tracker**: [GitHub Issues](https://github.com/eclipse-muto/muto/issues)
- **Eclipse Foundation**: [https://projects.eclipse.org/projects/automotive.muto](https://projects.eclipse.org/projects/automotive.muto)

## Resources

- **ROS 2 Documentation**: [https://docs.ros.org/en/humble/](https://docs.ros.org/en/humble/)
- **Eclipse Foundation**: [https://www.eclipse.org/](https://www.eclipse.org/)
- **Symphony Project**: [https://github.com/eclipse-symphony/symphony](https://github.com/eclipse-symphony/symphony)

## Related Documentation

- [Muto Introduction](../muto)
- [Agent Documentation](../muto-edge/agent)
- [Composer Documentation](../muto-edge/composer)
- [Contributing Guidelines](../contributing)
