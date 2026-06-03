/**
 * @file lim_app_safemode.c
 * @brief LIM_APP_SAFEMODE — autonomous safe-mode manager (Phase 1 stub).
 *
 * Main loop:
 *   1. Init: register app, create SB pipe, subscribe to cmd MID + wakeup
 *   2. Run loop (1 Hz wakeup from SCH):
 *      a. Kick WDT (supervisory)
 *      b. Check anomaly conditions (EPS, thermal, boot retry)
 *      c. Process command pipe (Noop, Enter, Exit, SetThreshold, WdtKick)
 *      d. Publish HK telemetry
 *
 * @author CODEX — Luna Ice Mapper FSW Lead
 * @version 0.1 (Phase 1)
 */
#include "lim_app_safemode.h"
#include <string.h>
#include <stdio.h>

/* ---- Module-private state ------------------------------------ */
static LIM_SafeMode_AppData_t s_AppData;

/* ============================================================
 * Application entry point
 * ============================================================ */
void LIM_SafeMode_AppMain(void)
{
    CFE_ES_RegisterApp();
    LIM_SafeMode_Init();
    CFE_EVS_SendEvent(0, CFE_EVS_EventType_INFORMATION,
                      "LIM_APP_SAFEMODE initialized.");

    s_AppData.RunStatus = CFE_ES_RunStatus_APP_RUN;

    while (s_AppData.RunStatus == CFE_ES_RunStatus_APP_RUN) {
        /* Supervisory WDT kick */
        LIM_SafeMode_KickWatchdog();

        /* Anomaly detection */
        LIM_SafeMode_CheckAnomalies();

        /* Command processing */
        LIM_SafeMode_ProcessCmdPipe();

        /* Housekeeping */
        LIM_SafeMode_SendHkTlm();

        /* Yield to scheduler (real cFS: block on SB message) */
        /* TODO Phase 2: block on CFE_SB_RcvMsg with wakeup MID */
        s_AppData.RunStatus = CFE_ES_RunStatus_APP_EXIT; /* exit after one pass in stub */
    }

    CFE_ES_WriteToSysLog("LIM_APP_SAFEMODE exiting.\n");
}

/* ============================================================
 * Initialization
 * ============================================================ */
void LIM_SafeMode_Init(void)
{
    memset(&s_AppData, 0, sizeof(s_AppData));
    s_AppData.WdtKickIntervalMs = LIM_SAFEMODE_WDT_KICK_PERIOD;

    /* Register with Event Services */
    CFE_EVS_Register(NULL, 0, 0);

    /* Create command pipe and subscribe */
    CFE_SB_CreatePipe(&s_AppData.CmdPipe,
                      LIM_SAFEMODE_PIPE_DEPTH,
                      LIM_SAFEMODE_PIPE_NAME);
    CFE_SB_Subscribe(LIM_SAFEMODE_CMD_MID, s_AppData.CmdPipe);
    CFE_SB_Subscribe(LIM_WAKEUP_MID,       s_AppData.CmdPipe);
    CFE_SB_Subscribe(LIM_SEND_HK_MID,      s_AppData.CmdPipe);

    /* Initialize HK telemetry */
    s_AppData.HkTlm.State       = LIM_SAFEMODE_STATE_NOMINAL;
    s_AppData.HkTlm.WdtArmed    = false;

    /* Check if boot sequence already forced safe mode */
    if (LIM_Boot_IsSafeModeRequired()) {
        LIM_SafeMode_Enter(LIM_SAFEMODE_STATE_BOOT_RETRY);
    }

    printf("[SAFEMODE] App initialized.\n");
}

/* ============================================================
 * WDT supervisory kick
 * ============================================================ */
void LIM_SafeMode_KickWatchdog(void)
{
    LIM_WDT_Kick();
    s_AppData.HkTlm.WdtKickCount++;
}

/* ============================================================
 * Anomaly detection
 * ============================================================ */
void LIM_SafeMode_CheckAnomalies(void)
{
    /*
     * TODO Phase 2: query EPS HK telemetry via SB for bus voltage.
     * TODO Phase 2: query thermal sensor readings via SB.
     * Stubs below illustrate the detection logic.
     */
#ifdef LIM_TARGET_FLIGHT
    /* Placeholder: replace with real EPS SB query */
    uint32_t battery_mv = 3800u;  /* nominal */
    if (battery_mv < LIM_SAFEMODE_EPS_UNDERVOLT_MV) {
        LIM_SafeMode_Enter(LIM_SAFEMODE_STATE_UNDERVOLT);
    }
#endif
    (void)0;
}

/* ============================================================
 * Safe-mode entry
 * ============================================================ */
void LIM_SafeMode_Enter(LIM_SafeModeState_t Reason)
{
    if (s_AppData.HkTlm.State != LIM_SAFEMODE_STATE_NOMINAL) {
        return;  /* already in safe mode */
    }
    s_AppData.HkTlm.State = Reason;
    s_AppData.HkTlm.SafeModeEntryCount++;

    CFE_EVS_SendEvent(1, CFE_EVS_EventType_CRITICAL,
                      "SAFE MODE ENTERED reason=%d", (int)Reason);
    printf("[SAFEMODE] ENTERED state=%d.\n", (int)Reason);

    /*
     * Phase 2 actions:
     *   - Shed non-essential loads (send EPS command)
     *   - Disable science payloads (send PAYLOAD command)
     *   - Set ADCS to sun-pointing mode (send ADCS command)
     *   - Enable beacon-only downlink (send COMMS command)
     */
}

/* ============================================================
 * Safe-mode exit
 * ============================================================ */
void LIM_SafeMode_Exit(void)
{
    if (s_AppData.HkTlm.State == LIM_SAFEMODE_STATE_NOMINAL) {
        return;
    }
    s_AppData.HkTlm.State = LIM_SAFEMODE_STATE_NOMINAL;
    s_AppData.HkTlm.SafeModeExitCount++;

    CFE_EVS_SendEvent(2, CFE_EVS_EventType_INFORMATION,
                      "SAFE MODE EXITED — resuming nominal.");
    printf("[SAFEMODE] EXITED — nominal.\n");

    /*
     * Phase 2 actions:
     *   - Re-enable loads via EPS command
     *   - Re-enable science payload schedule
     *   - Restore ADCS science-pointing mode
     */
}

/* ============================================================
 * Command pipe processing
 * ============================================================ */
void LIM_SafeMode_ProcessCmdPipe(void)
{
    CFE_SB_MsgPtr_t MsgPtr = NULL;
    /* Poll pipe (non-blocking) */
    while (LIM_IPC_Receive(&MsgPtr, s_AppData.CmdPipe, CFE_SB_POLL)) {
        LIM_SafeMode_ProcessCmd(MsgPtr);
    }
}

void LIM_SafeMode_ProcessCmd(CFE_SB_MsgPtr_t MsgPtr)
{
    CFE_SB_MsgId_t MsgId = CFE_SB_GetMsgId(MsgPtr);
    (void)MsgId; /* In stub, MsgId always 0 from cfe.h stub */

    /*
     * Phase 2: switch on actual MsgId / command code.
     * Here we just count accepted commands.
     */
    s_AppData.HkTlm.CmdAcceptCount++;
    printf("[SAFEMODE] Command processed.\n");
}

/* ============================================================
 * Housekeeping telemetry
 * ============================================================ */
void LIM_SafeMode_SendHkTlm(void)
{
    s_AppData.HkTlm.WdtArmed = LIM_WDT_IsArmed();
    printf("[SAFEMODE] HK state=%d wdtKicks=%u entries=%u exits=%u\n",
           (int)s_AppData.HkTlm.State,
           s_AppData.HkTlm.WdtKickCount,
           s_AppData.HkTlm.SafeModeEntryCount,
           s_AppData.HkTlm.SafeModeExitCount);
    /* TODO Phase 2: CFE_SB_SendMsg to publish LIM_SAFEMODE_HK_TLM_MID */
}
