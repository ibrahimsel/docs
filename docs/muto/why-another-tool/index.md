---
id: why-another-tool
title: Why Another Orchestration Tool?
sidebar_label: Why Another Orchestration Tool?
sidebar_position: 1
---


# Why Another Orchestration Tool?

## The Unique Challenges of ROS2

ROS2 has become the standard middleware for robotic systems, enabling decentralized, modular, and real-time capable robotics solutions. Despite its widespread adoption, managing large-scale deployments, handling complex runtime states, ensuring robustness, and maintaining efficient software updates remain challenging. Existing orchestration tools typically cater to cloud and microservices environments, not fully addressing the nuanced requirements of robotic systems running on ROS2.


---

### 1. Fragmented Launch & Lifecycle Management

* **Pain:** You’ve got dozens of `.launch.py` files, each with its own quirks, and ROS 2’s built-in lifecycle API is powerful but under-adopted. Spinning up, tearing down, and upgrading nodes manually gets messy fast.
* **Muto fix:** A central manifest (YAML/JSON) that describes your desired “graph” (nodes, parameters, remappings, lifecycles) plus a controller that handles rollout, health-checks, and graceful shutdowns.

### 1.1 Changing ROS Parameters at Runtime
* **If the ROS Node is listening to the parameter server**, Eclipse Muto provides the interface to change the parameters at runtime


### 1.2. Consistent Parameter & Config Management

* **Pain:** Parameters live in code, launch files, env vars, config files… it’s nearly impossible to guarantee everyone’s running with the same tuning set.
* **Muto fix:** Treat parameters like Kubernetes ConfigMaps: versioned, namespaced, injected at runtime, and even hot-reloaded across your robot fleet.

### 2. Cross-Machine Networking & DDS Configuration

* **Pain:** DDS discovery on multi‐host setups can be flakey—domain collisions, multicast woes, exploding peer counts—and you’re forced into hacks (static XML configs, DDS bridges).
* **Muto fix:** Automate domain ID allocation, inject DDS configs via sidecar containers or configmaps, and overlay a secure network mesh so nodes “just see” each other reliably.

### 3. Versioning, Deployment & Rollbacks

* **Pain:** Upgrading a single microservice means SSH’ing into each machine, rebuilding, and hoping nothing breaks—or you risk incompatible ABI changes across nodes.
* **Muto fix:** Containerize every ROS 2 node, push immutable images to a registry, and use declarative Deployments with rolling updates + automatic rollbacks on failure.

### 4. Self-Healing & Health Monitoring

* **Pain:** When a node crashes, sometimes the whole system falls apart, and you might not notice until you’re staring at a dead robot in the aisle.
* **Muto fix:** Built-in liveness/readiness probes and auto-restart policies—plus a dashboard that shows node-level CPU, memory, crash-looping stats in real-time.

### 5. Observability (Logs, Metrics & Tracing)

* **Pain:** Rviz and `ros2 topic echo` are great for debugging locally but worthless in production. Gathering logs from ten robots is a nightmare.
* **Muto fix:** Sidecar agents (Fluentd/Prometheus exporters) that scrape `/rosout` and DDS traffic, push it to a central ELK/Grafana stack, and let you set alerts on anomalies.

### 6. Security & Secrets Management

* **Pain:** SSH keys scattered on SD cards, tokens in plain text, open DDS ports by default—every robot is a potential backdoor.
* **Muto fix:** Integrate a vault for certificates, mount secrets as in-memory files, enforce TLS for DDS, and use RBAC so only authorized controllers can push new node specs.

### 7. Resource Quotas & Scheduling

* **Pain:** Two heavy vision nodes on the same CPU starve each other; another robot hogs network bandwidth and cripples your fleet’s telemetry.
* **Muto fix:** Declare CPU/memory limits per container, schedule heavyweight jobs on beefier hardware, and throttle DDS traffic with QoS policing.

### 8. Scaling & Multi-Tenant Support

* **Pain:** Building a demo for one robot is easy; managing 20 simultaneously is exponential pain. Isolating different user groups or experiments is practically impossible.
* **Muto fix:** Namespaces or “spaces” per project, horizontal autoscaling of compute-intensive nodes (e.g. inference OTs), and quota enforcement so teams can’t stomp on each other.

### 9. Dependency & ABI Compatibility

* **Pain:** ROS 2 distro differences, mismatched DDS vendors, or conflicting system libraries turn simple upgrades into week-long debugging sprints.
* **Muto fix:** Immutable container images per distro/vendor combo, image layering that caches common deps, and a registry that enforces metadata (distro, DDS, Python/C++).

---

#### Putting It All Together

An orchestration tool for ROS 2 would consist of:

1. **Control Plane** – API server to accept declarative specs (node graph, configs, policies).
2. **Agents** – Lightweight daemons on each robot that pull specs, launch containers, report health.
3. **Registry & Config Store** – Image registry for your node containers; config store (like etcd/Vault) for parameters and secrets.
4. **Dashboard & CLI** – Unified view of your entire fleet: node status, logs, metrics, and one-click rollbacks or upgrades.

Which leads us to Eclipse Muto.

### Tailored for ROS2 Ecosystem

Eclipse Muto is specifically designed for ROS2, understanding intimately its lifecycle, messaging paradigms, and system dynamics. Unlike general-purpose orchestration tools (k8s, docker swarm etc.), Muto seamlessly integrates with ROS2's distributed architecture, ensuring precise orchestration that directly maps to ROS2 entities such as nodes, parameters, topics, and services.

### Real-Time Runtime Reconciliation

One of the core strengths of Eclipse Muto is its runtime reconciliation process. It actively compares the actual state of your robotic fleet against the desired state defined in your manifests. By constantly reconciling this difference, Muto ensures your robots always operate precisely as intended, automatically handling failures, restarts, updates, and scaling.

### Efficient Software Deployment and Updates

In robotic fleets, software updates are critical yet challenging to manage, especially when dealing with geographically distributed and heterogeneous systems. Eclipse Muto handles this efficiently, automatically synchronizing fleet-wide software deployments upon updates in the central registry. This ensures consistency and reliability, dramatically reducing downtime and manual overhead.

### ROS2-Centric Workflow

Unlike broader tools, Eclipse Muto supports ROS2-native workflows. It leverages ROS2's tools and paradigms directly, eliminating the complexity of bridging between different orchestration layers and allowing engineers to operate entirely within their ROS2-centric development lifecycle.

### Extensible and Modular

Eclipse Muto is built from the ground up to be highly extensible and modular. Users can define custom behaviors, integrate third-party plugins, and adapt the orchestration logic to their specific scenarios, providing unmatched flexibility.

### Open and Community-Driven

Being part of the Eclipse Foundation, Muto benefits from an open, vendor-neutral governance model. This community-driven approach fosters collaboration, innovation, and transparency, ensuring Eclipse Muto continuously evolves with the needs of the robotics community.

Eclipse Muto isn’t merely another orchestration tool—it’s an essential solution purpose-built to address the unique orchestration challenges of ROS2-based robotic systems.

