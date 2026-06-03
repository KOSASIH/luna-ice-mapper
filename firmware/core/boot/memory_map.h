/**
 * @file memory_map.h
 * @brief Luna Ice Mapper OBC memory layout constants.
 *
 * Target: ARM Cortex-R5 class processor (TI RM57Lx or equivalent).
 * Addresses are representative until OBC vendor selected at PDR (Month 9).
 *
 * @author CODEX — Luna Ice Mapper FSW Lead
 */
#ifndef LIM_MEMORY_MAP_H
#define LIM_MEMORY_MAP_H

/* ---- Flash / ROM -------------------------------------------- */
#define LIM_MEM_FLASH_BASE      0x00000000u
#define LIM_MEM_FLASH_SIZE      (4u * 1024u * 1024u)   /* 4 MB   */
#define LIM_MEM_BOOT_VECTOR     LIM_MEM_FLASH_BASE
#define LIM_MEM_CFE_IMAGE_BASE  0x00010000u

/* ---- SRAM (EDAC-protected) ---------------------------------- */
#define LIM_MEM_SRAM_BASE       0x08000000u
#define LIM_MEM_SRAM_SIZE       (512u * 1024u)          /* 512 KB */
#define LIM_MEM_STACK_TOP       (LIM_MEM_SRAM_BASE + LIM_MEM_SRAM_SIZE)
#define LIM_MEM_HEAP_BASE       0x08010000u
#define LIM_MEM_HEAP_SIZE       (256u * 1024u)          /* 256 KB */

/* ---- SDRAM (science data buffer) ---------------------------- */
#define LIM_MEM_SDRAM_BASE      0x60000000u
#define LIM_MEM_SDRAM_SIZE      (64u * 1024u * 1024u)  /* 64 MB  */

/* ---- NVM / FRAM (non-volatile, radiation-tolerant) ---------- */
#define LIM_MEM_FRAM_BASE            0x00200000u
#define LIM_MEM_FRAM_SIZE            (256u * 1024u)     /* 256 KB */
#define LIM_MEM_BOOT_COUNT_ADDR      (LIM_MEM_FRAM_BASE + 0x00u)
#define LIM_MEM_SAFE_MODE_FLAGS_ADDR (LIM_MEM_FRAM_BASE + 0x04u)
#define LIM_MEM_APP_TABLE_ADDR       (LIM_MEM_FRAM_BASE + 0x100u)

/* ---- Solid-State Recorder (SSR) — 8 GB NAND --------------- */
#define LIM_MEM_SSR_BASE        0xA0000000u

/* ---- Peripheral register base addresses (vendor TBD) ------- */
#define LIM_REG_WDT_BASE        0xFFFFF700u
#define LIM_REG_SPI0_BASE       0xFFF7F400u
#define LIM_REG_SPI1_BASE       0xFFF7F600u
#define LIM_REG_I2C0_BASE       0xFFF7D400u
#define LIM_REG_I2C1_BASE       0xFFF7D500u
#define LIM_REG_UART0_BASE      0xFFF7E400u
#define LIM_REG_CAN0_BASE       0xFFF7DC00u

#endif /* LIM_MEMORY_MAP_H */
