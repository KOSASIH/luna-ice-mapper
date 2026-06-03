"""GUARDIAN Mission Control — Shared Monitor Base Types
Luna Ice Mapper (LIM-1)

Shared alert severity enum and HealthAlert dataclass used by all
subsystem monitors.

Author: GUARDIAN Mission Control AI
Version: 1.0.0
"""
from __future__ import annotations

from dataclasses import dataclass
from enum import Enum


class AlertSeverity(Enum):
    INFO     = "INFO"
    WARNING  = "WARNING"
    CRITICAL = "CRITICAL"


@dataclass
class HealthAlert:
    """A health alert emitted by a subsystem monitor."""
    subsystem:           str
    alert_id:            str
    severity:            AlertSeverity
    parameter:           str
    value:               float
    threshold:           float
    message:             str
    recommended_action:  str = ""
