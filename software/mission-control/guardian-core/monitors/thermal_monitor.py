"""GUARDIAN Mission Control — Thermal Health Monitor
Luna Ice Mapper (LIM-1)

Monitors Thermal Control Subsystem telemetry against limits.yaml
thresholds and emits HealthAlerts.

Author: GUARDIAN Mission Control AI
Version: 1.0.0
"""
from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import List, Optional

from .base_monitor import AlertSeverity, HealthAlert

logger = logging.getLogger("guardian.monitors.thermal")


@dataclass
class ThermalTelemetry:
    """Thermal telemetry frame.  All temperatures in degC."""
    # OBC
    obc_cpu_temperature:           float = 25.0
    obc_board_temperature:         float = 25.0
    # Payload
    neutron_spectrometer_temp:     float = 20.0
    nir_camera_temp:               float = 20.0
    detector_temp:                 float = -20.0
    # Battery (cross-reference from EPS; needed here for heater logic)
    battery_temperature:           float = 20.0
    # Structure panels
    panel_xp_temperature:          float = 20.0   # +X face
    panel_xm_temperature:          float = 20.0   # -X face
    panel_yp_temperature:          float = 20.0   # +Y face
    panel_ym_temperature:          float = 20.0   # -Y face
    panel_zp_temperature:          float = 20.0   # +Z face
    panel_zm_temperature:          float = 20.0   # -Z face
    # Heater states
    battery_heater_active:         bool  = False
    payload_heater_active:         bool  = False


class ThermalMonitor:
    """
    Thermal Control Subsystem health monitor.

    Usage::

        monitor = ThermalMonitor()
        alerts  = monitor.check(frame)
    """

    _THRESHOLDS = {
        "obc_cpu_temperature":       {"warning_low": -10.0, "critical_low": -20.0,
                                      "warning_high":  70.0, "critical_high":  85.0},
        "obc_board_temperature":     {"warning_low": -15.0, "critical_low": -25.0,
                                      "warning_high":  65.0, "critical_high":  80.0},
        "neutron_spectrometer_temp": {"warning_low": -30.0, "critical_low": -40.0,
                                      "warning_high":  50.0, "critical_high":  60.0},
        "nir_camera_temp":           {"warning_low": -20.0, "critical_low": -30.0,
                                      "warning_high":  45.0, "critical_high":  55.0},
        "detector_temp":             {"warning_high": -10.0, "critical_high":   0.0},
        "battery_temperature":       {"warning_low": -10.0, "critical_low": -20.0,
                                      "warning_high":  45.0, "critical_high":  55.0},
        # Structural panels share the same limit
        "panel_xp_temperature":      {"warning_low": -60.0, "critical_low": -80.0,
                                      "warning_high":  70.0, "critical_high":  90.0},
        "panel_xm_temperature":      {"warning_low": -60.0, "critical_low": -80.0,
                                      "warning_high":  70.0, "critical_high":  90.0},
        "panel_yp_temperature":      {"warning_low": -60.0, "critical_low": -80.0,
                                      "warning_high":  70.0, "critical_high":  90.0},
        "panel_ym_temperature":      {"warning_low": -60.0, "critical_low": -80.0,
                                      "warning_high":  70.0, "critical_high":  90.0},
        "panel_zp_temperature":      {"warning_low": -60.0, "critical_low": -80.0,
                                      "warning_high":  70.0, "critical_high":  90.0},
        "panel_zm_temperature":      {"warning_low": -60.0, "critical_low": -80.0,
                                      "warning_high":  70.0, "critical_high":  90.0},
    }

    def __init__(self) -> None:
        self._alert_history: List[HealthAlert] = []
        logger.info("ThermalMonitor initialised")

    def check(self, telemetry: ThermalTelemetry) -> List[HealthAlert]:
        """Evaluate telemetry frame; return triggered alerts."""
        alerts: List[HealthAlert] = []
        checks = [
            ("obc_cpu_temperature",       telemetry.obc_cpu_temperature,       "THERM-OBC-CPU"),
            ("obc_board_temperature",     telemetry.obc_board_temperature,     "THERM-OBC-BRD"),
            ("neutron_spectrometer_temp", telemetry.neutron_spectrometer_temp, "THERM-NS"),
            ("nir_camera_temp",           telemetry.nir_camera_temp,           "THERM-NIR"),
            ("detector_temp",             telemetry.detector_temp,             "THERM-DET"),
            ("battery_temperature",       telemetry.battery_temperature,       "THERM-BAT"),
            ("panel_xp_temperature",      telemetry.panel_xp_temperature,      "THERM-XP"),
            ("panel_xm_temperature",      telemetry.panel_xm_temperature,      "THERM-XM"),
            ("panel_yp_temperature",      telemetry.panel_yp_temperature,      "THERM-YP"),
            ("panel_ym_temperature",      telemetry.panel_ym_temperature,      "THERM-YM"),
            ("panel_zp_temperature",      telemetry.panel_zp_temperature,      "THERM-ZP"),
            ("panel_zm_temperature",      telemetry.panel_zm_temperature,      "THERM-ZM"),
        ]
        for param, value, aid in checks:
            alert = self._evaluate(param, value, self._THRESHOLDS.get(param, {}), aid)
            if alert:
                alerts.append(alert)
                self._alert_history.append(alert)
                logger.log(
                    logging.CRITICAL if alert.severity == AlertSeverity.CRITICAL else logging.WARNING,
                    "[THERMAL] %s: %s", alert.alert_id, alert.message,
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
            "battery_temperature": {
                AlertSeverity.CRITICAL: "ENTER SAFE MODE — activate heater (cold) or reduce load (hot)",
                AlertSeverity.WARNING:  "Adjust heater setpoints, monitor trend",
            },
            "neutron_spectrometer_temp": {
                AlertSeverity.CRITICAL: "Halt science ops, enable payload heater",
                AlertSeverity.WARNING:  "Pause observations, increase thermal telemetry rate",
            },
            "obc_cpu_temperature": {
                AlertSeverity.CRITICAL: "Reduce CPU utilisation, adjust spacecraft attitude",
                AlertSeverity.WARNING:  "Defer non-critical processing, monitor trend",
            },
        }
        return HealthAlert(
            subsystem="THERMAL",
            alert_id=f"{alert_id}-{severity.value}",
            severity=severity,
            parameter=parameter,
            value=value,
            threshold=threshold_value,
            message=f"THERMAL {parameter}={value:.1f}°C is {direction} ({threshold_value:.1f}°C)",
            recommended_action=recommendations.get(parameter, {}).get(
                severity, "Notify ground, log thermal diagnostics"
            ),
        )

    @property
    def alert_history(self) -> List[HealthAlert]:
        return list(self._alert_history)

    def clear_history(self) -> None:
        self._alert_history.clear()
