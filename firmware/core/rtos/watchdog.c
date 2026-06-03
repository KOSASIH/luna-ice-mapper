/**
 * @file watchdog.c
 * @brief Hardware watchdog stub implementation (Phase 1).
 *
 * Host: counter-based simulation.
 * Flight: ARM IWDG/WWDG peripheral (Phase 2).
 *
 * @author CODEX — Luna Ice Mapper FSW Lead
 */
#include "watchdog.h"
#include <string.h>
#include <stdio.h>

static LIM_WDT_Status_t s_WDT;

void LIM_WDT_Init(uint32_t TimeoutMs)
{
    memset(&s_WDT, 0, sizeof(s_WDT));
    s_WDT.TimeoutMs = TimeoutMs;
    printf("[WDT] Init timeout=%u ms.\n", TimeoutMs);
    /* TODO Phase 2: configure IWDG prescaler/reload registers */
}

void LIM_WDT_Kick(void)
{
    s_WDT.KickCount++;
    printf("[WDT] Kick #%u.\n", s_WDT.KickCount);
    /* TODO Phase 2: write reload key to IWDG_KR */
}

void LIM_WDT_Arm(void)
{
    s_WDT.Armed = true;
    printf("[WDT] Armed.\n");
    /* TODO Phase 2: start watchdog peripheral (irreversible in flight) */
}

void LIM_WDT_Disarm(void)
{
#ifdef LIM_TARGET_HOST
    s_WDT.Armed = false;
    printf("[WDT] Disarmed (host sim only).\n");
#else
    printf("[WDT] WARNING: Disarm ignored on flight hardware.\n");
#endif
}

void LIM_WDT_ForceReset(void)
{
    printf("[WDT] FORCE RESET.\n");
#ifdef LIM_TARGET_HOST
    /* In unit tests this path is mocked; in host integration just return */
    return;
#else
    while (1) { } /* WDT expires due to no kick */
#endif
}

bool LIM_WDT_IsArmed(void) { return s_WDT.Armed; }

const LIM_WDT_Status_t *LIM_WDT_GetStatus(void) { return &s_WDT; }
