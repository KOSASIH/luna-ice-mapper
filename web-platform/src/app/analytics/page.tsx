'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { TelemetryChart } from "@/components/dashboard/telemetry-chart";
import { ISRUCalculator } from "@/components/dashboard/isru-calculator";
import { PSRAnalysisGrid, ArtemisSiteComparison } from "@/components/dashboard/psr-analysis-grid";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, BarChart3, LineChart, Cpu, Zap, Orbit } from "lucide-react";

// Dynamically import the trajectory visualizer — Three.js requires browser WebGL
const TrajectoryVisualizer = dynamic(
  () => import('@/components/visualizer/trajectory-visualizer').then(mod => mod.TrajectoryVisualizer),
  { ssr: false, loading: () => (
    <div className="w-full h-[400px] bg-slate-950 flex items-center justify-center text-[#38bdf8] font-mono text-sm">
      <div className="w-6 h-6 border-2 border-[#38bdf8] border-t-transparent rounded-full animate-spin mr-2" />
      Loading trajectory simulation...
    </div>
  )}
);

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="glow" className="font-mono text-xs">
            DATA & TELEMETRY ANALYTICS
          </Badge>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Scientific & Orbital Telemetry Analytics
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Real-time orbital tracking telemetry, spectral neutron flux counts, thermal equilibrium
          simulations, and ISRU volatile yield analytics.
        </p>
      </div>

      {/* 3D BLT Trajectory Visualization */}
      <Card className="border-slate-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Orbit className="h-5 w-5 text-sky-400" />
              <CardTitle className="text-lg font-bold">BLT Trajectory & Orbital Simulation</CardTitle>
            </div>
            <Badge variant="cyan" className="font-mono text-xs">
              ~100 km Polar Orbit (90.0° Inc)
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <TrajectoryVisualizer />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1 font-mono">
              <div className="text-xs text-slate-400">BLT Delta-V Allocation</div>
              <div className="text-xl font-bold text-sky-400">845 m/s</div>
              <p className="text-[10px] text-slate-500">2-month transit to lunar capture</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1 font-mono">
              <div className="text-xs text-slate-400">Average Orbital Speed</div>
              <div className="text-xl font-bold text-emerald-400">1.63 km/s</div>
              <p className="text-[10px] text-slate-500">118 minute orbital period</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1 font-mono">
              <div className="text-xs text-slate-400">PSR Ground Track Passes</div>
              <div className="text-xl font-bold text-amber-400">12 passes/day</div>
              <p className="text-[10px] text-slate-500">Coverage over Shackleton/Cabeus</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1 font-mono">
              <div className="text-xs text-slate-400">DSN Ground Contact Slots</div>
              <div className="text-xl font-bold text-indigo-400">4 passes/day</div>
              <p className="text-[10px] text-slate-500">BRIN Biak + NASA DSN 34m</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <TelemetryChart />
      <ISRUCalculator />
      <PSRAnalysisGrid />
      <ArtemisSiteComparison />
    </div>
  );
}
