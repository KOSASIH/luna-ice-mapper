# GUARDIAN Architecture
## Mission Control Monitoring System — Luna Ice Mapper (LIM-1)

> **Version:** 1.0.0 | **Status:** Phase 1 — Baseline Architecture  
> **Author:** GUARDIAN Mission Control AI  
> **Last Updated:** 2026-06-03

---

## 1. Overview

GUARDIAN (Ground-Uplink & Autonomous Real-Time Detection / Intervention & Alert Node) is the autonomous mission control monitoring system for the Luna Ice Mapper 6U CubeSat. It performs continuous spacecraft health evaluation, anomaly detection, and autonomous fault response during all mission phases — including periods of ground contact loss that are routine in lunar orbit.

LIM-1 operates in the lunar south polar region where communication windows are limited and lighting conditions are extreme. GUARDIAN is the onboard "first responder" that keeps the spacecraft safe between ground contact passes.

---

## 2. Design Principles

| Principle | Rationale |
|-----------|----------|
| **Fail-safe defaults** | Any unresolvable anomaly transitions to SAFE mode |
| **Priority-ordered response** | P1 (CRITICAL) actions always supersede lower-priority checks |
| **Separation of detection and response** | Monitors detect; playbooks respond; state machine controls mode |
| **Config-driven limits** | All thresholds in `limits.yaml` — no magic numbers in code |
| **Audit trail** | Every transition and alert logged with timestamp and telemetry snapshot |
| **Graceful degradation** | System continues with reduced capability, never full stop |

---

## 3. Component Map

```
lunar-ice-mapper/
└── software/mission-control/
    ├── config/
    │   ├── limits.yaml          # Telemetry limit table (all subsystems)
    │   └── responses.yaml       # Autonomous response playbooks
    └── guardian-core/
        ├── state_machine.py     # Spacecraft mode state machine
        └── monitors/
            ├── __init__.py
            ├── base_monitor.py  # Shared AlertSeverity + HealthAlert types
            ├── eps_monitor.py   # Electrical Power Subsystem monitor
            ├── adcs_monitor.py  # Attitude Determination & Control monitor
            ├── comms_monitor.py # Communications Subsystem monitor
            └── thermal_monitor.py # Thermal Control monitor
```

---

## 4. Spacecraft Mode State Machine

### 4.1 Mode Definitions

| Mode | Description | Key Constraints |
|------|-------------|----------------|
| **BOOT** | Post-power-on self-test and subsystem initialisation | Max 10 min; enters SAFE if self-test fails |
| **DETUMBLE** | B-dot magnetorquer rate reduction | Payload off; reaction wheels off |
| **SAFE** | Minimum-power survival mode | Payload off; UHF beacon only; sun-pointing |
| **NOMINAL** | Normal baseline operations | All subsystems healthy; payload standby |
| **SCIENCE** | Active science observation | Pointing error < 2°; battery SOC ≥ 40% |
| **DOWNLINK** | Science data transmission | Ground contact active; S-band TX enabled |
| **ECLIPSE** | Eclipse power conservation | Solar input < 0.5 W; reduced loads |

### 4.2 Transition Diagram

```
                    ┌──────────────────────────────────────────┐
                    │           CRITICAL ANOMALY               │
                    │  (any mode → SAFE, priority=1)           │
                    └──────────────────────────────────────────┘
                                        │
                                        ▼
  ┌──────┐  selftest   ┌──────────┐  rates<2°/s  ┌─────────┐
  │ BOOT ├────────────►│ DETUMBLE ├─────────────►│ NOMINAL │◄─────┐
  └──────┘   pass+     └──────────┘  + complete   └────┬────┘     │
              tumble                                    │          │
                                          power+pointing│       eclipse
                                          SOC≥40%  ▼         exit│
                                               ┌─────────┐        │
                                               │ SCIENCE │        │
                                               └────┬────┘        │
                                     gnd contact +  │  degraded   │
                                     flash≥60%  ▼   │  power/point│
                                           ┌──────────┐           │
                                           │ DOWNLINK │           │
                                           └─────┬────┘           │
                                   session end   │                │
                                                 └────────────────┘

  ┌─────────┐  eclipse entry (any mode)  ┌─────────┐
  │ NOMINAL ├──────────────────────────►│ ECLIPSE ├──► NOMINAL (exit)
  └─────────┘                           └─────────┘

  ┌──────┐   recovery + ground cmd   ┌─────────┐
  │ SAFE ├──────────────────────────►│ NOMINAL │
  └──────┘                           └─────────┘
```

### 4.3 Safe Mode Entry Conditions

| ID | Trigger | Source |
|----|---------|--------|
| SM-001 | Battery voltage < 6.4 V | EPS-001 |
| SM-002 | Total angular rate > 15 °/s | ADCS-001 |
| SM-003 | Comms loss > 72 hours | COMMS-001 |
| SM-004 | OBC watchdog resets ≥ 5/day | OBC-001 |
| SM-005 | Battery temperature critical | THERM-001 |

---

## 5. Health Monitor Architecture

### 5.1 Monitor Loop

Each monitor follows an identical pattern:

```
Telemetry Frame (1–10 Hz)
        │
        ▼
┌───────────────┐
│ Subsystem     │  .check(telemetry) → List[HealthAlert]
│ Monitor       │
│ (EPS/ADCS/    │  • Evaluates each parameter
│  COMMS/THERM) │  • Checks WARNING then CRITICAL thresholds
└───────┬───────┘  • Returns highest-severity alert per parameter
        │
        ▼
┌───────────────┐
│ HealthAlert   │  alert_id, severity, parameter,
│ dataclass     │  value, threshold, message,
└───────┬───────┘  recommended_action
        │
        ▼
┌───────────────┐
│ GUARDIAN Loop │  Dispatches to:
│               │  • State machine (mode transitions)
│               │  • Response executor (playbook actions)
│               │  • Telemetry logger
│               │  • Ground notification queue
└───────────────┘
```

### 5.2 Subsystem Monitors

#### EPS Monitor (`eps_monitor.py`)
- **Telemetry:** Battery voltage/SOC/current/temperature, solar power input, 3.3V/5V/12V rails, total power consumption
- **Key alerts:** Battery critical low (→ SAFE mode), voltage rail fault (→ cycle rail), solar loss (→ eclipse protocol)
- **Critical threshold:** Battery voltage < 6.4 V → immediate SAFE mode

#### ADCS Monitor (`adcs_monitor.py`)
- **Telemetry:** Roll/pitch/yaw rates, pointing error, quaternion norm, magnetorquer current/temp, reaction wheel speed/temp, star tracker count, gyro/accel bias, error counters
- **Key alerts:** Tumble detection (→ DETUMBLE), pointing error (→ suspend science), repeated faults (→ ADCS reset/failover)
- **Critical threshold:** Total angular rate > 15 °/s → DETUMBLE mode

#### COMMS Monitor (`comms_monitor.py`)
- **Telemetry:** UHF RSSI/BER/TX power/temperature, S-band TX power/temperature, comms loss timer, missed contact windows, telemetry gap
- **Key alerts:** Extended comms loss (→ SAFE + emergency beacon), high BER (→ BPSK fallback + FEC)
- **Critical threshold:** Comms loss > 72 h → SAFE mode + autonomous groundpass orient

#### Thermal Monitor (`thermal_monitor.py`)
- **Telemetry:** OBC CPU/board temperature, neutron spectrometer/NIR camera/detector temperature, battery temperature, all 6 structural panel temperatures, heater states
- **Key alerts:** Battery thermal critical (→ SAFE), payload thermal warning (→ pause science), OBC thermal (→ reduce CPU load)
- **Critical threshold:** Battery temp outside [−20, +55] °C → SAFE mode

---

## 6. Telemetry Limits (Summary)

Full table in [`config/limits.yaml`](../../config/limits.yaml).

### Voltage Rails

| Rail | Nominal | Warning Low | Critical Low | Warning High | Critical High |
|------|---------|-------------|--------------|--------------|---------------|
| Battery | 7.4 V | 6.8 V | **6.4 V** | 8.4 V | 8.6 V |
| 3.3V | 3.3 V | 3.1 V | 2.9 V | 3.5 V | 3.7 V |
| 5V | 5.0 V | 4.7 V | 4.5 V | 5.3 V | 5.5 V |
| 12V | 12.0 V | 11.4 V | 10.8 V | 12.6 V | 13.2 V |

### Key Temperature Limits (°C)

| Sensor | Warn Low | Crit Low | Warn High | Crit High |
|--------|----------|----------|-----------|----------|
| Battery | −10 | **−20** | 45 | **55** |
| OBC CPU | −10 | −20 | 70 | 85 |
| Neutron Spectrometer | −30 | −40 | 50 | 60 |
| Structure Panels | −60 | −80 | 70 | 90 |

### Attitude Rate Limits

| Parameter | Warning | Critical |
|-----------|---------|----------|
| Roll / Pitch / Yaw | 5 °/s | **10 °/s** |
| Total Angular Rate | 8 °/s | **15 °/s** |
| Pointing Error | 2° | **5°** |

### Comms Loss Timers

| Timer | Warning | Critical |
|-------|---------|----------|
| Comms Loss | 24 h | **72 h** |
| Telemetry Gap | 300 s | 900 s |
| Missed Windows | 2 | 5 |

---

## 7. Autonomous Response Playbooks (Summary)

Full playbooks in [`config/responses.yaml`](../../config/responses.yaml).

| ID | Name | Priority | Key Actions |
|----|------|----------|-------------|
| EPS-001 | Battery Critical Low | **P1** | Disable payload → SAFE mode → max-power orient → emergency beacon |
| EPS-002 | Battery Warning Low | P2 | Reduce duty cycle, defer non-essential ops |
| ADCS-001 | Spacecraft Tumble | **P1** | B-dot detumble → disable reaction wheels → DETUMBLE mode |
| ADCS-004 | Repeated ADCS Faults | **P1** | ADCS reset → backup processor failover → SAFE mode |
| COMMS-001 | Extended Comms Loss | **P1** | SAFE mode → low-rate beacon → omni antenna → orient for groundpass |
| THERM-001 | Battery Thermal Critical | **P1** | Heater/load management → SAFE mode |

---

## 8. Integration Points

```
┌────────────────────────────────────────────────────────────┐
│                     GUARDIAN Core Loop                     │
│                                                            │
│  Telemetry Bus ──► [EPS Monitor]  ──► HealthAlerts ──┐     │
│                 ──► [ADCS Monitor]  ──► HealthAlerts ─┤     │
│                 ──► [COMMS Monitor] ──► HealthAlerts ─┤     │
│                 ──► [Thermal Monitor]─► HealthAlerts ─┤     │
│                                                       │     │
│                                                       ▼     │
│                              ┌─────────────────────────┐   │
│                              │   Alert Aggregator      │   │
│                              │   (priority sort)       │   │
│                              └──────────┬──────────────┘   │
│                                         │                   │
│              ┌──────────────────────────┼────────────────┐  │
│              ▼                          ▼                ▼  │
│  ┌──────────────────┐   ┌────────────────────┐  ┌──────────┐│
│  │  State Machine   │   │ Response Executor  │  │ TM Logger ││
│  │ (mode control)   │   │ (playbook runner)  │  │ (flash)   ││
│  └──────────────────┘   └────────────────────┘  └──────────┘│
│                                   │                          │
│                                   ▼                          │
│                        ┌──────────────────────┐             │
│                        │  Command Bus /        │             │
│                        │  Subsystem Drivers    │             │
│                        └──────────────────────┘             │
└────────────────────────────────────────────────────────────┘
```

**Future integration interfaces (Phase 2+):**
- `TelemetryBus`: pulls frames from OBC housekeeping service
- `CommandBus`: dispatches response actions to subsystem drivers
- `GroundNotificationQueue`: queues alerts for next contact window
- `ScienceScheduler`: coordinates science window requests with NOMINAL→SCIENCE transitions
- `EclipsePredictor`: provides `in_eclipse` flag from orbital mechanics engine

---

## 9. Phase Roadmap

| Phase | Scope | Status |
|-------|-------|--------|
| **1 — Baseline Architecture** | Limits table, response playbooks, state machine, monitor stubs | ✅ Complete |
| 2 — Telemetry Bus Integration | Wire monitors to live OBC housekeeping frames | Planned |
| 3 — Command Execution | Implement response executor against real command bus | Planned |
| 4 — Ground Notification | Uplink alert queue and contact-window-gated delivery | Planned |
| 5 — Science Scheduler | Autonomous science window planning with GUARDIAN gating | Planned |
| 6 — Fault Injection Testing | Hardware-in-the-loop anomaly scenario validation | Planned |

---

## 10. References

- [`config/limits.yaml`](../../config/limits.yaml) — Full telemetry limit table
- [`config/responses.yaml`](../../config/responses.yaml) — Full response playbook library
- [`guardian-core/state_machine.py`](../guardian-core/state_machine.py) — State machine implementation
- [`guardian-core/monitors/`](../guardian-core/monitors/) — Health monitor implementations
- NASA CubeSat Design Specification (CDS) Rev 14
- ECSS-E-ST-70-11C — Space engineering: Telemetry and telecommand packet utilization
