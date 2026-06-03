/**
 * @file scheduler.h
 * @brief LIM task scheduler interface (cFE execution wrapper).
 *
 * Thin abstraction over cFE task model. On flight, scheduling
 * is handled by RTEMS/VxWorks via cFS PSP. On host, tasks run
 * sequentially for unit testing.
 *
 * @author CODEX — Luna Ice Mapper FSW Lead
 */
#ifndef LIM_SCHEDULER_H
#define LIM_SCHEDULER_H
#include <stdint.h>
#include <stdbool.h>

#define LIM_SCHED_MAX_TASKS 16u

typedef void (*LIM_TaskFunc_t)(void);

typedef enum {
    LIM_TASK_PRIORITY_CRITICAL = 10, /**< SAFEMODE, WDT supervisor    */
    LIM_TASK_PRIORITY_HIGH     = 20, /**< ADCS, EPS, COMMS            */
    LIM_TASK_PRIORITY_MEDIUM   = 30, /**< NS, NIR, PAYLOAD            */
    LIM_TASK_PRIORITY_LOW      = 40, /**< HK, FM                      */
    LIM_TASK_PRIORITY_SYSTEM   = 50, /**< SCH (minor frame clock)     */
} LIM_TaskPriority_t;

typedef struct {
    const char         *Name;
    LIM_TaskFunc_t      TaskFunc;
    LIM_TaskPriority_t  Priority;
    uint32_t            StackSize;
    bool                Registered;
} LIM_TaskDescriptor_t;

void LIM_Sched_Init(void);
bool LIM_Sched_RegisterTask(const LIM_TaskDescriptor_t *Task);
void LIM_Sched_Start(void); /**< Does not return on flight */

#endif /* LIM_SCHEDULER_H */
