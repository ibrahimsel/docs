---
sidebar_position: 1
sidebar_label: Installation
---

# Installation

This guide walks you through installing Eclipse Muto on your development machine. By the end, you will have all components installed and ready to build bundles, run the daemon, and use the CLI.

## Prerequisites

| Requirement | Minimum Version | Check Command |
|-------------|----------------|---------------|
| Python | 3.10+ | `python3 --version` |
| pip | 22.0+ | `pip --version` |
| Node.js (for dashboard) | 18.0+ | `node --version` |
| Git | 2.0+ | `git --version` |
| protobuf compiler (for proto stubs) | 3.0+ | `protoc --version` |

### Optional (for ROS 2 agent)

| Requirement | Notes |
|-------------|-------|
| ROS 2 Humble or Iron | Required only for the `muto_agent` module |
| rclpy | Installed with ROS 2 |

## Clone the Repository

```bash
git clone https://github.com/eclipse-muto/muto.git
cd muto
```

## Set Up a Virtual Environment

We strongly recommend using a Python virtual environment to avoid conflicts with system packages:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

:::tip
Add `source /path/to/muto/.venv/bin/activate` to your shell profile if you want the environment activated automatically.
:::

## Install All Modules

Muto uses a Makefile with convenient install targets. The fastest way to install everything:

```bash
# Install all Python modules in editable mode
make install
```

This runs `pip install -e` for each module (`muto_core`, `mutod`, `muto_cli`, `muto_composer`, `muto_agent`), installing them in editable (development) mode so you can modify code without reinstalling.

### Install with Development Tools

If you plan to run tests or lint the code:

```bash
# Install with dev extras (pytest, ruff, grpcio-tools)
make install-dev
```

### Install Dashboard Dependencies

If you want to run the web dashboard:

```bash
make install-dashboard
```

## Generate Proto Stubs

Muto's components communicate via gRPC, using Protocol Buffer definitions. You need to generate the Python stubs from the `.proto` files:

```bash
make proto
```

This generates Python gRPC stubs in the `generated/python/` directory. The stubs are gitignored — you always generate them locally.

:::info
If `make proto` fails, ensure you have `grpcio-tools` installed. The `make install-dev` target installs it automatically.
:::

## Verify the Installation

After installation, verify each tool is available:

### CLI

```bash
muto --help
```

You should see the Muto CLI help output listing commands like `info`, `status`, `deploy`, `rollback`, `bundles`, and more.

### Composer

```bash
muto-compose --help
```

You should see commands for `build`, `keygen`, `sign`, `verify`, `validate`, and `inspect`.

### Daemon

```bash
python3 -m mutod --help
```

You should see the daemon's startup options including `--data-dir`, `--listen`, `--schema-path`, and logging options.

## Quick Verification

Run a quick end-to-end check to make sure everything works:

```bash
# 1. Generate signing keys
muto-compose keygen --output /tmp/muto-keys

# 2. Build a bundle from the example stack
muto-compose build muto_composer/examples \
    --key /tmp/muto-keys/muto.key \
    --output /tmp

# 3. Inspect the bundle
muto-compose inspect /tmp/example-autonomy-stack-*.tar.gz

# 4. Verify the bundle signature
muto-compose verify /tmp/example-autonomy-stack-*.tar.gz \
    --key /tmp/muto-keys/muto.pub
```

If all four commands succeed, your installation is working correctly.

## Project Layout

After installation, here is what each directory contains:

```
muto-2.0/
├── mutod/              # Daemon — system service for deployment
├── muto_agent/         # Agent — ROS 2 runtime manager
├── muto_core/          # Core — shared models and utilities
├── muto_cli/           # CLI — command-line tool
├── muto_composer/      # Composer — bundle authoring toolkit
├── dashboard/          # Dashboard — React web interface
├── proto/              # Protocol Buffer definitions
├── schemas/            # JSON Schema for manifest validation
├── generated/          # Generated gRPC stubs (after make proto)
├── muto_msgs/          # ROS 2 message definitions
├── Makefile            # Build targets
└── demo.sh             # Interactive demo script
```

## What is Next?

Head to the [First Deployment](first-deployment) guide to deploy your first bundle to a local daemon.
