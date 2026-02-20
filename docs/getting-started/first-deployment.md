---
sidebar_position: 2
sidebar_label: First Deployment
---

# First Deployment

This walkthrough takes you from zero to a complete deployment cycle: generating keys, building a bundle, starting the daemon, uploading the bundle, and rolling back. Everything runs locally on your machine.

## Prerequisites

Make sure you have completed the [Installation](installation) guide. You should be able to run `muto --help` and `muto-compose --help` successfully.

## Step 1: Create a Working Directory

```bash
DEMO_DIR=$(mktemp -d /tmp/muto-demo-XXXX)
echo "Working in $DEMO_DIR"
```

## Step 2: Generate Signing Keys

Create an ECDSA P-256 key pair for signing bundles:

```bash
muto-compose keygen --output "$DEMO_DIR/keys"
```

This creates:
- `$DEMO_DIR/keys/muto.key` — Your private signing key (keep this secret)
- `$DEMO_DIR/keys/muto.pub` — Your public verification key (share with vehicles)

```
ls -la "$DEMO_DIR/keys/"
# -rw------- 1 user user  227 muto.key
# -rw-r--r-- 1 user user  178 muto.pub
```

## Step 3: Build a Signed Bundle

Build a bundle from the example stack YAML that ships with Muto:

```bash
muto-compose build muto_composer/examples \
    --key "$DEMO_DIR/keys/muto.key" \
    --output "$DEMO_DIR"
```

This reads `muto_composer/examples/muto-stack.yaml`, transforms it into a manifest, signs it, and packages everything into a `.tar.gz`:

```
ls -lh "$DEMO_DIR"/*.tar.gz
# -rw-r--r-- 1 user user 2.1K example-autonomy-stack-1.0.0.tar.gz
```

## Step 4: Inspect the Bundle

Take a look at what is inside:

```bash
muto-compose inspect "$DEMO_DIR"/example-autonomy-stack-*.tar.gz
```

This shows you the bundle's name, version, target platforms, stacks, components, and signature status.

## Step 5: Verify the Bundle

Confirm the bundle's signature is valid:

```bash
muto-compose verify "$DEMO_DIR"/example-autonomy-stack-*.tar.gz \
    --key "$DEMO_DIR/keys/muto.pub"
```

You should see a confirmation that the signature is valid.

## Step 6: Start the Daemon

Start the Muto daemon in the background. Since we are running as a regular user (not root), the Unix domain socket at `/var/run/mutod.sock` will fail, and the daemon will fall back to TCP:

```bash
MUTOD_DATA="$DEMO_DIR/mutod-data"
MUTOD_LISTEN="localhost:50051"

python3 -m mutod \
    --data-dir "$MUTOD_DATA" \
    --listen "$MUTOD_LISTEN" \
    --no-json-logs \
    --log-level INFO \
    --schema-path schemas/manifest.schema.json \
    2>&1 &
DAEMON_PID=$!
sleep 2

# Verify the daemon is running
kill -0 "$DAEMON_PID" && echo "Daemon running (PID $DAEMON_PID)"
```

## Step 7: Query Daemon Info

Use the CLI to query the daemon:

```bash
muto info
```

This shows the daemon version, OS info, active slot, uptime, and more.

## Step 8: Check Deployment Status (Empty)

```bash
muto status
```

Both slots should be empty — nothing has been deployed yet.

## Step 9: Deploy the Bundle

Now for the main event. This Python script uploads the bundle to the daemon via gRPC streaming, verifies it, and installs it:

```bash
BUNDLE_FILE="$DEMO_DIR"/example-autonomy-stack-*.tar.gz

python3 - "$BUNDLE_FILE" "$MUTOD_LISTEN" <<'PYEOF'
import sys, os, grpc, pathlib

gen_path = os.environ.get("PYTHONPATH", "").split(":")[0]
if gen_path:
    sys.path.insert(0, gen_path)

from muto.daemon.v1 import daemon_pb2, daemon_pb2_grpc

bundle_path = pathlib.Path(sys.argv[1])
target = sys.argv[2]
CHUNK_SIZE = 64 * 1024

def upload_chunks(stub, path):
    data = path.read_bytes()
    total = len(data)
    def chunk_iter():
        offset = 0
        while offset < total:
            end = min(offset + CHUNK_SIZE, total)
            yield daemon_pb2.UploadBundleChunk(
                bundle_name=path.name,
                total_size=total,
                offset=offset,
                data=data[offset:end],
            )
            offset = end
    return stub.UploadBundle(chunk_iter())

channel = grpc.insecure_channel(target)
stub = daemon_pb2_grpc.DaemonServiceStub(channel)

# Upload
print("Uploading bundle...")
resp = upload_chunks(stub, bundle_path)
print(f"Uploaded → staging_id={resp.staging_id}")
print(f"SHA-256: {resp.sha256_hash[:32]}...")

# Verify
print("Verifying manifest...")
vresp = stub.VerifyBundle(
    daemon_pb2.VerifyBundleRequest(staging_id=resp.staging_id)
)
print(f"Schema valid={vresp.schema_valid}, "
      f"signature valid={vresp.signature_valid}, "
      f"target compatible={vresp.target_compatible}")

# Install
print("Installing to slot...")
iresp = stub.InstallBundle(
    daemon_pb2.InstallBundleRequest(staging_id=resp.staging_id)
)
print(f"Installed → slot={iresp.installed_slot}, "
      f"previous={iresp.previous_slot}")

channel.close()
print("Done!")
PYEOF
```

You should see output like:

```
Uploading bundle...
Uploaded → staging_id=abc123
SHA-256: a1b2c3d4e5f6...
Verifying manifest...
Schema valid=True, signature valid=True, target compatible=True
Installing to slot...
Installed → slot=B, previous=
Done!
```

## Step 10: Verify Deployment

Check the deployment status and bundle list:

```bash
muto status
muto bundles
```

You should see Slot B is now active with the example-autonomy-stack bundle.

## Step 11: Deploy Again (Fill Both Slots)

To demonstrate rollback, we need both slots populated. Deploy the same bundle again:

```bash
# Run the same upload/install script again
# (This installs to Slot A, the now-inactive slot)
```

Now `muto bundles` should show both Slot A and Slot B occupied.

## Step 12: Rollback

Trigger a rollback to the previous slot:

```bash
muto rollback --reason "Testing rollback"
```

Check the status to confirm the active slot switched:

```bash
muto status
```

## Step 13: Clean Up

Stop the daemon and remove temporary files:

```bash
kill "$DAEMON_PID" 2>/dev/null
rm -rf "$DEMO_DIR"
```

## Using the Interactive Demo

Muto ships with an interactive demo script that automates all of the above steps with pauses and colored output:

```bash
./demo.sh
```

The demo walks through all three phases (bundle authoring, daemon deployment, rollback) interactively.

## What You Just Learned

| Step | What Happened |
|------|--------------|
| Key generation | Created an ECDSA P-256 key pair for signing |
| Bundle build | Transformed stack YAML into a signed `.tar.gz` bundle |
| Verification | Confirmed signature and schema validity |
| Daemon startup | Started the privileged system service |
| Upload | Streamed the bundle to the daemon via gRPC |
| Install | Atomically placed the bundle into an A/B slot |
| Rollback | Switched back to the previous slot in milliseconds |

## What is Next?

- Read the [Architecture Overview](../architecture/system-overview) to understand how all components fit together
- Learn to [Author Your Own Bundles](../guides/authoring-bundles) with custom stacks
- Explore the [CLI Reference](../guides/cli-reference) for all available commands
