# Luna Ice Mapper — Project Charter

**Document ID:** LIM-MGMT-CHR-001  
**Version:** 1.0  
**Status:** APPROVED  
**Date:** 2026-06-03  
**Classification:** Public

---

## 1. Project Identification

| Field | Value |
|-------|-------|
| **Project Name** | Luna Ice Mapper |
| **Mission Type** | 6U CubeSat Scientific Mission |
| **Project Code** | LIM-2027 |
| **Lead Organization** | KOSASIH Research & Innovation |
| **Partner Agency** | NASA (via CubeSat Launch Initiative) |
| **Target** | Moon — South Polar Region (PSRs) |
| **Launch Target** | Q4 2027 – Q2 2028 |
| **Mission Duration** | 6–12 months (extendable to 24 months) |
| **Total Budget** | USD $3,852,500 |
| **Repository** | https://github.com/KOSASIH/luna-ice-mapper |

---

## 2. Vision & Mission

### 2.1 Vision Statement
> *"To establish Indonesia as a key contributor in global lunar exploration by advancing scientific understanding of water resources on the Moon, thereby supporting sustainable human presence beyond Earth."*

### 2.2 Mission Statement
> *"To map and characterize water-ice deposits in the lunar south polar region using a 6U CubeSat equipped with neutron spectrometer and near-infrared camera, providing decision-grade data for future Artemis landing site selection and In-Situ Resource Utilization (ISRU) initiatives."*

---

## 3. Project Objectives

### 3.1 Scientific Objectives
- **SO-1:** Map spatial distribution and abundance of water-ice in PSRs with ≥80% south polar coverage
- **SO-2:** Characterize neutron flux signatures indicating hydrogen-bearing compounds (H₂O/OH)
- **SO-3:** Identify H₂O absorption bands at 1.4 μm, 1.9 μm, and 2.7 μm via NIR hyperspectral imaging
- **SO-4:** Generate quantitative ice abundance map for ISRU resource assessment

### 3.2 Technical Objectives
- **TO-1:** Launch and deploy 6U CubeSat into ≤150 km polar lunar orbit
- **TO-2:** Achieve 3-axis stabilization with <3° pointing accuracy
- **TO-3:** Operate both instruments nominally for ≥6 months
- **TO-4:** Downlink all collected science data to ground

### 3.3 Programmatic Objectives
- **PO-1:** Deliver mission within USD $3,852,500 budget
- **PO-2:** Complete launch campaign by Q2 2028
- **PO-3:** Produce ≥3 peer-reviewed publications
- **PO-4:** Archive all data in NASA PDS format
- **PO-5:** Establish Indonesia as recognized lunar exploration contributor

---

## 4. Scope

### 4.1 In Scope
- Design, development, integration, and testing of the 6U CubeSat bus
- NS and NIR Camera payload development and integration
- Flight software development (NASA cFS framework)
- Ground station software and mission control system
- Science data processing pipeline and ML ice-detection models
- Launch preparation via NASA CSLI
- Lunar orbital operations (primary 6–12 months)
- Data archiving per NASA PDS standards

### 4.2 Out of Scope
- Surface landing or sample return
- Human spaceflight systems
- Launch vehicle development
- Deep space relay infrastructure

---

## 5. Project Organization

### 5.1 Governance Structure

```
Project Director (AURA)
├── Chief Systems Engineer (NEXUS)
│   ├── Flight Dynamics Lead (HELIOS)
│   ├── Thermal Engineer (ATLAS)
│   └── Communications Lead (ORBITRON)
├── Payload Scientist (PRISM)
├── Flight Software Lead (CODEX)
├── Data Scientist (ANALYTICA)
├── QA Engineer (VERITAS)
├── Mission Control AI (GUARDIAN)
├── Launch Operations Lead (STELLARIS)
└── Mission Operations Lead (PIONEER)
```

### 5.2 Stakeholders

| Stakeholder | Role | Engagement |
|-------------|------|------------|
| KOSASIH Research | Lead organization, technical authority | High |
| NASA CSLI | Launch service provider | Medium |
| NASA Artemis Program | Data recipient, ISRU planning | Medium |
| BRIN (Indonesia) | Institutional partner | Medium |
| Scientific community | Publication recipients | Low |
| NASA PDS | Data archive | Low |

---

## 6. Success Criteria

### 6.1 Minimum Success
- CubeSat achieves lunar orbit
- At least one instrument operates nominally
- ≥40% of south polar target area mapped
- Science data successfully downlinked and processed

### 6.2 Full Mission Success
- Both NS and NIR instruments operate nominally
- ≥80% of lunar south polar region mapped
- Complete science dataset downlinked
- ≥3 peer-reviewed publications
- Data delivered to NASA Artemis program and PDS

### 6.3 Extended Mission Success (>12 months)
- ≥95% south polar coverage
- Seasonal variation studies completed
- Multi-temporal ice abundance change detection

---

## 7. Phases & Key Milestones

| Phase | Duration | Key Deliverable | Target |
|-------|----------|-----------------|--------|
| 1: Initialization | Months 1–3 | Charter, CSLI LoI | Month 3 |
| 2: Preliminary Design | Months 4–9 | PDR Package | Month 9 |
| 3: Critical Design | Months 10–15 | CDR Package | Month 15 |
| 4: Manufacturing | Months 16–21 | Flight Model | Month 21 |
| 5: Environmental Testing | Months 22–24 | Test Reports | Month 24 |
| 6: Launch Campaign | Months 25–27 | Launch | Month 27 |
| 7: Mission Operations | Months 28–42 | Science Data | Month 42 |

---

## 8. Budget Authorization

| Category | Authorized (USD) |
|----------|-----------------|
| Spacecraft Bus | $1,200,000 |
| Payload (NS + NIR) | $800,000 |
| Integration & Testing | $300,000 |
| Launch (NASA CSLI) | $0 |
| Ground Segment | $200,000 |
| Mission Operations | $150,000 |
| Project Management | $200,000 |
| Contingency (15%) | $502,500 |
| **TOTAL** | **$3,852,500** |

*Changes >5% per category require Project Director approval.*

---

## 9. Risk Summary

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Launch delay | Medium | High | 3-month buffer; backup windows |
| Instrument underperformance | Low | High | Pre-launch calibration; redundant algorithms |
| Communication loss | Low | High | Store-and-forward; multi-ground-station |
| Budget overrun | Medium | Medium | Phased funding; 15% contingency |
| Solar particle event | Low | High | Radiation-tolerant components; safe mode |
| ³He supply shortage | Medium | High | Alternate detector technology as backup |

---

## 10. Assumptions & Constraints

### Assumptions
- NASA CSLI launch slot available Q4 2027 – Q2 2028
- Commercial 6U bus available (e.g., GomSpace, EnduroSat)
- ≥2 ground stations with S-band capability accessible
- ³He supply secured by Month 6

### Constraints
- Wet mass ≤ 14 kg
- Max continuous power ≤ 30 W
- Must comply with NASA NPR 7120.5F
- Must comply with COSPAR Planetary Protection Category II
- Must comply with ITU radio regulations (UHF/S-band)

---

## 11. Authority & Approvals

| Role | Agent | Date |
|------|-------|------|
| Project Director | AURA | 2026-06-03 |
| Chief Systems Engineer | NEXUS | TBD |
| Technical Authority | KOSASIH Research | TBD |

---

*Luna Ice Mapper — LIM-MGMT-CHR-001 v1.0*  
*"Mapping the Moon's water, enabling humanity's future" 🌙*
