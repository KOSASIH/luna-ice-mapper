cmake_minimum_required(VERSION 3.16)

add_library(LIM_APP_SAFEMODE STATIC
    fsw/src/lim_app_safemode.c
)

target_include_directories(LIM_APP_SAFEMODE PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}/fsw/src
    ${CMAKE_SOURCE_DIR}/firmware/cfe/include
    ${CMAKE_SOURCE_DIR}/firmware/core
    ${CMAKE_SOURCE_DIR}/firmware/core/rtos
    ${CMAKE_SOURCE_DIR}/firmware/core/hal
    ${CMAKE_SOURCE_DIR}/firmware/core/boot
    ${CMAKE_SOURCE_DIR}/firmware/applications/config
)

target_link_libraries(LIM_APP_SAFEMODE PUBLIC lim_core cfe_stub)
target_compile_options(LIM_APP_SAFEMODE PRIVATE -Wall -Wextra)

message(STATUS "[LIM_APP_SAFEMODE] Configured.")
