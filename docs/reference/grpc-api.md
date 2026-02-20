---
sidebar_position: 2
sidebar_label: gRPC API
---

# gRPC API Reference

Complete reference for the DaemonService and AgentService gRPC APIs.

## DaemonService

**Default endpoint:** `localhost:50051` (TCP) or `unix:///var/run/mutod.sock` (Unix socket)

### GetInfo

Returns daemon system information.

```protobuf
rpc GetInfo(GetInfoRequest) returns (GetInfoResponse);
```

**Request:** Empty (no fields)

**Response:**

| Field | Type | Description |
|-------|------|-------------|
| `response` | ApiResponse | Standard response envelope |
| `daemon_version` | string | Daemon software version |
| `os_version` | string | Operating system version |
| `active_slot` | string | Currently active slot ("A" or "B") |
| `device_id` | string | Unique device identifier |
| `tpm_present` | bool | Whether a TPM is available |
| `uptime_seconds` | int64 | Daemon uptime in seconds |
| `active_bundle_id` | string | Bundle ID of the active deployment |
| `active_bundle_version` | string | Bundle version of the active deployment |

---

### UploadBundle

Streams bundle data from client to daemon.

```protobuf
rpc UploadBundle(stream UploadBundleChunk) returns (UploadBundleResponse);
```

**Request (stream):**

| Field | Type | Description |
|-------|------|-------------|
| `bundle_name` | string | Filename (set in first chunk) |
| `total_size` | int64 | Total bundle size in bytes (set in first chunk) |
| `data` | bytes | Chunk data |
| `offset` | int64 | Byte offset of this chunk |

**Response:**

| Field | Type | Description |
|-------|------|-------------|
| `response` | ApiResponse | Standard response envelope |
| `staging_id` | string | Unique ID for referencing this staged bundle |
| `sha256_hash` | string | SHA-256 hash of the uploaded data |

---

### VerifyBundle

Validates a staged bundle's schema, signature, and target compatibility.

```protobuf
rpc VerifyBundle(VerifyBundleRequest) returns (VerifyBundleResponse);
```

**Request:**

| Field | Type | Description |
|-------|------|-------------|
| `staging_id` | string | Staging ID from UploadBundle |

**Response:**

| Field | Type | Description |
|-------|------|-------------|
| `response` | ApiResponse | Standard response envelope |
| `schema_valid` | bool | Whether the manifest conforms to the JSON schema |
| `signature_valid` | bool | Whether the ECDSA signature is valid |
| `target_compatible` | bool | Whether the bundle targets this platform |
| `errors` | repeated string | Detailed error messages |

---

### InstallBundle

Installs a staged bundle into the inactive A/B slot.

```protobuf
rpc InstallBundle(InstallBundleRequest) returns (InstallBundleResponse);
```

**Request:**

| Field | Type | Description |
|-------|------|-------------|
| `staging_id` | string | Staging ID from UploadBundle |
| `force` | bool | Bypass verification checks |

**Response:**

| Field | Type | Description |
|-------|------|-------------|
| `response` | ApiResponse | Standard response envelope |
| `installed_slot` | string | Slot where the bundle was installed ("A" or "B") |
| `previous_slot` | string | Previously active slot |

---

### GetDeploymentStatus

Returns the status of both A/B slots.

```protobuf
rpc GetDeploymentStatus(GetDeploymentStatusRequest) returns (GetDeploymentStatusResponse);
```

**Response:**

| Field | Type | Description |
|-------|------|-------------|
| `response` | ApiResponse | Standard response envelope |
| `active_slot` | string | Currently active slot |
| `inactive_slot` | string | Currently inactive slot |
| `active_info` | SlotInfo | Details of the active slot |
| `inactive_info` | SlotInfo | Details of the inactive slot |

**SlotInfo:**

| Field | Type | Description |
|-------|------|-------------|
| `slot_name` | string | "A" or "B" |
| `bundle_id` | string | Installed bundle ID |
| `bundle_version` | string | Installed bundle version |
| `installed_at_unix_ms` | int64 | Installation timestamp |
| `state` | string | "active", "inactive", or "empty" |

---

### Rollback

Switches the active slot to the previously active slot.

```protobuf
rpc Rollback(RollbackRequest) returns (RollbackResponse);
```

**Request:**

| Field | Type | Description |
|-------|------|-------------|
| `reason` | string | Reason for rollback (recorded in audit log) |

**Response:**

| Field | Type | Description |
|-------|------|-------------|
| `response` | ApiResponse | Standard response envelope |
| `rolled_back_to_slot` | string | The slot that is now active |

---

### ListBundles

Lists all installed bundles across both slots.

```protobuf
rpc ListBundles(ListBundlesRequest) returns (ListBundlesResponse);
```

**Response:**

| Field | Type | Description |
|-------|------|-------------|
| `response` | ApiResponse | Standard response envelope |
| `bundles` | repeated BundleSummary | List of installed bundles |

**BundleSummary:**

| Field | Type | Description |
|-------|------|-------------|
| `bundle_id` | string | Bundle ID |
| `name` | string | Bundle name |
| `version` | string | Bundle version |
| `slot` | string | Slot ("A" or "B") |
| `installed_at_unix_ms` | int64 | Installation timestamp |
| `state` | string | "active" or "inactive" |

---

### StreamLogs

Streams log events from the daemon.

```protobuf
rpc StreamLogs(StreamLogsRequest) returns (stream LogEvent);
```

**Request:**

| Field | Type | Description |
|-------|------|-------------|
| `source` | string | Filter by source (empty = all) |
| `tail_lines` | int32 | Number of historical lines |
| `follow` | bool | Continue streaming new events |

**LogEvent (stream):**

| Field | Type | Description |
|-------|------|-------------|
| `timestamp_unix_ms` | int64 | Event timestamp |
| `source` | string | Log source |
| `level` | string | Log level (DEBUG, INFO, WARNING, ERROR) |
| `message` | string | Log message |
| `fields` | map\<string, string\> | Structured log fields |

---

## AgentService

**Default endpoint:** `localhost:50052`

### GetMode

Returns the current vehicle mode.

```protobuf
rpc GetMode(GetModeRequest) returns (GetModeResponse);
```

**Response:**

| Field | Type | Description |
|-------|------|-------------|
| `response` | ApiResponse | Standard response envelope |
| `current_mode` | VehicleMode | Current mode enum value |
| `previous_mode` | VehicleMode | Previous mode enum value |
| `mode_since_unix_ms` | int64 | When the current mode started |
| `transition_in_progress` | bool | Whether a transition is happening |

---

### RequestMode

Requests a vehicle mode transition.

```protobuf
rpc RequestMode(RequestModeRequest) returns (RequestModeResponse);
```

**Request:**

| Field | Type | Description |
|-------|------|-------------|
| `target_mode` | VehicleMode | Desired mode |
| `reason` | string | Reason for the change |

**Response:**

| Field | Type | Description |
|-------|------|-------------|
| `response` | ApiResponse | Standard response envelope |
| `transition_id` | string | ID to track the transition |

---

### GetHealthSummary

Returns the overall health summary.

```protobuf
rpc GetHealthSummary(GetHealthSummaryRequest) returns (GetHealthSummaryResponse);
```

**Response:**

| Field | Type | Description |
|-------|------|-------------|
| `response` | ApiResponse | Standard response envelope |
| `overall` | HealthState | Aggregate health state |
| `stacks` | repeated StackHealthInfo | Per-stack health |
| `critical_probes` | repeated ProbeResult | FAILED probe results |
| `degraded_probes` | repeated ProbeResult | DEGRADED probe results |

---

### ListStacks

Returns all stacks with their current state.

```protobuf
rpc ListStacks(ListStacksRequest) returns (ListStacksResponse);
```

**Response:**

| Field | Type | Description |
|-------|------|-------------|
| `response` | ApiResponse | Standard response envelope |
| `stacks` | repeated StackInfo | Stack details |

**StackInfo:**

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Stack name |
| `state` | string | running, stopped, starting, stopping, failed |
| `components` | repeated ComponentInfo | Component details |
| `health` | HealthState | Stack health state |
| `started_at_unix_ms` | int64 | When the stack started |

---

### GetGraphSnapshot

Returns a snapshot of the ROS 2 computation graph.

```protobuf
rpc GetGraphSnapshot(GetGraphSnapshotRequest) returns (GetGraphSnapshotResponse);
```

**Response:**

| Field | Type | Description |
|-------|------|-------------|
| `response` | ApiResponse | Standard response envelope |
| `timestamp_unix_ms` | int64 | Snapshot timestamp |
| `nodes` | repeated GraphNode | ROS 2 nodes |
| `topics` | repeated GraphTopic | ROS 2 topics |
| `services` | repeated GraphService | ROS 2 services |

---

## Shared Types

### ResultCode

| Value | Name | Meaning |
|-------|------|---------|
| 0 | `RESULT_OK` | Success |
| 1 | `RESULT_ERROR` | Generic error |
| 2 | `RESULT_INVALID_ARGUMENT` | Bad request parameter |
| 3 | `RESULT_UNAUTHORIZED` | Authentication required |
| 4 | `RESULT_FORBIDDEN` | Insufficient permissions |
| 5 | `RESULT_NOT_FOUND` | Resource not found |
| 6 | `RESULT_CONFLICT` | Conflicting operation |
| 7 | `RESULT_TIMEOUT` | Operation timed out |
| 8 | `RESULT_PRECONDITION_FAILED` | Prerequisite not met |
| 9 | `RESULT_UNAVAILABLE` | Service unavailable |

### HealthState

| Value | Name |
|-------|------|
| 0 | `HEALTH_UNKNOWN` |
| 1 | `HEALTH_HEALTHY` |
| 2 | `HEALTH_DEGRADED` |
| 3 | `HEALTH_FAILED` |

### VehicleMode

| Value | Name |
|-------|------|
| 0 | `MODE_UNKNOWN` |
| 1 | `MODE_BOOT` |
| 2 | `MODE_STANDBY` |
| 3 | `MODE_AUTONOMOUS` |
| 4 | `MODE_TELEOP` |
| 5 | `MODE_DIAGNOSTIC` |
| 6 | `MODE_SAFE_STOP` |
| 7 | `MODE_UPDATE` |

### LifecycleState

| Value | Name |
|-------|------|
| 0 | `LIFECYCLE_UNKNOWN` |
| 1 | `LIFECYCLE_UNCONFIGURED` |
| 2 | `LIFECYCLE_INACTIVE` |
| 3 | `LIFECYCLE_ACTIVE` |
| 4 | `LIFECYCLE_FINALIZED` |
