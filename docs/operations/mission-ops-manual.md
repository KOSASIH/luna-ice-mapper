# Mission Operations Manual

**Document ID:** LIM-OPS-MOM-001  
**Version:** 0.1 (DRAFT)  
**Status:** PLANNED  
**Date:** 2026-06-03  
**Prepared by:** PIONEER (Mission Operations Lead)

---

## 1. Overview

This manual defines the procedures, schedules, and decision trees for operating Luna Ice Mapper from launch through end-of-mission. It is the primary reference for flight operators and the GUARDIAN mission control AI.

---

## 2. Mission Phases

### 2.1 LEOP (Launch and Early Operations) — Weeks 1–4

**Objectives:**
- Acquire first signal after separation
- Perform initial detumbling via magnetorquers
- Establish nominal attitude control
- Commission all subsystems
- Perform lunar trajectory correction maneuvers (TCMs)

**Key Events:**
| Event | Target Time | Success Criteria |
|-------|------------|------------------|
| Separation | T+0 | Clean separation confirmed |
| First signal | T+15 min | UHF beacon received |
| Detumbling complete | T+2 hours | Attitude rate <0.1 °/s |
| Solar array deploy | T+4 hours | Power positive confirmed |
| S-band commissioning | T+24 hours | Downlink at 32 kbps |
| Trajectory assessment | T+72 hours | TCM-1 executed if required |

### 2.2 Lunar Transfer — Weeks 4–16

- Ballistic Lunar Transfer (BLT) ~3-4 month flight time
- Weekly ground contacts for telemetry and trajectory updates
- Trajectory correction maneuvers as required
- Instrument health checks during transfer

### 2.3 Lunar Orbit Insertion (LOI)

- Propulsion burn (if hydrazine thruster equipped) or rely on BLT natural capture
- Target: ~100 km circular polar orbit
- Backup LOI opportunity within 72 hours

### 2.4 Commissioning — 2 Weeks Post-LOI

- Full instrument checkout: NS and NIR-CAM
- Science mode verification
- Ground track validation for ≥80% PSR coverage
- Nominal contact schedule established

### 2.5 Science Operations — Primary Mission (6–12 months)

**Daily Schedule Template:**
```
00:00–08:00  Science collection (NS + NIR-CAM over PSRs)
08:00–09:00  Housekeeping telemetry only
09:00–11:00  Ground contact window (downlink science data)
11:00–12:00  Command uplink (next-orbit science schedule)
12:00–24:00  Science collection continues
```

**Pass Planning:**
- PIONEER generates daily contact schedules
- Minimum 2 contacts/day over participating ground stations
- Priority downlink: science data > housekeeping > engineering logs

---

## 3. Spacecraft Modes

| Mode | Description | Entry Condition |
|------|-------------|----------------|
| BOOT | Post-reset initialization | Power-on / watchdog reset |
| DETUMBLE | Magnetorquer rate reduction | LEOP or anomaly recovery |
| SAFE | Minimum power, Earth-pointing | Critical anomaly detected |
| NOMINAL | Full subsystem operation | Commissioning complete |
| SCIENCE | Instruments active | Nominal + over PSR |
| DOWNLINK | High-rate S-band transmission | Ground contact window |
| ECLIPSE | Low-power, battery management | Lunar shadow entry |

---

## 4. Anomaly Response

### 4.1 Autonomous Response (GUARDIAN)

GUARDIAN monitors all telemetry in real-time and autonomously responds to:
- Power system undervoltage → enter ECLIPSE mode
- ADCS pointing error >5° → momentum dump, re-point
- OBC temperature >55°C → reduce power draw, alert ground
- Comms loss >24 hours → enter SAFE mode, broadcast beacon
- Watchdog reset → BOOT sequence, anomaly log entry

### 4.2 Escalation to Ground
- Any critical anomaly → immediate notification to operations team
- Unresolved anomaly after 2 autonomous recovery attempts → safemode + ground intervention

---

## 5. Ground Station Network

| Station | Location | Band | Aperture | Contact/Day |
|---------|----------|------|----------|-------------|
| Primary | TBD (Indonesia) | S + UHF | ≥5 m | 2–3 |
| Secondary 1 | NASA DSN (via agreement) | S-band | 34 m | As available |
| Secondary 2 | SatNOGS network | UHF | 1–3 m | 3–5 |

---

## 6. Science Data Management

- Raw data downlinked as CCSDS packets → ground station depacketizer
- Forwarded to ANALYTICA data processing pipeline
- Level-0 → Level-1 → Level-2 → Level-3 products
- Level-3 (ice abundance maps) archived to NASA PDS within 6 months of collection

---

*Luna Ice Mapper — LIM-OPS-MOM-001 v0.1 DRAFT — 2026-06-03*  
*Owned by PIONEER (Mission Operations Agent)*
