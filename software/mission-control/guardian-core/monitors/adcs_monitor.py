"""GUARDIAN Mission Control — ADCS Health Monitor
Luna Ice Mapper (LIM-1)

Monitors Attitude Determination and Control Subsystem telemetry.

Author: GUARDIAN Mission Control AI
Version: 1.0.0
"""
from __future__ import annotations

import logging
import math
from dataclasses import dataclass
from typing import List, Optional

from .base_monitor import AlertSeverity, HealthAlert

logger = logging.getLogger("guardian.monitors.adcs")


@dataclass
class ADCSTelemetry:
    """ADCS telemetry frame.  Units match limits.yaml."""
    roll_rate:             float = 0.0    # deg/s
    pitch_rate:            float = 0.0    # deg/s
    yaw_rate:              float = 0.0    # deg/s
    pointing_error:        float = 0.0    # deg
    quaternion_norm:       float = 1.0    # dimensionless (ideal = 1.0)
    mag_current:           float = 0.0    # A
    mag_temperature:       float = 25.0   # degC
    rw_speed:              float = 0.0    # RPM
    rw_temperature:        float = 25.0   # degC
    star_tracker_stars:    int   = 5      # count
    gyro_bias:             float = 0.0    # deg/s
    accel_bias:            float = 0.0    # m/s^2
    consecutive_errors:    int   = 0
    errors_per_hour:       int   = 0

    @property
    def total_angular_rate(self) -> float:
        return math.sqrt(
            self.roll_rate ** 2 + self.pitch_rate ** 2 + self.yaw_rate ** 2
        )

    @property
    def quaternion_norm_error(self) -> float:
        return abs(self.quaternion_norm - 1.0)


class ADCSMonitor:
    """
    Attitude Determination and Control Subsystem health monitor.

    Usage::

        monitor = ADCSMonitor()
        alerts  = monitor.check(frame)
    """

    _THRESHOLDS = {
        "roll_rate":             {"warning_high":  5.0,  "critical_high": 10.0},
        "pitch_rate":            {"warning_high":  5.0,  "critical_high": 10.0},
        "yaw_rate":              {"warning_high":  5.0,  "critical_high": 10.0},
        "total_angular_rate":    {"warning_high":  8.0,  "critical_high": 15.0},
        "pointing_error":        {"warning_high":  2.0,  "critical_high":  5.0},
        "quaternion_norm_error": {"warning_high":  0.01, "critical_high":  0.05},
        "mag_current":           {"warning_high":  0.4,  "critical_high":  0.5},
        "mag_temperature":       {"warning_high": 60.0,  "critical_high": 75.0},
        "rw_speed":              {"warning_high": 6000,  "critical_high": 7000},
        "rw_temperature":        {"warning_high": 70.0,  "critical_high": 85.0},
        "star_tracker_stars":    {"warning_low":   3,    "critical_low":   2},
        "gyro_bias":             {"warning_high":  0.1,  "critical_high":  0.2},
        "accel_bias":            {"warning_high":  0.05, "critical_high":  0.1},
        "consecutive_errors":    {"warning_high":  2,    "critical_high":  5},
        "errors_per_hour":       {"warning_high":  3,    "critical_high": 10},
    }

    def __init__(self) -> None:
        self._alert_history: List[HealthAlert] = []
        logger.info("ADCSMonitor initialised")

    def check(self, telemetry: ADCSTelemetry) -> List[HealthAlert]:
        """Evaluate telemetry frame; return triggered alerts."""
        alerts: List[HealthAlert] = []
        checks = [
            ("roll_rate",             telemetry.roll_rate,              "ADCS-ROLL"),
            ("pitch_rate",            telemetry.pitch_rate,             "ADCS-PTCH"),
            ("yaw_rate",              telemetry.yaw_rate,               "ADCS-YAW"),
            ("total_angular_rate",    telemetry.total_angular_rate,     "ADCS-RATE"),
            ("pointing_error",        telemetry.pointing_error,         "ADCS-PNTERR"),
            ("quaternion_norm_error", telemetry.quaternion_norm_error,  "ADCS-QNORM"),
            ("mag_current",           telemetry.mag_current,            "ADCS-MAGI"),
            ("mag_temperature",       telemetry.mag_temperature,        "ADCS-MAGT"),
            ("rw_speed",              telemetry.rw_speed,               "ADCS-RWS"),
            ("rw_temperature",        telemetry.rw_temperature,         "ADCS-RWT"),
            ("star_tracker_stars",    float(telemetry.star_tracker_stars), "ADCS-ST"),
            ("gyro_bias",             telemetry.gyro_bias,              "ADCS-GBIAS"),
            ("accel_bias",            telemetry.accel_bias,             "ADCS-ABIAS"),
            ("consecutive_errors",    float(telemetry.consecutive_errors), "ADCS-ERR"),
            ("errors_per_hour",       float(telemetry.errors_per_hour), "ADCS-ERRHR"),
        ]
        for param, value, aid in checks:
            alert = self._evaluate(param, value, self._THRESHOLDS.get(param, {}), aid)
            if alert:
                alerts.append(alert)
                self._alert_history.append(alert)
                logger.log(
                    logging.CRITICAL if alert.severity == AlertSeverity.CRITICAL else logging.WARNING,
                    "[ADCS] %s: %s", alert.alert_id, alert.message,
                )
        return alerts

    def _evaluate(
        self, parameter: str, value: float, thresholds: dict, alert_id: str
    ) -> Optional[HealthAlert]:
        severity, threshold_value, direction = None, 0.0, ""
        if "critical_low"  in thresholds and value < thresholds["critical_low"]:
            severity, threshold_value, direction = AlertSeverity.CRITICAL, thresholds["critical_low"],  "below critical low"
        elif "critical_high" in thresholds and value > thresholds["critical_high"]:
            severity, threshold_value, direction = AlertSeverity.CRITICAL, thresholds["critical_high"], "above critical high"
        elif "warning_low"  in thresholds and value < thresholds["warning_low"]:
            severity, threshold_value, direction = AlertSeverity.WARNING,  thresholds["warning_low"],   "below warning low"
        elif "warning_high" in thresholds and value > thresholds["warning_high"]:
            severity, threshold_value, direction = AlertSeverity.WARNING,  thresholds["warning_high"],  "above warning high"
        if severity is None:
            return None
        recommendations = {
            "total_angular_rate": {
                AlertSeverity.CRITICAL: "ENTER DETUMBLE MODE — enable B-dot, disable reaction wheels",
                AlertSeverity.WARNING:  "Increase ADCS control gain, log attitude history",
            },
            "pointing_error": {
                AlertSeverity.CRITICAL: "Suspend science ops, force star tracker re-acquisition",
                AlertSeverity.WARNING:  "Verify star tracker, recalculate maneuver plan",
            },
            "consecutive_errors": {
                AlertSeverity.CRITICAL: "Reset ADCS controller, failover to backup processor",
                AlertSeverity.WARNING:  "Log ADCS diagnostics, monitor for escalation",
            },
        }
        return HealthAlert(
            subsystem="ADCS",
            alert_id=f"{alert_id}-{severity.value}",
            severity=severity,
            parameter=parameter,
            value=value,
            threshold=threshold_value,
            message=f"ADCS {parameter}={value:.4g} is {direction} ({threshold_value:.4g})",
            recommended_action=recommendations.get(parameter, {}).get(
                severity, "Notify ground, log ADCS diagnostics"
            ),
        )

    @property
    def alert_history(self) -> List[HealthAlert]:
        return list(self._alert_history)

    def clear_history(self) -> None:
        self._alert_history.clear()
