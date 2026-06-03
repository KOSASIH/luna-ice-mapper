/**
 * @file lim_safemode_msg.h
 * @brief CCSDS message definitions for LIM_APP_SAFEMODE.
 *
 * Command and telemetry packet structures used by the safe-mode manager.
 * All structures are packed to match CCSDS secondary header alignment.
 *
 * @author CODEX — Luna Ice Mapper FSW Lead
 * @version 0.1 (Phase 1)
 */
#ifndef LIM_SAFEMODE_MSG_H
#define LIM_SAFEMODE_MSG_H

#include "cfe.h"
#include "lim_mid_table.h"
#include <stdint.h>
#include <stdbool.h>

/* ---- Command codes ------------------------------------------ */
#define LIM_SAFEMODE_NOOP_CC          0u  /**< No-op (health check)           */
#define LIM_SAFEMODE_RESET_COUNTERS_CC 1u /**< Reset error/WDT counters       */
#define LIM_SAFEMODE_ENTER_CC          2u /**< Force entry into safe mode      */
#define LIM_SAFEMODE_EXIT_CC           3u /**< Commanded exit from safe mode   */
#define LIM_SAFEMODE_SET_THRESHOLD_CC  4u /**< Update anomaly threshold        */
#define LIM_SAFEMODE_WDT_KICK_CC       5u /**< Manual WDT kick (test only)     */

/* ---- Safe-mode state enumeration ---------------------------- */
typedef enum {
    LIM_SAFEMODE_STATE_NOMINAL    = 0,
    LIM_SAFEMODE_STATE_WATCHDOG   = 1,  /**< Entered due to WDT expiry       */
    LIM_SAFEMODE_STATE_UNDERVOLT  = 2,  /**< EPS under-voltage trip          */
    LIM_SAFEMODE_STATE_TEMP_LIMIT = 3,  /**< Thermal limit exceeded          */
    LIM_SAFEMODE_STATE_COMMANDED  = 4,  /**< Ground-commanded safe mode      */
    LIM_SAFEMODE_STATE_BOOT_RETRY = 5,  /**< Exceeded max boot retries       */
    LIM_SAFEMODE_STATE_RADIATION  = 6,  /**< Radiation-induced reset         */
} LIM_SafeModeState_t;

/* ---- No-op command (header only) ---------------------------- */
typedef struct {
    CFE_SB_CmdHdr_t CmdHeader;
} LIM_SafeMode_NoopCmd_t;

/* ---- Enter/Exit commands (header only) ---------------------- */
typedef struct {
    CFE_SB_CmdHdr_t CmdHeader;
} LIM_SafeMode_EnterCmd_t;

typedef struct {
    CFE_SB_CmdHdr_t CmdHeader;
} LIM_SafeMode_ExitCmd_t;

/* ---- Set threshold command ---------------------------------- */
typedef struct {
    CFE_SB_CmdHdr_t CmdHeader;
    uint32_t        WdtKickIntervalMs;  /**< New WDT kick period             */
    uint16_t        MaxBootRetries;     /**< Override boot retry limit       */
    uint16_t        Spare;
} LIM_SafeMode_SetThresholdCmd_t;

/* ---- Housekeeping telemetry --------------------------------- */
typedef struct {
    CFE_SB_TlmHdr_t      TlmHeader;
    LIM_SafeModeState_t  State;
    uint32_t             WdtKickCount;
    uint32_t             WdtExpiredCount;
    uint32_t             SafeModeEntryCount;
    uint32_t             SafeModeExitCount;
    uint32_t             CmdAcceptCount;
    uint32_t             CmdErrCount;
    uint32_t             LastResetCause;
    uint32_t             UptimeSeconds;
    bool                 WdtArmed;
    uint8_t              Spare[3];
} LIM_SafeMode_HkTlm_t;

#endif /* LIM_SAFEMODE_MSG_H */
