---
sidebar_position: 1
sidebar_label: System Overview
---

# System Overview

Eclipse Muto is composed of six primary components, each with a distinct role and clear boundaries. This separation of concerns is a deliberate architectural decision — it makes the system more reliable, testable, and adaptable to different deployment scenarios.

## The Full Picture

```mermaid
graph TB
    subgraph "Developer Workstation"
        Composer["Composer<br/>muto-compose<br/><i>Bundle authoring & signing</i>"]
    end

    subgraph "Target Vehicle"
        subgraph "System Level (privileged)"
            Daemon["Daemon — mutod<br/><i>gRPC server, deployment,<br/>A/B slots, audit log</i>"]
        end

        subgraph "ROS 2 Level (user space)"
            Agent["Agent<br/><i>Mode machine, health engine,<br/>lifecycle, graph monitor</i>"]
            ROS["ROS 2 Nodes<br/><i>Perception, planning,<br/>control, etc.</i>"]
        end

        Agent <-->|"manages"| ROS
    end

    subgraph "Operator"
        CLI["CLI — muto<br/><i>Terminal commands</i>"]
        Dashboard["Dashboard<br/><i>Web UI for fleet</i>"]
    end

    subgraph "Shared Library"
        Core["Core — muto_core<br/><i>Models, policy, health</i>"]
    end

    Composer -->|"produces bundle"| CLI
    CLI -->|"gRPC"| Daemon
    CLI -->|"gRPC"| Agent
    Dashboard -->|"gRPC"| Daemon
    Dashboard -->|"gRPC"| Agent
    Daemon <-->|"bundle data"| Agent
    Core -.->|"imported by"| Daemon
    Core -.->|"imported by"| Agent
    Core -.->|"imported by"| Composer
```

## Component Responsibilities

| Component | Role | ROS 2 Dependency | Runs As |
|-----------|------|-------------------|---------|
| **Daemon** (`mutod`) | Bundle deployment, A/B slots, process supervision, audit log | None | System service (root) |
| **Agent** (`muto_agent`) | Mode management, health probes, lifecycle control, graph monitoring | Yes (rclpy) | ROS 2 node (user) |
| **Core** (`muto_core`) | Shared data models, policy logic, health primitives | None | Python library |
| **CLI** (`muto`) | Operator commands for daemon and agent | None | Terminal tool |
| **Composer** (`muto-compose`) | Bundle authoring, signing, validation | None | Terminal tool |
| **Dashboard** | Fleet monitoring, deployment management | None | Web application |

## Why Separate the Daemon and Agent?

This is the most important architectural decision in Muto. The daemon and agent are separate processes with different privilege levels and dependencies:

```mermaid
graph LR
    subgraph "Daemon (mutod)"
        direction TB
        D1["✓ Privileged (root)"]
        D2["✓ No ROS 2 dependency"]
        D3["✓ Always running"]
        D4["✓ Handles deployment"]
        D5["✓ Audit logging"]
    end

    subgraph "Agent"
        direction TB
        A1["✓ Unprivileged (user)"]
        A2["✓ ROS 2 dependency"]
        A3["✓ Starts with ROS stack"]
        A4["✓ Handles runtime"]
        A5["✓ Health monitoring"]
    end
```

### Rationale

1. **Reliability** — If the ROS 2 stack crashes (which happens more often than we'd like), the daemon keeps running. You can still deploy new software to fix the problem.

2. **Security** — The daemon runs as root because it needs to manage system-level resources (slots on disk, process supervision). The agent runs as a regular user because it only needs to interact with ROS 2. Minimizing the privileged attack surface is a security best practice.

3. **Independence** — The daemon can be developed, tested, and deployed without any ROS 2 installation. This makes CI/CD much simpler and allows the daemon to run on non-ROS platforms.

4. **Startup Order** — The daemon starts at boot (via systemd). The agent starts later, once the ROS 2 environment is ready. Deployment can happen before ROS 2 is even running.

## Communication Architecture

All inter-component communication uses **gRPC** (Google Remote Procedure Call) with Protocol Buffers for serialization:

```mermaid
graph LR
    CLI["CLI"]
    Dashboard["Dashboard"]
    Daemon["Daemon<br/>:50051"]
    Agent["Agent<br/>:50052"]

    CLI -->|"DaemonService<br/>(16 RPCs)"| Daemon
    CLI -->|"AgentService<br/>(11 RPCs)"| Agent
    Dashboard -->|"DaemonService"| Daemon
    Dashboard -->|"AgentService"| Agent
```

### Why gRPC?

| Feature | Why It Matters |
|---------|---------------|
| **Strongly typed** | Proto definitions enforce correct message structure at compile time |
| **Streaming** | Bundle uploads use client-streaming (sending data in 64 KB chunks) |
| **Bidirectional** | Health events and logs use server-streaming |
| **Efficient** | Binary encoding is 3-10x smaller than JSON |
| **Language agnostic** | Proto definitions generate stubs for Python, Go, TypeScript, etc. |
| **Unix socket support** | Daemon listens on `/var/run/mutod.sock` for local, zero-overhead communication |

### Proto Organization

The gRPC interface is defined in three proto files:

```
proto/
├── muto/
│   ├── shared/v1/
│   │   └── common.proto      # Shared enums and messages
│   ├── daemon/v1/
│   │   └── daemon.proto       # DaemonService (16 RPCs)
│   └── agent/v1/
│       └── agent.proto        # AgentService (11 RPCs)
```

The `shared/v1/common.proto` defines types used by both services: `ResultCode`, `HealthState`, `VehicleMode`, `LifecycleState`, `AuditEvent`, and `ProbeResult`.

## Data Flow: End-to-End Deployment

Here is what happens when an operator deploys a bundle to a vehicle:

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant Comp as Composer
    participant CLI as CLI
    participant Daemon as Daemon
    participant BM as Bundle Manager
    participant SM as Slot Manager
    participant Audit as Audit Log

    Dev->>Comp: muto-compose build ./stacks --key key.pem
    Comp->>Comp: Read YAML, transform to manifest
    Comp->>Comp: Compute SHA-256 hash
    Comp->>Comp: Sign with ECDSA P-256
    Comp-->>Dev: example-stack-1.0.0.tar.gz

    Dev->>CLI: muto deploy example-stack-1.0.0.tar.gz
    CLI->>Daemon: UploadBundle (streaming chunks)
    Daemon->>BM: Stage bundle, compute hash
    BM-->>Daemon: staging_id, sha256_hash

    CLI->>Daemon: VerifyBundle(staging_id)
    Daemon->>BM: Validate schema, signature, target
    BM-->>Daemon: VerifyBundleResponse

    CLI->>Daemon: InstallBundle(staging_id)
    Daemon->>SM: Get inactive slot
    SM->>SM: Extract to slot directory
    SM->>SM: Write slot_meta.json
    SM->>SM: Atomic symlink switch
    Daemon->>Audit: Record install event
    SM-->>Daemon: installed_slot=B

    Daemon-->>CLI: InstallBundleResponse
```

## Data Flow: Health-Triggered Mode Change

Here is what happens when a health probe failure triggers an automatic mode change:

```mermaid
sequenceDiagram
    participant Probe as Health Probe
    participant Engine as Health Engine
    participant Mode as Mode Machine
    participant Agent as Agent Node
    participant ROS as ROS 2 Stacks

    loop Every 100ms
        Engine->>Probe: Execute check
        Probe-->>Engine: HEALTHY
    end

    Note over Probe: Camera stops publishing

    Engine->>Probe: Execute check
    Probe-->>Engine: FAILED (camera_health)

    Engine->>Engine: Aggregate: FAILED
    Engine->>Engine: Is camera_health in required_health?
    Note over Engine: Yes — critical failure

    Engine->>Mode: Force SAFE_STOP
    Mode->>Mode: Validate transition
    Mode->>Agent: Transition: AUTONOMOUS → SAFE_STOP
    Agent->>ROS: Stop perception, planning, control stacks
    Agent->>ROS: Activate emergency stop procedures
```

## Deployment Topology

Muto supports different deployment topologies depending on your needs:

### Single Vehicle (Development)

```mermaid
graph LR
    CLI["CLI<br/>localhost"] --> Daemon["Daemon<br/>:50051"]
    CLI --> Agent["Agent<br/>:50052"]
```

Everything runs on one machine. Ideal for development and testing.

### Fleet with Dashboard

```mermaid
graph TB
    Dashboard["Dashboard<br/>(React UI)"]

    subgraph "Vehicle 1"
        D1["Daemon"] --- A1["Agent"]
    end

    subgraph "Vehicle 2"
        D2["Daemon"] --- A2["Agent"]
    end

    subgraph "Vehicle 3"
        D3["Daemon"] --- A3["Agent"]
    end

    Dashboard --> D1
    Dashboard --> D2
    Dashboard --> D3
    Dashboard --> A1
    Dashboard --> A2
    Dashboard --> A3
```

The dashboard connects to each vehicle's daemon and agent for fleet-wide monitoring and management.

## Next Steps

Dive deeper into each component:
- [Daemon](daemon) — The privileged system service
- [Agent](agent) — The ROS 2 runtime manager
- [Core](core) — The shared library
- [CLI](cli) — The command-line interface
- [Composer](composer) — The bundle authoring tool
- [Dashboard](dashboard) — The fleet monitoring UI
- [gRPC & Protobuf](grpc-communication) — The communication layer
