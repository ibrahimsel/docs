---
sidebar_position: 6
sidebar_label: CLI Reference
---

# CLI Reference

Complete reference for the `muto` and `muto-compose` command-line tools.

## muto — Daemon & Agent CLI

### Global Options

```
muto [--config PATH] [--daemon-address HOST:PORT] [--agent-address HOST:PORT] COMMAND
```

| Option | Default | Description |
|--------|---------|-------------|
| `--config` | `~/.config/muto/cli.yaml` | Path to CLI configuration file |
| `--daemon-address` | `localhost:50051` | Override daemon gRPC address |
| `--agent-address` | `localhost:50052` | Override agent gRPC address |

---

### `muto info`

Show daemon system information.

```bash
muto info
```

**Output:** Daemon version, OS version, active slot, device ID, TPM status, uptime, active bundle ID and version.

---

### `muto status`

Show deployment status for both A/B slots.

```bash
muto status
```

**Output:** For each slot (A and B): slot name, bundle ID, bundle version, installation timestamp, state (active/inactive/empty).

---

### `muto deploy`

Deploy a bundle to the daemon. Uploads, verifies, and installs.

```bash
muto deploy <bundle_path>
```

| Argument | Description |
|----------|-------------|
| `bundle_path` | Path to the `.tar.gz` bundle file |

---

### `muto rollback`

Rollback to the previous A/B slot.

```bash
muto rollback --reason <text>
```

| Option | Required | Description |
|--------|----------|-------------|
| `--reason` | Yes | Reason for the rollback (recorded in audit log) |

---

### `muto bundles`

List all installed bundles across both slots.

```bash
muto bundles
```

**Output:** For each bundle: bundle ID, name, version, slot, installation timestamp, state.

---

### `muto health`

Show agent health summary.

```bash
muto health
```

**Output:** Overall health state, per-stack health, list of critical (FAILED) probes, list of degraded probes.

---

### `muto graph`

Show ROS 2 graph snapshot.

```bash
muto graph
```

**Output:** All ROS 2 nodes (name, namespace, lifecycle state, published/subscribed topics, services), topics (name, type, publishers, subscribers, QoS), and services.

---

### `muto logs`

Stream logs from the daemon.

```bash
muto logs [--source SOURCE] [--tail N] [--follow]
```

| Option | Default | Description |
|--------|---------|-------------|
| `--source` | (all) | Filter by log source (e.g., `daemon`, `perception`) |
| `--tail` | `100` | Number of historical lines to fetch |
| `--follow` | `false` | Follow new log entries in real-time |

---

### `muto mode get`

Get the current vehicle mode.

```bash
muto mode get
```

**Output:** Current mode, previous mode, mode duration, whether a transition is in progress.

---

### `muto mode set`

Request a vehicle mode transition.

```bash
muto mode set <MODE> --reason <text>
```

| Argument | Description |
|----------|-------------|
| `MODE` | Target mode: `STANDBY`, `AUTONOMOUS`, `TELEOP`, `DIAGNOSTIC`, `UPDATE` |
| `--reason` | Reason for the mode change |

---

### `muto stacks list`

List all stacks with their state.

```bash
muto stacks list
```

**Output:** For each stack: name, state (running/stopped/starting/stopping/failed), components, health, start time.

---

### `muto stacks start`

Start a named stack.

```bash
muto stacks start <name>
```

---

### `muto stacks stop`

Stop a named stack.

```bash
muto stacks stop <name>
```

---

### `muto stacks restart`

Restart a named stack.

```bash
muto stacks restart <name>
```

---

## muto-compose — Bundle Authoring CLI

### `muto-compose keygen`

Generate an ECDSA P-256 signing key pair.

```bash
muto-compose keygen --output <directory> [--name <prefix>] [--password]
```

| Option | Default | Description |
|--------|---------|-------------|
| `--output` | (required) | Directory to write key files |
| `--name` | `muto` | File name prefix (produces `<name>.key` and `<name>.pub`) |
| `--password` | (no) | Prompt for a password to encrypt the private key |

**Output files:**
- `<name>.key` — Private key (PEM format)
- `<name>.pub` — Public key (PEM format)

---

### `muto-compose build`

Build a signed bundle from a stack YAML directory.

```bash
muto-compose build <source_dir> [--key <path>] [--password] [--output <dir>]
```

| Option | Default | Description |
|--------|---------|-------------|
| `source_dir` | (required) | Directory containing `muto-stack.yaml` |
| `--key` | (none) | Private key file for signing |
| `--password` | (no) | Prompt for key password |
| `--output` | `.` | Output directory for the bundle |

**Output:** `<name>-<version>.tar.gz`

---

### `muto-compose sign`

Sign an existing manifest file.

```bash
muto-compose sign <manifest_path> --key <path> [--password]
```

**Output:** `manifest.sig` in the same directory as the manifest.

---

### `muto-compose verify`

Verify a bundle or manifest signature.

```bash
muto-compose verify <path> --key <public_key_path>
```

| Argument | Description |
|----------|-------------|
| `path` | Path to bundle (`.tar.gz`) or manifest (`.json`) |
| `--key` | Path to the public key file |

---

### `muto-compose validate`

Validate a manifest or stack YAML against the JSON schema.

```bash
muto-compose validate <path>
```

| Argument | Description |
|----------|-------------|
| `path` | Path to bundle, manifest, or stack YAML |

---

### `muto-compose inspect`

Display a human-readable summary of a bundle.

```bash
muto-compose inspect <bundle_path>
```

**Output:** Bundle name, version, ID, target platforms, signature status, stacks, components, probes, and policies.
