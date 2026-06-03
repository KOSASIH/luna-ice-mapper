# Master Test & Verification Plan

**Document ID:** LIM-TST-MVP-001  
**Version:** 0.1 (DRAFT)  
**Status:** IN PROGRESS  
**Date:** 2026-06-03  
**Prepared by:** VERITAS (QA Engineer)

---

## 1. Introduction

This document defines the master test and verification strategy for the Luna Ice Mapper 6U CubeSat mission. It covers all test levels from unit testing through system-level environmental qualification.

---

## 2. Verification Methods

| Method | Code | Description |
|--------|------|-------------|
| Analysis | A | Mathematical / simulation verification |
| Inspection | I | Visual / documentation review |
| Demonstration | D | Functional operation observed |
| Test | T | Quantitative measurement against requirement |

---

## 3. Test Levels

### 3.1 Unit Testing
- **Scope:** Individual software modules; individual PCB assemblies
- **Responsible:** CODEX (FSW), VERITAS (hardware)
- **Pass Criteria:** 95% MC/DC coverage for flight-critical; 85% line for data processing
- **Tools:** pytest, CUnit, gcov, ctest

### 3.2 Integration Testing
- **Scope:** Subsystem-to-subsystem interfaces (EPS↔OBC, OBC↔Payload, etc.)
- **Responsible:** NEXUS + VERITAS
- **Pass Criteria:** All ICD-specified interface parameters within tolerance
- **Environment:** Flat-sat testbed

### 3.3 System Functional Testing
- **Scope:** Full spacecraft in ambient conditions
- **Responsible:** VERITAS + PIONEER
- **Pass Criteria:** All MRs verified in functional test

### 3.4 Environmental Qualification
- **Scope:** Full flight model
- **Responsible:** VERITAS + STELLARIS

| Test | Standard | Levels | Duration |
|------|----------|--------|---------|
| Random Vibration | GEVS-7000A Table 2-IV | Qual: +6 dB over acceptance | 3×2 min/axis |
| Acoustic | GEVS-7000A | Per launch vehicle spec | TBD |
| Thermal Vacuum Cycling | GEVS-7000A | -30°C to +60°C, 8 cycles | ~5 days |
| Thermal Balance | GEVS-7000A | Hot and cold cases | ~3 days |
| EMI/EMC | MIL-STD-461 | Per CSLI requirements | TBD |
| Shock | GEVS-7000A | Per separation system | TBD |

---

## 4. Software Verification

### 4.1 Coverage Requirements

| Component | Minimum Coverage | Method |
|-----------|------------------|--------|
| Flight software (cFS apps) | 95% MC/DC | gcov + manual review |
| Data processing pipeline | 85% line | pytest-cov |
| Ground station backend | 80% line | pytest-cov |
| Ground station UI | 70% line | Jest |

### 4.2 Static Analysis
- **C/C++:** Coverity, PC-lint, clang-tidy (MISRA-C profile)
- **Python:** pylint, mypy (type checking), bandit (security)
- **CI enforcement:** All PRs must pass linting gates

### 4.3 Regression Testing
- All merges to `main` trigger full regression suite
- Nightly builds with extended integration test suite
- Hardware-in-the-loop (HIL) testing on flat-sat from Month 16

---

## 5. Instrument Verification

### 5.1 Neutron Spectrometer
| Test | Method | Acceptance Criteria |
|------|--------|---------------------|
| Functional response | D | Counts detected from Cf-252 source |
| Energy calibration | T | Thermal peak within ±5% of reference |
| Sensitivity | T | H₂O detection ≤100 ppm equivalent |
| Power consumption | T | ≤3 W during nominal ops |

### 5.2 NIR Camera
| Test | Method | Acceptance Criteria |
|------|--------|---------------------|
| Spectral range | T | Response 1.0–2.5 μm confirmed |
| H₂O band detection | T | 1.4, 1.9, 2.7 μm bands resolved |
| Spatial resolution | A+T | ≤500 m/pixel at 100 km altitude |
| Dark current | T | Within specification at -20°C |

---

## 6. Anomaly Tracking

All test anomalies are tracked in GitHub Issues with labels:
- `anomaly:critical` — mission-impacting; blocks milestone closure
- `anomaly:major` — functional degradation; requires disposition
- `anomaly:minor` — non-critical; dispositioned before delivery

---

## 7. Milestone Test Gates

| Milestone | Required Test Status |
|-----------|---------------------|
| PDR (Month 9) | Unit test framework established; initial coverage baselines |
| CDR (Month 15) | All subsystem ICDs verified; software unit tests passing |
| FM Integration (Month 21) | System functional test complete; zero open critical anomalies |
| TVC Complete (Month 24) | All environmental tests passed; delta-qual documented |
| Launch (Month 27) | All verifications closed; Launch Readiness Review passed |

---

*Luna Ice Mapper — LIM-TST-MVP-001 v0.1 DRAFT — 2026-06-03*  
*Owned by VERITAS (QA Agent)*
