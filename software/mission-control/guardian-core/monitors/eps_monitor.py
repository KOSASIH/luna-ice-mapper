"""GUARDIAN Mission Control — EPS Health Monitor
Luna Ice Mapper (LIM-1)

Monitors Electrical Power Subsystem telemetry against limits.yaml
thresholds and emits HealthAlerts.

Author: GUARDIAN Mission Control AI
Version: 1.0.0
"""
from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import List, Optional

from .base_monitor import AlertSeverity, HealthAlert

logger = logging.getLogger("guardian.monitors.eps")


@dataclass
class EPSTelemetry:
    """EPS telemetry frame.  Units match limits.yaml."""
    battery_voltage:         float = 0.0    # V
    battery_soc:             float = 0.0    # %
    battery_current:         float = 0.0    # A
    battery_temperature:     float = 20.0   # degC
    solar_power_input:       float = 0.0    # W
    voltage_3v3:             float = 3.3    # V
    voltage_5v:              float = 5.0    # V
    voltage_12v:             float = 12.0   # V
    panel_temperature:       float = 20.0   # degC
    total_power_consumption: float = 0.0    # W


class EPSMonitor:
    """
    Electrical Power Subsystem health monitor.

    Evaluates an EPSTelemetry frame each telemetry cycle (1–10 Hz) and
    returns triggered HealthAlerts.

    Usage::

        monitor = EPSMonitor()
        alerts  = monitor.check(frame)
    """

    _THRESHOLDS = {
        "battery_voltage":         {"warning_low":   6.8, "critical_low":   6.4,
                                     "warning_high":  8.4, "critical_high":  8.6},
        "battery_soc":             {"warning_low":  25.0, "critical_low":  15.0},
        "battery_current":         {"warning_high":  3.5, "critical_high":  4.0},
        "battery_temperature":     {"warning_low": -10.0, "critical_low": -20.0,
                                     "warning_high": 45.0, "critical_high": 55.0},
        "solar_power_input":       {"warning_low":   0.5},
        "voltage_3v3":             {"warning_low":   3.1, "critical_low":   2.9,
                                     "warning_high":  3.5, "critical_high":  3.7},
        "voltage_5v":              {"warning_low":   4.7, "critical_low":   4.5,
                                     "warning_high":  5.3, "critical_high":  5.5},
        "voltage_12v":             {"warning_low":  11.4, "critical_low":  10.8,
                                     "warning_high": 12.6, "critical_high": 13.2},
        "total_power_consumption": {"warning_high": 18.0, "critical_high": 22.0},
    }

    _RECOMMENDATIONS = {
        "battery_voltage": {
            AlertSeverity.CRITICAL: "ENTER SAFE MODE — disable payload, enable beacon",
            AlertSeverity.WARNING:  "Reduce payload duty cycle, defer non-essential ops",
        },
        "battery_soc": {
            AlertSeverity.CRITICAL: "ENTER SAFE MODE — minimum power configuration",
            AlertSeverity.WARNING:  "Reduce power consumption, check solar input",
        },
        "battery_temperature": {
            AlertSeverity.CRITICAL: "ENTER SAFE MODE — activate heater or reduce load",
            AlertSeverity.WARNING:  "Monitor thermal trend, adjust heater setpoints",
        },
        "solar_power_input": {
            AlertSeverity.WARNING: "Verify eclipse schedule, check panel deployment",
        },
        "voltage_3v3": {
            AlertSeverity.CRITICAL: "Cycle 3.3V rail, isolate non-essential loads",
            AlertSeverity.WARNING:  "Monitor rail, log EPS diagnostics",
        },
        "voltage_5v": {
            AlertSeverity.CRITICAL: "Cycle 5V rail, isolate non-essential loads",
            AlertSeverity.WARNING:  "Monitor rail, log EPS diagnostics",
        },
        "voltage_12v": {
            AlertSeverity.CRITICAL: "Cycle 12V rail, isolate non-essential loads",
            AlertSeverity.WARNING:  "Monitor rail, log EPS diagnostics",
        },
        "total_power_consumption": {
            AlertSeverity.CRITICAL: "Shed payload and ADCS reaction wheels immediately",
            AlertSeverity.WARNING:  "Defer high-power operations, review power budget",
        },
    }

    def __init__(self) -> None:
        self._alert_history: List[HealthAlert] = []
        logger.info("EPSMonitor initialised")

    def check(self, telemetry: EPSTelemetry) -> List[HealthAlert]:
        """Evaluate telemetry frame; return any triggered alerts."""
        alerts: List[HealthAlert] = []
        checks = [
            ("battery_voltage",         telemetry.battery_voltage,         "EPS-V-BAT"),
            ("battery_soc",             telemetry.battery_soc,             "EPS-SOC"),
            ("battery_current",         telemetry.battery_current,         "EPS-I-BAT"),
            ("battery_temperature",     telemetry.battery_temperature,     "EPS-T-BAT"),
            ("solar_power_input",       telemetry.solar_power_input,       "EPS-P-SOL"),
            ("voltage_3v3",             telemetry.voltage_3v3,             "EPS-V-3V3"),
            ("voltage_5v",              telemetry.voltage_5v,              "EPS-V-5V"),
            ("voltage_12v",             telemetry.voltage_12v,             "EPS-V-12V"),
            ("total_power_consumption", telemetry.total_power_consumption,  "EPS-P-TOT"),
        ]
        for param, value, aid in checks:
            alert = self._evaluate(param, value, self._THRESHOLDS.get(param, {}), aid)
            if alert:
                alerts.append(alert)
                self._alert_history.append(alert)
                logger.log(
                    logging.CRITICAL if alert.severity == AlertSeverity.CRITICAL else logging.WARNING,
                    "[EPS] %s: %s", alert.alert_id, alert.message,
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
        return HealthAlert(
            subsystem="EPS",
            alert_id=f"{alert_id}-{severity.value}",
            severity=severity,
            parameter=parameter,
            value=value,
            threshold=threshold_value,
            message=f"EPS {parameter}={value:.3f} is {direction} ({threshold_value:.3f})",
            recommended_action=self._RECOMMENDATIONS.get(parameter, {}).get(
                severity, "Notify ground, log diagnostics"
            ),
        )

    @property
    def alert_history(self) -> List[HealthAlert]:
        return list(self._alert_history)

    def clear_history(self) -> None:
        self._alert_history.clear()
