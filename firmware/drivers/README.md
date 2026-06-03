# Firmware Drivers

**Agent Owner:** CODEX (Flight Software Lead)

Hardware peripheral drivers for all Luna Ice Mapper subsystem interfaces.

## Driver Inventory

| Driver | Target Hardware | Interface | Status |
|--------|----------------|-----------|--------|
| `ns_driver` | Neutron Spectrometer front-end ASIC | SPI | Planned |
| `nir_driver` | NIR Camera InGaAs FPA controller | SPI/LVDS | Planned |
| `rw_driver` | Reaction Wheel Assembly | CAN | Planned |
| `mtq_driver` | Magnetorquer controller | I2C | Planned |
| `eps_driver` | EPS battery/solar telemetry | I2C | Planned |
| `sband_driver` | S-band transceiver | UART/SPI | Planned |
| `uhf_driver` | UHF transceiver | UART | Planned |
| `flash_driver` | 8 GB solid-state recorder | SPI/QSPI | Planned |
| `therm_driver` | Thermistor / PT100 ADC channels | I2C | Planned |

## Driver Interface Standard

All drivers implement the standard HAL interface:

```c
typedef struct {
    int (*init)(void);
    int (*read)(uint8_t *buf, size_t len);
    int (*write)(const uint8_t *buf, size_t len);
    int (*ioctl)(uint32_t cmd, void *arg);
    int (*deinit)(void);
} hal_driver_t;
```

---
*Owner: CODEX • Luna Ice Mapper*
