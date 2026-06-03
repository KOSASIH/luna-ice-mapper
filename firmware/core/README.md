# Firmware Core

**Agent Owner:** CODEX (Flight Software Lead)

## Overview

The core firmware layer provides the real-time operating system foundation, hardware abstraction layer (HAL), scheduler, and boot sequence for the Luna Ice Mapper On-Board Computer (OBC).

## Architecture

```
firmware/core/
├── rtos/
│   ├── scheduler.c        # Task scheduler (preemptive, priority-based)
│   ├── ipc.c              # Inter-process communication
│   └── watchdog.c         # Hardware watchdog interface
├── hal/
│   ├── hal_spi.c          # SPI driver interface
│   ├── hal_i2c.c          # I2C driver interface
│   ├── hal_uart.c         # UART driver interface
│   ├── hal_can.c          # CAN bus driver interface
│   └── hal_gpio.c         # GPIO interface
├── boot/
│   ├── boot_sequence.c    # Power-on initialization
│   ├── safemode.c         # Safe mode entry/recovery
│   └── memory_map.h       # Memory layout constants
├── cfs_integration/
│   └── cfe_psp/           # NASA cFE Platform Support Package
└── CMakeLists.txt
```

## Build System

```bash
# Configure (host simulation target)
cmake -B build -DTARGET=host -DCMAKE_BUILD_TYPE=Debug

# Configure (ARM flight target)
cmake -B build-arm -DTARGET=arm-none-eabi -DCMAKE_BUILD_TYPE=Release

# Build
cmake --build build

# Run tests
cd build && ctest --output-on-failure
```

## Coding Standards

- NASA C Coding Standard (GSFC-C-CCS-2012)
- MISRA-C:2012 compliance (safety-critical subset)
- No dynamic memory allocation post-boot
- No recursion in ISR context
- All public APIs documented with Doxygen

## Status

📋 **Planned** — Architecture design by CODEX (Phase 1–2)

---
*Owner: CODEX • Luna Ice Mapper*
