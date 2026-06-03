/**
 * @file hal_can.h
 * @brief CAN Bus Hardware Abstraction Layer — Luna Ice Mapper OBC.
 * Reserved for future internal bus integration (e.g., GomSpace NanoBus).
 *
 * @author CODEX — Luna Ice Mapper FSW Lead
 */
#ifndef LIM_HAL_CAN_H
#define LIM_HAL_CAN_H
#include <stdint.h>
#include <stdbool.h>

#define LIM_CAN_MAX_DATA_BYTES 8u

typedef struct {
    uint32_t Id;
    bool     Extended;
    uint8_t  Data[LIM_CAN_MAX_DATA_BYTES];
    uint8_t  Length;
} LIM_CAN_Frame_t;

bool LIM_CAN_Init(uint32_t BitrateHz);
bool LIM_CAN_Transmit(const LIM_CAN_Frame_t *Frame, uint32_t TimeoutMs);
bool LIM_CAN_Receive(LIM_CAN_Frame_t *Frame, uint32_t TimeoutMs);
bool LIM_CAN_SetFilter(uint32_t Id, uint32_t Mask);

#endif /* LIM_HAL_CAN_H */
