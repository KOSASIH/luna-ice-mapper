/**
 * @file lim_safemode_tbl.c
 * @brief LIM_APP_SAFEMODE default configuration table.
 *
 * Loaded by cFE Table Services at startup.
 * Ground can uplink updated table images via CFDP.
 *
 * @author CODEX — Luna Ice Mapper FSW Lead
 * @version 0.1 (Phase 1 stub)
 */
#include <stdint.h>
#include <stdbool.h>

/**
 * @brief SafeMode configuration table structure.
 */
typedef struct {
    uint32_t WdtKickIntervalMs;    /**< WDT kick period (must be < timeout)     */
    uint32_t MaxBootRetries;       /**< Boot retry limit before safe-mode entry  */
    uint32_t EpsUndervoltThresh_mV;/**< Battery voltage safe-mode threshold      */
    uint32_t OBCTempLimitDegC;     /**< OBC temperature safe-mode threshold      */
    uint32_t RecoveryDelayS;       /**< Seconds to wait before auto-exit attempt */
    bool     AutoExitEnabled;      /**< Allow autonomous safe-mode exit          */
    uint8_t  Spare[3];
} LIM_SafeMode_TblData_t;

/**
 * @brief Default table values (Phase 1).
 *        Updated at PDR based on EPS and thermal analysis.
 */
const LIM_SafeMode_TblData_t LIM_SafeMode_DefaultTbl = {
    .WdtKickIntervalMs     = 4000u,   /* 4 s kick (8 s WDT timeout)     */
    .MaxBootRetries        = 3u,
    .EpsUndervoltThresh_mV = 3200u,   /* 3.2 V battery minimum          */
    .OBCTempLimitDegC      = 85u,
    .RecoveryDelayS        = 300u,    /* 5-minute recovery window       */
    .AutoExitEnabled       = true,
    .Spare                 = {0, 0, 0},
};
