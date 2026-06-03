/**
 * @file boot_sequence.c
 * @brief Luna Ice Mapper OBC power-on boot sequence (Phase 1 stub).
 *
 * Actual hardware-specific code implemented at Phase 2 (PDR).
 *
 * @author CODEX — Luna Ice Mapper FSW Lead
 * @version 0.1
 */
#include "boot_sequence.h"
#include "watchdog.h"
#include <string.h>
#include <stdio.h>

#define LIM_MAX_BOOT_RETRIES 3u

static LIM_BootStatus_t s_BootStatus;

static void     Stage1_InitClocks(void);
static void     Stage2_ScrubMemory(void);
static void     Stage3_ArmWatchdog(void);
static void     Stage4_InitCFE(void);
static void     Stage5_StartApps(void);
static uint32_t ReadResetCause(void);
static uint32_t ReadBootCount(void);
static void     WriteBootCount(uint32_t count);

void LIM_Boot_Init(void)
{
    memset(&s_BootStatus, 0, sizeof(s_BootStatus));
    s_BootStatus.CurrentStage   = LIM_BOOT_STAGE_RESET;
    s_BootStatus.LastResetCause = ReadResetCause();
    s_BootStatus.BootCount      = ReadBootCount() + 1u;
    WriteBootCount(s_BootStatus.BootCount);

    printf("[BOOT] Stage 0 — Reset. Cause=0x%08X BootCount=%u\n",
           s_BootStatus.LastResetCause, s_BootStatus.BootCount);

    if (LIM_Boot_IsSafeModeRequired()) {
        s_BootStatus.SafeModeForced = true;
        printf("[BOOT] Safe-mode entry forced.\n");
    }

    Stage1_InitClocks();
    Stage2_ScrubMemory();
    Stage3_ArmWatchdog();
    Stage4_InitCFE();
    Stage5_StartApps();

    s_BootStatus.CurrentStage = LIM_BOOT_STAGE_COMPLETE;
    printf("[BOOT] Boot sequence complete.\n");
}

LIM_BootStage_t LIM_Boot_GetStage(void) { return s_BootStatus.CurrentStage; }

const LIM_BootStatus_t *LIM_Boot_GetStatus(void) { return &s_BootStatus; }

void LIM_Boot_Abort(uint32_t ErrorCode)
{
    printf("[BOOT] ABORT stage=%d err=0x%08X\n",
           (int)s_BootStatus.CurrentStage, ErrorCode);
    s_BootStatus.CurrentStage = LIM_BOOT_STAGE_ERROR;
    LIM_WDT_ForceReset();
    while (1) { }
}

bool LIM_Boot_IsSafeModeRequired(void)
{
    if (s_BootStatus.BootCount > LIM_MAX_BOOT_RETRIES) return true;
    if (s_BootStatus.LastResetCause & (LIM_RESET_WATCHDOG | LIM_RESET_RADIATION)) return true;
    return false;
}

/* ---- Stage stubs -------------------------------------------- */
static void Stage1_InitClocks(void)
{
    s_BootStatus.CurrentStage = LIM_BOOT_STAGE_CLOCKS;
    printf("[BOOT] Stage 1 — Clocks (stub).\n");
    /* TODO Phase 2: ARM PLL, SDRAM controller, NOR flash timing */
}

static void Stage2_ScrubMemory(void)
{
    s_BootStatus.CurrentStage = LIM_BOOT_STAGE_MEMORY;
    printf("[BOOT] Stage 2 — EDAC memory scrub (stub).\n");
    /* TODO Phase 2: EDAC SECDED scan; log corrected errors to NVM */
}

static void Stage3_ArmWatchdog(void)
{
    s_BootStatus.CurrentStage = LIM_BOOT_STAGE_WATCHDOG;
    LIM_WDT_Init(LIM_WDT_TIMEOUT_8S);
    LIM_WDT_Kick();
    printf("[BOOT] Stage 3 — Watchdog armed (8 s).\n");
}

static void Stage4_InitCFE(void)
{
    s_BootStatus.CurrentStage = LIM_BOOT_STAGE_CFE_INIT;
    printf("[BOOT] Stage 4 — cFE init (stub).\n");
    /* TODO Phase 2: CFE_PSP_Main() via real cFS PSP */
}

static void Stage5_StartApps(void)
{
    s_BootStatus.CurrentStage = LIM_BOOT_STAGE_APPS_START;
    printf("[BOOT] Stage 5 — App table start (stub).\n");
    /* TODO Phase 2: parse cfe_es_startup.scr; launch all 10 LIM apps */
}

/* ---- HW stubs ----------------------------------------------- */
static uint32_t ReadResetCause(void)  { return LIM_RESET_POWER_ON; }
static uint32_t ReadBootCount(void)   { return 0u; }
static void     WriteBootCount(uint32_t c) { (void)c; }
