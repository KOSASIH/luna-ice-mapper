# ============================================================
# firmware/core — RTOS core, HAL, boot sequence
# Compiles as a static library: lim_core
# ============================================================
cmake_minimum_required(VERSION 3.16)

set(CORE_SOURCES
    rtos/scheduler.c
    rtos/watchdog.c
    rtos/ipc.c
    boot/boot_sequence.c
)

# Host simulation: add no-op HAL stubs so the library links cleanly
if(DEFINED TARGET AND TARGET STREQUAL "host")
    list(APPEND CORE_SOURCES hal/hal_sim_stubs.c)
endif()

add_library(lim_core STATIC ${CORE_SOURCES})

target_include_directories(lim_core PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}
    ${CMAKE_CURRENT_SOURCE_DIR}/rtos
    ${CMAKE_CURRENT_SOURCE_DIR}/hal
    ${CMAKE_CURRENT_SOURCE_DIR}/boot
    ${CMAKE_SOURCE_DIR}/firmware/cfe/include
    ${CMAKE_SOURCE_DIR}/firmware/applications/config
)

target_link_libraries(lim_core PUBLIC cfe_stub)
target_compile_options(lim_core PRIVATE -Wall -Wextra)

# ---- Host unit tests ----------------------------------------
if(DEFINED TARGET AND TARGET STREQUAL "host")
    add_executable(lim_core_test
        test/test_boot_sequence.c
        test/test_watchdog.c
    )
    target_link_libraries(lim_core_test lim_core)
    add_test(NAME CoreBootTest     COMMAND lim_core_test boot)
    add_test(NAME CoreWatchdogTest COMMAND lim_core_test watchdog)
endif()

message(STATUS "[lim_core] Configured (TARGET=${TARGET}).")
