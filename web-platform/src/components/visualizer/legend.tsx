'use client';

import * as THREE from 'three';
import { DataLayerType, DataPoint } from '@/lib/psr-data';

/**
 * Color legend for data layers.
 * Shows colormap gradient with min/max labels and scientific notation.
 */

const COLORMAPS: Record<string, string[]> = {
  viridis: ['#440154', '#3b528b', '#21918c', '#5ec962', '#fde725'],
  plasma: ['#0d0887', '#7e03a8', '#cc4778', '#f89540', '#f0f921'],
  blues: ['#0c4a6e', '#0369a1', '#0ea5e9', '#7dd3fc', '#e0f2fe'],
  RdBu_r: ['#2166ac', '#67a9cf', '#f7f7f7', '#ef8a62', '#b2182b'],
};

const LAYER_INFO: Record<DataLayerType, { name: string; colormap: string; min: number; max: number; unit: string }> = {
  ice: { name: 'Ice Probability', colormap: 'blues', min: 0, max: 100, unit: '%' },
  neutron: { name: 'Neutron Count', colormap: 'plasma', min: 100, max: 220, unit: 'counts/s' },
  temperature: { name: 'Temperature', colormap: 'viridis', min: 30, max: 150, unit: 'K' },
  slope: { name: 'Surface Slope', colormap: 'RdBu_r', min: 0, max: 45, unit: '°' },
  illumination: { name: 'Illumination', colormap: 'plasma', min: 0, max: 100, unit: '%' },
};

export function Legend({ activeLayer }: { activeLayer: DataLayerType }) {
  const info = LAYER_INFO[activeLayer];
  const colors = COLORMAPS[info.colormap] || COLORMAPS.blues;

  return (
    <div className="px-3 py-2.5 rounded-lg bg-slate-950/85 border border-slate-800 backdrop-blur">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300 font-bold">
          {info.name}
        </span>
        <span className="text-[9px] font-mono text-slate-500">{info.unit}</span>
      </div>
      {/* Gradient bar */}
      <div
        className="h-2.5 w-full rounded-full"
        style={{
          background: `linear-gradient(to right, ${colors.join(', ')})`,
        }}
      />
      {/* Tick marks */}
      <div className="flex items-center justify-between mt-1">
        <span className="text-[9px] font-mono text-slate-400">
          {info.min >= 1000 ? info.min.toExponential(1) : info.min}
        </span>
        <span className="text-[9px] font-mono text-slate-500">
          {((info.min + info.max) / 2).toFixed(0)}
        </span>
        <span className="text-[9px] font-mono text-slate-400">
          {info.max >= 1000 ? info.max.toExponential(1) : info.max}
        </span>
      </div>
    </div>
  );
}
