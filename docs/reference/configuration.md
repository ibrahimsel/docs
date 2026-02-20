---
sidebar_position: 3
sidebar_label: Configuration
---

# Configuration Reference

This page documents all configuration options for Eclipse Muto components.

## Daemon (mutod)

### Command-Line Options

```bash
python3 -m mutod [OPTIONS]
```

| Option | Default | Description |
|--------|---------|-------------|
| `--data-dir` | `/var/lib/mutod` | Root directory for slots, staging, and audit log |
| `--listen` | `localhost:50051` | TCP address for the gRPC server |
| `--socket` | `/var/run/mutod.sock` | Unix domain socket path |
| `--schema-path` | `schemas/manifest.schema.json` | Path to the manifest JSON schema |
| `--log-level` | `INFO` | Logging level: `DEBUG`, `INFO`, `WARNING`, `ERROR` |
| `--no-json-logs` | (flag) | Disable structured JSON logging, use human-readable format |

### Directory Structure

When the daemon starts, it creates this structure under `--data-dir`:

```
/var/lib/mutod/
├── slots/
│   ├── A/                    # Deployment slot A
│   │   ├── manifest.json
│   │   ├── manifest.sig
│   │   └── slot_meta.json
│   └── B/                    # Deployment slot B
│       ├── manifest.json
│       ├── manifest.sig
│       └── slot_meta.json
├── current → slots/B         # Symlink to active slot
├── staging/                  # Temporary upload directory
│   └── <staging_id>/
└── audit.jsonl               # Append-only audit log
```

### Configuration File

The daemon can optionally read a YAML configuration file:

**Location:** `/etc/mutod/config.yaml` (or set via `MUTOD_CONFIG` environment variable)

```yaml
data_dir: /var/lib/mutod
listen: localhost:50051
socket: /var/run/mutod.sock
schema_path: /etc/mutod/manifest.schema.json
log_level: INFO
json_logs: true
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `MUTOD_CONFIG` | Override the config file path |

### systemd Service

```ini
[Unit]
Description=Eclipse Muto Daemon
After=network.target

[Service]
Type=simple
User=root
ExecStart=/usr/bin/python3 -m mutod \
    --data-dir /var/lib/mutod \
    --listen localhost:50051 \
    --socket /var/run/mutod.sock \
    --schema-path /etc/mutod/manifest.schema.json
Restart=on-failure
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

---

## Agent (muto_agent)

### Configuration

The agent is configured as a ROS 2 node with standard ROS 2 parameter mechanisms:

| Parameter | Default | Description |
|-----------|---------|-------------|
| `grpc_port` | `50052` | Port for the AgentService gRPC server |
| `health_probe_hz` | `10.0` | Health probe execution frequency |
| `graph_snapshot_interval_sec` | `5.0` | How often to capture ROS 2 graph snapshots |

### Startup

The agent starts as a ROS 2 node:

```bash
# Direct
ros2 run muto_agent agent_node

# Or with parameters
ros2 run muto_agent agent_node --ros-args \
    -p grpc_port:=50052 \
    -p health_probe_hz:=10.0
```

### ROS 2 Topics

| Topic | Type | Direction | Description |
|-------|------|-----------|-------------|
| `/muto/health` | HealthSummary | Published | Aggregate health state |
| `/muto/mode` | ModeState | Published | Current mode and transition status |

---

## CLI (muto)

### Configuration File

**Default location:** `~/.config/muto/cli.yaml`

```yaml
# Connection settings
daemon_address: "localhost:50051"
agent_address: "localhost:50052"
daemon_socket: "/var/run/muto/daemon.sock"
use_unix_socket: false

# Behavior
timeout_seconds: 30.0
output_format: "rich"    # "rich" or "json"
```

### Field Reference

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `daemon_address` | string | `localhost:50051` | Daemon gRPC address (host:port) |
| `agent_address` | string | `localhost:50052` | Agent gRPC address (host:port) |
| `daemon_socket` | string | `/var/run/muto/daemon.sock` | Unix domain socket for daemon |
| `use_unix_socket` | bool | `false` | Use Unix socket instead of TCP |
| `timeout_seconds` | float | `30.0` | gRPC call timeout |
| `output_format` | string | `rich` | Output format: `rich` (colored terminal) or `json` (machine-readable) |

### Connection Priority

1. Command-line flags (`--daemon-address`, `--agent-address`)
2. Configuration file values
3. Default values

### Unix Socket vs TCP

| Transport | When to Use | Configuration |
|-----------|-------------|---------------|
| **TCP** | Remote access, development, cross-machine | `use_unix_socket: false`, `daemon_address: host:port` |
| **Unix socket** | Local production use, lower latency | `use_unix_socket: true`, `daemon_socket: /path/to/sock` |

Unix sockets are faster (no TCP overhead) and more secure (filesystem permissions) but only work when the CLI is on the same machine as the daemon.

---

## Composer (muto-compose)

The Composer is stateless and does not use a configuration file. All settings are provided via command-line arguments.

### Key File Formats

**Private key (`muto.key`):**
```
-----BEGIN EC PRIVATE KEY-----
MHQCAQEEIxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxoGCCqGSM49AwEHoUQDQgAExxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
-----END EC PRIVATE KEY-----
```

**Public key (`muto.pub`):**
```
-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAExxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
-----END PUBLIC KEY-----
```

Both use PEM encoding. The private key supports optional password encryption.

---

## Dashboard

### Environment

The dashboard is configured through Vite environment variables in `.env` files:

```bash
# .env.development
VITE_DAEMON_URL=http://localhost:50051
VITE_AGENT_URL=http://localhost:50052

# .env.production
VITE_DAEMON_URL=https://fleet.example.com/daemon
VITE_AGENT_URL=https://fleet.example.com/agent
```

### Build Configuration

| File | Purpose |
|------|---------|
| `vite.config.ts` | Build tool configuration |
| `tailwind.config.js` | CSS framework settings |
| `tsconfig.json` | TypeScript compiler options |

---

## Default Ports

| Component | Port | Protocol |
|-----------|------|----------|
| Daemon (TCP) | 50051 | gRPC |
| Daemon (socket) | — | Unix domain socket |
| Agent | 50052 | gRPC |
| Dashboard (dev) | 5173 | HTTP |
| Dashboard (prod) | 80/443 | HTTP/HTTPS |
