/**
 * @file ipc.h
 * @brief Inter-Process Communication — cFE Software Bus wrapper.
 * @author CODEX — Luna Ice Mapper FSW Lead
 */
#ifndef LIM_IPC_H
#define LIM_IPC_H
#include "cfe.h"
#include <stdbool.h>

#define LIM_IPC_CMD_PIPE_DEPTH 10u
#define LIM_IPC_TLM_PIPE_DEPTH 20u

typedef CFE_SB_PipeId_t  LIM_IPC_PipeId_t;
typedef CFE_SB_MsgId_t   LIM_IPC_MsgId_t;
typedef CFE_SB_MsgPtr_t  LIM_IPC_MsgPtr_t;

static inline bool LIM_IPC_CreatePipe(LIM_IPC_PipeId_t *p, uint16_t d, const char *n)
    { return CFE_SB_CreatePipe(p, d, n) == CFE_SUCCESS; }
static inline bool LIM_IPC_Subscribe(LIM_IPC_MsgId_t m, LIM_IPC_PipeId_t p)
    { return CFE_SB_Subscribe(m, p) == CFE_SUCCESS; }
static inline bool LIM_IPC_Receive(LIM_IPC_MsgPtr_t *b, LIM_IPC_PipeId_t p, int32_t t)
    { return CFE_SB_RcvMsg(b, p, t) == CFE_SUCCESS; }

#endif /* LIM_IPC_H */
