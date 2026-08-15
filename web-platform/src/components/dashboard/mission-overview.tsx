import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MISSION_INFO, OBJECTIVES } from "@/lib/constants";
import { Globe, Flag, Award, Target, CheckCircle2 } from "lucide-react";

export function MissionOverview() {
  return (
    <Card className="border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-sky-400" />
            <CardTitle className="text-lg font-bold">Mission Overview & Objectives</CardTitle>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-sky-300">
              6U CubeSat Platform
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mission Statement & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-sky-400 uppercase">
              <Target className="h-4 w-4" /> Core Mission Statement
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {MISSION_INFO.missionStatement}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-sky-400 uppercase">
              <Award className="h-4 w-4" /> Strategic Vision
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {MISSION_INFO.vision}
            </p>
          </div>
        </div>

        {/* Lead Partnerships */}
        <div className="p-4 rounded-lg bg-sky-950/20 border border-sky-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-sky-950 border border-sky-500/40 text-sky-400">
              <Flag className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-mono">LEAD COUNTRY / AGENCY</div>
              <div className="text-sm font-bold text-white">{MISSION_INFO.leadCountry}</div>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-800 hidden sm:block" />

          <div>
            <div className="text-xs text-slate-400 font-mono">INTERNATIONAL PARTNER</div>
            <div className="text-sm font-bold text-sky-400">{MISSION_INFO.partner}</div>
          </div>

          <div className="h-8 w-px bg-slate-800 hidden sm:block" />

          <div>
            <div className="text-xs text-slate-400 font-mono">MISSION DURATION</div>
            <div className="text-sm font-bold text-slate-200">{MISSION_INFO.missionDuration}</div>
          </div>
        </div>

        {/* 4 Objectives */}
        <div>
          <h4 className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-3">
            Key Strategic Objectives
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {OBJECTIVES.map((obj, index) => (
              <div key={index} className="flex gap-3 p-3 rounded-lg bg-slate-950/40 border border-slate-800/80">
                <CheckCircle2 className="h-4 w-4 text-sky-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-white mb-1">{obj.title}</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{obj.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
