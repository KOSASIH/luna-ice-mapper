"use client";

import React, { useState, useEffect } from "react";
import { SCIENTIFIC_FACTS } from "@/lib/constants";
import { Orbit, Sparkles } from "lucide-react";

export default function VisualizerLoading() {
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % SCIENTIFIC_FACTS.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-6 animate-fadeIn">
      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-sky-950 border-2 border-sky-400 shadow-[0_0_30px_rgba(56,189,248,0.5)]">
        <Orbit className="h-10 w-10 text-sky-400 animate-spin" />
      </div>

      <div className="space-y-2 max-w-md">
        <h2 className="text-xl font-bold text-white tracking-wider font-mono">
          LOADING 3D LUNAR ENVIRONMENT...
        </h2>
        <p className="text-xs font-mono text-sky-400 transition-all duration-300 min-h-[36px] flex items-center justify-center gap-2">
          <Sparkles className="h-3.5 w-3.5 shrink-0" />
          <span>{SCIENTIFIC_FACTS[factIndex]}</span>
        </p>
      </div>
    </div>
  );
}
