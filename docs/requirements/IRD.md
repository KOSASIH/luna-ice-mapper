# Initial Requirements Document (IRD)

**Document ID:** LIM-REQ-IRD-001  
**Version:** 1.0  
**Status:** BASELINED  
**Date:** 2026-06-03  
**Prepared by:** NEXUS (Chief Systems Engineer)  
**Reviewed by:** AURA (Project Director)

---

## 1. Introduction

### 1.1 Purpose
This IRD establishes the top-level mission and system requirements for Luna Ice Mapper. It serves as the requirements baseline for the Preliminary Design Review (PDR) and all subsequent design activities.

### 1.2 Applicable Documents
- LIM-MGMT-CHR-001: Project Charter
- NASA NPR 7120.5F: Space Flight Program and Project Management Requirements
- COSPAR Planetary Protection Policy (Category II: Moon)
- NASA CubeSat Launch Initiative (CSLI) requirements
- ITU Radio Regulations (UHF/S-band allocations)
- NASA-STD-7009: Standard for Models and Simulations
- GEVS-7000A: General Environmental Verification Standard

---

## 2. Mission Requirements

| ID | Requirement | Priority | Verification |
|----|-------------|----------|--------------|
| MR-001 | The spacecraft shall achieve and maintain a polar lunar orbit within 50–150 km altitude | SHALL | Analysis + Test |
| MR-002 | The mission shall map ≥80% of the lunar south polar region (below 80°S) | SHALL | Analysis |
| MR-003 | The mission shall detect hydrogen-bearing compounds using the Neutron Spectrometer | SHALL | Demonstration |
| MR-004 | The mission shall image lunar surface in the 1.0–2.5 μm spectral range | SHALL | Test |
| MR-005 | All science data shall be downlinked within 30 days of collection | SHALL | Inspection |
| MR-006 | Primary mission shall operate ≥6 months after lunar orbit insertion | SHALL | Analysis |
| MR-007 | All mission data shall be archived in NASA PDS-compatible format | SHALL | Inspection |
| MR-101 | Orbital inclination shall be ≥85° (near-polar) | SHALL | Analysis |
| MR-102 | Ground track repeat cycle shall allow ≥80% PSR coverage | SHALL | Analysis |
| MR-103 | Data downlink rate shall support ≥8 GB volume over mission lifetime | SHALL | Analysis |

---

## 3. Spacecraft Bus Requirements

### 3.1 Physical
| ID | Requirement |
|----|-------------|
| BUS-001 | Spacecraft form factor: 6U CubeSat (10 × 20 × 30 cm ± 0.1 mm) |
| BUS-002 | Total wet mass ≤ 14 kg |
| BUS-003 | Center of mass within ±2 cm of geometric center per axis |

### 3.2 Power
| ID | Requirement |
|----|-------------|
| PWR-001 | Solar array: ≥30 W average at 1 AU |
| PWR-002 | Battery: ≥40 Whr usable capacity |
| PWR-003 | Survive eclipse periods up to 45 minutes |
| PWR-004 | Regulated 3.3V, 5V, and 12V power buses |
| PWR-005 | Over-current protection on all power lines |

### 3.3 Attitude Control
| ID | Requirement |
|----|-------------|
| ADCS-001 | 3-axis attitude stabilization |
| ADCS-002 | Pointing accuracy < 3° (3σ) |
| ADCS-003 | Pointing knowledge < 1° (3σ) |
| ADCS-004 | Slew rate ≥ 10°/min |
| ADCS-005 | Reaction wheels on ≥3 orthogonal axes |
| ADCS-006 | Magnetorquers for momentum dumping |

### 3.4 Thermal
| ID | Requirement |
|----|-------------|
| THM-001 | All components operate nominally -20°C to +50°C |
| THM-002 | Battery maintained above -5°C at all times |
| THM-003 | Survive non-operating temperatures: -40°C to +60°C |
| THM-004 | No active cooling required |
| THM-005 | NS maintained below +25°C during science operations |

### 3.5 Structure
| ID | Requirement |
|----|-------------|
| STR-001 | Withstand launch vibration per GEVS-7000A |
| STR-002 | Fundamental frequency: >50 Hz lateral, >90 Hz axial |
| STR-003 | Survive quasi-static loads of ±20 g |
| STR-004 | All materials space-qualified or equivalent |

---

## 4. Payload Requirements

### 4.1 Neutron Spectrometer (NS)
| ID | Requirement |
|----|-------------|
| NS-001 | Detect thermal neutrons: 0.025 eV – 0.5 eV |
| NS-002 | Detect epithermal neutrons: 0.5 eV – 500 keV |
| NS-003 | H₂O detection sensitivity ≤100 ppm equivalent |
| NS-004 | Mass ≤ 1.5 kg |
| NS-005 | Power ≤ 3 W average |
| NS-006 | Raw event counts with timestamp accuracy ≤1 ms |
| NS-007 | Polyethylene neutron moderator included |

### 4.2 NIR Camera (NIR-CAM)
| ID | Requirement |
|----|-------------|
| NIR-001 | Spectral range: 1.0–2.5 μm |
| NIR-002 | Detect H₂O absorption at 1.4 μm, 1.9 μm, 2.7 μm |
| NIR-003 | Spatial resolution ≤500 m/pixel at 100 km altitude |
| NIR-004 | Spectral resolution ≤20 nm FWHM |
| NIR-005 | InGaAs FPA detector, minimum 256×256 pixels |
| NIR-006 | Mass ≤ 1.2 kg |
| NIR-007 | Power ≤ 2.5 W during imaging |
| NIR-008 | Onboard dark/flat-field calibration capability |

---

## 5. Communications Requirements

| ID | Requirement |
|----|-------------|
| COM-001 | Uplink: UHF (400 MHz ±5 MHz) at ≥9.6 kbps |
| COM-002 | Downlink: S-band (2.2–2.3 GHz) ≥32 kbps at lunar distance |
| COM-003 | Downlink ≥256 kbps within Earth-Moon transfer distance |
| COM-004 | On-board storage: ≥8 GB |
| COM-005 | Store-and-forward operations supported |
| COM-006 | All uplink commands authenticated (CCSDS standard) |
| COM-007 | Downlink FEC (Reed-Solomon or LDPC), BER ≤ 10⁻⁶ |
| COM-008 | ≥2 ground station contacts per day |

---

## 6. Flight Software Requirements

| ID | Requirement |
|----|-------------|
| FSW-001 | Based on NASA cFS (core Flight System) framework |
| FSW-002 | CCSDS packet telemetry and telecommand standards |
| FSW-003 | Watchdog timer resets OBC on software hang |
| FSW-004 | Autonomous safemode entry on critical anomaly |
| FSW-005 | Flight-critical software: ≥95% MC/DC coverage |
| FSW-006 | All commands and anomalies logged with timestamps |
| FSW-007 | Time sync accuracy ≤1 second |
| FSW-008 | Over-the-air (OTA) patch capability |

---

## 7. Ground Segment Requirements

| ID | Requirement |
|----|-------------|
| GND-001 | S-band receive capability (≥5 m dish recommended) |
| GND-002 | Real-time spacecraft telemetry display |
| GND-003 | Command sequence generation and upload |
| GND-004 | Raw and processed science data archiving |
| GND-005 | ≥2 passes/day scheduling support |
| GND-006 | Data latency downlink-to-archive ≤24 hours |

---

## 8. Environmental Requirements

| ID | Requirement |
|----|-------------|
| ENV-001 | Survive launch acoustic levels per GEVS-7000A |
| ENV-002 | TID ≥10 krad (Si) behind 2.5 mm Al shielding |
| ENV-003 | SEU resilience: EDAC for all RAM |
| ENV-004 | Materials: NASA outgassing standard ASTM E595 |
| ENV-005 | COSPAR Planetary Protection Category II compliance |

---

## 9. Requirements Baseline Summary

| Category | Count | Status |
|----------|-------|--------|
| Mission | 10 | Baselined |
| Spacecraft Bus | 18 | Baselined |
| Payload | 15 | Baselined |
| Communications | 8 | Baselined |
| Flight Software | 8 | Baselined |
| Ground Segment | 6 | Baselined |
| Environmental | 5 | Baselined |
| **Total** | **70** | **v1.0 Baseline** |

---

*Luna Ice Mapper — LIM-REQ-IRD-001 v1.0 — 2026-06-03*
