import React from "react";
import { MissionStatus } from "@/components/dashboard/mission-status";
import { LaunchCountdown } from "@/components/dashboard/countdown";
import { MissionOverview } from "@/components/dashboard/mission-overview";
import { AdvancedStats } from "@/components/dashboard/advanced-stats";
import { TechnicalSpecs } from "@/components/dashboard/technical-specs";
import { MissionTimeline } from "@/components/dashboard/mission-timeline";
import { TeamSection } from "@/components/dashboard/team-section";
import { PartnersSection } from "@/components/dashboard/partners-section";
import { TelemetryChart } from "@/components/dashboard/telemetry-chart";
import { ISRUCalculator } from "@/components/dashboard/isru-calculator";
import { Badge } from "@/components/ui/badge";
import { MISSION_INFO } from "@/lib/constants";
import { Compass, Sparkles, Activity, ShieldCheck, Flame, Cpu, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Banner Header */}
      <div className="relative overflow-hidden rounded-2xl border border-sky-500/30 bg-gradient-to-r from-space-900 via-sky-950/40 to-space-900 p-6 sm:p-8 shadow-[0_0_30px_rgba(56,189,248,0.15)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 z-10 relative">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="glow" className="font-mono text-xs">
                INDONESIA × NASA CSLI
              </Badge>
              <Badge variant="cyan" className="font-mono text-xs">
                6U CubeSat Platform
              </Badge>
              <Badge variant="outline" className="font-mono text-xs text-sky-300">
                Launch: Q4 2027
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-sans">
              LUNA ICE MAPPER <span className="text-sky-400 text-glow-ice">PLATFORM</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
              High-sensitivity hydrogen and surface water-ice spectral mapping over Lunar South Pole Permanently Shadowed Regions (PSRs) to power the NASA Artemis program and planetary science.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <a
              href="/visualizer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-sky-500 text-slate-950 font-bold hover:bg-sky-400 transition-all shadow-[0_0_20px_rgba(56,189,248,0.4)] text-sm"
            >
              <Sparkles className="h-4 w-4" />
              Launch 3D Visualizer
            </a>
            <a
              href="/luna-agi"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-sky-500/40 bg-slate-900/80 text-sky-400 font-semibold hover:bg-sky-950 transition-all text-sm"
            >
              <Cpu className="h-4 w-4" />
              Ask Luna-AGI Agent
            </a>
          </div>
        </div>
      </div>

      {/* Top Cards: Status + Countdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MissionStatus />
        <LaunchCountdown />
      </div>

      {/* Advanced Stats KPI Grid */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider">
          <Activity className="h-4 w-4 text-sky-400" />
          <span>Mission Key Performance Indicators</span>
        </div>
        <AdvancedStats />
      </section>

      {/* Mission Overview */}
      <MissionOverview />

      {/* Telemetry Stream */}
      <TelemetryChart />

      {/* ISRU Propellant Calculator */}
      <ISRUCalculator />

      {/* Spacecraft Technical Specifications */}
      <TechnicalSpecs />

      {/* Mission Timeline */}
      <MissionTimeline />

      {/* AI Engineering Agent Team */}
      <TeamSection />

      {/* Partners & Budget */}
      <PartnersSection />
    </div>
  );
}
