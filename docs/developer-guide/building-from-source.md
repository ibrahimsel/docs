---
sidebar_position: 2
sidebar_label: Building from Source
---

# Building from Source

This guide covers the complete development setup for Eclipse Muto — from cloning the repository to running tests and linting.

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Python | 3.10+ | All backend modules |
| pip | 22.0+ | Package management |
| Node.js | 18.0+ | Dashboard |
| protoc | 3.0+ | Proto stub generation |
| Git | 2.0+ | Source control |

## Clone and Set Up

```bash
git clone https://github.com/eclipse-muto/muto.git
cd muto

# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install all modules with dev extras
make install-dev
```

The `install-dev` target installs:
- All five Python modules in editable mode (`pip install -e`)
- Dev extras: `pytest`, `pytest-asyncio`, `ruff` (linter)
- Proto tooling: `grpcio-tools`

## Generate Proto Stubs

```bash
make proto
```

This generates Python gRPC stubs from the `.proto` files into `generated/python/`. The stubs must be regenerated whenever proto files change.

**What happens under the hood:**

```bash
python3 -m grpc_tools.protoc \
    -I proto \
    --python_out=generated/python \
    --grpc_python_out=generated/python \
    --pyi_out=generated/python \
    proto/muto/shared/v1/common.proto \
    proto/muto/daemon/v1/daemon.proto \
    proto/muto/agent/v1/agent.proto
```

The `__init__.py` files are created automatically to make the generated packages importable.

## Running Tests

```bash
# Run all tests
make test

# Run tests for a specific module
cd mutod && python3 -m pytest tests/ -v
cd muto_cli && python3 -m pytest tests/ -v
cd muto_composer && python3 -m pytest tests/ -v
```

Tests use `pytest` with `pytest-asyncio` for async test support. The `asyncio_mode = "auto"` setting in each module's `pyproject.toml` means async test functions are automatically detected.

### Writing Tests

Test files follow the pattern `test_<module>.py`:

```python
# tests/test_slot_manager.py
import pytest
from mutod.bundle.slot import SlotManager

@pytest.fixture
def slot_manager(tmp_path):
    return SlotManager(data_dir=tmp_path)

def test_initial_state(slot_manager):
    status = slot_manager.get_status()
    assert status.active_slot == ""
    assert status.active_info.state == "empty"
    assert status.inactive_info.state == "empty"

@pytest.mark.asyncio
async def test_install_bundle(slot_manager, sample_bundle):
    result = await slot_manager.install(sample_bundle)
    assert result.installed_slot in ("A", "B")
```

## Linting

```bash
make lint
```

This runs [Ruff](https://docs.astral.sh/ruff/) across all Python modules:

```bash
python3 -m ruff check mutod/ muto_cli/ muto_composer/ muto_agent/ muto_core/
```

### Code Style

The project follows these conventions (from `CLAUDE.md`):

- **Type hints** everywhere
- **Docstrings** on all public functions and classes
- **f-strings** preferred over format()
- **`logging` module** (not print) for output
- **Structured JSON logs** for the daemon
- **`asyncio`** for async operations

## Building the Dashboard

```bash
make install-dashboard   # Install npm dependencies
cd dashboard
npm run dev              # Development server (http://localhost:5173)
npm run build            # Production build (output: dist/)
```

## Makefile Targets Reference

| Target | Description |
|--------|-------------|
| `make proto` | Generate Python gRPC stubs |
| `make test` | Run all pytest suites |
| `make lint` | Run ruff linter |
| `make install` | Install all modules in editable mode |
| `make install-dev` | Install with dev extras |
| `make install-dashboard` | Install dashboard npm dependencies |
| `make clean` | Remove generated files, caches, build artifacts |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PYTHONPATH` | — | Should include `generated/python/` for proto imports |
| `MUTOD_CONFIG` | — | Override daemon config file path |

## IDE Setup

### VS Code

Recommended extensions:
- **Python** (ms-python.python)
- **Pylance** (ms-python.vscode-pylance)
- **Ruff** (charliermarsh.ruff)
- **Proto3** (zxh404.vscode-proto3)

Add to `.vscode/settings.json`:

```json
{
  "python.defaultInterpreterPath": "${workspaceFolder}/.venv/bin/python",
  "python.analysis.extraPaths": [
    "${workspaceFolder}/generated/python"
  ]
}
```

This ensures Pylance can resolve the generated proto imports.
