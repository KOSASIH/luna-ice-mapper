'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SAMPLE_DATASETS } from '@/lib/constants';
import { PolarProjectionMap } from '@/components/visualizer/polar-projection-map';
import { Database, Download, Upload, FileCode, CheckCircle2, RefreshCw, Map as MapIcon, Filter } from 'lucide-react';

export default function DataPortalPage() {
  const [datasets] = useState(SAMPLE_DATASETS);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [selectedCrater, setSelectedCrater] = useState<string | null>(null);
  const [doiGenerating, setDoiGenerating] = useState(false);

  const handleDownload = (id: string, title: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
    }, 1500);
  };

  const handleDOI = () => {
    setDoiGenerating(true);
    setTimeout(() => setDoiGenerating(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="glow" className="font-mono text-xs">
            OPEN SCIENCE DATA PORTAL (PDS4 COMPLIANT)
          </Badge>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Planetary Data System (PDS4) Repository
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Open-access scientific datasets from Luna Ice Mapper payloads including raw neutron count rates,
          calibrated spectral reflectances, and processed GeoTIFF volatile matrices.
        </p>
      </div>

      {/* South Polar Overview Map */}
      <Card className="border-slate-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapIcon className="h-5 w-5 text-sky-400" />
              <CardTitle className="text-lg font-bold">South Polar Stereographic Overview</CardTitle>
            </div>
            <Badge variant="cyan" className="font-mono text-[10px]">
              PSR Craters + Artemis Landing Sites
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <PolarProjectionMap
            showLandingSites
            onCraterClick={(id) => setSelectedCrater(id)}
            selectedCraterId={selectedCrater}
          />
        </CardContent>
      </Card>

      {/* Dataset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {datasets.map((dataset) => (
          <Card key={dataset.id} glow className="border-sky-500/30 flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="cyan" className="font-mono text-[10px]">
                  {dataset.instrument}
                </Badge>
                <span className="text-xs font-mono text-slate-400">{dataset.sizeMb} MB</span>
              </div>
              <CardTitle className="text-base font-bold text-white line-clamp-2">
                {dataset.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
              <p className="text-xs text-slate-300 leading-relaxed">{dataset.description}</p>
              <div className="space-y-2 text-xs font-mono bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">File Format:</span>
                  <span className="text-sky-400 font-bold">{dataset.format}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ice Detection Confidence:</span>
                  <span className="text-emerald-400 font-bold">{(dataset.iceProbability * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Data Points:</span>
                  <span className="text-slate-200">{dataset.dataPointsCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Recorded Date:</span>
                  <span className="text-slate-200">{dataset.recordedDate}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="default"
                  onClick={() => handleDownload(dataset.id, dataset.title)}
                  disabled={downloadingId === dataset.id}
                  className="flex-1 gap-2 font-mono text-xs"
                >
                  {downloadingId === dataset.id ? (
                    <><RefreshCw className="h-4 w-4 animate-spin" /> Downloading...</>
                  ) : (
                    <><Download className="h-4 w-4" /> PDS4</>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDownload(dataset.id, dataset.title)}
                  className="gap-2 font-mono text-xs"
                >
                  <Download className="h-4 w-4" /> GeoTIFF
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* DOI Generation + Upload + Calibration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-slate-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-sky-400" />
              <CardTitle className="text-lg font-bold">Submit Scientific Observation Data</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-slate-800 rounded-xl p-8 text-center bg-slate-950/40 hover:border-sky-500/40 transition-colors">
              <FileCode className="h-10 w-10 text-sky-400 mx-auto mb-2" />
              <p className="text-xs text-slate-300 font-semibold">
                Drag and drop PDS4 XML/FIT/GeoTIFF files here
              </p>
              <p className="text-[11px] text-slate-500 font-mono mt-1">
                Authorized BRIN / NASA GSFC Co-I login required for ingestion pipeline
              </p>
            </div>
            {/* DOI Generation */}
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">DOI Minting Service</span>
                <Badge variant="success" className="text-[10px] font-mono">DataCite</Badge>
              </div>
              <Button
                variant="outline"
                onClick={handleDOI}
                disabled={doiGenerating}
                className="w-full text-xs font-mono gap-2"
              >
                {doiGenerating ? (
                  <><RefreshCw className="h-3.5 w-3.5 animate-spin" /> Generating DOI...</>
                ) : (
                  <>Generate DOI for Dataset Citation</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <CardTitle className="text-lg font-bold">Calibration & Processing Pipeline</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span>Level 0: Raw Telemetry Stream</span>
              <Badge variant="success" className="text-[10px]">Verified</Badge>
            </div>
            <div className="p-3 rounded bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span>Level 1: Calibrated Physical Units</span>
              <Badge variant="success" className="text-[10px]">Verified</Badge>
            </div>
            <div className="p-3 rounded bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span>Level 2: Geo-referenced PSR Heatmaps</span>
              <Badge variant="cyan" className="text-[10px]">Processing</Badge>
            </div>
            <div className="p-3 rounded bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span>Level 3: Fused Ice Probability Maps</span>
              <Badge variant="cyan" className="text-[10px]">Processing</Badge>
            </div>
            <div className="p-3 rounded bg-slate-950 border border-slate-800 flex justify-between items-center">
              <span>Level 4: Artemis Decision Matrices</span>
              <Badge variant="default" className="text-[10px]">Pending</Badge>
            </div>
            {/* Version Control */}
            <div className="pt-2 border-t border-slate-800/50">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-400">Dataset Version Control</span>
                <span className="text-sky-400">v1.0.0 · 2026-08-15</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
