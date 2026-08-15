'use client';

import React from 'react';
import { Cpu, Wifi, HardDrive, Satellite, Compass } from 'lucide-react';

interface OrbitInfoProps {
  timeValue: number;
}

export function OrbitInfo({ timeValue }: OrbitInfoProps) {
  const currentIllum = Math.round(35 + Math.sin((timeValue * Math.PI) / 180) * 28);

  return (
    <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-3 sm:p-4 text-slate-100 font-mono text-xs shadow-2xl space-y-3 w-64 sm:w-72">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2 text-sky-400">
          <Satellite className="w-4 h-4 animate-pulse" />
          <span className="font-bold tracking-wider uppercase text-[11px]">LUNA-IM 6U CUBESAT</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>NOMINAL</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-2">
          <span className="text-slate-500 block text-[10px]">ALTITUDE</span>
          <span className="text-white font-bold">100.0 km</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-2">
          <span className="text-slate-500 block text-[10px]">VELOCITY</span>
          <span className="text-white font-bold">1.633 km/s</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-2">
          <span className="text-slate-500 block text-[10px]">PERIOD</span>
          <span className="text-white font-bold">118.2 min</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-2">
          <span className="text-slate-500 block text-[10px]">INCLINATION</span>
          <span className="text-white font-bold">90.0° Polar</span>
        </div>
      </div>

      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            Sun Beta Angle
          </span>
          <span className="text-amber-400 font-bold">+{Math.round(timeValue)}°</span>
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400 flex items-center gap-1">
            <Wifi className="w-3.5 h-3.5 text-sky-400" />
            Downlink Rate
          </span>
          <span className="text-sky-400 font-bold">100 Mbps (X-Band)</span>
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400 flex items-center gap-1">
            <HardDrive className="w-3.5 h-3.5 text-purple-400" />
            Data Queue
          </span>
          <span className="text-purple-300 font-bold">4.2 / 5.0 GB (84%)</span>
        </div>
      </div>

      <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-between text-[10px] text-sky-300">
        <span className="font-sans">NEXT PSR PASS:</span>
        <span className="font-mono font-bold text-white">Shackleton (14m 22s)</span>
      </div>
    </div>
  );
}
