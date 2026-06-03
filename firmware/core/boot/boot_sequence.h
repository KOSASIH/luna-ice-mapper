/**
 * @file boot_sequence.h
 * @brief Luna Ice Mapper OBC power-on initialization interface.
 *
 * Six-stage boot sequence:
 *   STAGE_0  Hardware reset vector
 *   STAGE_1  Clock and memory controller init
 *   STAGE_2  EDAC / ECC memory scrub
 *   STAGE_3  Watchdog arm
 *   STAGE_4  cFE / RTOS initialization
 *   STAGE_5  Application start
 *
 * Safe-mode is entered when BootCount > LIM_MAX_BOOT_RETRIES
 * or when a watchdog / radiation reset is detected.
 *
 * @author CODEX — Luna Ice Mapper FSW Lead
 * @version 0.1 (Phase 1 stub)
 */
#ifndef LIM_BOOT_SEQUENCE_H
#define LIM_BOOT_SEQUENCE_H
#include <stdint.h>
#include <stdbool.h>

typedef enum {
    LIM_BOOT_STAGE_RESET      = 0,
    LIM_BOOT_STAGE_CLOCKS     = 1,
    LIM_BOOT_STAGE_MEMORY     = 2,
    LIM_BOOT_STAGE_WATCHDOG   = 3,
    LIM_BOOT_STAGE_CFE_INIT   = 4,
    LIM_BOOT_STAGE_APPS_START = 5,
    LIM_BOOT_STAGE_COMPLETE   = 6,
    LIM_BOOT_STAGE_ERROR      = 0xFF,
} LIM_BootStage_t;

typedef struct {
    LIM_BootStage_t CurrentStage;
    uint32_t        BootCount;         /**< Persistent counter in NVM       */
    uint32_t        LastResetCause;    /**< Hardware reset cause register   */
    bool            SafeModeForced;    /**< true if safe-mode was triggered */
    uint32_t        BootTimestamp_ms;
} LIM_BootStatus_t;

#define LIM_RESET_POWER_ON   0x00000001u
#define LIM_RESET_WATCHDOG   0x00000002u
#define LIM_RESET_SOFTWARE   0x00000004u
#define LIM_RESET_RADIATION  0x00000008u
#define LIM_RESET_COMMANDED  0x00000010u

void                     LIM_Boot_Init(void);
LIM_BootStage_t          LIM_Boot_GetStage(void);
const LIM_BootStatus_t  *LIM_Boot_GetStatus(void);
void                     LIM_Boot_Abort(uint32_t ErrorCode);
bool                     LIM_Boot_IsSafeModeRequired(void);

#endif /* LIM_BOOT_SEQUENCE_H */
