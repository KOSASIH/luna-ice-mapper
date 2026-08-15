"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PSR_REGIONS } from "@/lib/constants";
import { Calculator, Flame, Droplets, Zap, Sparkles } from "lucide-react";

export function ISRUCalculator() {
  const [selectedPsrId, setSelectedPsrId] = useState(PSR_REGIONS[0].id);
  const [efficiency, setEfficiency] = useState(35); // %
  const [depthMeters, setDepthMeters] = useState(2.5); // meters
  const [rateTonsPerMonth, setRateTonsPerMonth] = useState(25); // tons/month

  const activePsr = PSR_REGIONS.find((p) => p.id === selectedPsrId) || PSR_REGIONS[0];

  // Calculation Math
  // Ice mass = area * depth fraction * ice concentration factor
  const totalInSituIce = activePsr.estimatedIceMassTons;
  const accessibleFraction = (depthMeters / activePsr.maxDepthMeters);
  const extractableIceTons = totalInSituIce * accessibleFraction * (efficiency / 100);

  // Propellant output (2 H2O -> 2 H2 + O2 by mass: 11.1% H2, 88.9% O2)
  const lh2Tons = extractableIceTons * 0.111;
  const loxTons = extractableIceTons * 0.889;
  const totalPropellantTons = lh2Tons + loxTons;

  // Artemis Starship / Lander refuels supported (~30 tons propellant each)
  const artemisMissionsSupported = Math.floor(totalPropellantTons / 30);

  // Energy required: ~2.8 kWh per kg H2O extracted & electrolyzed
  const totalEnergyGwh = (extractableIceTons * 1000 * 2.8) / 1000000;

  // Feasibility ROI Score 0-100
  const roiScore = Math.min(99, Math.round(
    (efficiency * 0.3) + (100 - activePsr.averageTempKelvin) * 0.4 + (depthMeters / 10) * 30
  ));

  return (
    <Card glow className="border-sky-500/40">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-sky-400" />
            <CardTitle className="text-lg font-bold">ISRU Water-Ice & Propellant Yield Calculator</CardTitle>
          </div>
          <Badge variant="glow" className="font-mono text-xs w-fit">
            Stoichiometric Model: 2H₂O → 2H₂ + O₂
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Top Selectors & Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
                Select Target PSR Crater
              </label>
              <Select
                value={selectedPsrId}
                onChange={(e) => setSelectedPsrId(e.target.value)}
                className="bg-slate-900 border-slate-700 text-sky-400"
              >
                {PSR_REGIONS.map((psr) => (
                  <option key={psr.id} value={psr.id}>
                    {psr.name} ({psr.diameterKm}km dia, ~{(psr.estimatedIceMassTons / 1e6).toFixed(0)}M tons ice)
                  </option>
                ))}
              </Select>
            </div>

            {/* Efficiency slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Extraction Efficiency:</span>
                <span className="text-sky-400 font-bold">{efficiency}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="80"
                value={efficiency}
                onChange={(e) => setEfficiency(Number(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Depth slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Accessible Depth:</span>
                <span className="text-sky-400 font-bold">{depthMeters} m</span>
              </div>
              <input
                type="range"
                min="0.5"
                max={activePsr.maxDepthMeters}
                step="0.5"
                value={depthMeters}
                onChange={(e) => setDepthMeters(Number(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Rate slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Target Mining Rate:</span>
                <span className="text-sky-400 font-bold">{rateTonsPerMonth} tons/month</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={rateTonsPerMonth}
                onChange={(e) => setRateTonsPerMonth(Number(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>
          </div>

          {/* Active PSR Selected Specs */}
          <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-mono font-bold text-sky-400 uppercase flex items-center justify-between">
              <span>{activePsr.name} Properties</span>
              {activePsr.artemisTarget && (
                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                  Artemis Candidate
                </span>
              )}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {activePsr.description}
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-800">
              <div>
                <span className="text-slate-400">Avg Temperature:</span>
                <div className="text-amber-400 font-bold">{activePsr.averageTempKelvin} K ({activePsr.averageTempKelvin - 273}°C)</div>
              </div>
              <div>
                <span className="text-slate-400">PSR Area:</span>
                <div className="text-slate-200 font-bold">{activePsr.areaKm2} km²</div>
              </div>
              <div>
                <span className="text-slate-400">Total In-Situ Ice:</span>
                <div className="text-sky-400 font-bold">{(activePsr.estimatedIceMassTons / 1e6).toFixed(1)} Million Tons</div>
              </div>
              <div>
                <span className="text-slate-400">Max Volatile Depth:</span>
                <div className="text-slate-200 font-bold">{activePsr.maxDepthMeters} m</div>
              </div>
            </div>
          </div>
        </div>

        {/* Output Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div className="p-4 rounded-lg bg-sky-950/40 border border-sky-500/40 space-y-1">
            <div className="flex items-center justify-between text-xs text-sky-400 font-mono">
              <span>Extractable H₂O Ice</span>
              <Droplets className="h-4 w-4 text-sky-400" />
            </div>
            <div className="font-mono font-bold text-2xl text-white">
              {(extractableIceTons / 1e6).toFixed(2)} M Tons
            </div>
            <p className="text-[10px] text-slate-400 font-mono">At {efficiency}% efficiency</p>
          </div>

          <div className="p-4 rounded-lg bg-emerald-950/40 border border-emerald-500/40 space-y-1">
            <div className="flex items-center justify-between text-xs text-emerald-400 font-mono">
              <span>LH₂ + LOX Propellant</span>
              <Flame className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="font-mono font-bold text-2xl text-white">
              {(totalPropellantTons / 1e6).toFixed(2)} M Tons
            </div>
            <p className="text-[10px] text-slate-400 font-mono">{(lh2Tons / 1e6).toFixed(2)}M LH₂ + {(loxTons / 1e6).toFixed(2)}M LOX</p>
          </div>

          <div className="p-4 rounded-lg bg-indigo-950/40 border border-indigo-500/40 space-y-1">
            <div className="flex items-center justify-between text-xs text-indigo-400 font-mono">
              <span>Artemis Missions Supported</span>
              <Sparkles className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="font-mono font-bold text-2xl text-white">
              {artemisMissionsSupported.toLocaleString()}
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Assuming 30t refuels/landings</p>
          </div>

          <div className="p-4 rounded-lg bg-amber-950/40 border border-amber-500/40 space-y-1">
            <div className="flex items-center justify-between text-xs text-amber-400 font-mono">
              <span>Energy & Feasibility Score</span>
              <Zap className="h-4 w-4 text-amber-400" />
            </div>
            <div className="font-mono font-bold text-2xl text-white">
              {roiScore}/100 Score
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Requires {totalEnergyGwh.toFixed(1)} GWh thermal/solar</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
