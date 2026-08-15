"use client";

import React, { useState, useEffect } from "react";
import { SCIENTIFIC_FACTS } from "@/lib/constants";
import { Orbit, Sparkles } from "lucide-react";

export function LoadingScreen() {
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % SCIENTIFIC_FACTS.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-space bg-stars text-slate-100 p-4">
      <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-sky-950 border-2 border-sky-400 shadow-[0_0_40px_rgba(56,189,248,0.5)]">
        <Orbit className="h-12 w-12 text-sky-400 animate-spin" />
      </div>

      <div className="mt-6 space-y-3 text-center max-w-md">
        <h2 className="text-xl font-bold tracking-wider text-white font-mono">
          LUNA ICE MAPPER PLATFORM
        </h2>
        <p className="text-xs font-mono text-sky-400 transition-all duration-300 min-h-[40px] flex items-center justify-center gap-2">
          <Sparkles className="h-4 w-4 shrink-0" />
          <span>{SCIENTIFIC_FACTS[factIndex]}</span>
        </p>
      </div>
    </div>
  );
}
