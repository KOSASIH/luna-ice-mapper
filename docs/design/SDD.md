# System Design Document (SDD)

**Document ID:** LIM-ENG-SDD-001  
**Version:** 0.1 (DRAFT)  
**Status:** IN PROGRESS  
**Date:** 2026-06-03  
**Prepared by:** NEXUS (Chief Systems Engineer)

---

## 1. System Overview

Luna Ice Mapper is a 6U CubeSat (10×20×30 cm) operating in a ~100 km circular polar lunar orbit. The spacecraft integrates five primary subsystems: EPS, OBC, ADCS, Comms, and Thermal Control, plus two scientific payloads (NS and NIR-CAM).

---

## 2. System Architecture

### 2.1 System Block Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                       6U CubeSat Bus                         │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │  EPS     │  │  OBC     │  │  ADCS    │  │  Comms     │  │
│  │(30W GaAs)│  │ (cFS FSW)│  │(RW+MTQ)  │  │ (UHF/SBand)│  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └─────┬──────┘  │
│       └─────────────┴──────────────┴──────────────┘         │
│                    CAN / I2C / SPI Internal Bus              │
│                                                              │
│  ┌─────────────────────┐  ┌──────────────────────────────┐  │
│  │  Neutron Spectrometer│  │       NIR Camera              │  │
│  │  (PRISM domain)      │  │       (PRISM domain)          │  │
│  └─────────────────────┘  └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Data Flow

```
Instrument Data → OBC Payload Interface → 8 GB SSR
                                              ↓
                               Science Data Packetizer (cFS App)
                                              ↓
                              S-band Downlink → Ground Station
                                              ↓
                              ANALYTICA Data Processing Pipeline
                                              ↓
                                 Ice Abundance Map (PDS Archive)
```

---

## 3. Subsystem Design (Stubs — to be developed at PDR)

### 3.1 Electrical Power Subsystem (EPS)
- Triple-junction GaAs solar panels, body-mounted
- Peak power tracking (MPPT) with Li-Ion 40 Whr battery
- Regulated 3.3V / 5V / 12V buses; unregulated battery bus
- Fault protection: fuses + software current monitors
- *Owner: NEXUS / ATLAS*

### 3.2 On-Board Computer (OBC)
- Radiation-tolerant processor (ARM Cortex-R5 class or equiv.)
- NASA cFS RTOS-based flight software
- 8 GB solid-state recorder for science data
- EDAC memory protection, watchdog timer
- *Owner: CODEX*

### 3.3 Attitude Determination and Control (ADCS)
- 3-axis reaction wheel assembly (min. 3 wheels)
- Magnetorquers for momentum dumping and coarse detumbling
- Star tracker or sun sensor + magnetometer for attitude determination
- Pointing accuracy: <3° (3σ)
- *Owner: HELIOS*

### 3.4 Communications
- UHF (400 MHz): uplink 9.6 kbps, omni antenna
- S-band (2.2–2.3 GHz): downlink 32–256 kbps, 12 dBi patch array
- CCSDS TC/TM standards, AES-256 command authentication
- Store-and-forward capability
- *Owner: ORBITRON*

### 3.5 Thermal Control
- Passive: MLI blankets, surface finishes, internal conduction paths
- Active: survival heaters on battery and NS detector
- ATLAS thermal model: ANSYS/NX Thermal (in development)

### 3.6 Structure
- Standard 6U aluminum frame (per CubeSat Design Specification Rev 14)
- Deployable solar panel hinges
- Launch lock and separation system interface
- *Owner: NEXUS*

---

## 4. Interface Control Summary

| Interface | Connector | Protocol | Notes |
|-----------|-----------|----------|-------|
| OBC ↔ NS | PC/104 | SPI | 10 Mbps max |
| OBC ↔ NIR-CAM | PC/104 | SPI / LVDS | High-rate image data |
| OBC ↔ ADCS | PC/104 | I2C | 400 kHz |
| OBC ↔ EPS | PC/104 | I2C | Housekeeping telemetry |
| OBC ↔ Comms | PC/104 | UART / SPI | TC/TM interface |

*Full Interface Control Documents (ICDs) to be developed in Phase 3 (CDR)*

---

## 5. Design Trades (Planned)

| Trade | Options | Decision Target |
|-------|---------|----------------|
| OBC processor | COTS vs. custom rad-hard | PDR (Month 9) |
| Solar panel config | Body-mounted vs. deployable | PDR (Month 9) |
| ADCS sensors | Star tracker vs. sun sensor | PDR (Month 9) |
| Comms antenna | Fixed patch vs. deployable dish | PDR (Month 9) |
| Bus vendor | GomSpace NanoMind vs. EnduroSat vs. custom | PDR (Month 9) |

---

*Luna Ice Mapper — LIM-ENG-SDD-001 v0.1 DRAFT — 2026-06-03*  
*Full document to be completed at PDR (Month 9)*
