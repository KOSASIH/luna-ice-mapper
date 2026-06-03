/**
 * @file lim_app_safemode.h
 * @brief LIM_APP_SAFEMODE application interface.
 *
 * Autonomous safe-mode manager for Luna Ice Mapper.
 * Responsibilities:
 *   - Supervisory watchdog kicking (must kick WDT every LIM_WDT_TIMEOUT_8S)
 *   - Anomaly detection: EPS under-voltage, thermal limits, boot-retry overflow
 *   - Autonomous safe-mode entry and recovery sequencing
 *   - Reporting safe-mode status via HK telemetry
 *
 * Priority: CRITICAL (highest cFS task priority)
 *
 * @author CODEX — Luna Ice Mapper FSW Lead
 * @version 0.1 (Phase 1 stub)
 */
#ifndef LIM_APP_SAFEMODE_H
#define LIM_APP_SAFEMODE_H

#include "cfe.h"
#include "lim_safemode_msg.h"
#include "lim_mid_table.h"
#include "watchdog.h"
#include "boot_sequence.h"
#include <stdint.h>
#include <stdbool.h>

/* ---- Application constants ---------------------------------- */
#define LIM_SAFEMODE_APP_NAME         "LIM_APP_SAFEMODE"
#define LIM_SAFEMODE_PIPE_DEPTH       10u
#define LIM_SAFEMODE_PIPE_NAME        "SAFEMODE_CMD_PIPE"
#define LIM_SAFEMODE_WDT_KICK_PERIOD  4000u  /**< Kick WDT every 4 s (< 8 s timeout) */
#define LIM_SAFEMODE_HK_PERIOD        1000u  /**< Publish HK every 1 s               */

/* ---- EPS threshold defaults (overridable via cmd) ----------- */
#define LIM_SAFEMODE_EPS_UNDERVOLT_MV 3200u  /**< Battery < 3.2 V → safe mode       */
#define LIM_SAFEMODE_TEMP_LIMIT_DEGC  85u    /**< OBC > 85°C → safe mode           */

/* ---- App global data structure ------------------------------ */
typedef struct {
    CFE_SB_PipeId_t      CmdPipe;
    LIM_SafeMode_HkTlm_t HkTlm;
    uint32_t             RunStatus;
    uint32_t             WdtKickIntervalMs;
    uint32_t             LastWdtKickTime_ms;
} LIM_SafeMode_AppData_t;

/* ---- Public entry point ------------------------------------- */
void LIM_SafeMode_AppMain(void);

/* ---- Internal API (visible for unit testing) ---------------- */
void LIM_SafeMode_Init(void);
void LIM_SafeMode_ProcessCmdPipe(void);
void LIM_SafeMode_ProcessCmd(CFE_SB_MsgPtr_t MsgPtr);
void LIM_SafeMode_SendHkTlm(void);
void LIM_SafeMode_CheckAnomalies(void);
void LIM_SafeMode_Enter(LIM_SafeModeState_t Reason);
void LIM_SafeMode_Exit(void);
void LIM_SafeMode_KickWatchdog(void);

#endif /* LIM_APP_SAFEMODE_H */
