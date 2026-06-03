# ============================================================
# cFE (core Flight Executive) interface library
# Real cFE source imported via nasa/cFS submodule at Phase 2.
# Phase 1: header-only stub library for host simulation builds.
# ============================================================
cmake_minimum_required(VERSION 3.16)

add_library(cfe_stub INTERFACE)
target_include_directories(cfe_stub INTERFACE
    ${CMAKE_CURRENT_SOURCE_DIR}/include
)

message(STATUS "[cFE] Stub library configured (TARGET=${TARGET}).")
