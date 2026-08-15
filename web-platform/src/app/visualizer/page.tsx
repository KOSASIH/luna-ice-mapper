'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { Badge } from '@/components/ui/badge';
import { LoadingScreen } from '@/components/loading/loading-screen';

// Dynamically import the LunarVisualizer with ssr: false — Three.js requires browser WebGL context
const LunarVisualizer = dynamic(
  () => import('@/components/visualizer/lunar-visualizer').then(mod => mod.LunarVisualizer),
  {
    ssr: false,
    loading: () => <LoadingScreen />,
  }
);

export default function VisualizerPage() {
  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="glow" className="font-mono text-xs">
            3D INTERACTIVE LUNAR SOUTH POLE VISUALIZER
          </Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          3D Lunar PSR & Ice Distribution Model
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Interactive WebGL rendering of the lunar south pole with epithermal neutron hydrogen map
          overlays, NIR ice absorption bands, and permanently shadowed region visualization.
        </p>
      </div>

      <div className="h-[calc(100vh-200px)] min-h-[600px] w-full">
        <LunarVisualizer />
      </div>
    </div>
  );
}
