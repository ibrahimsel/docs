---
id: installation
title: Installation
sidebar_label: Installation
sidebar_position: 3
---

## Prerequisites
Before installing Eclipse Muto, ensure you have the following prerequisites:
- **Python 3.5 or higher**: Eclipse Muto is built using Python, so you need a compatible version installed on your system.
- **ROS 2**: Eclipse Muto is designed to work with ROS 2, so you should have a compatible version of ROS 2 installed.
- **Rosdep**: This is required to install ROS 2 dependencies. After installing ROS 2, you should have `rosdep` available in your environment. If not, you can install it using the following command:

```bash
sudo apt install python3-rosdep
```
- **Colcon**: This is the recommended build tool for ROS 2 packages. After installing ROS 2, you should have `colcon` available in your environment. If not, you can install it using the following command:

```bash
sudo apt install python3-colcon-common-extensions
```
- **Docker** (optional): If you prefer to run Eclipse Muto in a containerized environment, ensure Docker is installed on your system.
- **Git**: To clone the repositories if you choose to build from source.

# Installation
Eclipse Muto can be installed in various ways depending on your needs. Below are the recommended methods for installation:

## 1. Using Docker
Eclipse Muto provides a Docker image that can be used to run the tool in a containerized environment. This is the easiest way to get started.

```bash
docker pull eclipse-muto/muto
```
To run the Docker container, use the following command:

```bash
docker run -it --rm eclipse-muto/muto
```

## 2. Building from Source
If you prefer to build Eclipse Muto from source, you can clone the repository and install the dependencies manually. This is useful for development or if you want to customize the tool.

```bash
mkdir -p muto/src
cd muto/src
git clone https://github.com/eclipse-muto/agent.git
git clone https://github.com/eclipse-muto/composer.git
git clone https://github.com/eclipse-muto/core.git
git clone https://github.com/eclipse-muto/messages.git
cd ..
rosdep install --from-paths src --ignore-src -r -y
colcon build --symlink-install --cmake-args -DCMAKE_BUILD_TYPE=Release
```

## 3. Using Debian Package
Eclipse Muto can be installed using a Debian package. This is useful for Debian-based systems like Ubuntu.
```bash
# TODO: Add repository link when available
sudo apt update
sudo apt install eclipse-muto
```
