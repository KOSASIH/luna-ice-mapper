import React from "react";
import { StatCard } from "./stat-card";
import { MISSION_INFO, BUDGET_SUMMARY } from "@/lib/constants";
import { DollarSign, Orbit, Clock, Layers, ShieldCheck, Calendar } from "lucide-react";

export function AdvancedStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <StatCard
        label="Total Budget"
        value={BUDGET_SUMMARY.formattedTotal}
        subText="15% contingency reserve"
        icon={DollarSign}
        accentColor="text-emerald-400"
      />
      <StatCard
        label="Target Orbit"
        value="100 km"
        subText="Polar 90.0° inclination"
        icon={Orbit}
        accentColor="text-sky-400"
      />
      <StatCard
        label="Mission Duration"
        value="14 Months"
        subText="12m polar primary ops"
        icon={Clock}
        accentColor="text-cyan-400"
      />
      <StatCard
        label="Flight Payloads"
        value="2 Payload Units"
        subText="NS Spectrometer + NIR Cam"
        icon={Layers}
        accentColor="text-indigo-400"
      />
      <StatCard
        label="Current Phase"
        value="Phase 1"
        subText="Initialization & Concept"
        icon={ShieldCheck}
        accentColor="text-sky-300"
        trend="In-Progress"
      />
      <StatCard
        label="Launch Target"
        value="Q4 2027"
        subText="NASA CSLI Rideshare"
        icon={Calendar}
        accentColor="text-amber-400"
      />
    </div>
  );
}
