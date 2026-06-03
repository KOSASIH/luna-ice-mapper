/**
 * @file hal_uart.h
 * @brief UART Hardware Abstraction Layer — Luna Ice Mapper OBC.
 *
 * UART ports:
 *   UART0 — COMMS TC/TM interface
 *   UART1 — Debug console (ground test only)
 *
 * @author CODEX — Luna Ice Mapper FSW Lead
 */
#ifndef LIM_HAL_UART_H
#define LIM_HAL_UART_H
#include <stdint.h>
#include <stddef.h>
#include <stdbool.h>

typedef enum { LIM_UART_PORT_0=0, LIM_UART_PORT_1=1, LIM_UART_PORT_COUNT } LIM_UART_Port_t;

typedef struct {
    LIM_UART_Port_t Port;
    uint32_t        BaudRate;
    uint8_t         DataBits;
    uint8_t         StopBits;
    bool            ParityEnable;
} LIM_UART_Config_t;

bool LIM_UART_Init(const LIM_UART_Config_t *Config);
bool LIM_UART_Transmit(LIM_UART_Port_t Port, const uint8_t *Buf, size_t Len, uint32_t TimeoutMs);
bool LIM_UART_Receive(LIM_UART_Port_t Port, uint8_t *Buf, size_t Len, uint32_t TimeoutMs);
bool LIM_UART_Available(LIM_UART_Port_t Port);
void LIM_UART_Flush(LIM_UART_Port_t Port);

#endif /* LIM_HAL_UART_H */
