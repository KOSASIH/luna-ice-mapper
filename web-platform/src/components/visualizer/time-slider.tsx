'use client';

import React, { useEffect, useRef } from 'react';
import { Play, Pause, FastForward, Sun, Clock, RotateCcw } from 'lucide-react';

interface TimeSliderProps {
  timeValue: number; // 0 - 360
  onChange: (val: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export function TimeSlider({
  timeValue,
  onChange,
  isPlaying,
  onTogglePlay,
  speed,
  onSpeedChange
}: TimeSliderProps) {
  const speeds = [1, 5, 10, 50];
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    let lastTime = performance.now();

    const update = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      const step = delta * 6 * speed;
      onChange((timeValue + step) % 360);

      animFrameRef.current = requestAnimationFrame(update);
    };

    animFrameRef.current = requestAnimationFrame(update);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, speed, timeValue, onChange]);

  const totalDays = (timeValue / 360) * 27.3 + 12;
  const days = Math.floor(totalDays);
  const hours = Math.floor((totalDays - days) * 24);
  const minutes = Math.floor((((totalDays - days) * 24) - hours) * 60);

  const subSolarLon = (timeValue - 180).toFixed(1);
  const subSolarLat = (Math.sin((timeValue * Math.PI) / 180) * 1.54).toFixed(1);

  return (
    <div className="bg-slate-950/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-3 sm:p-4 text-slate-100 font-sans shadow-2xl flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePlay}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-xs font-semibold transition-all ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-500/10'
                : 'bg-sky-500 text-slate-950 hover:bg-sky-400 shadow-lg shadow-sky-500/20'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>SIMULATE ORBIT</span>
              </>
            )}
          </button>

          <button
            onClick={() => onChange(0)}
            title="Reset Orbit Position"
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="flex items-center bg-slate-900/80 border border-slate-800 rounded-xl p-1">
            <FastForward className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-1" />
            {speeds.map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all ${
                  speed === s
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl">
          <div className="flex items-center gap-1.5 text-sky-400">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[11px] text-slate-400">MET:</span>
            <span className="font-bold">Day {days}, {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}</span>
          </div>
          <div className="h-3 w-px bg-slate-800" />
          <div className="flex items-center gap-1 text-slate-400 text-[11px]">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>Sub-Solar:</span>
            <span className="text-white font-semibold">{subSolarLat}°N, {subSolarLon}°E</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[10px] font-mono text-slate-400 shrink-0">0°</span>
        <div className="relative flex-1 flex items-center">
          <input
            type="range"
            min="0"
            max="360"
            step="0.5"
            value={timeValue}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
          />
        </div>
        <span className="text-[10px] font-mono text-slate-400 shrink-0">360°</span>
        <span className="text-xs font-mono font-bold text-sky-400 w-12 text-right">
          {Math.round(timeValue)}°
        </span>
      </div>
    </div>
  );
}
