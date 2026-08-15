import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AI_AGENT_TEAM } from "@/lib/constants";
import { Bot, Cpu, Sparkles } from "lucide-react";

export function TeamSection() {
  return (
    <Card className="border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-sky-400" />
            <CardTitle className="text-lg font-bold">Autonomous AI Agent Subsystem Engineers</CardTitle>
          </div>
          <Badge variant="glow" className="font-mono text-xs">
            12 AI Subsystems
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {AI_AGENT_TEAM.map((agent) => (
            <div
              key={agent.id}
              className="group p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/80 hover:border-sky-500/50 hover:bg-sky-950/30 transition-all duration-200 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-sky-950 border border-sky-500/30 font-mono text-xs font-bold text-sky-400 group-hover:scale-105 transition-transform">
                    {agent.name.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-sky-400 group-hover:text-sky-300">
                      {agent.name}
                    </h4>
                  </div>
                </div>
                <Badge
                  variant={agent.status === "active" ? "cyan" : "outline"}
                  className="text-[9px] px-1.5 py-0"
                >
                  {agent.status}
                </Badge>
              </div>

              <div>
                <div className="text-xs font-semibold text-white">{agent.role}</div>
                <div className="text-[10px] font-mono text-sky-400/80">{agent.domain}</div>
              </div>

              <p className="text-[11px] text-slate-400 leading-snug line-clamp-3">
                {agent.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
