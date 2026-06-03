/**
 * @file hal_gpio.h
 * @brief GPIO Hardware Abstraction Layer — Luna Ice Mapper OBC.
 *
 * Named GPIO lines:
 *   WDT_KICK     — External watchdog kick
 *   NS_PWR_EN    — Neutron Spectrometer power enable
 *   NIR_PWR_EN   — NIR Camera power enable
 *   SAFEMODE_LED — Safe-mode indicator (test connector)
 *   SEP_SWITCH   — Launch separation switch (input)
 *
 * @author CODEX — Luna Ice Mapper FSW Lead
 */
#ifndef LIM_HAL_GPIO_H
#define LIM_HAL_GPIO_H
#include <stdint.h>
#include <stdbool.h>

typedef enum {
    LIM_GPIO_WDT_KICK     = 0,
    LIM_GPIO_NS_PWR_EN    = 1,
    LIM_GPIO_NIR_PWR_EN   = 2,
    LIM_GPIO_SAFEMODE_LED = 3,
    LIM_GPIO_SEP_SWITCH   = 4,
    LIM_GPIO_COUNT,
} LIM_GPIO_Pin_t;

typedef enum { LIM_GPIO_DIR_INPUT=0, LIM_GPIO_DIR_OUTPUT=1 } LIM_GPIO_Dir_t;

bool LIM_GPIO_Init(LIM_GPIO_Pin_t Pin, LIM_GPIO_Dir_t Dir);
void LIM_GPIO_Write(LIM_GPIO_Pin_t Pin, bool State);
bool LIM_GPIO_Read(LIM_GPIO_Pin_t Pin);
void LIM_GPIO_Toggle(LIM_GPIO_Pin_t Pin);

#endif /* LIM_HAL_GPIO_H */
