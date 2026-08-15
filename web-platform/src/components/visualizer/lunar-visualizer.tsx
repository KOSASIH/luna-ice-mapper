'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { DataLayerType, DataPoint, PSR_REGIONS } from '@/lib/psr-data';
import { DataLayersPanel } from './data-layers-panel';
import { MoonScene } from './moon-scene';
import { TimeSlider } from './time-slider';
import { OrbitInfo } from './orbit-info';
import { InfoPanel } from './info-panel';
import { ExportPanel } from './export-panel';
import { Legend } from './legend';

export const LunarVisualizer: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [activeLayer, setActiveLayer] = useState<DataLayerType>('ice');
  const [timeValue, setTimeValue] = useState<number>(45.0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(10);
  const [overlayOpacity, setOverlayOpacity] = useState<number>(0.85);
  const [showPSROverlays, setShowPSROverlays] = useState<boolean>(true);
  const [showCraterLabels, setShowCraterLabels] = useState<boolean>(true);
  const [cameraView, setCameraView] = useState<'south-pole' | 'equator' | 'orbit'>('south-pole');
  const [selectedPoint, setSelectedPoint] = useState<DataPoint | null>(null);
  const [selectedCraterId, setSelectedCraterId] = useState<string | null>('shackleton');
  const [activeMobileTab, setActiveMobileTab] = useState<'layers' | 'visualizer' | 'analysis'>('visualizer');
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTimeValue((prev) => (prev + speed * 0.5) % 360);
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      canvasRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const takeScreenshot = () => {
    const canvas = canvasRef.current?.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `luna-ice-mapper-${activeLayer}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const handleSelectCrater = (craterId: string) => {
    setSelectedCraterId(craterId);
    const crater = PSR_REGIONS.find((c) => c.id === craterId);
    if (crater) {
      setSelectedPoint({
        lat: crater.lat, lon: crater.lon,
        elevation: -crater.maxDepth * 0.001,
        iceProbability: Math.min(98, crater.iceConcentration * 16),
        neutronCount: Math.round(180 - crater.neutronAnomaly * 15),
        temperature: crater.temperature,
        slope: 28, illumination: crater.illumination,
        psrId: crater.id,
      });
    }
  };

  const handlePointSelect = (point: DataPoint) => {
    setSelectedPoint(point);
    setSelectedCraterId(point.psrId || null);
  };

  if (!mounted) {
    return (
      <div className="w-full h-full min-h-[600px] bg-slate-950 flex flex-col items-center justify-center text-[#38bdf8] font-mono text-sm space-y-3">
        <div className="w-8 h-8 border-2 border-[#38bdf8] border-t-transparent rounded-full animate-spin" />
        <div>Initializing 3D Lunar WebGL Engine...</div>
        <div className="text-[10px] text-slate-500">Loading LOLA DEM tiles · Computing shadow propagation</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-100 overflow-hidden font-sans select-none rounded-xl border border-slate-800">
      <div className="lg:hidden flex border-b border-slate-800 bg-slate-900/90 text-xs font-semibold">
        {(['layers', 'visualizer', 'analysis'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveMobileTab(tab)}
            className={`flex-1 py-2.5 text-center border-b-2 transition-all capitalize ${
              activeMobileTab === tab
                ? 'border-[#38bdf8] text-[#38bdf8] bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab === 'layers' ? 'Data Layers' : tab === 'visualizer' ? '3D Visualizer' : 'Analysis & Export'}
          </button>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden relative">
        <div className={`lg:col-span-3 h-full overflow-y-auto ${activeMobileTab === 'layers' ? 'block' : 'hidden lg:block'}`}>
          <DataLayersPanel
            activeLayer={activeLayer}
            onLayerChange={setActiveLayer}
            overlayOpacity={overlayOpacity}
            onOpacityChange={setOverlayOpacity}
            showPSROverlays={showPSROverlays}
            onTogglePSROverlays={setShowPSROverlays}
            showCraterLabels={showCraterLabels}
            onToggleCraterLabels={setShowCraterLabels}
          />
        </div>

        <div
          ref={canvasRef}
          className={`lg:col-span-6 relative h-full flex flex-col bg-slate-950 overflow-hidden ${
            activeMobileTab === 'visualizer' ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 p-1 rounded-lg backdrop-blur-md shadow-lg">
            <span className="text-[10px] font-mono text-slate-400 px-2 uppercase font-semibold">VIEW:</span>
            {(['south-pole', 'equator', 'orbit'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setCameraView(view)}
                className={`px-2.5 py-1 text-[11px] font-mono rounded transition-all ${
                  cameraView === view
                    ? 'bg-[#38bdf8] text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {view === 'south-pole' ? 'South Pole' : view === 'equator' ? 'Equatorial' : 'Wide Orbit'}
              </button>
            ))}
          </div>

          <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
            <OrbitInfo timeValue={timeValue} />
            <div className="flex gap-1.5">
              <button onClick={takeScreenshot} title="Screenshot" className="p-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-[#38bdf8] hover:border-[#38bdf8]/50 backdrop-blur-md transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.66-.9l.82-1.2a2 2 0 011.66-.9h5.86a2 2 0 011.66.9l.82 1.2a2 2 0 001.66.9H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </button>
              <button onClick={toggleFullscreen} title="Fullscreen" className="p-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-[#38bdf8] hover:border-[#38bdf8]/50 backdrop-blur-md transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
              </button>
            </div>
          </div>

          <div className="flex-1 w-full h-full relative">
            <Canvas shadows camera={{ position: [0, -4.8, 1.2], fov: 45 }} gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }} className="w-full h-full">
              <color attach="background" args={['#020617']} />
              <MoonScene
                activeLayer={activeLayer}
                timeValue={timeValue}
                overlayOpacity={overlayOpacity}
                showPSROverlays={showPSROverlays}
                showCraterLabels={showCraterLabels}
                onPointSelect={handlePointSelect}
                selectedCraterId={selectedCraterId}
                cameraView={cameraView}
              />
            </Canvas>
          </div>

          <div className="absolute bottom-20 left-4 z-10 w-48">
            <Legend activeLayer={activeLayer} />
          </div>

          <div className="absolute bottom-4 left-4 right-4 z-10">
            <TimeSlider
              timeValue={timeValue}
              onChange={setTimeValue}
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
              speed={speed}
              onSpeedChange={setSpeed}
            />
          </div>
        </div>

        <div className={`lg:col-span-3 h-full flex flex-col overflow-hidden ${activeMobileTab === 'analysis' ? 'block' : 'hidden lg:block'}`}>
          <div className="flex-1 overflow-y-auto">
            <InfoPanel
              selectedPoint={selectedPoint}
              selectedCraterId={selectedCraterId}
              onSelectCrater={handleSelectCrater}
            />
          </div>
          <div className="flex-shrink-0">
            <ExportPanel activeLayer={activeLayer} />
          </div>
        </div>
      </div>
    </div>
  );
};
