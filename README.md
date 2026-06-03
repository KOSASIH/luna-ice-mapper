# 🌙 Luna Ice Mapper

[![Mission Status](https://img.shields.io/badge/Mission%20Status-Phase%201%20Initialization-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/License-Apache%202.0-green?style=for-the-badge)](LICENSE)
[![Launch Target](https://img.shields.io/badge/Launch-Q4%202027--Q2%202028-orange?style=for-the-badge)](#)
[![Lead Country](https://img.shields.io/badge/Lead-Indonesia-red?style=for-the-badge)](#)
[![NASA Partner](https://img.shields.io/badge/Partner-NASA%20CSLI-blue?style=for-the-badge)](#)

> **A 6U CubeSat mission to map water-ice deposits in the lunar south polar region**  
> *Supporting NASA Artemis ISRU objectives and sustainable human presence on the Moon*

[Mission Overview](#-mission-overview) · [Technical Specs](#️-technical-specifications) · [Team](#-ai-agent-team) · [Documentation](#-documentation) · [Contributing](CONTRIBUTING.md)

---

## 🎯 Mission Overview

Luna Ice Mapper is an Indonesian-led 6U CubeSat scientific mission targeting the Moon's south polar region — specifically the **Permanently Shadowed Regions (PSRs)** where water-ice deposits have been detected by LCROSS, LRO, and Chandrayaan-1.

The mission delivers **decision-grade data** for:
- 🏕️ NASA Artemis landing site selection
- 🔬 In-Situ Resource Utilization (ISRU) planning
- 📄 International peer-reviewed scientific publication
- 🚀 Indonesia's strategic position in lunar exploration

### Vision
> *"To establish Indonesia as a key contributor in global lunar exploration by advancing scientific understanding of water resources on the Moon, thereby supporting sustainable human presence beyond Earth."*

### Mission Statement
> *"To map and characterize water-ice deposits in the lunar south polar region using a 6U CubeSat equipped with neutron spectrometer and near-infrared camera, providing decision-grade data for future Artemis landing site selection and ISRU initiatives."*

---

## 🛰️ Technical Specifications

### Spacecraft Bus
| Parameter | Value |
|-----------|-------|
| Form Factor | 6U CubeSat (10 × 20 × 30 cm) |
| Total Mass | ~12 kg (wet mass) |
| Power Generation | ~30 W avg / 60 W peak (GaAs solar panels) |
| Energy Storage | 40 Whr Li-Ion (3S2P) |
| Attitude Control | 3-axis stabilization with reaction wheels |
| Pointing Accuracy | < 3° (3σ) |
| Thermal Control | Passive MLI blankets + survival heater |
| Operating Temperature | -20°C to +50°C |

### Communication Subsystem
| Link | Frequency | Data Rate |
|------|-----------|----------|
| Uplink | UHF 400 MHz | 9.6 kbps |
| Downlink (near Earth) | S-band 2.2–2.3 GHz | 256 kbps |
| Downlink (lunar distance) | S-band 2.2–2.3 GHz | 32 kbps |
| On-board Storage | Solid-state recorder | 8 GB |

### Scientific Payloads
| Instrument | Type | Mass | Power | Function |
|------------|------|------|-------|----------|
| Neutron Spectrometer (NS) | ³He proportional counter + moderator | 1.5 kg | 3 W | Detect H₂O via thermal/epithermal neutrons |
| NIR Camera (NIR-CAM) | InGaAs FPA 256×256 | 1.2 kg | 2.5 W | 1.0–2.5 μm hyperspectral ice band imaging |

### Orbit Profile
| Parameter | Value |
|-----------|-------|
| Transfer | Ballistic Lunar Transfer (BLT) |
| Target Orbit | ~100 km circular polar |
| Mission Altitude | 50–150 km |

---

## 📁 Repository Structure

```
luna-ice-mapper/
├── .github/
│   ├── workflows/          # CI/CD pipelines (build, release, test)
│   └── ISSUE_TEMPLATE/     # Bug reports, feature requests
├── docs/
│   ├── requirements/       # IRD, SRD, ICD
│   ├── design/             # SDD, subsystem specs, trade studies
│   ├── testing/            # Test plans, procedures, results
│   └── operations/         # Mission ops manual, pass planning
├── firmware/
│   ├── core/               # RTOS kernel, scheduler, HAL
│   ├── drivers/            # Hardware peripheral drivers
│   └── applications/       # Payload apps, ADCS, comms stack
├── hardware/
│   ├── mechanical/         # CAD, structural drawings
│   ├── electrical/         # Schematics, block diagrams
│   └── pcb/                # PCB layouts, BOM
├── software/
│   ├── ground-station/     # Ground control software
│   ├── mission-control/    # GUARDIAN real-time monitoring
│   └── data-processing/    # ANALYTICA science pipeline
├── data/
│   ├── calibration/        # Instrument calibration data
│   └── sample-data/        # Test and reference datasets
├── scripts/
│   ├── build/              # Build automation
│   └── deployment/         # Deployment scripts
└── tests/
    ├── unit/               # Unit tests
    ├── integration/        # Integration tests
    └── system/             # System-level tests
```

---

## 🗓️ Mission Timeline

| Phase | Period | Key Milestone |
|-------|--------|---------------|
| 1: Initialization | Months 1–3 | Project charter, NASA CSLI LoI |
| 2: Preliminary Design | Months 4–9 | PDR completion |
| 3: Critical Design | Months 10–15 | CDR completion |
| 4: Manufacturing | Months 16–21 | Flight model assembly |
| 5: Environmental Testing | Months 22–24 | TVC & vibration tests |
| 6: Launch Campaign | Months 25–27 | Launch & separation |
| 7: Operations | Months 28–42 | Science data collection |

**Launch Target:** Q4 2027 – Q2 2028 · **Mission Duration:** 6–12 months (extendable to 24)

---

## 🤖 AI Agent Team

| Agent | Role | Domain |
|-------|------|--------|
| **AURA** | Project Director | Management, timeline, risk, governance |
| **NEXUS** | Chief Systems Engineer | Spacecraft bus, integration, trade studies |
| **HELIOS** | Flight Dynamics Lead | Orbital mechanics, GNC, trajectory |
| **ATLAS** | Thermal Engineer | Thermal modeling, MLI design |
| **PRISM** | Payload Scientist | NS + NIR operation, ice detection |
| **ORBITRON** | Communications Lead | RF design, ground links, link budget |
| **VERITAS** | QA Engineer | Testing, validation, anomaly tracking |
| **CODEX** | Flight Software Lead | FSW development, command handling |
| **ANALYTICA** | Data Scientist | ML models, data pipeline, science insights |
| **GUARDIAN** | Mission Control AI | Real-time health monitoring, recovery |
| **STELLARIS** | Launch Operations Lead | Launch campaign, pre-launch ops |
| **PIONEER** | Mission Operations Lead | Pass planning, telemetry, ops schedule |

---

## 📚 Documentation

| Document | Description | Status |
|----------|-------------|--------|
| [Project Charter](PROJECT_CHARTER.md) | Formal mission governance | ✅ v1.0 |
| [IRD](docs/requirements/IRD.md) | Initial Requirements Document | ✅ v1.0 |
| [SDD](docs/design/SDD.md) | System Design Document | 🔄 Draft |
| [Test Plan](docs/testing/test-plan.md) | Master test & verification plan | 🔄 Draft |
| [Mission Ops Manual](docs/operations/mission-ops-manual.md) | Operations procedures | 📋 Planned |

---

## 📊 Budget Summary

| Category | Estimated Cost (USD) |
|----------|---------------------|
| Spacecraft Bus | $1,200,000 |
| Payload (NS + NIR) | $800,000 |
| Integration & Testing | $300,000 |
| Launch Services | $0 (NASA CSLI) |
| Ground Segment | $200,000 |
| Mission Operations | $150,000 |
| Project Management | $200,000 |
| Contingency (15%) | $502,500 |
| **Total** | **$3,852,500** |

---

## 🤝 Contributing

We welcome contributions from the global space and open-source communities. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📜 License

Apache License 2.0 — see [LICENSE](LICENSE).

---

<div align="center">

🌙 **Luna Ice Mapper** — Mapping the Moon's water, enabling humanity's future

*Made with 🇮🇩 by Indonesia, for the world*

</div>
