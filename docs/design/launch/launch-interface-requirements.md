# Launch Interface Requirements — Luna Ice Mapper (6U CubeSat)
## Document: docs/design/launch/launch-interface-requirements.md
**Version:** 1.0 | **Status:** Phase 1 Draft | **Author:** STELLARIS — Launch Operations Lead
**Date:** 2026-06-03 | **Mission:** Luna Ice Mapper — Lunar South Polar Water-Ice Mapping
**Applicable Standard:** NASA-STD-8729.1, GEVS-SE, CubeSat Design Specification Rev 14

---

## 1. Purpose and Scope

This document defines the interface requirements between the Luna Ice Mapper 6U CubeSat and its launch vehicle / dispenser system. Requirements are structured across mechanical, electrical, RF/frequency, environments, and programmatic domains.

**Spacecraft configuration:** 6U CubeSat (3U × 2U stacked), 100 × 226 × 366 mm, mass ≤ 14 kg deployed.

---

## 2. Applicable Documents

| ID | Document | Source |
|----|----------|--------|
| AD-01 | CubeSat Design Specification (CDS), Rev 14 | Cal Poly SLO |
| AD-02 | NASA GEVS, GSFC-STD-7000B | NASA GSFC |
| AD-03 | NASA Payload Safety Policy, NPR 8715.3C | NASA HQ |
| AD-04 | CSLI CubeSat Requirements, NP-2019-03-2724-HQ | NASA |
| AD-05 | Rocket Lab CubeSat Dispenser ICD (if applicable) | Rocket Lab |
| AD-06 | Intuitive Machines Secondary Payload ICD, IM-ICD-0042 | IM |
| AD-07 | Firefly Blue Ghost Payload User Guide | Firefly |
| AD-08 | SpaceFlight Inc. SHERPA-LTE2 ICD | SpaceFlight Inc. |
| AD-09 | ESPA Ring ICD, GSFC 21-ESPA-07 | NASA GSFC |
| AD-10 | Range Safety Requirements, AFSPCMAN 91-710 | USSF |

---

## 3. Mechanical Interface Requirements

### 3.1 Form Factor and Envelope

| Req ID | Requirement | Threshold | Objective | Verification |
|--------|-------------|-----------|-----------|-------------|
| MECH-01 | Spacecraft unit form factor SHALL be 6U per CDS Rev 14 | 6U (100 × 226 × 366.3 mm) | — | Dimensional inspection |
| MECH-02 | Deployed mass SHALL NOT exceed dispenser rated capacity | ≤ 14 kg | ≤ 12 kg | Mass measurement |
| MECH-03 | Center of mass (CoM) SHALL be within ±2 mm of geometric center in XY plane | ±2 mm | ±1 mm | CoM measurement |
| MECH-04 | CoM in Z-axis (deployment axis) SHALL be within dispenser tolerance | Per dispenser ICD | — | CoM measurement |
| MECH-05 | All deployables SHALL be restrained in stowed config | Zero free components | — | Inspection |
| MECH-06 | Spacecraft SHALL withstand launch quasi-static loads without permanent deformation | 40 g (lateral) / 25 g (axial) | 50 g / 30 g | Analysis + test |
| MECH-07 | Random vibration durability SHALL meet GEVS Level I minimum | GEVS Table 2.4-1 | +3 dB margin | Vibration test |
| MECH-08 | Acoustic environment SHALL be survived at GEVS composite levels | GEVS Table 2.6-1 | — | Acoustic test or analysis |
| MECH-09 | Shock response at separation event SHALL be withstood | 3,000 g, 3 ms half-sine | — | Shock test or analysis |
| MECH-10 | Spacecraft SHALL NOT exceed 6U envelope during all phases pre-deployment | 0 mm protrusion | — | Dimensional inspection |

### 3.2 Separation System

| Req ID | Requirement | Notes |
|--------|-------------|-------|
| MECH-11 | Separation system SHALL be a passive spring-loaded 6U CubeSat Deployer (P-POD, ISIPod, or equivalent) | Spring ΔV: 0.3–1.5 m/s |
| MECH-12 | Separation electrical inhibit (hardware) SHALL be engaged during all ground operations | Remove-Before-Flight pin |
| MECH-13 | Separation spring contact surfaces SHALL use passivated stainless steel rails | Prevent galling |
| MECH-14 | Spacecraft SHALL deploy with zero tumble rate exceeding 5°/s at separation | For ADCS acquisition |
| MECH-15 | Spring ejection force SHALL be documented in ICD | Required for ADCS detumble budget |

### 3.3 Structural Design Values (Derived)

- **Fundamental frequency (stowed):** ≥ 90 Hz (lateral), ≥ 140 Hz (axial)
- **Positive structural margins (Ultimate):** ≥ 0.25 all fasteners, joints, primary structure
- **Factor of Safety:** 2.0 on yield (qualification); 1.4 on yield (acceptance per GEVS)

---

## 4. Electrical Interface Requirements

### 4.1 Power

| Req ID | Requirement | Value | Verification |
|--------|-------------|-------|-------------|
| ELEC-01 | Spacecraft SHALL be battery-powered during launch with shore power inhibited | N/A (no umbilical) | Inspection |
| ELEC-02 | Battery charge state at launch integration SHALL be ≥ 80% SOC | ≥ 80% SOC | Measurement |
| ELEC-03 | Battery SHALL meet range safety requirements for sealed cells | Per AD-10 | Test + analysis |
| ELEC-04 | All circuits SHALL be inhibited until deployment via ≥ 2 hardware inhibits | ≥ 2 inhibits on RF transmitter | Inspection + test |
| ELEC-05 | EMI SHALL comply with MIL-STD-461G applicable limits | CE102, RE102 | EMC test |

### 4.2 Grounding and Bonding

| Req ID | Requirement |
|--------|-------------|
| ELEC-06 | Spacecraft chassis bond resistance to P-POD dispenser SHALL be ≤ 2.5 Ω |
| ELEC-07 | Single-point ground architecture SHALL be used; chassis floating ground prohibited |
| ELEC-08 | All connector shells SHALL be bonded to chassis |

### 4.3 Deployment Signal (if active deployer)

| Req ID | Requirement |
|--------|-------------|
| ELEC-09 | Spacecraft SHALL accept 28 VDC ±4 V deployment signal via M83513-compliant connector |
| ELEC-10 | Deployment circuit SHALL include EMI filter (low-pass, 1 MHz cutoff) on signal line |
| ELEC-11 | Deployment circuit SHALL have ≥ 1 Ω safe/arm resistor in series |

---

## 5. RF and Frequency Coordination Requirements

### 5.1 Frequency Allocation

| Band | Use | Frequency (Candidate) | Regulatory Body | Status |
|------|-----|-----------------------|-----------------|--------|
| S-band (downlink) | Science + HK telemetry | 2.4–2.45 GHz | ITU, MCMC Indonesia | TBD |
| UHF (uplink/downlink) | Telecommand + beacon | 437–438 MHz | ITU, IARU | TBD |
| S-band (uplink) | Telecommand | 2.025–2.110 GHz | ITU Space Operations | TBD |

**Action Required:** Initiate ITU frequency coordination via MCMC/Kominfo by **Q4 2026** (18–24 month lead time).

### 5.2 RF Inhibit Requirements

| Req ID | Requirement |
|--------|-------------|
| RF-01 | All RF transmitters SHALL be inhibited by ≥ 2 independent hardware inhibits during launch processing and until 30 minutes post-separation |
| RF-02 | RF inhibit circuit SHALL be verified by range safety prior to battery integration |
| RF-03 | Spacecraft beacon SHALL use a frequency pre-approved by range safety |
| RF-04 | EIRP SHALL NOT exceed launch vehicle ICD limit prior to deployment |
| RF-05 | Onboard oscillator accuracy SHALL be ≤ ±20 ppm over −40 to +85°C |

### 5.3 EMC and Link Budget

| Req ID | Requirement |
|--------|-------------|
| RF-06 | Spacecraft SHALL pass radiated emissions test at GEVS Level I prior to integration |
| RF-07 | RF system SHALL achieve minimum 20 dB link margin at 100 km lunar orbit using ≥ 9 m aperture ground station |

---

## 6. Thermal and Environmental Requirements

### 6.1 Launch Thermal Environments

| Phase | Temperature Range | Duration |
|-------|------------------|---------|
| Transportation | −20°C to +50°C | Up to 72 h |
| Storage (integration facility) | +15°C to +30°C | Up to 180 days |
| Launch vehicle fairing (pre-launch) | +5°C to +40°C | T-12 h to T-0 |
| Ascent (fairing closed) | −50°C to +80°C (external) | 0 to SECO |
| On-orbit initial (post-separation) | −80°C to +120°C (external) | First orbit |

### 6.2 Outgassing and Contamination

| Req ID | Requirement |
|--------|-------------|
| ENV-01 | All materials exposed to vacuum SHALL meet NASA GSFC outgassing: TML ≤ 1.0%, CVCM ≤ 0.1% |
| ENV-02 | Spacecraft SHALL complete vacuum bake-out prior to launch vehicle integration |
| ENV-03 | All structural cavities SHALL vent freely per CDS Rev 14 |
| ENV-04 | Optical surfaces SHALL be protected to Class 300A (MIL-STD-1246D) |
| ENV-05 | Integration SHALL be conducted in minimum ISO Class 8 cleanroom |
| ENV-06 | Planetary protection compliance (COSPAR Category II) SHALL be maintained |

---

## 7. Software and Data Interface Requirements

| Req ID | Requirement |
|--------|-------------|
| SW-01 | GSE interface SHALL support USB 3.0 or Ethernet for pre-launch functional testing |
| SW-02 | Spacecraft command/telemetry protocol SHALL be CCSDS Packet Telemetry (ECSS-E-ST-70-41C) |
| SW-03 | GSE software SHALL provide launch rehearsal mode with RF inhibit engaged |
| SW-04 | All test data from launch campaign SHALL be archived per CODEX data management plan |

---

## 8. Launch Readiness Review Deliverables

| Deliverable | Owner | Deadline |
|------------|-------|----------|
| LV ICD (signed) | STELLARIS + LV | L−18 months |
| Mass Properties Report | Spacecraft team | L−12 months |
| Vibration Test Report | Spacecraft team | L−9 months |
| EMC Test Report | Spacecraft team | L−9 months |
| Frequency Coordination Letter | Mission PI + MCMC | L−12 months |
| Battery Safety Data Sheet | EPS team | L−6 months |
| Range Safety Approval | STELLARIS | L−3 months |
| Launch Site Ops Plan | STELLARIS | L−6 months |

---

## 9. Requirements Summary

| Category | Total | TBD | TBC |
|----------|-------|-----|-----|
| Mechanical | 15 | 0 | 2 |
| Electrical | 11 | 2 | 1 |
| RF/Frequency | 7 | 3 | 1 |
| Thermal/Environmental | 6 | 0 | 0 |
| Software/Data | 4 | 0 | 0 |
| **Total** | **43** | **5** | **4** |

---

## 10. Open Items

| ID | Description | Owner | Due |
|----|-------------|-------|-----|
| TBD-01 | Final frequency selection — S-band vs UHF primary downlink | RF team / MCMC | Q4 2026 |
| TBD-02 | Active vs passive deployer selection (launcher-dependent) | STELLARIS | Q1 2027 |
| TBD-03 | Planetary protection category confirmation with NASA OPAG | Mission PI | Q3 2026 |
| TBD-04 | Shock qualification approach — test vs analysis | Structures team | Q4 2026 |
| TBC-01 | CLPS lander deployment altitude / timing (pre-LOI or post-LOI) | CLPS provider | Per ICD |

---
*Document status: PHASE-1 DRAFT. Requires review by Mission Systems Engineer, RF lead, and Structures lead prior to release.*
