---
sidebar_position: 5
sidebar_label: Dashboard Development
---

# Dashboard Development

This guide covers how to develop, extend, and customize the Muto Dashboard — the React-based fleet monitoring interface.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 |
| **Language** | TypeScript 5.9 |
| **Build** | Vite 7 |
| **Styling** | Tailwind CSS 3.4 |
| **Components** | shadcn/ui (Radix UI primitives) |
| **State** | Zustand |
| **Routing** | React Router 7 |
| **Icons** | Lucide React |

## Getting Started

```bash
cd dashboard
npm install
npm run dev
```

The dev server starts at `http://localhost:5173` with hot module replacement.

## Project Structure

```
dashboard/src/
├── App.tsx                    # Root with routes
├── main.tsx                   # Entry point
├── pages/
│   ├── FleetOverview.tsx      # Fleet dashboard
│   ├── VehicleDetail.tsx      # Single vehicle view
│   └── Deployment.tsx         # Deployment management
├── components/
│   ├── Layout.tsx             # App shell
│   ├── DataTable.tsx          # Reusable table
│   ├── StatusBadge.tsx        # Health/mode badges
│   ├── GraphViewer.tsx        # ROS 2 graph visualization
│   └── ModeTransitionDialog.tsx
├── types/
│   └── index.ts               # All TypeScript types
├── store/
│   └── index.ts               # Zustand store
└── lib/
    ├── mock-data.ts           # Development data
    └── utils.ts               # Helpers
```

## Type Definitions

The dashboard types mirror the protobuf definitions. Key types in `types/index.ts`:

```typescript
// Enums matching proto definitions
enum HealthState {
  UNKNOWN = "UNKNOWN",
  HEALTHY = "HEALTHY",
  DEGRADED = "DEGRADED",
  FAILED = "FAILED",
}

enum VehicleMode {
  BOOT = "BOOT",
  STANDBY = "STANDBY",
  AUTONOMOUS = "AUTONOMOUS",
  TELEOP = "TELEOP",
  DIAGNOSTIC = "DIAGNOSTIC",
  SAFE_STOP = "SAFE_STOP",
  UPDATE = "UPDATE",
}

// Data models
interface Vehicle {
  id: string;
  name: string;
  mode: VehicleMode;
  health: HealthState;
  bundleVersion: string;
  uptime: number;
  stacks: Stack[];
  probes: ProbeResult[];
}

interface Stack {
  name: string;
  state: string;
  health: HealthState;
  components: Component[];
}

interface ProbeResult {
  probeId: string;
  state: HealthState;
  message: string;
  timestamp: number;
  value?: number;
}
```

## State Management

The fleet store uses Zustand for minimal boilerplate:

```typescript
// store/index.ts
import { create } from 'zustand';

interface FleetStore {
  vehicles: Vehicle[];
  searchQuery: string;
  healthFilter: HealthState | null;
  modeFilter: VehicleMode | null;
  setSearchQuery: (query: string) => void;
  setHealthFilter: (filter: HealthState | null) => void;
  setModeFilter: (filter: VehicleMode | null) => void;
}

export const useFleetStore = create<FleetStore>((set) => ({
  vehicles: [],
  searchQuery: '',
  healthFilter: null,
  modeFilter: null,
  setSearchQuery: (query) => set({ searchQuery: query }),
  setHealthFilter: (filter) => set({ healthFilter: filter }),
  setModeFilter: (filter) => set({ modeFilter: filter }),
}));
```

Usage in components:

```typescript
function FleetOverview() {
  const { vehicles, searchQuery, setSearchQuery } = useFleetStore();

  const filtered = vehicles.filter(v =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {filtered.map(v => <VehicleCard key={v.id} vehicle={v} />)}
    </div>
  );
}
```

## Adding a New Page

1. **Create the page component:**

```typescript
// src/pages/AuditLog.tsx
export function AuditLog() {
  return (
    <div>
      <h1>Audit Log</h1>
      {/* Your page content */}
    </div>
  );
}
```

2. **Add a route in App.tsx:**

```typescript
import { AuditLog } from './pages/AuditLog';

function App() {
  return (
    <Routes>
      {/* existing routes */}
      <Route path="/audit" element={<AuditLog />} />
    </Routes>
  );
}
```

3. **Add navigation in Layout.tsx.**

## Component Patterns

### StatusBadge

The `StatusBadge` component renders color-coded badges for health states and modes:

```typescript
<StatusBadge state={vehicle.health} />
// Renders: green for HEALTHY, yellow for DEGRADED, red for FAILED

<StatusBadge mode={vehicle.mode} />
// Renders: blue for AUTONOMOUS, gray for STANDBY, red for SAFE_STOP
```

### ModeTransitionDialog

The mode transition dialog shows valid transitions and requires confirmation:

```typescript
<ModeTransitionDialog
  currentMode={vehicle.mode}
  onTransition={(targetMode, reason) => {
    // Call agent gRPC to request mode change
  }}
/>
```

It uses the `MODE_TRANSITIONS` constant to only show valid target modes.

## Building for Production

```bash
npm run build
```

Output goes to `dashboard/dist/`. This is a static site that can be served by any web server (nginx, Apache, S3, etc.).

### Docker

```bash
npm run docker:build
npm run docker:run    # Serves on port 8080
```

## Mock Data

During development, the dashboard uses mock data from `lib/mock-data.ts`:

```typescript
// lib/mock-data.ts
export const mockVehicles: Vehicle[] = [
  {
    id: "vehicle-001",
    name: "Delivery Bot Alpha",
    mode: VehicleMode.AUTONOMOUS,
    health: HealthState.HEALTHY,
    bundleVersion: "2.1.0",
    uptime: 86400,
    stacks: [...],
    probes: [...],
  },
  // ... more vehicles
];
```

To connect to a real backend, replace the mock data imports with gRPC client calls (using grpc-web or a REST gateway).
