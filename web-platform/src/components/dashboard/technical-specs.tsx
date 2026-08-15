"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { SPACECRAFT_SPECS, PAYLOAD_SPECS, COMMS_SPEC, ORBIT_PROFILE } from "@/lib/constants";
import { Cpu, Radio, Orbit, Zap, Shield, CheckCircle } from "lucide-react";

export function TechnicalSpecs() {
  return (
    <Card className="border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-sky-400" />
            <CardTitle className="text-lg font-bold">Spacecraft & Subsystem Specifications</CardTitle>
          </div>
          <Badge variant="cyan" className="font-mono text-xs">
            6U CubeSat Baseline
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="spacecraft">
          <TabsList className="mb-4">
            <TabsTrigger value="spacecraft">Spacecraft Bus (6U)</TabsTrigger>
            <TabsTrigger value="payloads">Scientific Payloads (NS + NIR)</TabsTrigger>
            <TabsTrigger value="orbit">Orbit & Communications</TabsTrigger>
          </TabsList>

          {/* Spacecraft Tab */}
          <TabsContent value="spacecraft">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800">
                <div className="text-xs font-mono text-slate-400">FORM FACTOR & SIZE</div>
                <div className="font-mono font-bold text-sm text-sky-400 mt-1">
                  {SPACECRAFT_SPECS.formFactor}
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800">
                <div className="text-xs font-mono text-slate-400">TOTAL LAUNCH MASS</div>
                <div className="font-mono font-bold text-sm text-sky-400 mt-1">
                  {SPACECRAFT_SPECS.mass}
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800">
                <div className="text-xs font-mono text-slate-400">AVERAGE ORBITAL POWER</div>
                <div className="font-mono font-bold text-sm text-sky-400 mt-1">
                  {SPACECRAFT_SPECS.power}
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800">
                <div className="text-xs font-mono text-slate-400">ENERGY STORAGE</div>
                <div className="font-mono font-bold text-sm text-sky-400 mt-1">
                  {SPACECRAFT_SPECS.battery}
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800">
                <div className="text-xs font-mono text-slate-400">ADCS & POINTING</div>
                <div className="font-mono font-bold text-sm text-sky-400 mt-1">
                  {SPACECRAFT_SPECS.adcs}
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800">
                <div className="text-xs font-mono text-slate-400">THERMAL CONTROL</div>
                <div className="font-mono font-bold text-sm text-sky-400 mt-1">
                  {SPACECRAFT_SPECS.thermal}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Payloads Tab */}
          <TabsContent value="payloads">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PAYLOAD_SPECS.map((p) => (
                <div key={p.id} className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <h4 className="font-bold text-sm text-white flex items-center gap-2">
                        <span>{p.name}</span>
                        <span className="text-xs font-mono bg-sky-950 text-sky-400 px-2 py-0.5 rounded border border-sky-500/30">
                          {p.abbreviation}
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{p.type}</p>
                    </div>
                    <div className="text-right font-mono text-xs">
                      <div className="text-sky-400">{p.mass}</div>
                      <div className="text-slate-400">{p.power}</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    <span className="font-bold text-slate-200">Function:</span> {p.function}
                  </p>

                  <div className="space-y-1">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Key Specifications:</div>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {p.specifications.map((spec, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-sky-400 flex-shrink-0" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Orbit & Comms Tab */}
          <TabsContent value="orbit">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Orbit Profile */}
              <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 space-y-3">
                <h4 className="font-bold text-sm text-white flex items-center gap-2 font-mono">
                  <Orbit className="h-4 w-4 text-sky-400" />
                  ORBITAL PROFILE
                </h4>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Trajectory:</span>
                    <span className="text-slate-200">{ORBIT_PROFILE.trajectory}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Target Altitude:</span>
                    <span className="text-sky-400 font-bold">{ORBIT_PROFILE.targetOrbit}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Inclination:</span>
                    <span className="text-slate-200">{ORBIT_PROFILE.inclination}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Orbital Period:</span>
                    <span className="text-slate-200">{ORBIT_PROFILE.period}</span>
                  </div>
                </div>
              </div>

              {/* Comms Profile */}
              <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 space-y-3">
                <h4 className="font-bold text-sm text-white flex items-center gap-2 font-mono">
                  <Radio className="h-4 w-4 text-sky-400" />
                  TELECOMMUNICATIONS & STORAGE
                </h4>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">UHF Uplink:</span>
                    <span className="text-slate-200">{COMMS_SPEC.uplink}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">S-band Downlink:</span>
                    <span className="text-sky-400 font-bold">{COMMS_SPEC.downlink}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Ground Network:</span>
                    <span className="text-slate-200 text-right">{COMMS_SPEC.groundStations}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Onboard Data Storage:</span>
                    <span className="text-slate-200">{COMMS_SPEC.storage}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
