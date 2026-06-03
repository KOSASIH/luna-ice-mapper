/**
 * @file hal_sim_stubs.c
 * @brief Host-simulation no-op stubs for all HAL drivers.
 *
 * Allows lim_core to link on a Linux host without real hardware.
 * Replaced by real HAL implementations on ARM flight target.
 *
 * @author CODEX — Luna Ice Mapper FSW Lead
 */
#include "hal_spi.h"
#include "hal_i2c.h"
#include "hal_uart.h"
#include "hal_can.h"
#include "hal_gpio.h"
#include <stdio.h>

/* SPI stubs */
bool LIM_SPI_Init(const LIM_SPI_Config_t *c)    { (void)c; return true; }
bool LIM_SPI_Transfer(LIM_SPI_Bus_t b, const uint8_t *tx, uint8_t *rx, size_t l)
    { (void)b;(void)tx;(void)rx;(void)l; return true; }
bool LIM_SPI_Write(LIM_SPI_Bus_t b, const uint8_t *buf, size_t l)
    { (void)b;(void)buf;(void)l; return true; }
bool LIM_SPI_Read(LIM_SPI_Bus_t b, uint8_t *buf, size_t l)
    { (void)b;(void)buf;(void)l; return true; }
void LIM_SPI_ChipSelect(LIM_SPI_Bus_t b, bool a) { (void)b;(void)a; }

/* I2C stubs */
bool LIM_I2C_Init(LIM_I2C_Bus_t b, uint32_t hz)  { (void)b;(void)hz; return true; }
bool LIM_I2C_Write(LIM_I2C_Bus_t b, uint8_t a, const uint8_t *buf, size_t l)
    { (void)b;(void)a;(void)buf;(void)l; return true; }
bool LIM_I2C_Read(LIM_I2C_Bus_t b, uint8_t a, uint8_t *buf, size_t l)
    { (void)b;(void)a;(void)buf;(void)l; return true; }
bool LIM_I2C_WriteRead(LIM_I2C_Bus_t b, uint8_t a, const uint8_t *tx, size_t tl,
                       uint8_t *rx, size_t rl)
    { (void)b;(void)a;(void)tx;(void)tl;(void)rx;(void)rl; return true; }

/* UART stubs */
bool LIM_UART_Init(const LIM_UART_Config_t *c)   { (void)c; return true; }
bool LIM_UART_Transmit(LIM_UART_Port_t p, const uint8_t *b, size_t l, uint32_t t)
    { (void)p;(void)b;(void)l;(void)t; return true; }
bool LIM_UART_Receive(LIM_UART_Port_t p, uint8_t *b, size_t l, uint32_t t)
    { (void)p;(void)b;(void)l;(void)t; return false; }
bool LIM_UART_Available(LIM_UART_Port_t p)        { (void)p; return false; }
void LIM_UART_Flush(LIM_UART_Port_t p)            { (void)p; }

/* CAN stubs */
bool LIM_CAN_Init(uint32_t r)                     { (void)r; return true; }
bool LIM_CAN_Transmit(const LIM_CAN_Frame_t *f, uint32_t t) { (void)f;(void)t; return true; }
bool LIM_CAN_Receive(LIM_CAN_Frame_t *f, uint32_t t)        { (void)f;(void)t; return false; }
bool LIM_CAN_SetFilter(uint32_t id, uint32_t m)   { (void)id;(void)m; return true; }

/* GPIO stubs */
bool LIM_GPIO_Init(LIM_GPIO_Pin_t p, LIM_GPIO_Dir_t d) { (void)p;(void)d; return true; }
void LIM_GPIO_Write(LIM_GPIO_Pin_t p, bool s)          { (void)p;(void)s; }
bool LIM_GPIO_Read(LIM_GPIO_Pin_t p)                   { (void)p; return false; }
void LIM_GPIO_Toggle(LIM_GPIO_Pin_t p)                 { (void)p; }
