# Mission Control Software

**Agent Owner:** GUARDIAN (Mission Control AI)

## Overview

The mission control system is the autonomous intelligence layer that monitors spacecraft health, detects anomalies, and triggers recovery procedures. It integrates directly with the ground station and the PIONEER operations scheduler.

## Core Capabilities

### 1. Real-Time Health Monitoring
- Telemetry ingestion from ground station at <100 ms latency
- Automated limit checking against spacecraft health thresholds
- Multi-parameter anomaly detection (rule-based + ML)
- State machine tracking across all 7 spacecraft modes

### 2. Anomaly Detection & Classification
- Rule-based: voltage, temperature, attitude rate, comms loss timers
- ML-based: anomaly pattern recognition trained on CubeSat mission data
- Severity classification: CRITICAL / MAJOR / MINOR / INFORMATIONAL

### 3. Autonomous Response
- CRITICAL: immediate safemode entry + operator alert
- MAJOR: corrective action sequence + alert
- MINOR: log + scheduled review

### 4. Dashboard
- Real-time 3D spacecraft attitude visualization (Three.js)
- Orbital track plot (Leaflet.js globe)
- Subsystem health cards with trend plots
- Active anomaly feed with disposition workflow

## Architecture

```
mission-control/
├── guardian-core/      # Python anomaly engine
│   ├── monitors/       # Per-subsystem health monitors
│   ├── state-machine/  # Spacecraft mode tracker
│   ├── responder/      # Autonomous response executor
│   └── ml-models/      # Anomaly detection ML models
├── dashboard/          # React operator console
├── alerts/             # Notification system (email/SMS/Slack)
└── config/
    ├── limits.yaml     # Spacecraft telemetry limit tables
    └── responses.yaml  # Autonomous response playbooks
```

## Status

📋 **Planned** — Development begins Phase 3 (Month 10)

---
*Owner: GUARDIAN • Luna Ice Mapper*
