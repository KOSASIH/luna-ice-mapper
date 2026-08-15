import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TIMELINE_PHASES } from "@/lib/constants";
import { GitCommit, CheckCircle2, Clock, CalendarDays } from "lucide-react";

export function MissionTimeline() {
  return (
    <Card className="border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCommit className="h-5 w-5 text-sky-400" />
            <CardTitle className="text-lg font-bold">Mission Execution Timeline</CardTitle>
          </div>
          <span className="text-xs font-mono text-slate-400">7 Lifecycle Phases</span>
        </div>
      </CardHeader>
      <CardContent>
        {/* Responsive Timeline: Horizontal on Desktop, Vertical on Mobile */}
        <div className="relative">
          {/* Desktop view */}
          <div className="hidden lg:grid grid-cols-7 gap-3">
            {TIMELINE_PHASES.map((phase) => {
              const isActive = phase.status === "in-progress";
              const isCompleted = phase.status === "completed";

              return (
                <div
                  key={phase.number}
                  className={`p-3.5 rounded-lg border transition-all flex flex-col justify-between ${
                    isActive
                      ? "bg-sky-950/60 border-sky-500/60 shadow-[0_0_15px_rgba(56,189,248,0.25)] ring-1 ring-sky-400/40"
                      : isCompleted
                      ? "bg-slate-900/90 border-emerald-500/30"
                      : "bg-slate-950/40 border-slate-800/80 opacity-70 hover:opacity-100"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-sky-400">
                        PHASE {phase.number}
                      </span>
                      {isActive ? (
                        <Badge variant="glow" className="text-[9px] px-1.5 py-0">
                          Active
                        </Badge>
                      ) : isCompleted ? (
                        <Badge variant="success" className="text-[9px] px-1.5 py-0">
                          Done
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0">
                          Planned
                        </Badge>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-white line-clamp-2 leading-tight">
                      {phase.name}
                    </h4>
                    <p className="text-[10px] font-mono text-slate-400">
                      {phase.period}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/60">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">
                      Milestone:
                    </div>
                    <div className="text-[11px] font-medium text-slate-200 line-clamp-2">
                      {phase.milestone}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile & Tablet vertical view */}
          <div className="lg:hidden space-y-3">
            {TIMELINE_PHASES.map((phase) => {
              const isActive = phase.status === "in-progress";
              const isCompleted = phase.status === "completed";

              return (
                <div
                  key={phase.number}
                  className={`p-4 rounded-lg border flex items-start gap-3 ${
                    isActive
                      ? "bg-sky-950/60 border-sky-500/60 shadow-[0_0_15px_rgba(56,189,248,0.25)]"
                      : isCompleted
                      ? "bg-slate-900/90 border-emerald-500/30"
                      : "bg-slate-950/40 border-slate-800/80"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full font-mono text-xs font-bold ${
                        isActive
                          ? "bg-sky-500 text-slate-950"
                          : isCompleted
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-500/40"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {phase.number}
                    </div>
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">{phase.name}</h4>
                      {isActive ? (
                        <Badge variant="glow" className="text-[10px]">
                          Active
                        </Badge>
                      ) : isCompleted ? (
                        <Badge variant="success" className="text-[10px]">
                          Done
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px]">
                          Planned
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                      <CalendarDays className="h-3 w-3 text-sky-400" />
                      <span>{phase.period}</span>
                    </div>
                    <p className="text-xs text-slate-300 pt-1 leading-relaxed">
                      {phase.details}
                    </p>
                    <div className="text-xs font-mono text-sky-300 pt-1">
                      <span className="text-slate-400">Target Milestone:</span> {phase.milestone}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
