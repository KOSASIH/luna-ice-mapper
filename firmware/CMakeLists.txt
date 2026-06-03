cmake_minimum_required(VERSION 3.16)
project(LunaIceMapper_FSW C)

# ============================================================
# Luna Ice Mapper — Flight Software Build System
# NASA cFS (core Flight System) environment
# ============================================================
# Usage:
#   cmake -B build -DTARGET=host            # Host simulation
#   cmake -B build -DTARGET=arm-none-eabi   # Flight (cross-compile)
#   cmake --build build
# ============================================================

set(CMAKE_C_STANDARD 99)
set(CMAKE_C_STANDARD_REQUIRED ON)

# ---- Target selection ----------------------------------------
if(NOT DEFINED TARGET)
    set(TARGET "host")
endif()
message(STATUS "[LIM-FSW] Building for TARGET=${TARGET}")

# ---- Compiler flags by target --------------------------------
if(TARGET STREQUAL "host")
    add_compile_definitions(LIM_TARGET_HOST=1)
    add_compile_options(-Wall -Wextra -Wpedantic -g -O0)
elseif(TARGET STREQUAL "arm-none-eabi")
    set(CMAKE_C_COMPILER arm-none-eabi-gcc)
    add_compile_definitions(LIM_TARGET_FLIGHT=1)
    add_compile_options(
        -Wall -Wextra
        -mcpu=cortex-r5 -mfpu=vfpv3-d16 -mfloat-abi=hard
        -O2 -ffunction-sections -fdata-sections
    )
    set(CMAKE_EXE_LINKER_FLAGS
        "-Wl,--gc-sections -T${CMAKE_SOURCE_DIR}/firmware/core/lim_memory.ld")
else()
    message(FATAL_ERROR "Unknown TARGET=${TARGET}. Use 'host' or 'arm-none-eabi'.")
endif()

# ---- Global include paths ------------------------------------
include_directories(
    ${CMAKE_SOURCE_DIR}/firmware/cfe/include
    ${CMAKE_SOURCE_DIR}/firmware/core
    ${CMAKE_SOURCE_DIR}/firmware/core/rtos
    ${CMAKE_SOURCE_DIR}/firmware/core/hal
    ${CMAKE_SOURCE_DIR}/firmware/core/boot
    ${CMAKE_SOURCE_DIR}/firmware/applications/config
)

# ---- Subdirectories ------------------------------------------
add_subdirectory(firmware/cfe)
add_subdirectory(firmware/core)
add_subdirectory(firmware/applications/LIM_APP_SAFEMODE)

# ---- Testing -------------------------------------------------
enable_testing()

message(STATUS "[LIM-FSW] Configuration complete.")
message(STATUS "[LIM-FSW] Run: cmake --build ${CMAKE_BINARY_DIR}")
