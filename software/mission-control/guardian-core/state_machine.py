"""GUARDIAN Mission Control — Spacecraft Mode State Machine
Luna Ice Mapper Mission (LIM-1)

Modes: BOOT, DETUMBLE, SAFE, NOMINAL, SCIENCE, DOWNLINK, ECLIPSE

Author: GUARDIAN Mission Control AI
Version: 1.0.0
"""
from __future__ import annotations

import logging
import math
import time
from dataclasses import dataclass, field
from enum import Enum, auto
from typing import Callable, Dict, List, Optional

logger = logging.getLogger("guardian.state_machine")


# ---------------------------------------------------------------------------
# Spacecraft Mode Definitions
# ---------------------------------------------------------------------------

class SpacecraftMode(Enum):
    """All valid spacecraft operational modes."""
    BOOT      = auto()   # Post-power-on initialisation
    DETUMBLE  = auto()   # Angular-rate reduction via magnetorquers
    SAFE      = auto()   # Minimum-power survival mode
    NOMINAL   = auto()   # Normal operations baseline
    SCIENCE   = auto()   # Active science data collection
    DOWNLINK  = auto()   # Science data transmission to ground
    ECLIPSE   = auto()   # Eclipse / power-conservation mode


# ---------------------------------------------------------------------------
# Telemetry Snapshot
# ---------------------------------------------------------------------------

@dataclass
class TelemetrySnapshot:
    """Current spacecraft telemetry used to evaluate transition conditions."""
    # EPS
    battery_voltage: float = 0.0           # V
    battery_soc: float = 0.0               # %
    solar_power_input: float = 0.0         # W
    total_power_consumption: float = 0.0   # W
    battery_temperature: float = 20.0      # degC

    # ADCS
    roll_rate: float = 0.0     # deg/s
    pitch_rate: float = 0.0    # deg/s
    yaw_rate: float = 0.0      # deg/s
    pointing_error: float = 0.0  # deg
    adcs_consecutive_errors: int = 0

    # COMMS
    comms_loss_hours: float = 0.0
    ground_contact_active: bool = False
    uplink_pending_commands: int = 0

    # THERMAL
    obc_temperature: float = 25.0       # degC
    payload_temperature: float = 20.0   # degC

    # OBC
    obc_healthy: bool = True
    watchdog_resets_today: int = 0
    flash_usage_pct: float = 0.0        # %

    # Derived / flags
    in_eclipse: bool = False
    ground_command_exit_safe: bool = False
    boot_selftest_passed: bool = False
    initialization_complete: bool = False
    detumble_complete: bool = False

    @property
    def total_angular_rate(self) -> float:
        return math.sqrt(
            self.roll_rate ** 2 + self.pitch_rate ** 2 + self.yaw_rate ** 2
        )


# ---------------------------------------------------------------------------
# Transition
# ---------------------------------------------------------------------------

@dataclass
class Transition:
    """Conditional transition between two spacecraft modes."""
    source:      SpacecraftMode
    target:      SpacecraftMode
    condition:   Callable[[TelemetrySnapshot], bool]
    priority:    int = 10          # lower = higher priority
    description: str = ""


# ---------------------------------------------------------------------------
# Mode Actions
# ---------------------------------------------------------------------------

@dataclass
class ModeActions:
    """Callables executed on entry to / exit from a spacecraft mode."""
    on_entry: List[Callable[[], None]] = field(default_factory=list)
    on_exit:  List[Callable[[], None]] = field(default_factory=list)


# ---------------------------------------------------------------------------
# State Event (audit trail)
# ---------------------------------------------------------------------------

@dataclass
class StateEvent:
    """Record of a single state-machine transition."""
    timestamp:           float
    from_mode:           SpacecraftMode
    to_mode:             SpacecraftMode
    trigger_description: str
    telemetry:           Optional[TelemetrySnapshot] = None


# ---------------------------------------------------------------------------
# Spacecraft State Machine
# ---------------------------------------------------------------------------

class SpacecraftStateMachine:
    """
    GUARDIAN spacecraft mode state machine for Luna Ice Mapper (LIM-1).

    Nominal flow::

        BOOT → DETUMBLE → NOMINAL ⇄ SCIENCE ⇄ DOWNLINK
                ↓               ↑
              ECLIPSE ──────────┘
        ANY → SAFE → (recovery + ground cmd) → NOMINAL

    Usage::

        sm = SpacecraftStateMachine()
        new_mode = sm.update(telemetry_snapshot)
    """

    # Thresholds (cross-reference limits.yaml)
    _BAT_CRITICAL_V           = 6.4
    _BAT_RECOVERY_V           = 7.2
    _BAT_RECOVERY_SOC         = 35.0
    _TUMBLE_RATE              = 15.0   # deg/s
    _DETUMBLE_COMPLETE_RATE   = 2.0    # deg/s
    _COMMS_LOSS_CRITICAL_H    = 72.0
    _OBC_WATCHDOG_CRITICAL    = 5
    _BAT_TEMP_CRIT_LOW        = -20.0
    _BAT_TEMP_CRIT_HIGH       = 55.0
    _SCIENCE_MIN_SOC          = 40.0
    _SCIENCE_MIN_V            = 7.0
    _SCIENCE_MAX_POINT_ERR    = 2.0    # deg

    def __init__(self) -> None:
        self._mode:             SpacecraftMode         = SpacecraftMode.BOOT
        self._previous_mode:    Optional[SpacecraftMode] = None
        self._mode_entry_time:  float                  = time.monotonic()
        self._history:          List[StateEvent]        = []
        self._actions:          Dict[SpacecraftMode, ModeActions] = {}
        self._transitions:      List[Transition]        = []
        self._callbacks:        List[Callable[[SpacecraftMode, SpacecraftMode], None]] = []

        self._build_transitions()
        self._register_default_actions()
        logger.info("SpacecraftStateMachine initialised. mode=%s", self._mode.name)

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    @property
    def current_mode(self) -> SpacecraftMode:
        return self._mode

    @property
    def previous_mode(self) -> Optional[SpacecraftMode]:
        return self._previous_mode

    @property
    def time_in_current_mode(self) -> float:
        """Seconds elapsed since last mode transition."""
        return time.monotonic() - self._mode_entry_time

    @property
    def history(self) -> List[StateEvent]:
        return list(self._history)

    def register_transition_callback(
        self, cb: Callable[[SpacecraftMode, SpacecraftMode], None]
    ) -> None:
        """Called with (from_mode, to_mode) on every transition."""
        self._callbacks.append(cb)

    def register_mode_actions(
        self, mode: SpacecraftMode, actions: ModeActions
    ) -> None:
        """Override entry/exit actions for a given mode."""
        self._actions[mode] = actions

    def force_transition(
        self, target: SpacecraftMode, reason: str = "ground_command"
    ) -> None:
        """Unconditional transition (ground command or test override)."""
        logger.warning(
            "FORCED transition %s → %s (reason: %s)",
            self._mode.name, target.name, reason,
        )
        self._do_transition(target, reason, telemetry=None)

    def update(
        self, telemetry: TelemetrySnapshot
    ) -> Optional[SpacecraftMode]:
        """
        Evaluate all transitions for the current mode against *telemetry*.
        Executes the first matching transition (sorted by priority).

        Returns the new mode if a transition fired, else None.
        """
        eligible = sorted(
            [t for t in self._transitions if t.source == self._mode],
            key=lambda t: t.priority,
        )
        for transition in eligible:
            try:
                if transition.condition(telemetry):
                    logger.info(
                        "Transition: %s → %s  [%s]",
                        self._mode.name, transition.target.name,
                        transition.description,
                    )
                    self._do_transition(
                        transition.target, transition.description, telemetry
                    )
                    return self._mode
            except Exception as exc:  # pylint: disable=broad-except
                logger.error(
                    "Error evaluating transition %s → %s: %s",
                    self._mode.name, transition.target.name, exc,
                )
        return None

    def status_report(self) -> dict:
        """Dict suitable for telemetry downlink or logging."""
        return {
            "current_mode": self._mode.name,
            "previous_mode": self._previous_mode.name if self._previous_mode else None,
            "time_in_mode_seconds": round(self.time_in_current_mode, 1),
            "total_transitions": len(self._history),
            "last_transition": (
                {
                    "from": self._history[-1].from_mode.name,
                    "to":   self._history[-1].to_mode.name,
                    "reason": self._history[-1].trigger_description,
                    "ts":   self._history[-1].timestamp,
                }
                if self._history else None
            ),
        }

    def __repr__(self) -> str:
        return (
            f"<SpacecraftStateMachine mode={self._mode.name} "
            f"uptime={self.time_in_current_mode:.0f}s>"
        )

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _do_transition(
        self,
        target: SpacecraftMode,
        description: str,
        telemetry: Optional[TelemetrySnapshot],
    ) -> None:
        from_mode = self._mode

        # Exit actions
        for action in self._actions.get(from_mode, ModeActions()).on_exit:
            try:
                action()
            except Exception as exc:  # pylint: disable=broad-except
                logger.error("Exit action error (%s): %s", from_mode.name, exc)

        self._previous_mode    = from_mode
        self._mode             = target
        self._mode_entry_time  = time.monotonic()

        self._history.append(StateEvent(
            timestamp=time.time(),
            from_mode=from_mode,
            to_mode=target,
            trigger_description=description,
            telemetry=telemetry,
        ))

        # Entry actions
        for action in self._actions.get(target, ModeActions()).on_entry:
            try:
                action()
            except Exception as exc:  # pylint: disable=broad-except
                logger.error("Entry action error (%s): %s", target.name, exc)

        for cb in self._callbacks:
            try:
                cb(from_mode, target)
            except Exception as exc:  # pylint: disable=broad-except
                logger.error("Transition callback error: %s", exc)

    # ------------------------------------------------------------------
    # Transition Table
    # ------------------------------------------------------------------

    def _build_transitions(self) -> None:
        """Register all nominal and anomaly transitions."""

        # ── BOOT ──────────────────────────────────────────────────────
        self._transitions += [
            Transition(
                source=SpacecraftMode.BOOT, target=SpacecraftMode.SAFE,
                priority=1,
                condition=lambda t: not t.boot_selftest_passed,
                description="Boot self-test FAILED → SAFE",
            ),
            Transition(
                source=SpacecraftMode.BOOT, target=SpacecraftMode.DETUMBLE,
                priority=5,
                condition=lambda t: (
                    t.boot_selftest_passed and t.total_angular_rate > 2.0
                ),
                description="Boot complete, tumbling → DETUMBLE",
            ),
            Transition(
                source=SpacecraftMode.BOOT, target=SpacecraftMode.NOMINAL,
                priority=10,
                condition=lambda t: (
                    t.boot_selftest_passed
                    and t.initialization_complete
                    and t.total_angular_rate <= 2.0
                ),
                description="Boot OK, rates nominal → NOMINAL",
            ),
        ]

        # ── DETUMBLE ──────────────────────────────────────────────────
        self._transitions += [
            Transition(
                source=SpacecraftMode.DETUMBLE, target=SpacecraftMode.SAFE,
                priority=1,
                condition=self._safe_mode_condition,
                description="Critical anomaly during DETUMBLE → SAFE",
            ),
            Transition(
                source=SpacecraftMode.DETUMBLE, target=SpacecraftMode.NOMINAL,
                priority=5,
                condition=lambda t: (
                    t.total_angular_rate <= self._DETUMBLE_COMPLETE_RATE
                    and t.detumble_complete
                ),
                description="Detumble complete → NOMINAL",
            ),
        ]

        # ── SAFE ──────────────────────────────────────────────────────
        self._transitions += [
            Transition(
                source=SpacecraftMode.SAFE, target=SpacecraftMode.NOMINAL,
                priority=5,
                condition=lambda t: (
                    t.ground_command_exit_safe
                    and t.battery_voltage   >= self._BAT_RECOVERY_V
                    and t.battery_soc       >= self._BAT_RECOVERY_SOC
                    and t.total_angular_rate <= self._DETUMBLE_COMPLETE_RATE
                    and t.obc_healthy
                    and t.watchdog_resets_today < self._OBC_WATCHDOG_CRITICAL
                ),
                description="Safe recovery confirmed + ground cmd → NOMINAL",
            ),
        ]

        # ── NOMINAL ───────────────────────────────────────────────────
        self._transitions += [
            Transition(
                source=SpacecraftMode.NOMINAL, target=SpacecraftMode.SAFE,
                priority=1,
                condition=self._safe_mode_condition,
                description="Critical anomaly in NOMINAL → SAFE",
            ),
            Transition(
                source=SpacecraftMode.NOMINAL, target=SpacecraftMode.ECLIPSE,
                priority=2,
                condition=lambda t: t.in_eclipse and t.solar_power_input < 0.5,
                description="Eclipse entry → ECLIPSE",
            ),
            Transition(
                source=SpacecraftMode.NOMINAL, target=SpacecraftMode.SCIENCE,
                priority=5,
                condition=lambda t: (
                    t.battery_soc      >= self._SCIENCE_MIN_SOC
                    and t.battery_voltage  >= self._SCIENCE_MIN_V
                    and t.pointing_error   <= self._SCIENCE_MAX_POINT_ERR
                    and not t.in_eclipse
                    and t.total_angular_rate <= 1.0
                ),
                description="Power + pointing OK → SCIENCE",
            ),
        ]

        # ── SCIENCE ───────────────────────────────────────────────────
        self._transitions += [
            Transition(
                source=SpacecraftMode.SCIENCE, target=SpacecraftMode.SAFE,
                priority=1,
                condition=self._safe_mode_condition,
                description="Critical anomaly in SCIENCE → SAFE",
            ),
            Transition(
                source=SpacecraftMode.SCIENCE, target=SpacecraftMode.ECLIPSE,
                priority=2,
                condition=lambda t: t.in_eclipse and t.solar_power_input < 0.5,
                description="Eclipse entry during SCIENCE → ECLIPSE",
            ),
            Transition(
                source=SpacecraftMode.SCIENCE, target=SpacecraftMode.DOWNLINK,
                priority=5,
                condition=lambda t: (
                    t.ground_contact_active and t.flash_usage_pct >= 60.0
                ),
                description="Downlink window + flash >60% → DOWNLINK",
            ),
            Transition(
                source=SpacecraftMode.SCIENCE, target=SpacecraftMode.NOMINAL,
                priority=8,
                condition=lambda t: (
                    t.battery_soc < self._SCIENCE_MIN_SOC
                    or t.pointing_error > self._SCIENCE_MAX_POINT_ERR
                ),
                description="Power or pointing degraded → NOMINAL",
            ),
        ]

        # ── DOWNLINK ──────────────────────────────────────────────────
        self._transitions += [
            Transition(
                source=SpacecraftMode.DOWNLINK, target=SpacecraftMode.SAFE,
                priority=1,
                condition=self._safe_mode_condition,
                description="Critical anomaly in DOWNLINK → SAFE",
            ),
            Transition(
                source=SpacecraftMode.DOWNLINK, target=SpacecraftMode.ECLIPSE,
                priority=2,
                condition=lambda t: t.in_eclipse and t.solar_power_input < 0.5,
                description="Eclipse entry during DOWNLINK → ECLIPSE",
            ),
            Transition(
                source=SpacecraftMode.DOWNLINK, target=SpacecraftMode.NOMINAL,
                priority=5,
                condition=lambda t: (
                    not t.ground_contact_active or t.flash_usage_pct < 20.0
                ),
                description="Downlink session complete → NOMINAL",
            ),
        ]

        # ── ECLIPSE ───────────────────────────────────────────────────
        self._transitions += [
            Transition(
                source=SpacecraftMode.ECLIPSE, target=SpacecraftMode.SAFE,
                priority=1,
                condition=self._safe_mode_condition,
                description="Critical anomaly in ECLIPSE → SAFE",
            ),
            Transition(
                source=SpacecraftMode.ECLIPSE, target=SpacecraftMode.NOMINAL,
                priority=5,
                condition=lambda t: (
                    not t.in_eclipse
                    and t.solar_power_input >= 1.0
                    and t.battery_soc >= 30.0
                ),
                description="Eclipse exit, power positive → NOMINAL",
            ),
        ]

    # ------------------------------------------------------------------
    # Shared Condition Helpers
    # ------------------------------------------------------------------

    def _safe_mode_condition(self, t: TelemetrySnapshot) -> bool:
        """True if ANY critical anomaly warrants SAFE mode entry."""
        reasons: List[str] = []

        if t.battery_voltage < self._BAT_CRITICAL_V:
            reasons.append(f"battery_voltage={t.battery_voltage:.2f}V")
        if t.total_angular_rate > self._TUMBLE_RATE:
            reasons.append(f"angular_rate={t.total_angular_rate:.1f}deg/s")
        if t.comms_loss_hours > self._COMMS_LOSS_CRITICAL_H:
            reasons.append(f"comms_loss={t.comms_loss_hours:.1f}h")
        if t.watchdog_resets_today >= self._OBC_WATCHDOG_CRITICAL:
            reasons.append(f"watchdog_resets={t.watchdog_resets_today}")
        if (
            t.battery_temperature < self._BAT_TEMP_CRIT_LOW
            or t.battery_temperature > self._BAT_TEMP_CRIT_HIGH
        ):
            reasons.append(f"battery_temp={t.battery_temperature:.1f}°C")

        if reasons:
            logger.warning("SAFE mode triggered: %s", "; ".join(reasons))
            return True
        return False

    # ------------------------------------------------------------------
    # Default Mode Actions (stub log hooks)
    # ------------------------------------------------------------------

    def _register_default_actions(self) -> None:
        def _make_entry(mode: SpacecraftMode) -> Callable[[], None]:
            def _entry() -> None:
                logger.info("[ENTRY] %s", mode.name)
                # TODO: wire to command bus
            return _entry

        def _make_exit(mode: SpacecraftMode) -> Callable[[], None]:
            def _exit() -> None:
                logger.info("[EXIT]  %s", mode.name)
            return _exit

        for mode in SpacecraftMode:
            self._actions[mode] = ModeActions(
                on_entry=[_make_entry(mode)],
                on_exit=[_make_exit(mode)],
            )
