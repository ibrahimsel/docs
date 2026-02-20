---
sidebar_position: 3
sidebar_label: Proto Definitions
---

# Proto Definitions

The gRPC API is defined in Protocol Buffer (`.proto`) files under the `proto/` directory. These files are the **source of truth** for all inter-component communication. This guide explains how to read, modify, and extend the proto definitions.

## File Organization

```
proto/
└── muto/
    ├── shared/v1/
    │   └── common.proto        # Shared enums and messages
    ├── daemon/v1/
    │   └── daemon.proto        # DaemonService
    └── agent/v1/
        └── agent.proto         # AgentService
```

The versioned path (`v1`) allows introducing breaking changes in a future `v2` without disrupting existing clients.

## Reading Proto Files

### Enums

```protobuf
enum HealthState {
  HEALTH_UNKNOWN = 0;    // Field 0 is always the default
  HEALTH_HEALTHY = 1;
  HEALTH_DEGRADED = 2;
  HEALTH_FAILED = 3;
}
```

- Enum values have a numeric ID — these are what get sent over the wire
- Field 0 is always the default (unset) value
- Names are prefixed with the enum name to avoid collisions (`HEALTH_` prefix)

### Messages

```protobuf
message GetInfoResponse {
  ApiResponse response = 1;       // Field number 1
  string daemon_version = 2;      // Field number 2
  string os_version = 3;
  string active_slot = 4;
  string device_id = 5;
  bool tpm_present = 6;
  int64 uptime_seconds = 7;
  string active_bundle_id = 8;
  string active_bundle_version = 9;
}
```

- Each field has a **type**, a **name**, and a **field number**
- Field numbers are permanent — never reuse or change them
- Fields can be added in any order (field numbers determine wire format)
- All fields are optional by default in proto3

### Services

```protobuf
service DaemonService {
  rpc GetInfo(GetInfoRequest) returns (GetInfoResponse);
  rpc UploadBundle(stream UploadBundleChunk) returns (UploadBundleResponse);
  rpc StreamLogs(StreamLogsRequest) returns (stream LogEvent);
}
```

- `rpc Name(Request) returns (Response)` — Unary RPC
- `rpc Name(stream Request) returns (Response)` — Client streaming
- `rpc Name(Request) returns (stream Response)` — Server streaming
- `rpc Name(stream Request) returns (stream Response)` — Bidirectional streaming

## Adding a New RPC

To add a new RPC to an existing service:

### 1. Define Messages

Add the request and response messages to the appropriate `.proto` file:

```protobuf
// In daemon.proto

message GetTemperatureRequest {
  string sensor_id = 1;
}

message GetTemperatureResponse {
  ApiResponse response = 1;
  string sensor_id = 2;
  double celsius = 3;
  int64 timestamp_unix_ms = 4;
}
```

### 2. Add the RPC

Add the RPC to the service definition:

```protobuf
service DaemonService {
  // ... existing RPCs ...

  // Hardware monitoring
  rpc GetTemperature(GetTemperatureRequest) returns (GetTemperatureResponse);
}
```

### 3. Regenerate Stubs

```bash
make proto
```

### 4. Implement the Server

In `server.py`, add the implementation:

```python
async def GetTemperature(self, request, context):
    sensor_id = request.sensor_id
    # ... read temperature from hardware ...
    return daemon_pb2.GetTemperatureResponse(
        response=common_pb2.ApiResponse(
            code=common_pb2.RESULT_OK,
            message="ok",
            request_id=str(uuid.uuid4()),
        ),
        sensor_id=sensor_id,
        celsius=42.5,
        timestamp_unix_ms=int(time.time() * 1000),
    )
```

### 5. Add Client Method

In `client.py`, add the client wrapper:

```python
def get_temperature(self, sensor_id: str) -> daemon_pb2.GetTemperatureResponse:
    try:
        return self.stub.GetTemperature(
            daemon_pb2.GetTemperatureRequest(sensor_id=sensor_id),
            timeout=self.config.timeout_seconds,
        )
    except grpc.RpcError as e:
        raise RPCError(f"GetTemperature failed: {e}")
```

## Proto Style Guide

### Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Service | PascalCase + `Service` suffix | `DaemonService` |
| RPC | PascalCase verb phrase | `GetDeploymentStatus` |
| Message | PascalCase | `UploadBundleChunk` |
| Field | snake_case | `installed_at_unix_ms` |
| Enum | PascalCase | `VehicleMode` |
| Enum value | SCREAMING_SNAKE_CASE with prefix | `MODE_AUTONOMOUS` |

### Field Number Ranges

| Range | Usage |
|-------|-------|
| 1-15 | Most frequently used fields (1 byte on wire) |
| 16-2047 | Standard fields (2 bytes on wire) |
| 19000-19999 | Reserved (proto internal use) |

### Best Practices

1. **Never reuse field numbers** — Even if you delete a field, do not reuse its number
2. **Always include `ApiResponse`** — Every RPC response should have a `response` field at position 1
3. **Use `int64` for timestamps** — Millisecond precision, stored as `unix_ms`
4. **Use `string` for IDs** — Even if they look numeric, IDs should be strings for flexibility
5. **Add comments** — Document the purpose of each RPC, message, and non-obvious field

## Generated Code

After running `make proto`, the generated Python files provide:

### Message Classes (`*_pb2.py`)

```python
from muto.daemon.v1 import daemon_pb2

# Create a message
request = daemon_pb2.GetInfoRequest()

# Access fields
response = daemon_pb2.GetInfoResponse()
response.daemon_version = "0.1.0"
response.active_slot = "B"

# Serialize
bytes_data = response.SerializeToString()

# Deserialize
parsed = daemon_pb2.GetInfoResponse()
parsed.ParseFromString(bytes_data)
```

### Service Stubs (`*_pb2_grpc.py`)

```python
from muto.daemon.v1 import daemon_pb2_grpc

# Server side — inherit and implement
class DaemonServiceServicer(daemon_pb2_grpc.DaemonServiceServicer):
    async def GetInfo(self, request, context):
        return daemon_pb2.GetInfoResponse(...)

# Client side — use the stub
stub = daemon_pb2_grpc.DaemonServiceStub(channel)
response = stub.GetInfo(daemon_pb2.GetInfoRequest())
```

### Type Stubs (`*.pyi`)

Type hint files for IDE autocompletion. These let your IDE know the types of all fields on protobuf messages.
