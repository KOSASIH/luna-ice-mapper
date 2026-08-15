"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Radio, Play, Pause, RefreshCw, Zap, Battery, Thermometer, Signal } from "lucide-react";

interface TelemetryPoint {
  time: string;
  battery: number;
  solar: number;
  temp: number;
  signal: number;
}

export function TelemetryChart() {
  const [data, setData] = useState<TelemetryPoint[]>([]);
  const [isLive, setIsLive] = useState(true);

  // Initialize with 20 points
  useEffect(() => {
    const initial: TelemetryPoint[] = [];
    const now = Date.now();
    for (let i = 19; i >= 0; i--) {
      const t = new Date(now - i * 3000);
      initial.push({
        time: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        battery: 94 + Math.sin(i * 0.5) * 0.8,
        solar: 34.5 + Math.cos(i * 0.4) * 1.2,
        temp: 18.5 + Math.sin(i * 0.3) * 0.6,
        signal: -78.4 + Math.cos(i * 0.6) * 1.5,
      });
    }
    setData(initial);
  }, []);

  // Interval generator
  useEffect(() => {
    if (!isLive) return;
    const timer = setInterval(() => {
      setData((prev) => {
        const nextTime = new Date();
        const tStr = nextTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const last = prev[prev.length - 1] || { battery: 94.2, solar: 34.8, temp: 18.5, signal: -78.4 };
        const newPoint: TelemetryPoint = {
          time: tStr,
          battery: Math.min(100, Math.max(90, last.battery + (Math.random() - 0.5) * 0.2)),
          solar: Math.min(40, Math.max(28, last.solar + (Math.random() - 0.5) * 0.4)),
          temp: Math.min(25, Math.max(12, last.temp + (Math.random() - 0.5) * 0.2)),
          signal: Math.min(-65, Math.max(-90, last.signal + (Math.random() - 0.5) * 0.6)),
        };
        return [...prev.slice(1), newPoint];
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [isLive]);

  const latest = data[data.length - 1] || { battery: 94.2, solar: 34.8, temp: 18.5, signal: -78.4 };

  // Calculate SVG path for solar power line chart
  const svgWidth = 600;
  const svgHeight = 160;
  const pointsCount = data.length || 1;
  const solarPoints = data.map((d, idx) => {
    const x = (idx / (pointsCount - 1)) * svgWidth;
    // Map solar 25-40W to SVG height 140 to 20
    const y = svgHeight - ((d.solar - 25) / 15) * (svgHeight - 40) - 20;
    return `${x},${y}`;
  }).join(" ");

  return (
    <Card className="border-slate-800">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-sky-400 animate-pulse" />
            <CardTitle className="text-lg font-bold">Real-Time Telemetry Stream</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isLive ? "glow" : "outline"} className="font-mono text-xs">
              {isLive ? "LIVE STREAM" : "PAUSED"}
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsLive(!isLive)}
              className="h-8 gap-1 font-mono text-xs"
            >
              {isLive ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {isLive ? "Pause" : "Resume"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 4 Key Realtime Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Solar Power</span>
              <Zap className="h-3.5 w-3.5 text-sky-400" />
            </div>
            <div className="font-mono font-bold text-xl text-sky-400 mt-1">
              {latest.solar.toFixed(1)} W
            </div>
            <div className="text-[10px] text-slate-500 font-mono">Nominal: ~35.0 W</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Battery SOC</span>
              <Battery className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div className="font-mono font-bold text-xl text-emerald-400 mt-1">
              {latest.battery.toFixed(1)} %
            </div>
            <div className="text-[10px] text-slate-500 font-mono">40 Whr Li-Ion</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Core Temp</span>
              <Thermometer className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <div className="font-mono font-bold text-xl text-amber-400 mt-1">
              {latest.temp.toFixed(1)} °C
            </div>
            <div className="text-[10px] text-slate-500 font-mono">Safe Range: -10..+35°C</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Signal RSSI</span>
              <Signal className="h-3.5 w-3.5 text-indigo-400" />
            </div>
            <div className="font-mono font-bold text-xl text-indigo-400 mt-1">
              {latest.signal.toFixed(1)} dBm
            </div>
            <div className="text-[10px] text-slate-500 font-mono">S-Band 2.2 GHz</div>
          </div>
        </div>

        {/* Real-time SVG Graph */}
        <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>Solar Power Output (W) — 60s Rolling Window</span>
            <span className="text-sky-400">Peak: 38.2W</span>
          </div>
          <div className="w-full h-40">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
              {/* Grid lines */}
              <line x1="0" y1="40" x2={svgWidth} y2="40" stroke="#1e293b" strokeDasharray="4 4" />
              <line x1="0" y1="80" x2={svgWidth} y2="80" stroke="#1e293b" strokeDasharray="4 4" />
              <line x1="0" y1="120" x2={svgWidth} y2="120" stroke="#1e293b" strokeDasharray="4 4" />

              {/* Polygon fill */}
              {solarPoints && (
                <polygon
                  points={`0,${svgHeight} ${solarPoints} ${svgWidth},${svgHeight}`}
                  fill="url(#skyGradient)"
                  opacity="0.3"
                />
              )}

              {/* Polyline */}
              {solarPoints && (
                <polyline
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  points={solarPoints}
                />
              )}

              <defs>
                <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#030712" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
