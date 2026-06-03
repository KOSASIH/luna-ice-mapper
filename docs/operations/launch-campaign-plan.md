# Launch Campaign Plan — Luna Ice Mapper (6U CubeSat)
## Document: docs/operations/launch-campaign-plan.md
**Version:** 0.1 (STUB) | **Status:** Phase 1 Draft | **Author:** STELLARIS — Launch Operations Lead
**Date:** 2026-06-03 | **Mission:** Luna Ice Mapper — Lunar South Polar Water-Ice Mapping

---

## 1. Purpose

This document defines the pre-launch campaign timeline, ship-to-site checklist, and launch day operations procedure for Luna Ice Mapper. It is a living document — specifics (provider ICD, facility procedures) are to be finalized once a launch provider is selected (target: Q2 2027).

---

## 2. Campaign Phases Overview

```
L−24 months ──── Provider Selection & ICD Initiation
L−18 months ──── Frequency Coordination Filed
L−12 months ──── Mass Properties & Preliminary ICD Signed
L− 9 months ──── Environmental Test Campaign Complete
L− 6 months ──── Spacecraft CDR / Pre-Ship Review
L− 3 months ──── Ship to Integration Facility
L− 2 months ──── Spacecraft-to-Dispenser Integration
L− 3 weeks  ──── Dispenser-to-LV Integration
L− 1 week   ──── Launch Readiness Review (LRR)
L− 2 days   ──── Spacecraft Battery Charge Check
L− 1 day    ──── Final Inhibit Verification
L + 0       ──── LAUNCH
L + 30 min  ──── RF Inhibit Release / First Contact Attempt
L + 24 hrs  ──── Early Operations Review
L + 30 days ──── LEOP Complete / Cruise Phase Begin
```

---

## 3. Pre-Launch Campaign Timeline

### 3.1 Phase A: Provider & Interface (L−24 to L−18 months)

| # | Activity | Owner | Duration | Exit Criterion |
|---|----------|-------|----------|----------------|
| A1 | Execute launch provider selection (CSLI/CLPS application or commercial contract) | STELLARIS + Mission PI | 2 weeks | Signed launch agreement |
| A2 | Initiate Launch Vehicle ICD negotiation | STELLARIS | 4 weeks | Draft ICD v0.1 issued |
| A3 | File ITU frequency coordination via MCMC/Kominfo Indonesia | Mission PI + RF team | Ongoing | Filing acknowledgment received |
| A4 | Establish launch site POC and integration schedule | STELLARIS | 2 weeks | Contact list and schedule stub |
| A5 | Complete range safety documentation package (initial) | STELLARIS | 4 weeks | Range Safety Initial Submission |

### 3.2 Phase B: Design Lock & Environmental Test (L−18 to L−9 months)

| # | Activity | Owner | Duration | Exit Criterion |
|---|----------|-------|----------|----------------|
| B1 | Finalize spacecraft mass properties (mass, CoM, MOI) | Structures team | 2 weeks | Mass report released |
| B2 | Complete vibration acceptance test (GEVS Level I) | Spacecraft team | 3 weeks | Test report approved |
| B3 | Complete acoustic test or analysis (GEVS Level I) | Spacecraft team | 2 weeks | Test report approved |
| B4 | Complete EMC / radiated emissions test | RF team | 2 weeks | EMC report approved |
| B5 | Complete vacuum bake-out | ATLAS (thermal) | 1 week | TML / CVCM within limits |
| B6 | Complete thermal vacuum test | ATLAS | 2 weeks | TV/TC test report |
| B7 | Finalize and sign LV ICD | STELLARIS + LV | 4 weeks | ICD Rev A signed |

### 3.3 Phase C: Pre-Ship Readiness (L−9 to L−3 months)

| # | Activity | Owner | Duration | Exit Criterion |
|---|----------|-------|----------|----------------|
| C1 | Conduct Pre-Ship Review (PSR) | Mission Systems Engineer | 1 day | PSR action items closed |
| C2 | Final functional test (full operational mode) | CODEX + PIONEER | 3 days | All modes nominal |
| C3 | Final software upload and verification | CODEX | 2 days | Flight software v1.0 verified |
| C4 | Battery charge to 80% SOC | EPS team | 1 day | SOC verified |
| C5 | Install all inhibit plugs (RF + pyro) | Spacecraft team | 1 day | Inhibit verification complete |
| C6 | Configure spacecraft for transport (stowed, clean, bagged) | Spacecraft team | 1 day | Transport configuration approved |

---

## 4. Ship-to-Site Checklist (Stub)

### 4.1 Pre-Shipment (T−3 days before shipping)

- [ ] Pre-Ship Review completed and all actions closed
- [ ] Spacecraft in stowed/inhibited configuration
- [ ] All Remove-Before-Flight (RBF) pins installed and tagged
- [ ] RF inhibit verified: ≥ 2 hardware inhibits confirmed by RF lead
- [ ] Battery SOC 80% confirmed; charging equipment removed
- [ ] Optical surfaces protected with covers
- [ ] Export control / ITAR clearance documentation signed (if applicable)
- [ ] Shipping container inspected (drop sensors, humidity indicators installed)
- [ ] Vibration data logger installed in shipping container
- [ ] Manifest and customs documentation prepared
- [ ] Insurance coverage confirmed

### 4.2 Shipping

- [ ] Container sealed and security-tagged
- [ ] Chain of custody documentation signed
- [ ] Tracking information distributed to STELLARIS + Mission PI
- [ ] Escort officer assigned (if required by launch authority)
- [ ] Emergency contact list provided to shipper

### 4.3 Arrival at Integration Facility

- [ ] Container inspection on arrival (damage check, drop sensor status, humidity indicator)
- [ ] Receive spacecraft in cleanroom (ISO Class 8 minimum)
- [ ] Post-transport functional test (power-on, health check)
- [ ] Review vibration log — escalate if any G-event exceeded transport limit
- [ ] Confirm RBF pins still installed
- [ ] Submit arrival report to launch authority

---

## 5. Integration Activities (L−60 to L−21 days)

| # | Activity | Owner | Duration |
|---|----------|-------|----------|
| I1 | Spacecraft functional test at integration facility | Spacecraft team | 2 days |
| I2 | Interface verification with CubeSat dispenser (fit-check) | STELLARIS + LV team | 1 day |
| I3 | Spacecraft-to-dispenser integration | STELLARIS + LV team | 1 day |
| I4 | Dispenser electrical interface verification (if active deployer) | Spacecraft team + LV | 1 day |
| I5 | Dispenser fit-check to launch vehicle (or ESPA ring) | LV team (STELLARIS witness) | 1 day |
| I6 | Dispenser-to-LV integration | LV team (STELLARIS witness) | 1 day |
| I7 | Combined system RF compatibility check | RF team + Range Safety | 1 day |
| I8 | Final pre-launch functional test (health check only) | Spacecraft team | 4 hours |

---

## 6. Launch Readiness Review (LRR) — L−7 days

### Go/No-Go Criteria

| Criterion | Go Condition |
|-----------|-------------|
| Spacecraft health | All subsystems nominal; no critical open anomalies |
| RF inhibits | All inhibits verified; range safety approved |
| Integration complete | All fit-checks and torques verified and recorded |
| Frequency coordination | Launch site frequency deconfliction confirmed |
| Range safety | Approval letter in hand |
| Environmental data | All environmental test reports reviewed and accepted |
| Mission ops readiness | PIONEER: ground station contacts scheduled; ops team trained |
| Battery SOC | ≥ 70% at T−24 hours predicted |

---

## 7. Launch Day Countdown (Outline)

| T-Time | Activity |
|--------|----------|
| T−24 h | Final battery SOC check |
| T−12 h | Fairing close — last access window |
| T− 6 h | Range clears all non-essential personnel |
| T− 2 h | Launch vehicle fueling (LV team only) |
| T−30 min | Spacecraft team monitoring from Mission Ops |
| T− 0 | LAUNCH |
| T+30 min | RF inhibit release (deployment separation + 30 min) |
| T+45 min | First pass contact attempt via primary ground station |
| T+ 2 h | Initial housekeeping telemetry review |
| T+ 6 h | Early Operations first team standup |
| T+24 h | Early Operations Review — anomaly assessment |

---

## 8. Post-Launch Early Operations (L+1 to L+30 days)

| Phase | Duration | Key Activity | Owner |
|-------|----------|--------------|-------|
| Initial Acquisition | L+0 to L+3 days | Beacon acquisition, UHF/S-band comms established | PIONEER + ops team |
| Subsystem Checkout | L+3 to L+14 days | ADCS detumble, EPS commissioning, payload health check | All subsystems |
| Trajectory Correction | L+14 to L+30 days | TCM-1 maneuver execution (if BLT) | PIONEER + ORBITRON |
| LEOP Complete | L+30 days | All subsystems nominal; cruise phase begins | Mission PI |

For detailed LEOP procedures see: `docs/operations/leop-procedures.md` (PIONEER — in progress)

---

## 9. Key Contacts (TBD — to be populated after provider selection)

| Role | Name | Organization | Contact |
|------|------|-------------|--------|
| Mission PI | TBD | KOSASIH / Luna Ice Mapper | — |
| STELLARIS (Launch Ops Lead) | — | Luna Ice Mapper | — |
| Launch Vehicle POC | TBD | LV Provider | — |
| Range Safety Officer | TBD | Launch Range | — |
| MCMC Frequency Coordinator | TBD | Kominfo Indonesia | — |
| BRIN liaison | TBD | BRIN / LAPAN | — |

---

## 10. Open Items

| ID | Description | Owner | Due |
|----|-------------|-------|-----|
| OP-01 | Populate contacts table after provider selection | STELLARIS | Q2 2027 |
| OP-02 | Finalize integration facility location | STELLARIS | Q4 2026 |
| OP-03 | Define export control requirements (ITAR/EAR) | Mission PI + Legal | Q3 2026 |
| OP-04 | Confirm LEOP ops team roster | PIONEER | Q1 2027 |

---
*Document status: PHASE-1 STUB. To be expanded after launch provider selection (target Q2 2027). All dates are relative to launch (L-day); absolute dates TBD.*
