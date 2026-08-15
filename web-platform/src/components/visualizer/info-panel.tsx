'use client';

import React from 'react';
import { DataPoint, PSR_REGIONS, getPointData } from '@/lib/psr-data';
import {
  MapPin,
  Download,
  Copy,
  Check,
  Snowflake,
  Radio,
  Thermometer,
  Mountain,
  Sun,
  Target,
  BarChart2
} from 'lucide-react';

interface InfoPanelProps {
  selectedPoint: DataPoint | null;
  onSelectCrater: (craterId: string) => void;
  selectedCraterId: string | null;
}

export function InfoPanel({ selectedPoint, onSelectCrater, selectedCraterId }: InfoPanelProps) {
  const [copied, setCopied] = React.useState(false);

  const point = selectedPoint || getPointData(-89.9, 0.0);
  const matchedCrater = PSR_REGIONS.find((c) => c.id === point.psrId);

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(`${point.lat}°, ${point.lon}°`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(point, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `luna-point-${point.lat}-${point.lon}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    const headers = 'Latitude,Longitude,Elevation_m,IceProbability_pct,NeutronCount_cps,Temperature_K,Slope_deg,Illumination_pct\n';
    const row = `${point.lat},${point.lon},${point.elevation},${point.iceProbability},${point.neutronCount},${point.temperature},${point.slope},${point.illumination}\n`;
    const dataStr = 'data:text/csv;charset=utf-8,' + encodeURIComponent(headers + row);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `luna-point-${point.lat}-${point.lon}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  let tempColor = 'text-sky-400 bg-sky-950/40 border-sky-500/30';
  let tempLabel = 'Cryogenic Trap';
  if (point.temperature > 100) {
    tempColor = 'text-amber-400 bg-amber-950/40 border-amber-500/30';
    tempLabel = 'Illuminated Surface';
  } else if (point.temperature > 50) {
    tempColor = 'text-indigo-400 bg-indigo-950/40 border-indigo-500/30';
    tempLabel = 'Polar Ambient';
  }

  const circumference = 2 * Math.PI * 38;
  const strokeDashoffset = circumference - (point.iceProbability / 100) * circumference;

  return (
    <div className="flex flex-col h-full bg-slate-950/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-4 text-slate-100 font-sans shadow-2xl overflow-y-auto space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-white uppercase font-mono">
              {matchedCrater ? matchedCrater.name : 'Target Coordinate Analysis'}
            </h2>
            <p className="text-[11px] font-mono text-sky-400">
              {point.lat}° Lat, {point.lon}° Lon • Elev: {point.elevation}m
            </p>
          </div>
        </div>
        <button
          onClick={handleCopyCoords}
          title="Copy Coordinates"
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
            Water Ice Mass Fraction
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-mono font-extrabold text-sky-400">
              {point.iceProbability}%
            </span>
            <span className="text-xs text-slate-400 font-mono">Probability</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 max-w-[180px]">
            {point.iceProbability > 50
              ? 'High volatile ice concentration detected in permanent shadowed trap.'
              : 'Low-to-moderate hydrogen signature.'}
          </p>
        </div>

        <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="38"
              className="text-slate-800 stroke-current"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="38"
              className="text-sky-400 stroke-current transition-all duration-500 ease-out"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <Snowflake className="w-6 h-6 text-sky-400 absolute" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 space-y-1">
          <div className="flex items-center gap-1.5 text-purple-400 text-xs font-mono">
            <Radio className="w-3.5 h-3.5" />
            <span>Epithermal Neutrons</span>
          </div>
          <div className="text-lg font-mono font-bold text-white">
            {point.neutronCount} <span className="text-xs font-normal text-slate-400">cps</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-purple-400 h-full rounded-full"
              style={{ width: `${Math.min(100, (point.neutronCount / 240) * 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 space-y-1">
          <div className="flex items-center gap-1.5 text-pink-400 text-xs font-mono">
            <Thermometer className="w-3.5 h-3.5" />
            <span>Temperature</span>
          </div>
          <div className="text-lg font-mono font-bold text-white">
            {point.temperature} <span className="text-xs font-normal text-slate-400">K</span>
          </div>
          <span className={`inline-block text-[9px] font-mono px-2 py-0.5 rounded-full border ${tempColor}`}>
            {tempLabel}
          </span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono">
            <Mountain className="w-3.5 h-3.5" />
            <span>Surface Slope</span>
          </div>
          <div className="text-lg font-mono font-bold text-white">
            {point.slope}°
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {point.slope < 15 ? 'Traversable (<15°)' : point.slope < 25 ? 'Moderate Rim' : 'Steep Rim (>25°)'}
          </span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 text-xs font-mono">
            <Sun className="w-3.5 h-3.5" />
            <span>Illumination</span>
          </div>
          <div className="text-lg font-mono font-bold text-white">
            {point.illumination}%
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {point.illumination < 5 ? 'Perpetual Shadow' : 'Intermittent Solar'}
          </span>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 space-y-2">
        <span className="text-[11px] font-mono font-semibold text-slate-300 flex items-center gap-1.5">
          <BarChart2 className="w-3.5 h-3.5 text-sky-400" />
          Comparison vs. South Pole Average
        </span>

        <div className="space-y-2 text-[10px] font-mono">
          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Ice Mass Fraction</span>
              <span>{point.iceProbability}% vs 18% avg</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex">
              <div className="bg-sky-400 h-full" style={{ width: `${point.iceProbability}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Neutron Suppression</span>
              <span>{point.neutronCount} cps vs 195 avg</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex">
              <div className="bg-purple-400 h-full" style={{ width: `${(point.neutronCount / 240) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-sky-400" />
          Jump to Key PSR Crater (12 Cataloged)
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {PSR_REGIONS.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelectCrater(c.id)}
              className={`p-2 rounded-xl text-left border text-[10px] font-mono transition-all ${
                selectedCraterId === c.id || point.psrId === c.id
                  ? 'bg-sky-500/20 text-sky-300 border-sky-400 font-bold'
                  : 'bg-slate-900/60 hover:bg-slate-800 border-slate-800 text-slate-300'
              }`}
            >
              <div className="truncate font-semibold">{c.name}</div>
              <div className="text-[9px] text-slate-400">{c.iceConcentration} wt% • {c.temperature}K</div>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800/80 flex gap-2">
        <button
          onClick={handleExportJSON}
          className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-sky-400 font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          JSON Point Data
        </button>
        <button
          onClick={handleExportCSV}
          className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          CSV Table
        </button>
      </div>
    </div>
  );
}
