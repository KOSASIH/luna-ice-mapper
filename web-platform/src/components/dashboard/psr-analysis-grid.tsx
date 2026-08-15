"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PSR_REGIONS, ARTEMIS_LANDING_SITES } from "@/lib/constants";
import { PSRRegion } from "@/types";
import { Database, ArrowUpDown, Filter, MapPin, CheckCircle2 } from "lucide-react";

export function PSRAnalysisGrid() {
  const [sortField, setSortField] = useState<keyof PSRRegion>("estimatedIceMassTons");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [minIceFilter, setMinIceFilter] = useState(100); // Million tons

  const handleSort = (field: keyof PSRRegion) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const filteredRegions = PSR_REGIONS.filter(
    (r) => r.estimatedIceMassTons >= minIceFilter * 1e6
  ).sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (typeof valA === "number" && typeof valB === "number") {
      return sortOrder === "asc" ? valA - valB : valB - valA;
    }
    return 0;
  });

  return (
    <Card className="border-slate-800">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-sky-400" />
            <CardTitle className="text-lg font-bold">Permanently Shadowed Region (PSR) Ice Inventory</CardTitle>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Filter className="h-3.5 w-3.5 text-sky-400" />
              <span>Min Ice ({minIceFilter}M Tons):</span>
              <input
                type="range"
                min="100"
                max="800"
                step="50"
                value={minIceFilter}
                onChange={(e) => setMinIceFilter(Number(e.target.value))}
                className="w-24 accent-sky-400 cursor-pointer h-1.5 bg-slate-800 rounded"
              />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto border border-slate-800 rounded-lg">
          <table className="w-full text-xs text-left font-mono">
            <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3 cursor-pointer hover:text-white" onClick={() => handleSort("name")}>
                  <div className="flex items-center gap-1">
                    Crater Name <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="p-3 cursor-pointer hover:text-white" onClick={() => handleSort("latitude")}>
                  Location (Lat / Lng)
                </th>
                <th className="p-3 cursor-pointer hover:text-white" onClick={() => handleSort("diameterKm")}>
                  Diameter
                </th>
                <th className="p-3 cursor-pointer hover:text-white" onClick={() => handleSort("areaKm2")}>
                  PSR Area
                </th>
                <th className="p-3 cursor-pointer hover:text-white text-right" onClick={() => handleSort("estimatedIceMassTons")}>
                  Estimated Ice Mass
                </th>
                <th className="p-3 cursor-pointer hover:text-white text-right" onClick={() => handleSort("averageTempKelvin")}>
                  Avg Temp
                </th>
                <th className="p-3 text-center">Artemis Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
              {filteredRegions.map((psr) => (
                <tr key={psr.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="p-3 font-bold text-white font-sans">{psr.name}</td>
                  <td className="p-3 text-slate-400">
                    {psr.latitude}°S, {psr.longitude}°E
                  </td>
                  <td className="p-3 text-slate-300">{psr.diameterKm} km</td>
                  <td className="p-3 text-slate-300">{psr.areaKm2} km²</td>
                  <td className="p-3 text-right font-bold text-sky-400">
                    {(psr.estimatedIceMassTons / 1e6).toFixed(1)} M Tons
                  </td>
                  <td className="p-3 text-right text-amber-400 font-bold">{psr.averageTempKelvin} K</td>
                  <td className="p-3 text-center">
                    {psr.artemisTarget ? (
                      <Badge variant="success" className="text-[10px]">
                        Yes
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px]">
                        Secondary
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {filteredRegions.map((psr) => (
            <div key={psr.id} className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-white">{psr.name}</h4>
                {psr.artemisTarget && (
                  <Badge variant="success" className="text-[10px]">
                    Artemis Target
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{psr.description}</p>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-800">
                <div>
                  <span className="text-slate-400">Ice Mass:</span>
                  <div className="text-sky-400 font-bold">{(psr.estimatedIceMassTons / 1e6).toFixed(1)}M Tons</div>
                </div>
                <div>
                  <span className="text-slate-400">Avg Temp:</span>
                  <div className="text-amber-400 font-bold">{psr.averageTempKelvin} K</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function ArtemisSiteComparison() {
  return (
    <Card className="border-slate-800">
      <CardHeader>
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-sky-400" />
          <CardTitle className="text-lg font-bold">NASA Artemis Landing Site Candidates</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ARTEMIS_LANDING_SITES.map((site) => (
            <div key={site.id} className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="font-bold text-sm text-white">{site.name}</h4>
                <Badge
                  variant={site.artemisPriority === "Critical" ? "glow" : "cyan"}
                  className="text-[10px]"
                >
                  {site.artemisPriority} Priority
                </Badge>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{site.description}</p>

              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Coordinates:</span>
                  <span className="text-slate-200">{site.latitude}°S, {site.longitude}°E</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">PSR Proximity:</span>
                  <span className="text-sky-400 font-bold">{site.psrProximityKm} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Est. Ice Concentration:</span>
                  <span className="text-emerald-400 font-bold">{site.iceConcentrationPct}% H₂O</span>
                </div>
              </div>

              <div className="space-y-1 pt-1 border-t border-slate-800/80">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Key Advantages:</div>
                <ul className="space-y-1 text-xs text-slate-300">
                  {site.keyFeatures.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3 w-3 text-sky-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
