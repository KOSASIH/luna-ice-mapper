import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  subText?: string;
  icon: LucideIcon;
  accentColor?: string; // tailwind color class
  trend?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  subText,
  icon: Icon,
  accentColor = "text-sky-400",
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("border-slate-800 hover:border-slate-700 transition-all duration-200", className)}>
      <CardContent className="p-5 flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            {label}
          </span>
          <div className="font-mono font-bold text-2xl text-white tracking-tight">
            {value}
          </div>
          {subText && (
            <p className="text-[11px] text-slate-400 font-mono pt-0.5">
              {subText}
            </p>
          )}
          {trend && (
            <span className="inline-block text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
              {trend}
            </span>
          )}
        </div>
        <div className={cn("p-2.5 rounded-lg bg-slate-950 border border-slate-800/80", accentColor)}>
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}
