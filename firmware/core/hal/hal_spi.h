/**
 * @file hal_spi.h
 * @brief SPI Hardware Abstraction Layer — Luna Ice Mapper OBC.
 *
 * SPI buses:
 *   SPI0 — Neutron Spectrometer (10 Mbps, PC/104)
 *   SPI1 — NIR Camera (LVDS high-rate)
 *   SPI2 — COMMS transceiver control
 *
 * @author CODEX — Luna Ice Mapper FSW Lead
 */
#ifndef LIM_HAL_SPI_H
#define LIM_HAL_SPI_H
#include <stdint.h>
#include <stddef.h>
#include <stdbool.h>

typedef enum { LIM_SPI_BUS_0=0, LIM_SPI_BUS_1=1, LIM_SPI_BUS_2=2, LIM_SPI_BUS_COUNT } LIM_SPI_Bus_t;
typedef enum { LIM_SPI_MODE_0=0, LIM_SPI_MODE_1=1, LIM_SPI_MODE_2=2, LIM_SPI_MODE_3=3 } LIM_SPI_Mode_t;

typedef struct {
    LIM_SPI_Bus_t  Bus;
    LIM_SPI_Mode_t Mode;
    uint32_t       ClockHz;
    uint8_t        BitsPerWord;
} LIM_SPI_Config_t;

bool LIM_SPI_Init(const LIM_SPI_Config_t *Config);
bool LIM_SPI_Transfer(LIM_SPI_Bus_t Bus, const uint8_t *TxBuf, uint8_t *RxBuf, size_t Len);
bool LIM_SPI_Write(LIM_SPI_Bus_t Bus, const uint8_t *Buf, size_t Len);
bool LIM_SPI_Read(LIM_SPI_Bus_t Bus, uint8_t *Buf, size_t Len);
void LIM_SPI_ChipSelect(LIM_SPI_Bus_t Bus, bool Assert);

#endif /* LIM_HAL_SPI_H */
