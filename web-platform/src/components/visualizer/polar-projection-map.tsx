'use client';

import * as React from 'react';
import { PSR_REGIONS } from '@/lib/psr-data';
import { ARTEMIS_LANDING_SITES } from '@/lib/constants';

/**
 * PolarProjectionMap — SVG-based south polar stereographic projection.
 * Lightweight alternative to Deck.gl for 2D lunar south pole visualization.
 * Shows PSR crater locations sized by estimated ice mass, color-coded by temperature.
 * Includes Artemis landing site markers and interactive hover tooltips.
 */

interface PolarMapProps {
  showLandingSites?: boolean;
  onCraterClick?: (craterId: string) => void;
  selectedCraterId?: string | null;
}

const MAP_SIZE = 480;
const CENTER = MAP_SIZE / 2;
const MAX_RADIUS = CENTER - 30;

// Convert lat/lon to stereographic south polar projection
function latLonToXY(lat: number, lon: number): { x: number; y: number } {
  const latRad = (lat * Math.PI) / 180;
  const lonRad = (lon * Math.PI) / 180;
  // South polar stereographic: rho = 2 * tan(pi/4 + |lat|/2)
  const rho = 2 * Math.tan(Math.PI / 4 + Math.abs(latRad) / 2);
  const scale = MAX_RADIUS / (2 * Math.tan(Math.PI / 4 + (Math.PI / 2) / 2)); // normalize to -90° at edge
  const r = rho * scale * 0.5;
  const x = CENTER + r * Math.cos(lonRad);
  const y = CENTER - r * Math.sin(lonRad);
  return { x, y };
}

function tempColor(kelvin: number): string {
  if (kelvin < 40) return '#38bdf8'; // ice blue - very cold
  if (kelvin < 55) return '#818cf8'; // indigo
  if (kelvin < 70) return '#a78bfa'; // violet
  if (kelvin < 90) return '#f472b6'; // pink
  return '#fb923c'; // orange - warmer
}

export function PolarProjectionMap({
  showLandingSites = true,
  onCraterClick,
  selectedCraterId,
}: PolarMapProps) {
  const [hovered, setHovered] = React.useState<string | null>(null);
  const [hoverData, setHoverData] = React.useState<{ x: number; y: number; name: string; temp: number; ice: number } | null>(null);

  const handleMouseEnter = (e: React.MouseEvent, crater: typeof PSR_REGIONS[0]) => {
    const rect = (e.currentTarget as SVGElement).closest('svg')?.getBoundingClientRect();
    if (!rect) return;
    setHovered(crater.id);
    setHoverData({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      name: crater.name,
      temp: crater.temperature,
      ice: crater.iceConcentration,
    });
  };

  const handleMouseLeave = () => {
    setHovered(null);
    setHoverData(null);
  };

  return (
    <div className="relative w-full max-w-[520px] mx-auto">
      <svg viewBox={`0 0 ${MAP_SIZE} ${MAP_SIZE}`} className="w-full h-auto">
        {/* Background circle */}
        <defs>
          <radialGradient id="polarBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0c1929" />
            <stop offset="70%" stopColor="#030712" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx={CENTER} cy={CENTER} r={MAX_RADIUS} fill="url(#polarBg)" stroke="#1e293b" strokeWidth="1.5" />

        {/* Latitude grid lines */}
        {[80, 82, 84, 86, 88].map((lat) => {
          const { x: x1, y: y1 } = latLonToXY(-lat, 0);
          const { x: x2, y: y2 } = latLonToXY(-lat, 180);
          const r = Math.sqrt((x1 - CENTER) ** 2 + (y1 - CENTER) ** 2);
          return (
            <circle
              key={lat}
              cx={CENTER}
              cy={CENTER}
              r={r}
              fill="none"
              stroke="#1e293b"
              strokeWidth="0.5"
              strokeDasharray="2 4"
            />
          );
        })}

        {/* Longitude meridian lines */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((lon) => {
          const { x, y } = latLonToXY(-90, lon);
          return (
            <line
              key={lon}
              x1={CENTER}
              y1={CENTER}
              x2={x}
              y2={y}
              stroke="#1e293b"
              strokeWidth="0.5"
              strokeDasharray="2 4"
            />
          );
        })}

        {/* Latitude labels */}
        {[-80, -85, -88].map((lat) => {
          const { x, y } = latLonToXY(lat, 180);
          return (
            <text key={lat} x={x + 4} y={y} fill="#475569" fontSize="8" fontFamily="monospace">
              {Math.abs(lat)}°S
            </text>
          );
        })}

        {/* PSR craters */}
        {PSR_REGIONS.map((crater) => {
          const { x, y } = latLonToXY(crater.lat, crater.lon);
          const sizeScale = Math.max(4, Math.min(18, Math.sqrt(crater.diameterKm) * 2));
          const isSelected = selectedCraterId === crater.id;
          const isHovered = hovered === crater.id;
          return (
            <g key={crater.id}>
              {/* Pulsing ring for selected */}
              {isSelected && (
                <circle
                  cx={x}
                  cy={y}
                  r={sizeScale + 6}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  opacity="0.6"
                  className="animate-ping-slow"
                />
              )}
              {/* Crater circle */}
              <circle
                cx={x}
                cy={y}
                r={sizeScale}
                fill={tempColor(crater.temperature)}
                fillOpacity={isHovered ? 0.8 : 0.45}
                stroke={tempColor(crater.temperature)}
                strokeWidth={isHovered || isSelected ? 2 : 1}
                filter={isHovered ? 'url(#glow)' : undefined}
                className="cursor-pointer transition-all"
                onMouseEnter={(e) => handleMouseEnter(e, crater)}
                onMouseLeave={handleMouseLeave}
                onClick={() => onCraterClick?.(crater.id)}
              />
              {/* Label */}
              {(isHovered || isSelected) && (
                <text
                  x={x}
                  y={y - sizeScale - 4}
                  textAnchor="middle"
                  fill="#e2e8f0"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {crater.name}
                </text>
              )}
            </g>
          );
        })}

        {/* Artemis landing sites */}
        {showLandingSites && ARTEMIS_LANDING_SITES.map((site) => {
          const { x, y } = latLonToXY(site.latitude, site.longitude);
          return (
            <g key={site.id}>
              <polygon
                points={`${x},${y - 6} ${x + 5},${y + 3} ${x - 5},${y + 3}`}
                fill="#fbbf24"
                stroke="#f59e0b"
                strokeWidth="1"
                className="cursor-pointer"
                opacity="0.9"
              />
              <text
                x={x}
                y={y + 14}
                textAnchor="middle"
                fill="#fbbf24"
                fontSize="7"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {site.name.split(' ')[0]}
              </text>
            </g>
          );
        })}

        {/* South pole marker */}
        <circle cx={CENTER} cy={CENTER} r="2" fill="#f8fafc" />
        <text x={CENTER + 4} y={CENTER + 3} fill="#94a3b8" fontSize="7" fontFamily="monospace">SP</text>

        {/* Legend */}
        <g transform={`translate(10, ${MAP_SIZE - 60})`}>
          <text fill="#64748b" fontSize="8" fontFamily="monospace" y="-4">Temperature (K)</text>
          {[
            { temp: 35, label: '<40' },
            { temp: 50, label: '40-55' },
            { temp: 65, label: '55-70' },
            { temp: 80, label: '70-90' },
            { temp: 100, label: '>90' },
          ].map((item, i) => (
            <g key={i} transform={`translate(${i * 28}, 0)`}>
              <rect width="12" height="12" fill={tempColor(item.temp)} fillOpacity="0.5" stroke={tempColor(item.temp)} strokeWidth="0.5" />
              <text x="14" y="10" fill="#64748b" fontSize="7" fontFamily="monospace">{item.label}</text>
            </g>
          ))}
        </g>

        {/* PSR vs Landing Site legend */}
        <g transform={`translate(${MAP_SIZE - 120}, ${MAP_SIZE - 50})`}>
          <circle cx="8" cy="8" r="5" fill="#38bdf8" fillOpacity="0.45" stroke="#38bdf8" strokeWidth="1" />
          <text x="18" y="11" fill="#64748b" fontSize="8" fontFamily="monospace">PSR Crater</text>
          <polygon points="4,26 12,26 8,20" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" />
          <text x="18" y="28" fill="#64748b" fontSize="8" fontFamily="monospace">Artemis Site</text>
        </g>
      </svg>

      {/* Tooltip */}
      {hoverData && (
        <div
          className="absolute pointer-events-none z-20 px-2.5 py-1.5 rounded-lg bg-slate-950/95 border border-slate-700 shadow-xl font-mono text-[10px] space-y-0.5"
          style={{ left: hoverData.x + 12, top: hoverData.y + 12 }}
        >
          <div className="text-[#38bdf8] font-bold text-[11px]">{hoverData.name}</div>
          <div className="text-slate-400">Temp: <span className="text-amber-400">{hoverData.temp} K</span></div>
          <div className="text-slate-400">Ice: <span className="text-emerald-400">{hoverData.ice} wt%</span></div>
        </div>
      )}
    </div>
  );
}
