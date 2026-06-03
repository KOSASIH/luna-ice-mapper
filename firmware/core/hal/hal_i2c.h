/**
 * @file hal_i2c.h
 * @brief I2C Hardware Abstraction Layer — Luna Ice Mapper OBC.
 *
 * I2C buses:
 *   I2C0 — ADCS (400 kHz)
 *   I2C1 — EPS  (400 kHz)
 *
 * @author CODEX — Luna Ice Mapper FSW Lead
 */
#ifndef LIM_HAL_I2C_H
#define LIM_HAL_I2C_H
#include <stdint.h>
#include <stddef.h>
#include <stdbool.h>

typedef enum { LIM_I2C_BUS_0=0, LIM_I2C_BUS_1=1, LIM_I2C_BUS_COUNT } LIM_I2C_Bus_t;

bool LIM_I2C_Init(LIM_I2C_Bus_t Bus, uint32_t ClockHz);
bool LIM_I2C_Write(LIM_I2C_Bus_t Bus, uint8_t Addr, const uint8_t *Buf, size_t Len);
bool LIM_I2C_Read(LIM_I2C_Bus_t Bus, uint8_t Addr, uint8_t *Buf, size_t Len);
bool LIM_I2C_WriteRead(LIM_I2C_Bus_t Bus, uint8_t Addr,
                       const uint8_t *TxBuf, size_t TxLen,
                       uint8_t *RxBuf, size_t RxLen);

#endif /* LIM_HAL_I2C_H */
