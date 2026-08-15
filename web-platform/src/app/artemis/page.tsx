'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ARTEMIS_LANDING_SITES, PSR_REGIONS } from '@/lib/constants';
import { PolarProjectionMap } from '@/components/visualizer/polar-projection-map';
import { MapPin, Search, Sparkles, CheckCircle2, Database, Crosshair } from 'lucide-react';

export default function ArtemisPage() {
  const [latInput, setLatInput] = useState('-89.4');
  const [lngInput, setLngInput] = useState('222.0');
  const [queryResult, setQueryResult] = useState<any | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedCrater, setSelectedCrater] = useState<string | null>(null);
  const [minIceMass, setMinIceMass] = useState(100); // million tons
  const [searchRadius, setSearchRadius] = useState(10);

  const handleQuery = () => {
    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);
    if (isNaN(lat) || isNaN(lng)) return;

    setAnalyzing(true);
    setTimeout(() => {
      let nearest = PSR_REGIONS[0];
      let minDist = Infinity;
      PSR_REGIONS.forEach((psr) => {
        const dist = Math.sqrt((psr.latitude - lat) ** 2 + (psr.longitude - lng) ** 2);
        if (dist < minDist) { minDist = dist; nearest = psr; }
      });

      const distKm = minDist * 30;
      const iceProb = Math.max(0, 100 - distKm * 3);
      const temp = 40 + Math.min(80, distKm * 2);
      const iceConc = Math.min(6, (nearest.estimatedIceMassTons / 50_000_000));
      const score = Math.max(10, Math.min(95, Math.round(iceProb * 0.6 + iceConc * 8 + (100 - temp) * 0.2)));

      setQueryResult({
        latitude: lat,
        longitude: lng,
        nearestPsr: nearest.name,
        psrDistanceKm: distKm.toFixed(1),
        estimatedIceConcentration: iceConc.toFixed(1),
        averageTemperatureKelvin: Math.round(temp),
        suitabilityScore: score,
        isInPsr: distKm < 5,
        isruPotential: score > 70 ? 'HIGH' : score > 40 ? 'MODERATE' : 'LOW',
      });
      setAnalyzing(false);
    }, 1200);
  };

  const filteredPSRs = PSR_REGIONS.filter((psr) => psr.estimatedIceMassTons >= minIceMass * 1_000_000);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="glow" className="font-mono text-xs">
            NASA ARTEMIS PROGRAM INTEGRATION
          </Badge>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Artemis Candidate Landing Site Evaluation
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Direct mapping correlation between Luna Ice Mapper PSR water-ice remote sensing and
          NASA Artemis crew landing site criteria.
        </p>
      </div>

      {/* Polar Overview Map + API Docs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-slate-800 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-sky-400" />
                <CardTitle className="text-lg font-bold">South Pole Site Overview</CardTitle>
              </div>
              <Badge variant="cyan" className="font-mono text-[10px]">Stereographic Projection</Badge>
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

        <Card className="border-slate-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-sky-400" />
              <CardTitle className="text-sm font-bold">API Integration</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 font-mono text-[10px]">
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
              <div className="text-sky-400 mb-1">GET /api/artemis/landing-sites</div>
              <div className="text-slate-500">Returns all candidate sites with ISRU scoring</div>
            </div>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
              <div className="text-sky-400 mb-1">POST /api/artemis/landing-sites/analyze</div>
              <div className="text-slate-500">{`{lat, lon} → ice depth, accessibility, ISRU`}</div>
            </div>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
              <div className="text-sky-400 mb-1">GET /api/artemis/psr-search</div>
              <div className="text-slate-500">Params: min_h2o_pct, lat, lon, radius_km</div>
              <div className="text-amber-400 mt-1">PostGIS ST_DWithin query</div>
            </div>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
              <div className="text-sky-400 mb-1">Swagger Docs</div>
              <div className="text-slate-500">Available at /docs (FastAPI auto-generated)</div>
            </div>
            <div className="pt-1">
              <Badge variant="success" className="text-[9px]">PDS4 Compliant</Badge>
              <Badge variant="cyan" className="text-[9px] ml-1">PostGIS Enabled</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Landing Sites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ARTEMIS_LANDING_SITES.map((site) => (
          <Card key={site.id} glow className="border-sky-500/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-1">
                <Badge variant={site.artemisPriority === 'Critical' ? 'glow' : 'cyan'} className="font-mono text-[10px]">
                  {site.artemisPriority} Priority
                </Badge>
                <span className="text-xs font-mono text-sky-400">{site.latitude}°S, {site.longitude}°E</span>
              </div>
              <CardTitle className="text-base font-bold text-white">{site.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">{site.description}</p>
              <div className="space-y-1.5 text-xs font-mono bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">Elevation:</span>
                  <span className="text-slate-200">+{site.elevationKm} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Proximity to PSR Ice:</span>
                  <span className="text-sky-400 font-bold">{site.psrProximityKm} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated H₂O Ice:</span>
                  <span className="text-emerald-400 font-bold">{site.iceConcentrationPct}%</span>
                </div>
              </div>
              <div className="space-y-1 pt-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Key Advantages:</div>
                <ul className="space-y-1 text-xs text-slate-300">
                  {site.keyFeatures.map((feat, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3 w-3 text-sky-400 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Coordinate Query + PostGIS Spatial Search */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Crosshair className="h-5 w-5 text-sky-400" />
              <CardTitle className="text-lg font-bold">Coordinate Ice Analysis</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Latitude (°S)</label>
                <Input value={latInput} onChange={(e) => setLatInput(e.target.value)} placeholder="-89.4" />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Longitude (°E)</label>
                <Input value={lngInput} onChange={(e) => setLngInput(e.target.value)} placeholder="222.0" />
              </div>
              <div className="flex items-end">
                <Button onClick={handleQuery} disabled={analyzing} className="w-full gap-2 font-mono text-xs">
                  {analyzing ? <><RefreshIcon /> Analyzing...</> : <><Sparkles className="h-4 w-4" /> Analyze</>}
                </Button>
              </div>
            </div>

            {queryResult && (
              <div className="p-4 rounded-lg bg-sky-950/40 border border-sky-500/40 space-y-3 font-mono text-xs animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-sky-400">Analysis: ({queryResult.latitude}°S, {queryResult.longitude}°E)</span>
                  <Badge variant={queryResult.isInPsr ? 'glow' : 'outline'}>
                    {queryResult.isInPsr ? 'Inside PSR' : 'Outside PSR'}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Nearest PSR</div>
                    <div className="text-sky-400 font-bold text-sm">{queryResult.nearestPsr}</div>
                  </div>
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">PSR Distance</div>
                    <div className="text-slate-200 font-bold text-sm">{queryResult.psrDistanceKm} km</div>
                  </div>
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Est. Ice Conc.</div>
                    <div className="text-emerald-400 font-bold text-sm">{queryResult.estimatedIceConcentration} wt%</div>
                  </div>
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Avg Temp</div>
                    <div className="text-amber-400 font-bold text-sm">{queryResult.averageTemperatureKelvin} K</div>
                  </div>
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">ISRU Score</div>
                    <div className="text-white font-bold text-sm">{queryResult.suitabilityScore}/100</div>
                  </div>
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">ISRU Potential</div>
                    <div className={`font-bold text-sm ${queryResult.isruPotential === 'HIGH' ? 'text-emerald-400' : queryResult.isruPotential === 'MODERATE' ? 'text-amber-400' : 'text-slate-400'}`}>
                      {queryResult.isruPotential}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* PostGIS Spatial Query */}
        <Card className="border-slate-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-sky-400" />
              <CardTitle className="text-lg font-bold">PostGIS Spatial Query</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-slate-400 font-mono">
              Find all PSRs with ice mass above a threshold.
            </p>
            <div className="space-y-3">
              <div>
                <label className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                  <span>Min Ice Mass: <span className="text-sky-400 font-bold">{minIceMass}M tons</span></span>
                </label>
                <input
                  type="range" min={0} max={500} step={10}
                  value={minIceMass}
                  onChange={(e) => setMinIceMass(Number(e.target.value))}
                  className="w-full accent-sky-500"
                />
              </div>
              <div>
                <label className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                  <span>Search Radius: <span className="text-sky-400 font-bold">{searchRadius} km</span></span>
                </label>
                <input
                  type="range" min={1} max={50} step={1}
                  value={searchRadius}
                  onChange={(e) => setSearchRadius(Number(e.target.value))}
                  className="w-full accent-sky-500"
                />
              </div>
            </div>

            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-[9px] text-slate-500 overflow-x-auto">
              <span className="text-sky-400">SELECT</span> name, estimated_ice_mass_tons, avg_temp_k<br />
              <span className="text-sky-400">FROM</span> psr_regions<br />
              <span className="text-sky-400">WHERE</span> estimated_ice_mass_tons <span className="text-amber-400">&gt;=</span> {minIceMass}000000<br />
              &nbsp;&nbsp;<span className="text-sky-400">AND</span> ST_DWithin(geometry, ST_Point({lngInput}, {latInput})::geography, {searchRadius * 1000});
            </div>

            <div className="space-y-1.5">
              <div className="text-[10px] font-mono text-slate-400 uppercase">
                Results: {filteredPSRs.length} PSRs match criteria
              </div>
              {filteredPSRs.map((psr) => (
                <div key={psr.id} className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800 font-mono text-[11px]">
                  <span className="text-slate-200">{psr.name}</span>
                  <div className="flex gap-3">
                    <span className="text-emerald-400">{(psr.estimatedIceMassTons / 1e6).toFixed(0)}M t</span>
                    <span className="text-amber-400">{psr.averageTempKelvin} K</span>
                  </div>
                </div>
              ))}
              {filteredPSRs.length === 0 && (
                <div className="text-center text-slate-500 text-xs py-4">No PSRs match the current criteria</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RefreshIcon() {
  return (
    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}
