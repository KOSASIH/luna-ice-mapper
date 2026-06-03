/**
 * @file cfe.h
 * @brief cFE (core Flight Executive) stub header — host simulation.
 *
 * Replaced by the real NASA cFS distribution at Phase 2.
 * Provides enough API surface for FSW applications to compile and
 * unit-test without hardware or the full cFS source tree.
 *
 * @author CODEX — Luna Ice Mapper FSW Lead
 * @version 0.1 (Phase 1 skeleton)
 */
#ifndef CFE_H
#define CFE_H

#include <stdint.h>
#include <stddef.h>
#include <stdbool.h>
#include <stdio.h>

/* ---- Return codes -------------------------------------------- */
typedef int32_t CFE_Status_t;
#define CFE_SUCCESS             ((CFE_Status_t)0x00000000)
#define CFE_ES_ERR_APP_CREATE   ((CFE_Status_t)0xC4000001)
#define CFE_SB_BAD_ARGUMENT     ((CFE_Status_t)0xCA000001)
#define CFE_SB_PIPE_RD_ERR      ((CFE_Status_t)0xCA000004)

/* ---- Software Bus types -------------------------------------- */
typedef uint16_t CFE_SB_MsgId_t;
typedef uint32_t CFE_SB_PipeId_t;
typedef void    *CFE_SB_MsgPtr_t;
#define CFE_SB_PEND_FOREVER     (-1)
#define CFE_SB_POLL             (0)

typedef struct { uint16_t StreamId; uint8_t Sequence[2]; uint16_t Length; } CCSDS_PriHdr_t;
typedef struct { CCSDS_PriHdr_t Primary; uint8_t SecHdr[4];  } CFE_SB_CmdHdr_t;
typedef struct { CCSDS_PriHdr_t Primary; uint8_t SecHdr[10]; } CFE_SB_TlmHdr_t;

static inline CFE_Status_t CFE_SB_CreatePipe(CFE_SB_PipeId_t *p, uint16_t d, const char *n)
    { (void)d;(void)n; *p=0; return CFE_SUCCESS; }
static inline CFE_Status_t CFE_SB_Subscribe(CFE_SB_MsgId_t m, CFE_SB_PipeId_t p)
    { (void)m;(void)p; return CFE_SUCCESS; }
static inline CFE_Status_t CFE_SB_RcvMsg(CFE_SB_MsgPtr_t *b, CFE_SB_PipeId_t p, int32_t t)
    { (void)b;(void)p;(void)t; return CFE_SB_PIPE_RD_ERR; }
static inline CFE_SB_MsgId_t CFE_SB_GetMsgId(CFE_SB_MsgPtr_t m) { (void)m; return 0; }

/* ---- Executive Services ------------------------------------- */
#define CFE_ES_RunStatus_APP_RUN    1u
#define CFE_ES_RunStatus_APP_EXIT   2u
#define CFE_ES_RunStatus_APP_ERROR  3u
typedef uint32_t CFE_ES_RunStatus_t;

static inline CFE_Status_t CFE_ES_RegisterApp(void) { return CFE_SUCCESS; }
static inline void CFE_ES_RunLoop(uint32_t *s) { if(s) *s = CFE_ES_RunStatus_APP_EXIT; }
static inline void CFE_ES_WaitForStartupSync(uint32_t t) { (void)t; }
static inline CFE_Status_t CFE_ES_WriteToSysLog(const char *f, ...)
    { (void)f; return CFE_SUCCESS; }

/* ---- Event Services ----------------------------------------- */
#define CFE_EVS_EventType_DEBUG       1u
#define CFE_EVS_EventType_INFORMATION 2u
#define CFE_EVS_EventType_ERROR       3u
#define CFE_EVS_EventType_CRITICAL    4u

static inline CFE_Status_t CFE_EVS_Register(const void *f, uint16_t n, uint16_t s)
    { (void)f;(void)n;(void)s; return CFE_SUCCESS; }
static inline void CFE_EVS_SendEvent(uint16_t id, uint16_t t, const char *s, ...)
    { (void)id;(void)t;(void)s; }

/* ---- Table Services ----------------------------------------- */
typedef int32_t CFE_TBL_Handle_t;
static inline CFE_Status_t CFE_TBL_Register(CFE_TBL_Handle_t *h, const char *n,
    size_t sz, uint16_t opt, void *fn)
    { (void)n;(void)sz;(void)opt;(void)fn; *h=0; return CFE_SUCCESS; }
static inline CFE_Status_t CFE_TBL_GetAddress(void **p, CFE_TBL_Handle_t h)
    { (void)h; *p=NULL; return CFE_SUCCESS; }

/* ---- Time Services ------------------------------------------ */
typedef struct { uint32_t Seconds; uint32_t Subseconds; } CFE_TIME_SysTime_t;
static inline CFE_TIME_SysTime_t CFE_TIME_GetTime(void)
    { CFE_TIME_SysTime_t t={0,0}; return t; }

#endif /* CFE_H */
