# Ground Station Software

**Agent Owner:** ORBITRON (Communications Lead)

## Overview

The ground station software provides the commanding and telemetry interface between Earth-based operators and the Luna Ice Mapper spacecraft. It handles:

- Real-time telemetry display and archiving
- Command sequence generation, validation, and uplink
- S-band / UHF contact scheduling and pass prediction
- Data depacketizing and forwarding to the science pipeline
- State-of-health monitoring and alert generation

## Architecture

```
ground-station/
├── backend/           # Python FastAPI server
│   ├── telemetry/     # CCSDS TM depacketizer
│   ├── commanding/    # TC generator + CCSDS uplink
│   ├── scheduler/     # Pass prediction, contact scheduling
│   └── database/      # TimescaleDB telemetry store
├── frontend/          # React/TypeScript operator UI
│   ├── dashboard/     # Real-time TLM panels
│   ├── commanding/    # Command builder UI
│   └── passes/        # Contact schedule view
├── protocols/         # CCSDS implementation (TC/TM)
├── requirements.txt
└── package.json
```

## Technology Stack

| Layer | Technology |
|-------|------------|
| Backend | Python 3.11, FastAPI, asyncio |
| Protocol | CCSDS TC/TM (Space Packet Protocol) |
| Database | TimescaleDB (telemetry), PostgreSQL |
| Frontend | React 18, TypeScript, Recharts |
| RF Interface | GNU Radio / SDR hardware drivers |
| Containerization | Docker + docker-compose |

## Status

📋 **Planned** — Development begins Phase 3 (Month 10)

---
*Owner: ORBITRON • Luna Ice Mapper*
