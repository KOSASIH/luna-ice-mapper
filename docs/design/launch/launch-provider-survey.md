# Launch Provider Survey — Luna Ice Mapper (6U CubeSat)
## Document: docs/design/launch/launch-provider-survey.md
**Version:** 1.0 | **Status:** Phase 1 Draft | **Author:** STELLARIS — Launch Operations Lead
**Date:** 2026-06-03 | **Mission:** Luna Ice Mapper — Lunar South Polar Water-Ice Mapping

---

## 1. Executive Summary

Luna Ice Mapper is a 6U CubeSat (≈12–14 kg, 366 × 226 × 100 mm) targeting a low-altitude polar lunar orbit (~100 km, 85–90° inclination) to map water-ice in the lunar south polar region. The mission requires Trans-Lunar Injection (TLI) capability or delivery to a TLI-enabling orbit. The baseline trajectory is a **Ballistic Lunar Transfer (BLT)**, which exploits Sun-Earth-Moon Lagrange dynamics to minimize ΔV (~600–800 m/s post-separation, vs. ~3,100 m/s for direct transfer), accepting a longer cruise (~90–120 days) in exchange for propellant mass savings that are critical for a 6U bus.

This survey evaluates five launch provider categories for 2027–2028 availability:

| Priority | Provider / Path | TLI? | Estimated Cost | Feasibility |
|----------|----------------|-------|----------------|-------------|
| 1 | NASA CSLI + CLPS Lunar Rideshare | Yes (via CLPS) | $0 (CSLI) | Medium — competitive |
| 2 | Rocket Lab Electron + Photon tug | Yes (Photon) | $7–9 M (dedicated) | High — proven lunar TLI |
| 3 | SpaceX Transporter + onboard propulsion | LEO only → BLT self-propelled | $80–120k | High avail. / low ΔV margin |
| 4 | ISRO PSLV-XL rideshare (via BRIN) | LEO/SSO only | $15–30k/kg | Medium — partnership upside |
| 5 | Dedicated Lunar CubeSat Bus (CLPS providers) | Yes | TBD / CLPS | High capability, schedule risk |

**Recommendation (primary):** Pursue NASA CSLI + CLPS lunar rideshare as primary path (no-cost, mission-enabling TLI). Execute parallel negotiations with Rocket Lab Photon as the technical backup. Monitor ISRO Chandrayaan-4 auxiliary payload opportunity given the Indonesia–BRIN partnership.

---

## 2. Trajectory Background — Why TLI Matters

### 2.1 Direct Lunar Transfer
- ΔV budget: ~3,100 m/s (TLI) + ~900 m/s (lunar orbit insertion, LOI)
- Transit time: 3–5 days
- Requires dedicated upper stage providing TLI — impractical for 6U mass budget unless the launch vehicle provides TLI directly.

### 2.2 Ballistic Lunar Transfer (BLT) — Baseline
- ΔV budget: **~600–800 m/s** (post-TLI correction) + ~900 m/s LOI
- Transit time: 90–120 days
- Physics: Exploits the Sun-Earth-Moon Weak Stability Boundary (WSB); spacecraft coasts to ~1.5 million km before being recaptured by lunar gravity.
- Heritage: JAXA HITEN (1990), ESA SMART-1 (2003), NASA CAPSTONE (2022).
- **Implication:** The launch vehicle or an upper stage must still provide the initial TLI burn (C3 ≈ −0.7 to −1.2 km²/s²). After separation the spacecraft's onboard propulsion handles trajectory correction maneuvers (TCMs) and LOI.
- **6U propulsion baseline:** BGT-X5 or Bradford ECAPS 1N HPGP monoprop thruster cluster; ΔV ≈ 250–350 m/s from 0.8 kg propellant mass — sufficient for TCMs but NOT for self-propelled TLI from LEO.

### 2.3 Consequence for Launch Provider Selection
A launch vehicle that drops to LEO/SSO **without** providing TLI forces the spacecraft to carry propulsion capable of executing TLI (~3,100 m/s) — impossible within 6U mass limits. Therefore:
- **TLI-providing options are mission-enabling; LEO-only options require a propulsive tug or are disqualifying unless a partner tug is manifest.**

---

## 3. Provider Assessments

### 3.1 NASA CubeSat Launch Initiative (CSLI) + CLPS

#### 3.1.1 CSLI Overview
- **Program:** NASA Education and Communications, Headquarters
- **Cost:** No cost to approved missions (in-kind contribution)
- **Process:** Educational/non-profit/government missions submit CubeSat Mission Profile (CMP); NASA assigns a manifest slot
- **Normal manifest:** Primarily LEO ISS re-boost or rideshare to SSO — does NOT inherently provide TLI

#### 3.1.2 CSLI Lunar Opportunity — Artemis / CLPS Integration
- NASA has manifested CubeSats on Artemis SLS as secondary payloads with TLI (Artemis 1: 13 6U CubeSats, 2022)
- **Future Artemis manifests (Artemis II onward):** Crewed; secondary payloads restricted
- **CLPS (Commercial Lunar Payload Services):** NASA contracts CLPS task orders to commercial landers; secondary payload slots (CubeSat-class) are sometimes available on lander decks
  - Active CLPS providers: Intuitive Machines (Nova-C), Firefly Aerospace (Blue Ghost), Astrobotic (Griffin/Peregrine)
  - CubeSat deployment from CLPS: Spacecraft typically ejected from lander prior to lunar orbit insertion or after lunar orbit capture — provides effective TLI + LLO

#### 3.1.3 Application Strategy
1. Submit CubeSat Mission Profile to NASA CSLI by **Q3 2026** (18-month lead minimum for 2028 manifest)
2. Simultaneously pursue CLPS Task Order 19D/20C secondary payload call (watch NASA SAA/BAA postings)
3. Leverage Indonesian LAPAN/BRIN co-investigator for international partnership credibility
4. **Key contact:** NASA Ames Research Center, Small Spacecraft Systems Virtual Institute (SSSVI)

#### 3.1.4 TLI Assessment: ✅ YES (via CLPS lander) | ⚠️ CONDITIONAL (CSLI Artemis manifest unlikely post-Artemis I)

| Parameter | Value |
|-----------|-------|
| TLI Provided | Yes, via CLPS lander trajectory |
| C3 at Separation | −0.5 to +0.5 km²/s² (lander-dependent) |
| Separation Environment | 6U P-POD or CSD equivalent |
| Interface Standard | NASA SLS-SPEC-159 or CLPS provider ICD |
| Schedule Risk | High — competitive selection; 18–24 month lead |
| Cost | $0 (CSLI) + integration cost (~$200–500k) |
| Heritage | Artemis 1 CubeSats (2022), LunaH-Map, BioSentinel |

---

### 3.2 Rocket Lab Electron + Photon Upper Stage

#### 3.2.1 Electron Overview
- **Vehicle:** Two-stage liquid rocket; payload to LEO ~300 kg, to SSO ~200 kg
- **Photon:** Restartable upper stage (liquid kick stage); heritage: CAPSTONE (2022) — provided TLI for 12U CubeSat
- **Launch Sites:** LC-1 Mahia, New Zealand; LC-2 Wallops Island VA, USA
- **Cost (dedicated small 6U mission):** $7–9 M (dedicated Electron); rideshare on Electron possible at ~$1–3 M depending on manifest

#### 3.2.2 TLI Capability via Photon
- CAPSTONE mission demonstrated Photon providing TLI to a near-rectilinear halo orbit (NRHO) around the Moon
- **Photon Lunar capability:** C3 range −2 to +0.5 km²/s²; demonstrated transit to lunar vicinity
- Luna Ice Mapper can leverage identical profile: Photon provides TLI, spacecraft executes TCMs + LOI
- **BLT variant available:** Photon can target WSB injection for BLT trajectory

#### 3.2.3 Assessment: ✅ STRONG — Proven lunar TLI, heritage CAPSTONE

| Parameter | Value |
|-----------|-------|
| TLI Provided | Yes — Photon upper stage |
| C3 at Separation | Programmable; BLT target achievable |
| Mission Heritage | CAPSTONE (2022), NRHO insertion |
| Separation System | 6U CubeSat dispenser |
| Cost (dedicated) | $7–9 M |
| Cost (rideshare) | $1–3 M (subject to manifest availability) |
| Schedule (2027–2028) | Launch window: 4–6 lunation opportunities/year |
| Key Contact | Rocket Lab Business Development, Launch Integration Team |
| Risk | Medium — schedule dependent on primary manifest |

---

### 3.3 SpaceX Transporter Rideshare

#### 3.3.1 Program Overview
- **Service:** Quarterly dedicated SmallSat rideshare missions to SSO (~97°, ~500–525 km alt)
- **Cost:** $5,500–6,000/kg to SSO (commercial rate)
- **6U CubeSat mass (12 kg):** ≈ $66,000–72,000 launch cost
- **Availability:** ~3–4 missions/year; 2027–2028 slots available
- **Interface:** Standard 6U CubeSat deployer (ISIPOD, NanoAvionics, SpaceFlight Inc. via LV)

#### 3.3.2 TLI Assessment: ❌ NO — SSO only
- Transporter delivers to ~525 km SSO. No TLI capability.
- **To reach the Moon from SSO:** Requires onboard ΔV of ~3,100 m/s — infeasible for 6U.
- **Option A — Propulsive tug:** Charter a Momentus Vigoride or D-Orbit ION tug to raise orbit and execute TLI from SSO. Adds ~$500k–1M, but Momentus does not yet have lunar TLI heritage.
- **Verdict:** SpaceX Transporter is unsuitable as a standalone lunar launch path. May serve as a technology demonstrator opportunity (deploy to LEO for system validation) if budget allows a 2026 test flight before the primary lunar launch.

| Parameter | Value |
|-----------|-------|
| TLI Provided | ❌ No |
| Orbit Delivered | SSO ~525 km, 97.6° |
| Cost (6U) | ~$66,000–72,000 |
| Use Case | Technology demo / LEO validation only |

---

### 3.4 ISRO PSLV-XL / SSLV (Indonesia–BRIN Partnership)

#### 3.4.1 Program Overview
- **PSLV-XL:** India's workhorse launch vehicle; proven 50+ flights; payload to SSO ~1,750 kg
- **SSLV:** New small satellite launch vehicle; payload to SSO ~500 kg
- **Indonesia connection:** BRIN has bilateral MOU with ISRO; LAPAN-A series satellites launched on PSLV
- **Cost (rideshare):** PSLV-XL rideshare: ~$15,000–25,000/kg; 6U (12 kg) → ~$180,000–300,000

#### 3.4.2 TLI Assessment
- Standard PSLV/SSLV missions: ❌ No TLI
- **Chandrayaan-4 auxiliary payload:** ⚠️ Conditional — BRIN co-investigator track may unlock a secondary slot on a lunar-bound PSLV mission

| Parameter | Value |
|-----------|-------|
| TLI Provided (Standard) | ❌ No |
| TLI Provided (Chandrayaan-4 auxiliary) | ⚠️ Possible — diplomatic track |
| Cost (standard rideshare) | ~$180,000–300,000 |
| Indonesian Partnership Leverage | High — BRIN MOU with ISRO |
| Recommendation | Pursue BRIN–ISRO diplomatic channel; treat as tertiary option |

---

### 3.5 Dedicated Lunar CubeSat Buses / CLPS Providers

| Provider | Vehicle | TLI? | Heritage | Notes |
|----------|---------|-------|----------|-------|
| Astrobotic | Griffin Lander | ✅ Yes | Peregrine (2024, partial) | CLPS TO 19D; reliability improvement ongoing |
| Intuitive Machines | Nova-C | ✅ Yes | IM-1 (2024, successful landing) | IM-3/4 planned 2027 |
| Firefly Aerospace | Blue Ghost | ✅ Yes | IM-2 2025 planned | CLPS TO 20C |
| ispace (JP/US) | Series 2 Micro Lander | ✅ Yes | Hakuto-R Msn 1 (2023, anomaly) | S. polar target; Series 2 LLs incorporated |
| Momentus Vigoride | In-space tug | ❌ No | LEO only | Not suitable for TLI |

---

## 4. Comparative TLI Summary Matrix

| Provider | TLI? | 2027–28 Slot | Cost (6U) | Risk | Recommendation |
|----------|-------|--------------|-----------|------|----------------|
| NASA CSLI + CLPS | ✅ Yes | Possible | ~$0–500k | Medium | **PRIMARY** |
| Rocket Lab Photon | ✅ Yes (proven) | Yes | $1–9M | Medium-Low | **BACKUP #1** |
| SpaceX Transporter | ❌ No | High | ~$72k | Low | LEO Demo Only |
| ISRO PSLV (standard) | ❌ No | Yes | ~$250k | Low | Not viable standalone |
| ISRO PSLV (Chandrayaan-4) | ⚠️ Conditional | 2027? | TBD | High | **TERTIARY (diplomatic)** |
| Astrobotic Griffin | ✅ Yes | 2027? | ~$1–2M | Medium | **BACKUP #2** |
| Intuitive Machines Nova-C | ✅ Yes | IM-3/4 ~2027 | ~$1–2M | Medium | **BACKUP #2** |
| Firefly Blue Ghost | ✅ Yes | TO future | ~$1–2M | Medium | **BACKUP #2** |
| ispace Series 2 | ✅ Yes | 2027–2028 | TBD | Medium-High | **MONITOR** |

---

## 5. Launch Window Analysis (2027–2028)

### 5.1 BLT Window Frequency
- BLT windows open approximately every **28–30 days** (1 per lunar synodic cycle)
- Optimal BLT windows for lunar south polar orbit: ~4–6 windows/year
- Window duration: 1–3 days per opportunity

### 5.2 Candidate Launch Windows (Preliminary)

| Window | Launch Date (Approx.) | Transit Duration | Lunar Arrival | Notes |
|--------|----------------------|-----------------|---------------|-------|
| LW-1 | March 2027 | 95 days | June 2027 | Southern hemisphere launch sites preferred |
| LW-2 | July 2027 | 105 days | October 2027 | Primary candidate |
| LW-3 | November 2027 | 98 days | February 2028 | Backup if LW-2 slips |
| LW-4 | April 2028 | 92 days | July 2028 | Last resort backup |

---

## 6. Procurement and Partnership Actions

| Action | Owner | Deadline | Priority |
|--------|-------|----------|----------|
| Submit NASA CSLI CubeSat Mission Profile | Mission PI + STELLARIS | Q3 2026 | HIGH |
| Monitor NASA CLPS secondary payload AO | STELLARIS | Ongoing | HIGH |
| Initiate Rocket Lab Business Dev contact | STELLARIS | Q4 2026 | HIGH |
| Engage BRIN for ISRO Chandrayaan-4 inquiry | Mission PI + BRIN liaison | Q3 2026 | MEDIUM |
| Attend Intuitive Machines payload workshop | STELLARIS | 2026 conference season | MEDIUM |

---

## 7. References

1. NASA CubeSat Launch Initiative (CSLI): https://www.nasa.gov/smallspacecraft/csli/
2. NASA CLPS Overview: https://www.nasa.gov/clps
3. Rocket Lab CAPSTONE Mission: https://www.rocketlabusa.com/missions/lunar/
4. SpaceX Transporter Rideshare: https://www.spacex.com/rideshare/
5. ISRO PSLV User Manual, Issue 7, 2020
6. Sweetser, T. et al., "Ballistic Lunar Transfer Trajectories for Small Spacecraft," AAS 93-648

---
*Document status: PHASE-1 DRAFT. Requires Mission PI approval and trajectory team validation before provider selection.*
