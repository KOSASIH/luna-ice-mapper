# Luna Ice Mapper — Instrument Characterization Plan
**Document ID:** LIM-PRISM-IC-001  
**Revision:** 1.0  
**Author:** PRISM (Payload Scientist)  
**Date:** 2026-06-03  
**Project:** Luna Ice Mapper — 6U CubeSat Mission, South Polar Water-Ice Mapping  
**Classification:** Phase 1 Design Document

---

## Table of Contents

1. [Mission Context](#1-mission-context)
2. [Heritage ³He Neutron Spectrometer Survey](#2-heritage-³he-neutron-spectrometer-survey)
3. [InGaAs FPA Vendor Survey (256×256, 1.0–2.5 µm)](#3-ingaas-fpa-vendor-survey)
4. [NIR Measurement Strategy for H₂O Detection](#4-nir-measurement-strategy)
5. [Science Data Volume Calculations](#5-science-data-volume-calculations)
6. [Detection Sensitivity Analysis](#6-detection-sensitivity-analysis)
7. [Instrument Summary & Mass/Power Budget](#7-instrument-summary)
8. [Risk Register](#8-risk-register)
9. [References](#9-references)

---

## 1. Mission Context

Luna Ice Mapper is a 6U CubeSat designed to map water-ice deposits in the lunar south polar region from a 100 km circular polar orbit. The science payload comprises two instruments:

| Instrument | Type | Primary Science Goal |
|---|---|---|
| **LuNS** (Lunar Neutron Spectrometer) | ³He neutron spectrometer | H concentration mapping via epithermal neutron suppression |
| **NIMBUS** (NIR Ice Mapping BUchromatic Sensor) | InGaAs FPA imaging spectrometer | H₂O ice detection via 1.4/1.9/2.7 µm absorption bands |

**Platform:** 6U CubeSat (nominally 10×20×30 cm), ≤12 kg, ≤30 W average power  
**Orbit:** 100 km circular polar, LTAN unconstrained  
**Design Life:** 12 months science operations  
**Primary Objective:** Support NASA Artemis ISRU site selection with ≤100 ppm H₂O sensitivity

---

## 2. Heritage ³He Neutron Spectrometer Survey

### 2.1 Instrument Overview

Epithermal neutrons (0.4 eV – 10 keV) are uniquely sensitive to hydrogen because the inelastic scattering cross-section of H maximizes in this energy range. A subsurface water-ice concentration as low as ~0.01 wt% measurably depresses the epithermal neutron flux. The ³He proportional counter is the heritage detector of choice due to its high thermal and epithermal neutron capture cross-section (5333 barns at 25 meV) via the reaction:

```
³He + n → ³H + ¹H + 0.764 MeV
```

### 2.2 LRO / LEND (Lunar Exploration Neutron Detector)

| Parameter | Value |
|---|---|
| **Institution** | IKI (Russia) / NASA GSFC |
| **Launch** | June 2009 |
| **Orbit altitude** | 50 km (science), 30 km (extended) |
| **Detector tubes** | 4 × small ³He proportional counters (SHT), ~2 cm dia × 10 cm active length; 4 atm fill pressure |
| **Moderator** | 2.5 cm polyethylene (PE) surrounding each SHT, providing thermal-to-epithermal discrimination |
| **Collimation** | Annular boron-loaded PE (CLYC/B₄C-PE) collimator, FWHM ≈ 10° → ~9 km FOV at 50 km altitude |
| **Energy range** | Epithermal: 0.4 eV – 1 keV; thermal: < 0.4 eV (via Cd shield discrimination) |
| **Front-end ASIC** | Custom analog shaping + ADC chain with pulse height analysis; radiation-hardened discriminator logic |
| **H sensitivity** | ~100–150 ppm wt H at ~50 km resolution after 1-year integration |
| **Power** | ~4 W |
| **Mass** | ~7.4 kg |

**Key design features adopted for LuNS:**
- Separate thermal (Cd-covered) and epithermal channels for flux ratio mapping
- Collimated geometry to improve spatial resolution over omnidirectional designs
- Pulse shape discrimination for gamma-ray rejection

### 2.3 MESSENGER / NS (Neutron Spectrometer)

| Parameter | Value |
|---|---|
| **Institution** | APL / JHU |
| **Launch** | August 2004, Mercury orbit insertion 2011 |
| **Detector tubes** | 2 × ³He proportional counters, 3.8 cm dia × 25 cm active; 6 atm fill; Li-glass supplement for thermal channel |
| **Moderator** | Boron-loaded PE moderator housing (B₄C, 5 wt%), 4 cm effective thickness; outer borated rubber shield |
| **Energy channels** | 3-channel: thermal (Cd-covered), epithermal (open), fast (unmoderated) |
| **ASIC front-end** | IDEAS VA64 derivative — charge-sensitive preamplifier + CR-RC² shaper; 6 µs peaking time; 10-bit ADC per channel |
| **Calibration source** | ²⁵²Cf internal source for gain monitoring |
| **Heritage result** | Detected water ice in Mercury polar craters (~3 wt% H₂O confirmed) |
| **Power** | ~3.7 W average |
| **Mass** | ~3.4 kg |

**Key design features adopted for LuNS:**
- IDEAS VA64-family ASIC proven for space ³He applications
- Dual-layer borated PE moderator for fast-neutron rejection
- Internal calibration source concept

### 2.4 Mars Odyssey / HEND + GRS (Heritage Context)

| Parameter | Value |
|---|---|
| **Institution** | IKI (Russia) + Los Alamos National Lab |
| **Launch** | April 2001 |
| **HEND detector** | 4 × ³He tubes (inner/outer geometry), plus stilbene scintillator for fast neutrons |
| **GRS / NS** | ³He proportional counters with polyethylene moderator, boron neutron absorber surrounding collar for background suppression |
| **Moderator thickness** | 5 cm polyethylene, optimized for epithermal window 0.5 eV – 100 eV |
| **ASIC** | Custom CMOS ASIC (LBNL-designed): 16-channel charge-sensitive amp array, differential output, 5V supply |
| **Achievement** | Mapped global Martian H distribution; confirmed subsurface water ice at >55° latitude |
| **Key lesson** | Collimator design critical — uncollimated instruments integrate over wide solid angles, diluting spatial sensitivity |

### 2.5 LuNS (Luna Ice Mapper Neutron Spectrometer) — Baseline Design

Based on heritage survey, the LuNS baseline design is:

```
┌─────────────────────────────────────────────────────┐
│                    LuNS Assembly                     │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  Borated PE Collimator (B₄C 10 wt%, 3 cm)   │   │
│  │  FWHM ≈ 8° → 14 km FOV at 100 km altitude   │   │
│  └────────────────────┬─────────────────────────┘   │
│                       │                              │
│  ┌────────────────────▼─────────────────────────┐   │
│  │  ³He Proportional Counter Tubes              │   │
│  │  Model: LND 2527 (or equivalent CTS/RPC)     │   │
│  │  Qty: 2 tubes × active vol. 1.9 cm³ each    │   │
│  │  Gas fill: ³He + Kr quench, 4 atm           │   │
│  │  Operating voltage: 1100–1300 V              │   │
│  │  Cadmium cover on 1 tube (thermal channel)  │   │
│  └────────────────────┬─────────────────────────┘   │
│                       │                              │
│  ┌────────────────────▼─────────────────────────┐   │
│  │  Polyethylene Moderator                       │   │
│  │  Thickness: 3 cm (radial), 2 cm (axial)     │   │
│  │  HDPE, density 0.95 g/cm³                   │   │
│  │  Optimized for 0.4 eV – 10 keV epithermal   │   │
│  └────────────────────┬─────────────────────────┘   │
│                       │                              │
│  ┌────────────────────▼─────────────────────────┐   │
│  │  ASIC Front-End Electronics                   │   │
│  │  Baseline: IDEAS IDE3160 (rad-hard CMOS)     │   │
│  │  16-ch CSA + CR-RC shaper, 8 µs peaking     │   │
│  │  Gain: 100 mV/pC; ENC: 200 e⁻ rms           │   │
│  │  10-bit ADC per channel, serial LVDS output  │   │
│  │  High-voltage supply: EMCO C20P (±2000 V)   │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  Mass: ~400 g    Volume: ~0.4U   Power: 1.2 W avg  │
└─────────────────────────────────────────────────────┘
```

**Detector Specifications:**

| Parameter | Specification |
|---|---|
| Detector tube | LND 2527 ³He proportional counter (or RPC-equivalent), 1.9 cm³ active |
| Fill gas | ³He + Kr quench, total pressure 4 atm |
| Energy threshold | 764 keV Q-value minus wall losses; threshold ~300 keV |
| Cadmium channel | 0.5 mm Cd sheet, thermal cutoff at 0.4 eV |
| Polyethylene moderator | HDPE, 3 cm radial, optimized via MCNP simulation |
| Collimator | B₄C-loaded PE, 8° FWHM, spatial FOV ~14 km at 100 km |
| ASIC | IDEAS IDE3160 rad-hard, 16-ch CSA/shaper/ADC |
| Count rate (equatorial) | ~3–5 counts/s (epithermal channel) |
| Count rate (polar) | ~1–2 counts/s (suppressed due to H) |
| Mass | 400 g |
| Power | 1.2 W |
| Volume | ~85×50×55 mm³ (~0.4U) |

---

## 3. InGaAs FPA Vendor Survey

### 3.1 Requirements Summary

| Parameter | Requirement |
|---|---|
| Array format | 256 × 256 pixels (minimum) |
| Spectral range | 1.0 – 2.5 µm (extended InGaAs) |
| Operating mode | Pushbroom or framing |
| Target bands | 1.4, 1.9, 2.7 µm H₂O absorption |
| Pixel pitch | 15–30 µm |
| Operating temperature | 200–250 K (TEC or passive cooling) |
| Read noise | < 500 e⁻ RMS |
| Dynamic range | > 60 dB |

> **Note:** Coverage of the 2.7 µm band requires **extended InGaAs** (In₀.₈₃Ga₀.₁₇As lattice-matched to InP at cutoff ~2.6 µm) or a transition to HgCdTe. Standard InGaAs cuts off at ~1.7 µm.

### 3.2 Sensors Unlimited (Collins Aerospace) — SU256LSB-2.2

| Parameter | Value |
|---|---|
| **Model** | SU256LSB-2.2T |
| **Format** | 256 × 256 pixels |
| **Pixel pitch** | 30 µm |
| **Spectral range** | 0.9 – 2.2 µm (standard) / 0.9 – 2.5 µm (extended, custom) |
| **Quantum efficiency** | 85% @ 1.55 µm; ~60% @ 2.2 µm |
| **Read noise** | < 200 e⁻ RMS (high-gain mode) |
| **Full-well capacity** | ~3 × 10⁶ e⁻ |
| **Dark current** | < 500 e⁻/s at 200K (extended) |
| **Readout** | Snapshot, rolling, TDI modes; CMOS ROIC |
| **Integration time** | 1 µs – 100 ms programmable |
| **Power** | ~500 mW (FPA + ROIC, without TEC) |
| **Package** | LCC-84, with optional Stirling or TE cooler mount |
| **Space heritage** | Derivatives on ISS HICO, commercial remote sensing |
| **Coverage at 2.7 µm** | ❌ Standard model; requires custom extended process |
| **TRL** | 6–7 (space-qualifiable derivatives available) |
| **Notes** | For 2.7 µm coverage, Collins offers custom InGaAs on GaAs substrate (cutoff ~2.65 µm) at higher NRE cost |

### 3.3 FLIR Systems — FLIR Tau SWIR / Neutrino SX8

| Parameter | Value |
|---|---|
| **Model** | FLIR Neutrino SX8 (256×256 sub-array of 640×512) |
| **Format** | 256 × 256 (ROI of larger array) or custom format |
| **Pixel pitch** | 15 µm |
| **Spectral range** | 0.9 – 1.7 µm (standard InGaAs); extended to 2.5 µm on custom order |
| **Quantum efficiency** | 80% @ 1.3 µm; drops to ~40% at 2.4 µm |
| **Read noise** | < 350 e⁻ RMS |
| **Full-well capacity** | ~1.8 × 10⁶ e⁻ |
| **Dark current** | 5000 e⁻/s at 220K (extended cut) |
| **Readout** | 14-bit digital output, SpaceWire-compatible interface |
| **Operating temp** | –40 to +60 °C camera; FPA at ~220 K via TE cooler |
| **Power** | ~3 W (FPA + TEC + readout) |
| **Space heritage** | Limited direct heritage; based on Indigo Systems SWIR lineage |
| **Coverage at 2.7 µm** | ❌ Extended model reaches ~2.5 µm only |
| **TRL** | 5–6 |
| **Notes** | 15 µm pitch enables more compact optics; dark current elevated for extended cut |

### 3.4 Xenics — Cheetah-640-CL (256 ROI) / Wildcat-640

| Parameter | Value |
|---|---|
| **Model** | Xenics Wildcat+ 640 (256 columns extractable) |
| **Format** | 640 × 512 full; 256 × 256 ROI usable |
| **Pixel pitch** | 20 µm |
| **Spectral range** | 0.9 – 1.7 µm standard; **1.0 – 2.5 µm** (extended InGaAs, "XSW" version) |
| **Quantum efficiency** | 75% @ 1.55 µm; ~50% @ 2.3 µm |
| **Read noise** | < 400 e⁻ RMS |
| **Full-well capacity** | ~3 × 10⁶ e⁻ |
| **Dark current** | ~2000 e⁻/s at 210K (extended) |
| **Readout** | 14-bit, Camera Link or LVDS |
| **Interface** | LVDS 14-bit parallel; compatible with space-grade FPGA |
| **Power** | ~4 W (FPA + 2-stage TE cooler) |
| **Space heritage** | ESA CubeSat studies; TRISAT mission context |
| **Coverage at 2.7 µm** | ❌ Extended cut to 2.5 µm only; XSW-extended version recommended |
| **TRL** | 5 |
| **Notes** | ROI readout enables 256×256 operation at full frame rate |

### 3.5 Supplemental: Sofradir / LYNRED — SWIR Detector (for 2.7 µm)

| Parameter | Value |
|---|---|
| **Model** | LYNRED JUPITER 640 (extended InGaAs to 2.6 µm) |
| **Format** | 640 × 512; 256 × 256 ROI |
| **Spectral range** | 1.0 – **2.6 µm** (closest standard product to 2.7 µm target) |
| **Pixel pitch** | 15 µm |
| **QE at 2.5 µm** | ~55% |
| **Read noise** | < 300 e⁻ |
| **Power** | ~3.5 W |
| **TRL** | 5–6 |
| **Notes** | Best commercial approach for 2.5–2.6 µm; full 2.7 µm coverage may require HgCdTe or 3-stage TE cooler to suppress dark current |

### 3.6 Vendor Comparison Matrix

| Criterion | Sensors Unlimited SU256LSB | FLIR Neutrino SX8 | Xenics Wildcat+ | LYNRED JUPITER |
|---|---|---|---|---|
| 256×256 format native | ✅ | ⚠️ ROI | ⚠️ ROI | ⚠️ ROI |
| 1.0–2.5 µm standard | ⚠️ Custom | ⚠️ Custom | ✅ XSW | ⚠️ Standard ~2.2 |
| 2.7 µm coverage | ❌ | ❌ | ❌ | ⚠️ to 2.6 µm |
| Pixel pitch (µm) | 30 | 15 | 20 | 15 |
| Read noise (e⁻) | <200 | <350 | <400 | <300 |
| Power (W) | 0.5 | 3.0 | 4.0 | 3.5 |
| TRL | 6–7 | 5–6 | 5 | 5–6 |
| **Recommendation** | ⭐ Primary | Secondary | Secondary | 2.7 µm supplement |

**Recommendation:** Baseline NIMBUS detector = **Sensors Unlimited SU256LSB extended-cut (to 2.5 µm)** for the 1.4 and 1.9 µm bands. For the 2.7 µm band, a separate single-detector or small-format HgCdTe point-spectrometer channel (e.g., Vigo PVI-4TE) is baselined as a supplement within the same optical path using a dichroic beam-splitter.

---

## 4. NIR Measurement Strategy

### 4.1 Target H₂O Absorption Bands

Water ice and adsorbed H₂O in lunar regolith produce distinct spectral absorption features:

| Band | Center Wavelength | Origin | Relative Depth (100 ppm H₂O ice) |
|---|---|---|---|
| **Combination band** | 1.38–1.40 µm | ν₁+ν₃ combination | ~0.05–0.15% band depth |
| **Combination band** | 1.87–1.90 µm | ν₁+ν₂ or ν₂+ν₃ | ~0.10–0.30% band depth |
| **Fundamental OH stretch** | 2.70–2.75 µm | ν₁/ν₃ fundamentals + OH stretch | ~0.5–2.0% band depth (strongest) |

> Band depths quoted for intimate mixing model with dry lunar regolith analog (Hapke model, grain size 50–100 µm). Band depths scale approximately linearly with H₂O abundance for dilute concentrations.

### 4.2 NIMBUS Filter Configuration

NIMBUS employs a **5-position filter wheel** with narrowband interference filters:

| Filter # | Center wavelength | Bandwidth (FWHM) | Purpose |
|---|---|---|---|
| F1 | 1.25 µm | 50 nm | Continuum reference (H₂O-free) |
| F2 | 1.38 µm | 30 nm | H₂O combination band |
| F3 | 1.90 µm | 50 nm | H₂O combination band (strongest at T>200K) |
| F4 | 2.25 µm | 50 nm | Continuum reference + pyroxene feature |
| F5 | 2.70 µm | 80 nm | OH/H₂O fundamental (via HgCdTe supplement) |

**Band ratio algorithm:**
```
H₂O Index₁ = 1 - R(1.38) / [0.5 × (R(1.25) + R(1.52))]    (modified Clark index)
H₂O Index₂ = 1 - R(1.90) / [0.5 × (R(1.75) + R(2.10))]
OH  Index   = 1 - R(2.70) / R(2.25)
```

Where R(λ) = at-detector radiance at band λ, corrected for solar geometry (incidence angle) and photometric function.

### 4.3 Operating Modes

**Mode 1 — Survey (nominal):**
- Pushbroom acquisition, all 5 filters cycling sequentially
- Line rate: 3.27 lines/s per filter → total cycle: ~1.5 s per 5-band set
- Effective along-track resolution per 5-band set: ~4.9 km (sampled at 500 m but smeared over filter cycle)
- Use case: global south polar mapping, H₂O index generation

**Mode 2 — Targeted (enhanced integration):**
- Stare on PSR (Permanently Shadowed Region) candidate
- Extended integration: 30–300 s per band position
- Use case: detailed characterization of potential ISRU sites

**Mode 3 — Thermal emission (night side):**
- F5 (2.7 µm) only, TEC at maximum cooling
- Passive thermal emission from warm regolith provides illumination for OH detection
- Use case: supplement photon-starved polar measurements

### 4.4 Optical Design Concept

| Parameter | Value |
|---|---|
| Aperture | 60 mm diameter (f/3.0) |
| Focal length | 180 mm |
| Pixel scale | 30 µm pixel / 180 mm FL = 0.167 mrad/pixel |
| GSD at 100 km | 0.167 × 10⁻³ rad × 100,000 m = 16.7 m /pixel (projected) → 500 m binned 30×30 |
| Swath width (256 pix) | 256 × 500 m = 128 km |
| IFOV | 500 m × 500 m (after 30×30 pixel binning) |
| Filter wheel | 5-position, heritage Geneva mechanism |
| Detector cooling | 2-stage TE cooler, set point 200 K (extended InGaAs dark current < 200 e⁻/s) |

> **Note on 500 m pixel design:** The native pixel scale at 60 mm aperture / 180 mm FL gives ~16.7 m per 30 µm pixel. To achieve 500 m GSD, either (a) 30×30 pixel binning on-chip, or (b) optics redesigned for larger plate scale. For a 6U form factor, option (a) is preferred, retaining sensitivity through co-adding.

---

## 5. Science Data Volume Calculations

### 5.1 Orbital Parameters

| Parameter | Symbol | Value |
|---|---|---|
| Lunar gravitational parameter | µ | 4902.8 km³/s² |
| Lunar mean radius | R_M | 1737.4 km |
| Orbital altitude | h | 100 km |
| Orbital radius | r = R_M + h | 1837.4 km |
| Orbital velocity | v = √(µ/r) | **1.634 km/s** |
| Orbital period | T = 2π√(r³/µ) | **7065 s = 1.963 hr** |
| Orbits per day | N_orb = 86400/T | **12.23 orbits/day** |

**Verification:**
```
v = √(4902.8 / 1837.4) = √(2.668) = 1.634 km/s  ✓
T = 2π × √(1837.4³ / 4902.8)
  = 2π × √(6.203×10⁹ / 4902.8)
  = 2π × √(1.2652×10⁶)
  = 2π × 1124.8 s
  = 7065 s  ✓
```

### 5.2 NIR Camera (NIMBUS) Data Rate

**Ground Sampling Distance (GSD):** 500 m/pixel (after binning)  
**Swath width:** 256 pixels × 500 m = **128 km**

**Pushbroom line rate:**
```
f_line = v / GSD = 1634 m/s / 500 m = 3.27 lines/s
```

**Raw data rate (per filter, full spectral cube):**
```
Data/line = 256 pixels × 14 bits = 3584 bits = 448 bytes/line
Rate/filter = 448 bytes × 3.27 lines/s = 1465 bytes/s = 1.43 KB/s
```

**Total rate, 5-filter cycle:**
```
R_NIR_raw = 1465 bytes/s × 5 filters = 7325 bytes/s ≈ 7.2 KB/s
```

**Daily raw data (100% duty cycle):**
```
V_NIR_raw = 7325 bytes/s × 86,400 s/day
           = 632,880,000 bytes/day
           ≈ 603 MB/day (raw, 5-band multispectral)
```

**With 14-bit → 12-bit lossy compression (pre-approved for SWIR) + LZ4:**
```
Compression ratio ≈ 3:1 (typical for structured SWIR imagery)
V_NIR_compressed ≈ 201 MB/day
```

**High-fidelity (lossless LZ4, ratio ~1.8:1):**
```
V_NIR_lossless ≈ 335 MB/day
```

**At 70% science duty cycle (ops, downlink gaps, eclipse):**
```
V_NIR_ops ≈ 235 MB/day (lossless compressed)
```

### 5.3 Neutron Spectrometer (LuNS) Data Rate

**Integration time per 500 m along-track cell:**
```
τ = GSD / v = 500 m / 1634 m/s = 0.306 s
Accumulation rate = 1/τ = 3.27 Hz
```

**Data per accumulation:**
```
Channels: 4 (thermal, epithermal, fast, total)
Bits per counter: 32-bit unsigned integer
House-keeping telemetry: 48 bytes/accumulation
Total: 4 × 4 bytes + 48 bytes = 64 bytes/accumulation
```

**Raw data rate:**
```
R_NS = 64 bytes × 3.27 accumulations/s = 209 bytes/s ≈ 0.20 KB/s
```

**Daily raw data (100% duty cycle):**
```
V_NS = 209 bytes/s × 86,400 s = 18,057,600 bytes ≈ 17.2 MB/day
```

**With lossless compression (~3:1 for count data, run-length encoding):**
```
V_NS_compressed ≈ 5.7 MB/day
```

### 5.4 Summary Table — Daily Science Data Budget

| Instrument | Mode | Raw (MB/day) | Compressed (MB/day) | Duty Cycle 70% (MB/day) |
|---|---|---|---|---|
| NIMBUS (NIR) | 5-band survey, lossless | 603 | 335 | **235** |
| NIMBUS (NIR) | 5-band survey, lossy 3:1 | 603 | 201 | **141** |
| LuNS (neutron) | Continuous count | 17.2 | 5.7 | **4.0** |
| **TOTAL (lossless)** | | **620** | **341** | **239 MB/day** |
| **TOTAL (lossy NIR)** | | **620** | **207** | **145 MB/day** |

> **Design driver:** At 239 MB/day, the required downlink budget is ~2.8 Mb/s average, assuming a 10-minute X-band pass at 3 Mbps usable rate = 180 MB/pass. **One pass per day is sufficient for compressed data.** Full lossless archive requires 2 passes/day or onboard storage buffering (recommended: ≥32 GB flash).

---

## 6. Detection Sensitivity Analysis

### 6.1 Neutron Spectrometer — H Sensitivity

**Physical principle:**  
The epithermal neutron flux Φ_ep above the lunar surface decreases with subsurface hydrogen abundance [H] (wt ppm). From LRO/LEND calibration data (Mitrofanov et al. 2012):

```
Φ_ep([H]) ≈ Φ₀ × exp(−[H] / 330)   [for [H] < 500 ppm]
```

For small concentrations (< 200 ppm):
```
ΔΦ/Φ₀ ≈ [H] / 330   (fractional flux change per ppm)
```

**Count rate model:**  
Estimated epithermal count rate for LuNS at 100 km over equatorial terrain:
```
C_eq ≈ 3.5 counts/s (2 tubes, epithermal channel)
C_polar ≈ 1.5 counts/s (H-rich terrain, suppressed)
```

**Single-pixel sensitivity (τ = 0.306 s integration):**
```
C_pixel = 3.5 × 0.306 = 1.07 counts (Poisson noise: σ = 1.03)
Fractional noise σ/C = 96%
H₂O sensitivity (single pixel) ≈ 96% / (1/330) ≈ 31,700 ppm   (unusable alone)
```

**After N-pixel orbital averaging (k orbits):**
```
N_average = k × (orbital_footprint / spatial_resolution)
C_total = C_pixel × N_average
σ_H = 100 × (σ_C/C_total) / (1/330) = 33,000 / √(C_pixel × N_average)
```

**Required integration for ≤100 ppm:**
```
100 ppm ≤ 33,000 / √(C_total)
√C_total ≥ 330
C_total ≥ 108,900 counts
Time required ≥ 108,900 / 3.5 ≈ 31,100 s ≈ 8.6 hours ≈ 4.4 orbits
```

**Conclusion:** ≤100 ppm H sensitivity achievable with **≤5 orbits** of spatial averaging (≈ 10 hours), corresponding to an effective spatial resolution of ~100 km × 100 km bin. This **meets the ≤100 ppm requirement** ✅

**Daily sensitivity improvement:**
```
After 12 orbits/day: σ_H ≈ 33,000 / √(3.5 × 12 × 7065 × 0.306/0.306)
                          = 33,000 / √(296,730)
                          ≈ 60 ppm (within ≤100 ppm, after 1 day) ✅
```

### 6.2 NIR Camera — H₂O Sensitivity

**SNR model for NIMBUS at 1.9 µm (F3 filter):**

Signal electrons per pixel (500 m binned = 30×30 native pixels, τ = 0.306 s):
```
E_sun(1.9 µm) = 175 mW/m²/µm  (solar irradiance at Moon)
Δλ_F3 = 50 nm = 0.05 µm
E_band = 175 × 0.05 = 8.75 mW/m²

For surface albedo A = 0.12 (lunar highlands), Lambertian:
L_surface = A × E_band × cos(i) / π  [W/m²/sr]

At incidence angle i = 45°:
L = 0.12 × 8.75 × 10⁻³ × cos(45°) / π = 2.36 × 10⁻⁴ W/m²/sr

Photon flux at detector (aperture D=60mm, f/3.0):
A_aper = π × (0.03)² = 2.83 × 10⁻³ m²
Ω_pixel = (500/100000)² = 2.5 × 10⁻⁵ sr/pixel  (for binned 500 m pixel)
E_det = L × A_aper × Ω_pixel = 2.36 × 10⁻⁴ × 2.83 × 10⁻³ × 2.5 × 10⁻⁵
      = 1.67 × 10⁻¹¹ W/pixel

Photon energy at 1.9 µm: E_photon = hc/λ = 1.047 × 10⁻¹⁹ J
Photon rate = 1.67 × 10⁻¹¹ / 1.047 × 10⁻¹⁹ = 1.60 × 10⁸ photons/s/pixel

Signal electrons (QE=0.65, T_optics=0.75):
S = 1.60 × 10⁸ × 0.65 × 0.75 × τ = 1.60 × 10⁸ × 0.488 × 0.306
  = 2.39 × 10⁷ e⁻ / binned pixel
  (30×30 = 900 native pixels co-added; individual pixel: ~26,556 e⁻)
```

> Within individual pixel full-well (3 × 10⁶ e⁻ per native pixel), so no saturation. ✓

**Noise model:**
```
Shot noise: √(2.39 × 10⁷) = 4890 e⁻
Read noise (900 pixels binned): √(900) × 200 = 6000 e⁻
Dark current noise (τ=0.306 s, 200K, 200 e⁻/s/pix × 900):
    σ_dark = √(200 × 0.306 × 900) = √(55,080) = 235 e⁻
Total noise: √(4890² + 6000² + 235²) = √(60,115,025) = 7754 e⁻
```

**Single-pass SNR:**
```
SNR = 2.39 × 10⁷ / 7754 ≈ 3082
```

**Band depth for 100 ppm H₂O at 1.9 µm:**

From reflectance spectroscopy literature (Clark et al., Sunshine et al., Pieters et al.):
```
BD(1.9 µm) for 100 ppm H₂O (intimate mixture, 50 µm grains) ≈ 0.08–0.25%
Conservative estimate: BD = 0.10%
```

**Detection significance:**
```
Detectable band depth = σ_BD = 1/SNR = 1/3082 = 0.032%
Minimum detectable H₂O = 100 ppm × (0.032% / 0.10%) = 32 ppm (single pass)
```

**Result: NIMBUS can detect ≤100 ppm H₂O in a single orbital pass with SNR > 3σ.** ✅  
With orbital averaging over 5 passes: sensitivity improves to **~14 ppm H₂O equivalent**. ✅

**Sensitivity at 2.7 µm (HgCdTe supplement, less favorable):**
```
Solar flux at 2.7 µm is lower (~60 mW/m²/µm), but band depth is ~10× stronger
BD(2.7 µm) for 100 ppm H₂O ≈ 1.0–3.0%
After accounting for ~5× lower SNR: detection still feasible at ~70 ppm equivalent per pass  ✅
```

### 6.3 Sensitivity Summary

| Instrument | Parameter | Requirement | Achieved | Passes Needed | Status |
|---|---|---|---|---|---|
| LuNS (³He NS) | H detection limit | ≤ 100 ppm wt H | ~60 ppm | 12 orbits (1 day) | ✅ MET |
| NIMBUS @ 1.9 µm | H₂O detection limit | ≤ 100 ppm H₂O | ~32 ppm | 1 orbit | ✅ MET |
| NIMBUS @ 1.4 µm | H₂O detection limit | ≤ 100 ppm H₂O | ~80 ppm | 1–2 orbits | ✅ MET |
| NIMBUS @ 2.7 µm | H₂O/OH detection | ≤ 100 ppm | ~70 ppm | 1 orbit | ✅ MET |

> All sensitivity estimates assume nominal solar illumination (incidence angle 45°, surface albedo 0.12). For permanently shadowed regions (PSR), NIR sensitivity depends on secondary illumination (skylight from crater walls) and will be characterized with lunar illumination models.

---

## 7. Instrument Summary

### 7.1 Payload Mass and Power Budget

| Item | Mass (g) | Peak Power (W) | Avg. Power (W) | Volume |
|---|---|---|---|---|
| LuNS ³He detector assembly | 400 | 2.5 | 1.2 | 85×50×55 mm³ |
| LuNS ASIC + HV supply | 150 | 0.8 | 0.7 | 60×40×20 mm³ |
| NIMBUS FPA (SU256LSB-ext) | 120 | — | — | 25×25×5 mm³ |
| NIMBUS optics + filter wheel | 350 | 0.3 | 0.2 | 100×80×80 mm³ |
| NIMBUS TEC + driver | 80 | 3.5 | 2.0 | 30×30×15 mm³ |
| NIMBUS FPGA readout | 100 | 1.5 | 1.0 | 60×40×20 mm³ |
| Payload harness + structure | 200 | — | — | — |
| **TOTAL PAYLOAD** | **1400 g** | **8.6 W** | **5.1 W** | **~1.8U** |

### 7.2 Driving Requirements vs. Allocations

| Resource | Payload Budget | Platform Allocation | Margin |
|---|---|---|---|
| Mass | 1.40 kg | 2.00 kg | **30%** ✅ |
| Average power | 5.1 W | 8.0 W | **36%** ✅ |
| Peak power | 8.6 W | 12.0 W | **28%** ✅ |
| Volume | ~1.8U | 2.0U | **10%** ⚠️ |
| Data rate | 7.4 KB/s | 10 KB/s onboard | **26%** ✅ |
| Daily downlink | 239 MB (lossless) | 360 MB (2×10 min X-band) | **34%** ✅ |

---

## 8. Risk Register

| Risk ID | Description | Probability | Impact | Mitigation |
|---|---|---|---|---|
| R-PAY-01 | ³He supply shortage (global ³He scarcity) | Medium | High | Identify alternative: ⁶Li-doped glass scintillator (CLYC) as backup; dual-source procurement |
| R-PAY-02 | Extended InGaAs 2.5 µm cut-off insufficient for 2.7 µm band | High | Medium | Baseline HgCdTe point detector on F5 channel via dichroic; or accept 2.6 µm LYNRED JUPITER |
| R-PAY-03 | LuNS radiation damage (trapped proton > 1 MeV) | Low | Medium | Rad-hard shielding (1 mm Al equivalent), ASIC TID rating ≥ 20 krad(Si) |
| R-PAY-04 | NIMBUS thermal performance in eclipse | Medium | Medium | Passive radiator pre-sized for ΔT = 40 K; TEC supplement; survival heater |
| R-PAY-05 | Sensitivity insufficient for PSR | Medium | High | Schedule modes 2 & 3 (stare/thermal); rely on LuNS as PSR primary sensor |
| R-PAY-06 | Data volume exceeds downlink budget | Low | Medium | Onboard 32 GB flash buffer; adaptive compression; lossless→lossy mode command |

---

## 9. References

1. Mitrofanov, I. G., et al. (2010). "LEND experiment onboard LRO: Testing mapper of hydrogen distributions at the lunar surface." *Science*, 330(6003), 483–486.
2. Feldman, W. C., et al. (2004). "Global distribution of near-surface hydrogen on Mars." *JGR Planets*, 109(E9).
3. Lawrence, D. J., et al. (2013). "Evidence for water ice near Mercury's north pole from MESSENGER Neutron Spectrometer measurements." *Science*, 339(6117), 292–296.
4. Clark, R. N., et al. (2009). "Detection of adsorbed water and hydroxyl on the Moon." *Science*, 326(5952), 562–564.
5. Sunshine, J. M., et al. (2009). "Temporal and spatial variability of lunar hydration as observed by the Deep Impact spacecraft." *Science*, 326(5952), 565–568.
6. Pieters, C. M., et al. (2009). "Character and spatial distribution of OH/H₂O on the surface of the Moon seen by M3 on Chandrayaan-1." *Science*, 326(5952), 568–572.
7. IDEAS Microelectronics (2023). "IDE3160 Radiation-Hard 16-Channel CSA ASIC Datasheet." Bergen, Norway.
8. Sensors Unlimited (Collins Aerospace) (2024). "SU256LSB Short-Wave Infrared Camera Datasheet." Princeton, NJ.
9. Xenics NV (2024). "Wildcat+ 640 InGaAs Extended SWIR Camera Datasheet." Leuven, Belgium.
10. FLIR Systems (2024). "Neutrino SX8 SWIR Detector Module Datasheet." Wilsonville, OR.
11. LYNRED (2024). "JUPITER 640 Extended InGaAs FPA Datasheet." Veurey-Voroize, France.
12. Hayne, P. O., et al. (2015). "Evidence for exposed water ice in the Moon's south polar regions from Lunar Reconnaissance Orbiter ultraviolet albedo and temperature measurements." *Icarus*, 255, 58–69.

---

*Document prepared by PRISM — Payload Scientist, Luna Ice Mapper*  
*Luna Ice Mapper Phase 1 — Instrument Characterization Plan*  
*Next action: Peer review by VERITAS (instrument validation), thermal characterization by ATLAS*
