/**
 * @file lim_mid_table.h
 * @brief CCSDS Message ID (MID) allocation table — Luna Ice Mapper cFS.
 *
 * All 10 LIM cFS applications communicate via the cFE Software Bus
 * using these CCSDS stream IDs.
 *
 * Convention:
 *   Command MIDs  : 0x18xx  (CCSDS type bit set)
 *   Telemetry MIDs: 0x08xx  (CCSDS type bit clear)
 *
 * Managed exclusively by CODEX. Do not modify without updating
 * this header AND docs/design/fsw/fsw-architecture.md.
 *
 * @author CODEX — Luna Ice Mapper FSW Lead
 * @version 0.1 (Phase 1)
 */
#ifndef LIM_MID_TABLE_H
#define LIM_MID_TABLE_H

#include <stdint.h>

/* =============================================================
 * COMMAND MIDs (0x18xx)
 * ============================================================= */
#define LIM_ADCS_CMD_MID         ((uint16_t)0x1801u) /**< ADCS cmd input          */
#define LIM_EPS_CMD_MID          ((uint16_t)0x1802u) /**< EPS cmd input            */
#define LIM_COMMS_CMD_MID        ((uint16_t)0x1803u) /**< COMMS cmd input          */
#define LIM_NS_CMD_MID           ((uint16_t)0x1804u) /**< Neutron Spec cmd input   */
#define LIM_NIR_CMD_MID          ((uint16_t)0x1805u) /**< NIR Camera cmd input     */
#define LIM_PAYLOAD_CMD_MID      ((uint16_t)0x1806u) /**< Payload Mgr cmd input    */
#define LIM_HK_CMD_MID           ((uint16_t)0x1807u) /**< Housekeeping cmd input   */
#define LIM_FM_CMD_MID           ((uint16_t)0x1808u) /**< File Manager cmd input   */
#define LIM_SCH_CMD_MID          ((uint16_t)0x1809u) /**< Scheduler cmd input      */
#define LIM_SAFEMODE_CMD_MID     ((uint16_t)0x180Au) /**< SafeMode cmd input       */

/* Internal inter-app command MIDs (not uplinked) */
#define LIM_SEND_HK_MID          ((uint16_t)0x1880u) /**< Trigger HK collection   */
#define LIM_WAKEUP_MID           ((uint16_t)0x1881u) /**< SCH 1-Hz wakeup pulse   */

/* =============================================================
 * TELEMETRY MIDs (0x08xx)
 * ============================================================= */
#define LIM_ADCS_HK_TLM_MID      ((uint16_t)0x0801u) /**< ADCS housekeeping TLM   */
#define LIM_EPS_HK_TLM_MID       ((uint16_t)0x0802u) /**< EPS housekeeping TLM    */
#define LIM_COMMS_HK_TLM_MID     ((uint16_t)0x0803u) /**< COMMS housekeeping TLM  */
#define LIM_NS_HK_TLM_MID        ((uint16_t)0x0804u) /**< NS housekeeping TLM     */
#define LIM_NIR_HK_TLM_MID       ((uint16_t)0x0805u) /**< NIR housekeeping TLM    */
#define LIM_PAYLOAD_HK_TLM_MID   ((uint16_t)0x0806u) /**< Payload Mgr HK TLM      */
#define LIM_HK_COMBINED_TLM_MID  ((uint16_t)0x0807u) /**< Combined HK packet      */
#define LIM_FM_HK_TLM_MID        ((uint16_t)0x0808u) /**< File Manager HK TLM     */
#define LIM_SCH_DIAG_TLM_MID     ((uint16_t)0x0809u) /**< Scheduler diagnostic    */
#define LIM_SAFEMODE_HK_TLM_MID  ((uint16_t)0x080Au) /**< SafeMode status TLM     */

/* Science data packets */
#define LIM_NS_SCIENCE_TLM_MID   ((uint16_t)0x0820u) /**< NS science data         */
#define LIM_NIR_SCIENCE_TLM_MID  ((uint16_t)0x0821u) /**< NIR image metadata      */

/* =============================================================
 * Validation macros
 * ============================================================= */
#define LIM_IS_CMD_MID(mid)  (((mid) & 0x1800u) == 0x1800u)
#define LIM_IS_TLM_MID(mid)  (((mid) & 0x1800u) == 0x0800u)

/*
 * MID Allocation Summary
 * App             | Cmd MID | HK TLM  | Science TLM
 * ----------------|---------|---------|------------
 * LIM_APP_ADCS    | 0x1801  | 0x0801  | —
 * LIM_APP_EPS     | 0x1802  | 0x0802  | —
 * LIM_APP_COMMS   | 0x1803  | 0x0803  | —
 * LIM_APP_NS      | 0x1804  | 0x0804  | 0x0820
 * LIM_APP_NIR     | 0x1805  | 0x0805  | 0x0821
 * LIM_APP_PAYLOAD | 0x1806  | 0x0806  | —
 * LIM_APP_HK      | 0x1807  | 0x0807  | —
 * LIM_APP_FM      | 0x1808  | 0x0808  | —
 * LIM_APP_SCH     | 0x1809  | 0x0809  | —
 * LIM_APP_SAFEMODE| 0x180A  | 0x080A  | —
 */

#endif /* LIM_MID_TABLE_H */
