/**
 * @file scheduler.c
 * @brief LIM task scheduler stub (Phase 1).
 * @author CODEX — Luna Ice Mapper FSW Lead
 */
#include "scheduler.h"
#include <string.h>
#include <stdio.h>

static LIM_TaskDescriptor_t s_Tasks[LIM_SCHED_MAX_TASKS];
static uint32_t             s_TaskCount = 0;

void LIM_Sched_Init(void)
{
    memset(s_Tasks, 0, sizeof(s_Tasks));
    s_TaskCount = 0;
    printf("[SCHED] Init (max=%u tasks).\n", LIM_SCHED_MAX_TASKS);
}

bool LIM_Sched_RegisterTask(const LIM_TaskDescriptor_t *Task)
{
    if (!Task || s_TaskCount >= LIM_SCHED_MAX_TASKS) {
        printf("[SCHED] ERROR: register failed (null or full).\n");
        return false;
    }
    s_Tasks[s_TaskCount]            = *Task;
    s_Tasks[s_TaskCount].Registered = true;
    printf("[SCHED] Registered '%s' pri=%d.\n",
           Task->Name, (int)Task->Priority);
    s_TaskCount++;
    return true;
}

void LIM_Sched_Start(void)
{
    printf("[SCHED] Starting %u tasks.\n", s_TaskCount);
    /* TODO Phase 2: RTEMS/VxWorks task creation via cFS PSP */
    for (uint32_t i = 0; i < s_TaskCount; i++) {
        if (s_Tasks[i].TaskFunc) {
            printf("[SCHED] Run '%s'.\n", s_Tasks[i].Name);
            s_Tasks[i].TaskFunc();
        }
    }
}
