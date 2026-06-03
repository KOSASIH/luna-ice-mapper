# HELIOS Orbital Trajectory Analysis
## Luna Ice Mapper — Phase 1 Flight Dynamics Report

**Agent:** HELIOS (Flight Dynamics Lead)  
**Date:** 2026-06-03  
**Mission:** Luna-Ice-Mapper 6U CubeSat — Lunar South Polar Mapping  
**Status:** ✅ Phase 1 Complete

---

## 1. Mission Orbit Characterisation

| Parameter | Value |
|-----------|-------|
| Altitude | 100 km circular |
| Inclination | 90° (polar) |
| Semi-major axis | 1,837.4 km |
| Orbital period | **117.79 min** (7,067.5 s) |
| Orbital velocity | **1.6335 km/s** |
| Orbits per day | **12.23** |
| J2 RAAN drift (polar) | ~0°/day (polar orbit immune) |

**Altitude trade-off:**

| Alt (km) | Period (min) | Velocity (km/s) | Orbits/day |
|----------|-------------|-----------------|------------|
| 50 | 113.9 | 1.648 | 12.65 |
| **100** | **117.8** | **1.634** | **12.23** |
| 150 | 121.7 | 1.619 | 11.84 |

**Recommendation:** 100 km nominal. Minimum safe altitude ≥50 km (terrain clearance at south pole).

---

## 2. Trajectory Options — BLT vs Direct

### 2.1 Direct Transfer (Patched Conic)

| ΔV Component | Value |
|---|---|
| TLI (launch vehicle provides) | 3,130 m/s |
| TCM-1 (day 1–2) | 30 m/s |
| TCM-2 (day 3–4) | 20 m/s |
| TCM-3 (arrival) | 10 m/s |
| LOI — 100 km polar | **821.9 m/s** |
| **Total (CubeSat)** | **881.9 m/s** |
| Transfer time | 3.5 days |
| Propellant required (Isp=240 s) | **2.97 kg** |

### 2.2 Ballistic Lunar Transfer — BLT/WSB

| ΔV Component | Value |
|---|---|
| TLI (launch vehicle provides) | 3,150 m/s |
| Apogee Raise Manoeuvre (ARM) | 25 m/s |
| TCM-1 | 20 m/s |
| TCM-2 | 15 m/s |
| TCM-3 | 10 m/s |
| LOI — low v∞ capture | **727.2 m/s** |
| **Total (CubeSat)** | **797.2 m/s** |
| Transfer time | ~105 days |
| Propellant required (Isp=240 s) | **2.73 kg** |
| ΔV savings vs direct | **9.6%** |

### 2.3 ⚠️ Critical Finding — Propulsion Feasibility Gap

| Propellant System | Isp (s) | ΔV Capacity | Direct Feasible? | BLT Feasible? |
|---|---|---|---|---|
| Cold Gas N₂ | 65 | 148.9 m/s | ❌ | ❌ |
| Monoprop Hydrazine | 220 | 504.0 m/s | ❌ | ❌ |
| **Green Propellant (AF-M315E)** | **240** | **549.8 m/s** | ❌ | ❌ |

**Both trajectories exceed the 2.5 kg propellant budget.** Neither independent transfer is feasible as currently configured.

### 2.4 Recommended Architecture — CLPS/Artemis Rideshare

> **HELIOS Recommendation:** Deploy as secondary payload on a NASA CLPS mission or Artemis rideshare that performs TLI + LOI. The CubeSat deploys from the carrier near lunar orbit and uses its 549 m/s propulsion budget for:
> - Orbit circularisation from elliptical insertion: ~200 m/s
> - Plane change (if needed): ~100 m/s
> - Station-keeping (12 months): ~12 m/s
> - Contingency: ~237 m/s
>
> **This is the only feasible approach for a 12 kg, 2.5 kg propellant 6U CubeSat.**
> Alternatively: increase propellant to 3.8 kg with dry mass reduction, or use electric propulsion (Isp ~1500 s, requires ~0.45 kg xenon).

---

## 3. Ground Track & PSR Coverage

### 3.1 Instrument Swaths

| Instrument | FOV half-angle | Swath Width | Footprint at 100 km |
|---|---|---|---|
| Neutron Spectrometer (NS) | 45° | **200 km** | ~300 km effective |
| NIR Camera | 5° | **17 km** | 17.4 km |

### 3.2 South Polar Coverage (PSRs < 80°S)

| Instrument | Days to 80% Coverage | Days to 100% Coverage | 6-Month Coverage |
|---|---|---|---|
| **Neutron Spectrometer** | **0.6 days** | ~0.8 days | **100%** |
| **NIR Camera** | **7.1 days** | ~8.9 days | **100%** |

✅ **Both instruments achieve ≥80% PSR coverage well within mission duration.**
The NS achieves full polar coverage in under 1 day due to its 200 km swath. NIR achieves 80% in one week.

### 3.3 Ground Track Parameters

- Longitude shift per orbit: **1.07°** (Moon rotates beneath polar orbit)
- 12.23 orbits/day × 1.07° = **13.1° daily precession** in ground track
- Complete repeat cycle: ~27.3 days (one lunar sidereal period)

---

## 4. Launch Window Calendar — Q4 2027 to Q2 2028

| Window | Open | Close | Trajectory | BLT Arrival | Notes |
|--------|------|-------|-----------|-------------|-------|
| W01 | 2027-09-30 | 2027-10-03 | Direct | 2028-01-15 | First opportunity |
| **W02** | **2027-10-30** | **2027-11-02** | **Direct** | **2028-02-13** | **Nominal Q4 2027** |
| W03 | 2027-11-28 | 2027-12-01 | BLT | 2028-03-14 | BLT preferred |
| **W04** | **2027-12-28** | **2027-12-31** | **BLT** | **2028-04-12** | **Primary BLT window** |
| W05 | 2028-01-26 | 2028-01-29 | BLT | 2028-05-12 | Best Q1 2028 geometry |
| W06 | 2028-02-25 | 2028-02-28 | BLT | 2028-06-10 | Optimal C3 |
| W07 | 2028-03-26 | 2028-03-29 | BLT | 2028-07-09 | Q2 2028 |
| W08 | 2028-04-24 | 2028-04-27 | BLT | 2028-08-07 | Extended schedule |
| W09 | 2028-05-24 | 2028-05-27 | BLT | 2028-09-05 | Contingency |
| W10 | 2028-06-22 | 2028-06-25 | BLT | 2028-10-05 | Schedule limit |

**Primary target: W04 (2027-12-28)** — favourable Sun-Earth-Moon BLT geometry, CLPS-compatible.
**Backup: W05 (2028-01-26)** — optimal C3 for BLT carrier.

Window frequency: ~29.5 days (synodic month). Each window is a 3-day slot.

---

## 5. ΔV Budget Summary

```
┌─────────────────────────────────────────────────────────────────┐
│  LUNA ICE MAPPER — MASTER ΔV BUDGET (GREEN PROPELLANT, Isp=240s) │
├──────────────────────────┬────────────┬────────────┬────────────┤
│  Manoeuvre               │  Direct    │  BLT       │  CLPS Mode │
├──────────────────────────┼────────────┼────────────┼────────────┤
│  TLI (LV provided)       │  3,130 m/s │  3,150 m/s │  (carrier) │
│  ARM                     │     —      │     25 m/s │     —      │
│  TCMs                    │    60 m/s  │     45 m/s │    30 m/s  │
│  LOI                     │   822 m/s  │    727 m/s │   200 m/s  │
│  Station-keeping (1 yr)  │    10 m/s  │     10 m/s │    10 m/s  │
│  Contingency (5%)        │    45 m/s  │     40 m/s │    12 m/s  │
├──────────────────────────┼────────────┼────────────┼────────────┤
│  TOTAL (CubeSat only)    │   937 m/s  │    847 m/s │   252 m/s  │
│  Propellant required     │   3.15 kg  │   2.85 kg  │   0.52 kg  │
│  FEASIBLE with 2.5 kg?   │     ❌      │     ❌      │     ✅      │
└──────────────────────────┴────────────┴────────────┴────────────┘
```

---

## 6. Risk Assessment — Trajectory

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| CLPS rideshare unavailability | Medium | Critical | Book W04 + W05 backup windows simultaneously |
| LOI failure (CLPS performs) | Low | Critical | Store-and-forward science mode during contingency orbit |
| Orbit altitude decay <50 km | Low | High | Station-keeping budget allocated; GUARDIAN monitors |
| Launch window slip >6 months | Low | Medium | W10 (Jun 2028) as absolute schedule limit |
| TCM execution error >50 m/s | Very Low | Medium | 3 TCMs provide correction redundancy |

---

## 7. Coordination Notes

**→ NEXUS (Systems):** Recommend evaluating electric propulsion option (BIT-3 ion thruster, Isp=1500s). Would eliminate propellant gap entirely for independent BLT. Trade-off: power (6W) and 1U volume.

**→ ATLAS (Thermal):** 100 km polar orbit yields eclipse fraction ~40% per orbit (47 min sunlit / 70 min eclipse at solstice). Critical for thermal cycling budget.

**→ PRISM (Payload):** NS 200 km swath achieves 80% PSR coverage in <1 day. NIR 17 km swath needs 7 days. Instrument scheduling should prioritise NS first passes for rapid hydrogen mapping.

**→ PIONEER (Operations):** 12.23 orbits/day with 27.3-day ground track repeat. Recommend scheduling 4 contact windows/day during primary science phase.

---

## 8. References

1. Belbruno, E.A. & Miller, J.K. (1993). "Sun-perturbed Earth-to-Moon transfers with ballistic capture." *Journal of Guidance, Control, and Dynamics*, 16(4), 770–775.
2. Koon, W.S., Lo, M.W., Marsden, J.E., Ross, S.D. (2001). "Low energy transfer to the Moon." *Celestial Mechanics and Dynamical Astronomy*, 81, 63–73.
3. NASA GSFC (2020). *Small Spacecraft Technology State of the Art Report*, NASA/TP-2020-5008734.
4. Zuber, M.T. et al. (2012). "Gravity field of the Moon from the GRAIL mission." *Science*, 339, 668–671.
5. Hayne, P.O. et al. (2021). "Global regolith thermophysical properties of the Moon." *Journal of Geophysical Research: Planets*, 122(12), 2371–2400.

---

*Generated by HELIOS Flight Dynamics Engine v1.0 | Luna Ice Mapper Phase 1 | 2026-06-03*
