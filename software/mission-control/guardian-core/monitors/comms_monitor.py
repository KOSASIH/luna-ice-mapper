"""GUARDIAN Mission Control — COMMS Health Monitor
Luna Ice Mapper (LIM-1)

Monitors Communications Subsystem telemetry against limits.yaml
thresholds and emits HealthAlerts.

Author: GUARDIAN Mission Control AI
Version: 1.0.0
"""
from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import List, Optional

from .base_monitor import AlertSeverity, HealthAlert

logger = logging.getLogger("guardian.monitors.comms")


@dataclass
class COMMSTelemetry:
    """COMMS telemetry frame.  Units match limits.yaml."""
    # UHF transceiver
    uhf_rssi:              float = -80.0  # dBm
    uhf_bit_error_rate:    float = 0.0    # dimensionless
    uhf_tx_power:          float = 27.0   # dBm
    uhf_temperature:       float = 25.0   # degC
    # S-band transmitter
    sband_tx_power:        float = 2.0    # W
    sband_temperature:     float = 25.0   # degC
    # Link quality
    comms_loss_hours:      float = 0.0    # hours
    missed_contact_windows: int  = 0      # count
    telemetry_gap_seconds: float = 0.0    # seconds
    ground_contact_active: bool  = False


class COMSMonitor:
    """
    Communications Subsystem health monitor.

    Usage::

        monitor = COMSMonitor()
        alerts  = monitor.check(frame)
    """

    _THRESHOLDS = {
        "uhf_rssi":               {"warning_low": -105.0, "critical_low": -115.0},
        "uhf_bit_error_rate":     {"warning_high":  1e-4,  "critical_high":  1e-3},
        "uhf_tx_power":           {"warning_low":  24.0,  "critical_low":  20.0,
                                   "warning_high": 30.0,  "critical_high": 33.0},
        "uhf_temperature":        {"warning_high": 65.0,  "critical_high": 80.0},
        "sband_tx_power":         {"warning_low":   1.5,  "critical_low":   1.0,
                                   "warning_high":  3.0,  "critical_high":  3.5},
        "sband_temperature":      {"warning_high": 70.0,  "critical_high": 85.0},
        "comms_loss_hours":       {"warning_high": 24.0,  "critical_high": 72.0},
        "missed_contact_windows": {"warning_high":  2,    "critical_high":  5},
        "telemetry_gap_seconds":  {"warning_high": 300.0, "critical_high": 900.0},
    }

    def __init__(self) -> None:
        self._alert_history: List[HealthAlert] = []
        logger.info("COMSMonitor initialised")

    def check(self, telemetry: COMMSTelemetry) -> List[HealthAlert]:
        """Evaluate telemetry frame; return triggered alerts."""
        alerts: List[HealthAlert] = []
        checks = [
            ("uhf_rssi",               telemetry.uhf_rssi,                          "COMMS-RSSI"),
            ("uhf_bit_error_rate",     telemetry.uhf_bit_error_rate,                "COMMS-BER"),
            ("uhf_tx_power",           telemetry.uhf_tx_power,                      "COMMS-UHF-PWR"),
            ("uhf_temperature",        telemetry.uhf_temperature,                   "COMMS-UHF-T"),
            ("sband_tx_power",         telemetry.sband_tx_power,                    "COMMS-SBAND-PWR"),
            ("sband_temperature",      telemetry.sband_temperature,                 "COMMS-SBAND-T"),
            ("comms_loss_hours",       telemetry.comms_loss_hours,                  "COMMS-LOSS"),
            ("missed_contact_windows", float(telemetry.missed_contact_windows),     "COMMS-MISS"),
            ("telemetry_gap_seconds",  telemetry.telemetry_gap_seconds,             "COMMS-GAP"),
        ]
        for param, value, aid in checks:
            alert = self._evaluate(param, value, self._THRESHOLDS.get(param, {}), aid)
            if alert:
                alerts.append(alert)
                self._alert_history.append(alert)
                logger.log(
                    logging.CRITICAL if alert.severity == AlertSeverity.CRITICAL else logging.WARNING,
                    "[COMMS] %s: %s", alert.alert_id, alert.message,
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
            "comms_loss_hours": {
                AlertSeverity.CRITICAL: "ENTER SAFE MODE — enable low-rate beacon, orient for next groundpass",
                AlertSeverity.WARNING:  "Retry link acquisition, boost TX power, verify antenna deployment",
            },
            "uhf_bit_error_rate": {
                AlertSeverity.WARNING: "Fall back to BPSK, reduce data rate, enable Reed-Solomon FEC",
            },
        }
        return HealthAlert(
            subsystem="COMMS",
            alert_id=f"{alert_id}-{severity.value}",
            severity=severity,
            parameter=parameter,
            value=value,
            threshold=threshold_value,
            message=f"COMMS {parameter}={value:.4g} is {direction} ({threshold_value:.4g})",
            recommended_action=recommendations.get(parameter, {}).get(
                severity, "Notify ground, log COMMS diagnostics"
            ),
        )

    @property
    def alert_history(self) -> List[HealthAlert]:
        return list(self._alert_history)

    def clear_history(self) -> None:
        self._alert_history.clear()
