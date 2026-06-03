/**
 * @file watchdog.h
 * @brief Hardware watchdog interface — Luna Ice Mapper OBC.
 *
 * Must be kicked at least once per LIM_WDT_TIMEOUT period.
 * LIM_APP_SAFEMODE is the supervisory kicker during nominal operations.
 * On flight hardware the WDT cannot be disarmed once armed (by design).
 *
 * @author CODEX — Luna Ice Mapper FSW Lead
 * @version 0.1 (Phase 1 stub)
 */
#ifndef LIM_WATCHDOG_H
#define LIM_WATCHDOG_H
#include <stdint.h>
#include <stdbool.h>

#define LIM_WDT_TIMEOUT_2S   2000u
#define LIM_WDT_TIMEOUT_4S   4000u
#define LIM_WDT_TIMEOUT_8S   8000u  /**< Operational default */
#define LIM_WDT_TIMEOUT_30S  30000u /**< LEOP / test mode only */

typedef struct {
    bool     Armed;
    uint32_t TimeoutMs;
    uint32_t KickCount;
    uint32_t LastKickTimestamp_ms;
    uint32_t ExpiredCount;
} LIM_WDT_Status_t;

void  LIM_WDT_Init(uint32_t TimeoutMs);
void  LIM_WDT_Kick(void);
void  LIM_WDT_Arm(void);
void  LIM_WDT_Disarm(void);        /**< No-op on flight hardware        */
void  LIM_WDT_ForceReset(void);    /**< Immediately trigger system reset */
bool  LIM_WDT_IsArmed(void);
const LIM_WDT_Status_t *LIM_WDT_GetStatus(void);

#endif /* LIM_WATCHDOG_H */
