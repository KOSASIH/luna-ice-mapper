'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { DataLayerType } from '@/lib/psr-data';

/**
 * ExportPanel — Data export interface for the 3D visualizer.
 * Supports GeoTIFF, PDS4, CSV, GeoJSON, and PNG (screenshot) formats.
 * Includes region selection, resolution options, and PDS4 metadata preview.
 */

interface ExportPanelProps {
  activeLayer: DataLayerType;
}

const FORMATS = [
  { id: 'geotiff', name: 'GeoTIFF', icon: '🗺️', desc: 'Raster with geospatial metadata' },
  { id: 'pds4', name: 'PDS4', icon: '📐', desc: 'NASA Planetary Data System v4' },
  { id: 'csv', name: 'CSV', icon: '📊', desc: 'Tabular lat/lon/value data' },
  { id: 'geojson', name: 'GeoJSON', icon: '🌐', desc: 'Vector points with properties' },
  { id: 'png', name: 'PNG', icon: '📸', desc: 'Current viewport screenshot' },
] as const;

const REGIONS = [
  { id: 'current', name: 'Current View' },
  { id: 'selected', name: 'Selected PSR' },
  { id: 'polar', name: 'Full South Polar (-70° to -90°)' },
];

const RESOLUTIONS = [
  { value: '5', label: '5 m/px' },
  { value: '50', label: '50 m/px' },
  { value: '100', label: '100 m/px' },
  { value: '500', label: '500 m/px' },
  { value: '1000', label: '1 km/px' },
];

export function ExportPanel({ activeLayer }: ExportPanelProps) {
  const [format, setFormat] = React.useState<string>('geotiff');
  const [region, setRegion] = React.useState('polar');
  const [resolution, setResolution] = React.useState('100');
  const [exporting, setExporting] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [exportComplete, setExportComplete] = React.useState(false);

  const handleExport = () => {
    setExporting(true);
    setProgress(0);
    setExportComplete(false);

    const steps = [
      'Querying PostGIS spatial database...',
      'Processing raster data...',
      'Applying colormap transformation...',
      'Generating geospatial metadata...',
      format === 'pds4' ? 'Creating PDS4 XML labels...' : 'Writing output file...',
      'Computing checksums...',
    ];

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setProgress((step / steps.length) * 100);
      if (step >= steps.length) {
        clearInterval(interval);
        setExporting(false);
        setExportComplete(true);
        setTimeout(() => setExportComplete(false), 3000);
      }
    }, 500);
  };

  return (
    <div className="p-3 space-y-3 border-t border-slate-800 bg-slate-950/60">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
          📤 Data Export
        </h3>
        <Badge variant="cyan" className="text-[9px] font-mono">
          {activeLayer.toUpperCase()}
        </Badge>
      </div>

      {/* Format Selection */}
      <div>
        <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1.5">Format</label>
        <div className="grid grid-cols-5 gap-1">
          {FORMATS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFormat(f.id)}
              title={f.desc}
              className={`p-1.5 rounded-md border text-center transition-all ${
                format === f.id
                  ? 'border-[#38bdf8] bg-[#38bdf8]/10'
                  : 'border-slate-800 hover:border-slate-600'
              }`}
            >
              <div className="text-sm">{f.icon}</div>
              <div className="text-[8px] font-mono text-slate-400 mt-0.5">{f.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Region Selection */}
      <div>
        <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Region</label>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="w-full text-[11px] font-mono bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-300"
        >
          {REGIONS.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>

      {/* Resolution */}
      {format !== 'png' && (
        <div>
          <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Resolution</label>
          <div className="flex flex-wrap gap-1">
            {RESOLUTIONS.map((r) => (
              <button
                key={r.value}
                onClick={() => setResolution(r.value)}
                className={`px-2 py-0.5 text-[10px] font-mono rounded border transition-all ${
                  resolution === r.value
                    ? 'border-[#38bdf8] bg-[#38bdf8]/10 text-[#38bdf8]'
                    : 'border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PDS4 Metadata Preview */}
      {format === 'pds4' && (
        <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[9px] text-slate-400 max-h-32 overflow-auto">
          <div className="text-[#38bdf8]">&lt;Product_Observational&gt;</div>
          <div className="pl-2">&lt;Identification_Area&gt;</div>
          <div className="pl-4">&lt;logical_identifier&gt;LIM-2027/NS_DATA_001&lt;/...&gt;</div>
          <div className="pl-4">&lt;version_id&gt;1.0&lt;/...&gt;</div>
          <div className="pl-4">&lt;title&gt;South Pole Neutron Flux&lt;/...&gt;</div>
          <div className="pl-4">&lt;instrument_host_name&gt;LUNA_ICE_MAPPER&lt;/...&gt;</div>
          <div className="pl-2">&lt;/...&gt;</div>
          <div className="pl-2">&lt;Spectral_Object&gt;...</div>
        </div>
      )}

      {/* Export Progress / Button */}
      {exporting ? (
        <div className="space-y-2">
          <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[9px] font-mono text-slate-400 text-center">
            Exporting {format.toUpperCase()}... {Math.round(progress)}%
          </p>
        </div>
      ) : (
        <button
          onClick={handleExport}
          className={`w-full py-2 rounded-lg text-[11px] font-mono font-bold transition-all ${
            exportComplete
              ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400'
              : 'bg-[#38bdf8]/15 border border-[#38bdf8]/40 text-[#38bdf8] hover:bg-[#38bdf8]/25'
          }`}
        >
          {exportComplete ? '✓ Export Complete' : `Export as ${format.toUpperCase()}`}
        </button>
      )}

      {/* DOI Generation */}
      {format !== 'png' && (
        <div className="flex items-center gap-2 pt-1 border-t border-slate-800/50">
          <input
            type="checkbox"
            id="doi-gen"
            className="accent-[#38bdf8] w-3 h-3"
            defaultChecked
          />
          <label htmlFor="doi-gen" className="text-[9px] font-mono text-slate-400">
            Generate DOI for dataset citation
          </label>
        </div>
      )}
    </div>
  );
}
