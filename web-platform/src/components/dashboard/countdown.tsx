"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MISSION_INFO } from "@/lib/constants";
import { Rocket, Calendar } from "lucide-react";
import { differenceInSeconds } from "date-fns";

export function LaunchCountdown() {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 });

  useEffect(() => {
    const launchDate = new Date(MISSION_INFO.targetLaunchDateIso);

    const updateCountdown = () => {
      const now = new Date();
      const diffSec = differenceInSeconds(launchDate, now);

      if (diffSec <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 });
        return;
      }

      const d = Math.floor(diffSec / (3600 * 24));
      const h = Math.floor((diffSec % (3600 * 24)) / 3600);
      const m = Math.floor((diffSec % 3600) / 60);
      const s = diffSec % 60;

      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s, totalSeconds: diffSec });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  // Total seconds from Phase 1 start (June 1, 2026) to Target Launch (Oct 1, 2027)
  const totalPhase1Duration = differenceInSeconds(
    new Date(MISSION_INFO.targetLaunchDateIso),
    new Date(MISSION_INFO.phase1StartDateIso)
  );
  const elapsedPhase1 = totalPhase1Duration - timeLeft.totalSeconds;
  const progressPct = Math.min(100, Math.max(0, (elapsedPhase1 / totalPhase1Duration) * 100));

  return (
    <Card glow className="h-full border-sky-500/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-sky-400" />
            <CardTitle className="text-lg font-bold">Launch Window Target</CardTitle>
          </div>
          <span className="text-xs font-mono text-sky-300 bg-sky-950 px-2.5 py-1 rounded border border-sky-500/40">
            {MISSION_INFO.launchTarget}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Countdown Digits */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 shadow-inner">
            <div className="font-mono font-bold text-2xl sm:text-3xl text-sky-400">
              {timeLeft.days}
            </div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mt-1">
              Days
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 shadow-inner">
            <div className="font-mono font-bold text-2xl sm:text-3xl text-sky-400">
              {timeLeft.hours.toString().padStart(2, "0")}
            </div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mt-1">
              Hours
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 shadow-inner">
            <div className="font-mono font-bold text-2xl sm:text-3xl text-sky-400">
              {timeLeft.minutes.toString().padStart(2, "0")}
            </div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mt-1">
              Minutes
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 shadow-inner">
            <div className="font-mono font-bold text-2xl sm:text-3xl text-sky-400 animate-pulse">
              {timeLeft.seconds.toString().padStart(2, "0")}
            </div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mt-1">
              Seconds
            </div>
          </div>
        </div>

        {/* Phase Readiness Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-sky-400" /> Pre-Launch Development Progress
            </span>
            <span className="text-sky-400 font-bold">{progressPct.toFixed(1)}%</span>
          </div>
          <Progress value={progressPct} />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>Phase 1 Kickoff (Jun 2026)</span>
            <span>Target Launch (Oct 2027)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
