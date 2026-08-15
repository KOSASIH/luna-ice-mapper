"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MISSION_INFO, SYSTEM_HEALTH_INDICATORS } from "@/lib/constants";
import { Activity, Clock, ShieldCheck, Cpu } from "lucide-react";

export function MissionStatus() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mission Elapsed Time since June 1, 2026
  const startDate = new Date(MISSION_INFO.phase1StartDateIso);
  const diffMs = now ? Math.max(0, now.getTime() - startDate.getTime()) : 0;
  
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
  const seconds = Math.floor((diffMs / 1000) % 60);

  const utcString = now ? now.toUTCString().replace("GMT", "UTC") : "Loading...";

  return (
    <Card glow className="h-full border-sky-500/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-sky-400 animate-pulse" />
            <CardTitle className="text-lg font-bold">Mission Status & Health</CardTitle>
          </div>
          <Badge variant="glow" className="font-mono text-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping mr-1" />
            ACTIVE
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* MET & UTC Clock */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-lg bg-slate-950/70 border border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <Clock className="h-3.5 w-3.5 text-sky-400" />
              <span>MISSION ELAPSED TIME (MET)</span>
            </div>
            <div className="font-mono font-bold text-lg text-sky-400 tracking-wider">
              {days}d {hours.toString().padStart(2, "0")}h {minutes.toString().padStart(2, "0")}m {seconds.toString().padStart(2, "0")}s
            </div>
            <div className="text-[10px] text-slate-500 font-mono">Phase 1 Start: June 1, 2026</div>
          </div>

          <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0 sm:pl-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <Cpu className="h-3.5 w-3.5 text-emerald-400" />
              <span>MISSION SYSTEM TIME (UTC)</span>
            </div>
            <div className="font-mono font-bold text-sm text-slate-200 pt-1">
              {utcString}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">Synced to BRIN Biak Time Standard</div>
          </div>
        </div>

        {/* 9 Subsystems Grid */}
        <div>
          <h4 className="text-xs font-semibold text-slate-300 font-mono uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <span>Subsystem Health Array</span>
            <span className="text-emerald-400 text-[11px]">9/9 NOMINAL</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {SYSTEM_HEALTH_INDICATORS.map((sys, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded bg-slate-950/50 border border-slate-800/80 hover:border-sky-500/30 transition-colors"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 flex-shrink-0" />
                  <span className="text-xs font-medium text-slate-300 truncate">{sys.name}</span>
                </div>
                <span className="text-xs font-mono text-sky-400 font-semibold">{sys.value}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
