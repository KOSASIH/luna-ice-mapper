# Flight Software Architecture

**Document ID:** LIM-ENG-FSW-001  
**Version:** 0.1 (Phase 1 — PDR Baseline)  
**Status:** IN PROGRESS  
**Date:** 2026-06-03  
**Owner:** CODEX (Flight Software Lead)

---

## 1. Overview

The Luna Ice Mapper (LIM) flight software (FSW) is built on the **NASA core Flight System (cFS)** framework, running on a radiation-tolerant ARM Cortex-R5 class processor. The architecture is layered:

```
┌─────────────────────────────────────────────────────────────────────┐
│  Application Layer (10 cFS apps)                                  │
│  ADCS  EPS  COMMS  NS  NIR  PAYLOAD  HK  FM  SCH  SAFEMODE       │
├─────────────────────────────────────────────────────────────────────┤
│  cFE (core Flight Executive)                                      │
│  ES  │ SB  │ EVS  │ TBL  │ TIME                               │
│  (Executive) (SoftBus) (Events) (Tables) (Time)                   │
├─────────────────────────────────────────────────────────────────────┤
│  cFE PSP (Platform Support Package)                               │
│  RTEMS / VxWorks │ Memory Services │ Timer Services             │
├─────────────────────────────────────────────────────────────────────┤
│  LIM Core (firmware/core/)                                        │
│  Boot Sequence │ RTOS Tasks │ HAL (SPI/I2C/UART/CAN/GPIO)      │
├─────────────────────────────────────────────────────────────────────┤
│  Hardware (ARM Cortex-R5 OBC, SPI/I2C/UART peripherals)          │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. cFS Application Inventory

| # | App | Function | Priority | Cmd MID | HK TLM MID |
|---|-----|----------|----------|---------|------------|
| 1 | `LIM_APP_SAFEMODE` | Autonomous safe-mode manager, WDT supervisor | Critical | 0x180A | 0x080A |
| 2 | `LIM_APP_ADCS` | Attitude control loops, RW management | High | 0x1801 | 0x0801 |
| 3 | `LIM_APP_EPS` | Power management, load shedding | High | 0x1802 | 0x0802 |
| 4 | `LIM_APP_COMMS` | TC/TM routing, link management | High | 0x1803 | 0x0803 |
| 5 | `LIM_APP_NS` | Neutron Spectrometer data acquisition | Medium | 0x1804 | 0x0804 |
| 6 | `LIM_APP_NIR` | NIR Camera image capture | Medium | 0x1805 | 0x0805 |
| 7 | `LIM_APP_PAYLOAD` | Science schedule manager | Medium | 0x1806 | 0x0806 |
| 8 | `LIM_APP_HK` | Housekeeping telemetry aggregator | Low | 0x1807 | 0x0807 |
| 9 | `LIM_APP_FM` | File manager (SSR interface) | Low | 0x1808 | 0x0808 |
| 10 | `LIM_APP_SCH` | Scheduler (table-driven command dispatch) | System | 0x1809 | 0x0809 |

Science telemetry: NS → 0x0820, NIR → 0x0821.  
Full MID definitions: `firmware/applications/config/lim_mid_table.h`

---

## 3. CCSDS Software Bus Message Routing

```
 Ground Station
      |
      | UHF uplink (TC frames)
      v
 +-------------+     cmd    +----------+     cmd    +----------+
 | LIM_APP_    |---0x1803-->| LIM_APP_ |---0x1801-->| LIM_APP_ |
 | COMMS       |            | ADCS     |            | EPS      |
 +-------------+            +----------+            +----------+
      |                          |                       |
      | 0x0803 HK TLM            | 0x0801 HK TLM         | 0x0802 HK TLM
      |                          v                       v
      |                   +-----------+          +-----------+
      |   wakeup 0x1881   | LIM_APP_  |          | LIM_APP_  |
      |<------------------| SCH       |          | PAYLOAD   |
      |                   +-----------+          +-----------+
      |                          |                       |
      |                    0x1804/5/6 cmds         0x0806 HK
      |                          v                       v
      |               +----------+  +----------+  +-----------+
      |               | LIM_APP_ |  | LIM_APP_ |  | LIM_APP_  |
      |               | NS       |  | NIR      |  | HK        |
      |               +----------+  +----------+  +-----------+
      |               0x0820 sci  0x0821 sci         0x0807
      |                    \           /              /
      |                     \         /              /
      |                      v       v              v
      |               +-------------------------------+
      |               | LIM_APP_FM  (0x1808)          |
      |               | SSR write / read queue        |
      |               +-------------------------------+
      |                              |
      |  S-band downlink (TM frames) |
      +<-----------------------------+

 *** SAFEMODE supervises all apps via WDT kick + anomaly monitoring ***
 +-------------------------------------------------------------------+
 | LIM_APP_SAFEMODE (0x180A)                                         |
 | - Kicks WDT every 4 s (WDT timeout = 8 s)                        |
 | - Monitors EPS voltage & OBC temperature                         |
 | - Can inhibit PAYLOAD/NS/NIR via SB command on anomaly           |
 | - Publishes 0x080A status TLM at 1 Hz                            |
 +-------------------------------------------------------------------+
```

---

## 4. Boot Sequence

```
Power-on reset
    |
    v
STAGE 0: Hardware reset vector (assembly stub)
    |   - Read reset cause register
    |   - Increment boot counter (NVM/FRAM)
    v
STAGE 1: Clock and memory controller init
    |   - ARM PLL configuration
    |   - SDRAM controller timing
    |   - NOR flash setup
    v
STAGE 2: EDAC memory scrub
    |   - SECDED scan of SRAM (512 KB)
    |   - Log corrected bit errors to NVM
    v
STAGE 3: Arm hardware watchdog
    |   - LIM_WDT_Init(8000 ms)
    |   - LIM_WDT_Kick() — first kick
    v
STAGE 4: cFE / RTOS initialization
    |   - CFE_PSP_Main()
    |   - RTEMS kernel start
    |   - cFE services: ES, SB, EVS, TBL, TIME
    v
STAGE 5: Application table load
    |   - Parse cfe_es_startup.scr
    |   - Start all 10 LIM apps in priority order
    |   - SAFEMODE started first (watchdog supervisor)
    v
BOOT COMPLETE

Safe-mode fork (if BootCount > 3 OR WDT/radiation reset):
    STAGE 0 → ... STAGE 4 → Start SAFEMODE + COMMS only
                             (science apps remain inhibited)
```

---

## 5. Watchdog Strategy

| Parameter | Value | Rationale |
|-----------|-------|----------|
| WDT hardware timeout | 8 s | Allows 2 missed kicks before reset |
| SAFEMODE kick period | 4 s | 50% margin against 8 s timeout |
| WDT type | Hardware IWDG (irreversible) | Cannot be disabled post-arm — by design |
| Safe-mode kick responsibility | `LIM_APP_SAFEMODE` exclusively | Single point of truth |
| Test-mode timeout | 30 s | LEOP / ground test only |

The hardware watchdog **cannot be disarmed** once armed on flight hardware. If `LIM_APP_SAFEMODE` hangs or exits abnormally, the WDT will expire and force a system reset within 8 seconds.

---

## 6. Memory Layout Summary

| Region | Base Address | Size | Contents |
|--------|-------------|------|----------|
| Flash / ROM | 0x00000000 | 4 MB | cFE image, FSW binary |
| SRAM (EDAC) | 0x08000000 | 512 KB | Stack, heap, cFE runtime |
| SDRAM | 0x60000000 | 64 MB | Science data buffer |
| FRAM (NVM) | 0x00200000 | 256 KB | Boot counter, app tables, safe-mode flags |
| SSR (NAND) | 0xA0000000 | 8 GB | Science data archive |

Full definitions: `firmware/core/boot/memory_map.h`

---

## 7. Build System

```bash
# Host simulation (Ubuntu, cmake 3.16+)
cmake -B build -DTARGET=host -DCMAKE_BUILD_TYPE=Debug
cmake --build build
ctest --test-dir build --output-on-failure

# Flight target (ARM cross-compile)
cmake -B build-arm -DTARGET=arm-none-eabi -DCMAKE_BUILD_TYPE=Release
cmake --build build-arm
```

**CMake targets:**

| Target | Library / Executable | Description |
|--------|----------------------|-------------|
| `cfe_stub` | INTERFACE library | cFE header stubs for host sim |
| `lim_core` | STATIC library | RTOS, boot, HAL |
| `LIM_APP_SAFEMODE` | STATIC library | SafeMode cFS app |
| `lim_core_test` | Executable (host only) | Core unit tests |

**Adding future apps:**
1. Create `firmware/applications/LIM_APP_<NAME>/CMakeLists.txt`
2. Add `add_subdirectory(firmware/applications/LIM_APP_<NAME>)` to `firmware/CMakeLists.txt`
3. Allocate MID in `firmware/applications/config/lim_mid_table.h`
4. Update this document

---

## 8. Coding Standards

- NASA C Coding Standard (GSFC-C-CCS-2012)
- MISRA-C:2012 safety-critical subset
- No dynamic memory allocation post-boot
- No recursion in ISR context
- All public APIs documented with Doxygen
- Cyclomatic complexity ≤ 10 per function
- All functions return status codes; no silent failures

---

## 9. Phase Roadmap

| Phase | Milestone | FSW Deliverable |
|-------|-----------|----------------|
| 1 (now) | Architecture | cFS skeleton, MID table, SafeMode stub, HAL interfaces |
| 2 | PDR (Month 9) | Real cFS integration, all 10 apps functional, RTEMS port |
| 3 | CDR (Month 18) | Flight-qualified build, MISRA compliance, full test coverage |
| 4 | Integration | Hardware-in-the-loop test with OBC engineering model |
| 5 | Launch | Flight software delivery, upload verification |

---

*Luna Ice Mapper — LIM-ENG-FSW-001 v0.1 DRAFT — 2026-06-03*  
*Owner: CODEX — Flight Software Lead*
