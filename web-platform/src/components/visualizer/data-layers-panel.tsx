'use client';

import React from 'react';
import { DataLayerType } from '@/lib/psr-data';
import {
  Layers,
  Snowflake,
  Radio,
  Thermometer,
  Mountain,
  Sun,
  Eye,
  Tag,
  Sliders,
  Info
} from 'lucide-react';

interface DataLayersPanelProps {
  activeLayer: DataLayerType;
  onLayerChange: (layer: DataLayerType) => void;
  overlayOpacity: number;
  onOpacityChange: (opacity: number) => void;
  showPSROverlays: boolean;
  onTogglePSROverlays: (show: boolean) => void;
  showCraterLabels: boolean;
  onToggleCraterLabels: (show: boolean) => void;
}

interface LayerOption {
  id: DataLayerType;
  title: string;
  subtitle: string;
  description: string;
  source: string;
  icon: React.ReactNode;
  accentColor: string;
}

export function DataLayersPanel({
  activeLayer,
  onLayerChange,
  overlayOpacity,
  onOpacityChange,
  showPSROverlays,
  onTogglePSROverlays,
  showCraterLabels,
  onToggleCraterLabels
}: DataLayersPanelProps) {
  const layerOptions: LayerOption[] = [
    {
      id: 'ice',
      title: 'Water Ice Mass Fraction',
      subtitle: '0 - 100% Concentration',
      description: 'Inferred surface & shallow subsurface water-ice abundance models.',
      source: 'LRO LAMP UV Reflectance & LEND Epithermal Neutron Synthesis',
      icon: <Snowflake className="w-5 h-5 text-sky-400" />,
      accentColor: 'border-sky-500/50 bg-sky-950/20'
    },
    {
      id: 'neutron',
      title: 'Epithermal Neutron Flux',
      subtitle: '100 - 220 Counts/sec',
      description: 'Neutron flux suppression directly correlated with hydrogen concentration.',
      source: 'LRO LEND & Lunar Prospector Neutron Spectrometer (LP-NS)',
      icon: <Radio className="w-5 h-5 text-purple-400" />,
      accentColor: 'border-purple-500/50 bg-purple-950/20'
    },
    {
      id: 'temperature',
      title: 'Surface Temperature',
      subtitle: '30 - 150 Kelvin',
      description: 'Cryogenic equilibrium surface temperatures in PSR micro-cold traps.',
      source: 'LRO Diviner Lunar Radiometer Experiment (DLRE)',
      icon: <Thermometer className="w-5 h-5 text-pink-400" />,
      accentColor: 'border-pink-500/50 bg-pink-950/20'
    },
    {
      id: 'slope',
      title: 'Topographic Slope',
      subtitle: '0° - 45° Gradient',
      description: 'Local surface tilt angle relevant for landing safety and rover mobility.',
      source: 'LRO LOLA Laser Altimeter DEM (5m/px resolution)',
      icon: <Mountain className="w-5 h-5 text-emerald-400" />,
      accentColor: 'border-emerald-500/50 bg-emerald-950/20'
    },
    {
      id: 'illumination',
      title: 'Solar Illumination',
      subtitle: '0 - 100% Annual Average',
      description: 'Accumulated solar illumination percentage across the lunar precession cycle.',
      source: 'LOLA Horizon Horizon Horizon Solar Visibility Simulation',
      icon: <Sun className="w-5 h-5 text-amber-400" />,
      accentColor: 'border-amber-500/50 bg-amber-950/20'
    }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-4 text-slate-100 font-sans shadow-2xl overflow-y-auto">
      <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-800">
        <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-white uppercase font-mono">
            Data Layers
          </h2>
          <p className="text-[11px] text-slate-400">South Polar Map Overlays (-70° to -90°)</p>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        {layerOptions.map((layer) => {
          const isActive = activeLayer === layer.id;
          return (
            <button
              key={layer.id}
              onClick={() => onLayerChange(layer.id)}
              className={`w-full text-left p-3 rounded-xl border transition-all duration-200 flex flex-col gap-1.5 ${
                isActive
                  ? `${layer.accentColor} border-sky-400 shadow-lg shadow-sky-500/10 scale-[1.01]`
                  : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800/80 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    {layer.icon}
                  </div>
                  <span className="text-xs font-semibold text-white font-mono">
                    {layer.title}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950/80 text-sky-400 border border-slate-800">
                  {layer.subtitle}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed pl-1">
                {layer.description}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono mt-0.5 pl-1">
                <Info className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{layer.source}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="pt-4 border-t border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-sky-400" />
            Layer Opacity
          </span>
          <span className="text-xs font-mono text-sky-400 font-bold">
            {Math.round(overlayOpacity * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={overlayOpacity}
          onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
        />

        <div className="space-y-2.5 pt-2">
          <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:bg-slate-900">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-200">
              <Eye className="w-4 h-4 text-sky-400" />
              <span>PSR Region Markers</span>
            </div>
            <input
              type="checkbox"
              checked={showPSROverlays}
              onChange={(e) => onTogglePSROverlays(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-sky-500 focus:ring-sky-400"
            />
          </label>

          <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:bg-slate-900">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-200">
              <Tag className="w-4 h-4 text-sky-400" />
              <span>Crater Labels</span>
            </div>
            <input
              type="checkbox"
              checked={showCraterLabels}
              onChange={(e) => onToggleCraterLabels(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-sky-500 focus:ring-sky-400"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
