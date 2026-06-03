# Firmware Applications

**Agent Owner:** CODEX (Flight Software Lead)

NASA cFS application layer implementing mission-specific flight software.

## cFS Application Inventory

| App | Function | Priority | Status |
|-----|----------|----------|--------|
| `LIM_APP_ADCS` | Attitude control loops, RW management | High | Planned |
| `LIM_APP_EPS` | Power management, load shedding | High | Planned |
| `LIM_APP_COMMS` | TC/TM routing, link management | High | Planned |
| `LIM_APP_NS` | Neutron Spectrometer data acquisition | Medium | Planned |
| `LIM_APP_NIR` | NIR Camera image capture | Medium | Planned |
| `LIM_APP_PAYLOAD` | Science schedule manager | Medium | Planned |
| `LIM_APP_HK` | Housekeeping telemetry aggregator | Low | Planned |
| `LIM_APP_FM` | File manager (SSR interface) | Low | Planned |
| `LIM_APP_SCH` | Scheduler (table-driven command dispatch) | System | Planned |
| `LIM_APP_SAFEMODE` | Autonomous safe-mode manager | Critical | Planned |

## cFS Message Routing

All apps communicate via the cFE Software Bus using CCSDS message IDs. Command and telemetry message tables defined in `config/` subdirectories per app.

---
*Owner: CODEX • Luna Ice Mapper*
