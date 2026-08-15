import * as THREE from 'three';

export type DataLayerType = 'ice' | 'neutron' | 'temperature' | 'slope' | 'illumination';

export interface DataPoint {
  lat: number;
  lon: number;
  elevation: number;
  iceProbability: number;
  neutronCount: number;
  temperature: number;
  slope: number;
  illumination: number;
  psrId?: string;
}

export interface PSRRegion {
  id: string;
  name: string;
  lat: number;
  lon: number;
  radius: number; // radius in degrees on sphere
  iceConcentration: number; // 0-6 wt%
  neutronAnomaly: number; // cps drop
  temperature: number; // 30-60 K
  illumination: number; // 0-5 %
  maxDepth: number; // meters
  diameterKm: number; // crater diameter in km
  description: string;
}

export const PSR_REGIONS: PSRRegion[] = [
  {
    id: 'shackleton',
    name: 'Shackleton Crater',
    lat: -89.9,
    lon: 0.0,
    radius: 0.35,
    iceConcentration: 5.6,
    neutronAnomaly: -45,
    temperature: 38,
    illumination: 1.2,
    maxDepth: 4200,
    diameterKm: 21,
    description: 'Located almost directly on the lunar South Pole. Interior rim is in perpetual shadow with significant hydrogen anomaly.'
  },
  {
    id: 'haworth',
    name: 'Haworth Crater',
    lat: -87.4,
    lon: -5.0,
    radius: 0.58,
    iceConcentration: 4.2,
    neutronAnomaly: -38,
    temperature: 42,
    illumination: 2.1,
    maxDepth: 3100,
    diameterKm: 35,
    description: 'Deep complex crater featuring extensive permanent shadow zones along its floor and southern wall.'
  },
  {
    id: 'shoemaker',
    name: 'Shoemaker Crater',
    lat: -88.1,
    lon: 45.0,
    radius: 0.85,
    iceConcentration: 4.8,
    neutronAnomaly: -42,
    temperature: 40,
    illumination: 1.8,
    maxDepth: 3800,
    diameterKm: 51,
    description: 'Named in honor of Eugene Shoemaker. Exhibits strong epithermal neutron absorption indicative of surface ice.'
  },
  {
    id: 'faustini',
    name: 'Faustini Crater',
    lat: -87.3,
    lon: 86.0,
    radius: 0.65,
    iceConcentration: 3.9,
    neutronAnomaly: -32,
    temperature: 45,
    illumination: 2.5,
    maxDepth: 2900,
    diameterKm: 39,
    description: 'Adjoins Shoemaker Crater. Contains multi-tiered micro-cold traps under 40 Kelvin.'
  },
  {
    id: 'cabeus',
    name: 'Cabeus Crater',
    lat: -85.0,
    lon: -35.5,
    radius: 1.00,
    iceConcentration: 5.8,
    neutronAnomaly: -52,
    temperature: 35,
    illumination: 0.8,
    maxDepth: 4000,
    diameterKm: 60,
    description: 'Target of the 2009 NASA LCROSS impact experiment, confirming water vapor and hydroxyl volatiles.'
  },
  {
    id: 'de-gerlache',
    name: 'de Gerlache Crater',
    lat: -88.5,
    lon: 90.0,
    radius: 0.53,
    iceConcentration: 4.1,
    neutronAnomaly: -34,
    temperature: 44,
    illumination: 2.0,
    maxDepth: 2800,
    diameterKm: 32,
    description: 'Key candidate site for Artemis crewed surface exploration due to neighboring illuminated ridges.'
  },
  {
    id: 'nobile',
    name: 'Nobile Crater',
    lat: -85.5,
    lon: 54.0,
    radius: 1.20,
    iceConcentration: 3.5,
    neutronAnomaly: -28,
    temperature: 48,
    illumination: 3.2,
    maxDepth: 3500,
    diameterKm: 73,
    description: 'Selected for NASA VIPER rover mission. Broad floor contains localized polar shadow patches.'
  },
  {
    id: 'amundsen',
    name: 'Amundsen Crater',
    lat: -84.5,
    lon: 105.6,
    radius: 1.70,
    iceConcentration: 3.2,
    neutronAnomaly: -25,
    temperature: 52,
    illumination: 4.1,
    maxDepth: 4500,
    diameterKm: 105,
    description: 'Large impact basin near south pole with terrace walls and central peak cold traps.'
  },
  {
    id: 'sverdrup',
    name: 'Sverdrup Crater',
    lat: -88.5,
    lon: -150.0,
    radius: 0.55,
    iceConcentration: 4.0,
    neutronAnomaly: -31,
    temperature: 43,
    illumination: 1.9,
    maxDepth: 2700,
    diameterKm: 33,
    description: 'Situated between Shackleton and de Gerlache, heavily shadowed terrain.'
  },
  {
    id: 'wiechert',
    name: 'Wiechert Crater',
    lat: -85.5,
    lon: 165.0,
    radius: 0.70,
    iceConcentration: 2.8,
    neutronAnomaly: -22,
    temperature: 50,
    illumination: 3.8,
    maxDepth: 3200,
    diameterKm: 42,
    description: 'Located in the southern highland area on the lunar far side transition.'
  },
  {
    id: 'malapert',
    name: 'Malapert Crater',
    lat: -85.0,
    lon: 12.9,
    radius: 1.20,
    iceConcentration: 3.1,
    neutronAnomaly: -24,
    temperature: 49,
    illumination: 4.5,
    maxDepth: 3000,
    diameterKm: 72,
    description: 'Features Malapert Mountain (5km high ridge) providing direct Earth line-of-sight communications.'
  },
  {
    id: 'peary',
    name: 'Peary Crater',
    lat: -88.0,
    lon: 30.0,
    radius: 1.20,
    iceConcentration: 3.7,
    neutronAnomaly: -29,
    temperature: 46,
    illumination: 2.8,
    maxDepth: 3600,
    diameterKm: 73,
    description: 'Large polar crater with high rim peaks receiving near-constant solar illumination.'
  }
];

export function latLonToVector3(lat: number, lon: number, radius: number = 2.0): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 90) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}

export function vector3ToLatLon(x: number, y: number, z: number, radius: number = 2.0): { lat: number; lon: number } {
  const currentRadius = Math.sqrt(x * x + y * y + z * z) || radius;
  const yNorm = Math.max(-1, Math.min(1, y / currentRadius));
  const phi = Math.acos(yNorm);
  const lat = 90 - (phi * (180 / Math.PI));
  
  const theta = Math.atan2(z, -x);
  let lon = (theta * (180 / Math.PI)) - 90;
  
  while (lon > 180) lon -= 360;
  while (lon < -180) lon += 360;
  
  return { lat, lon };
}

export function getPointData(lat: number, lon: number): DataPoint {
  let matchedPsr: PSRRegion | undefined;
  let minDistance = Infinity;

  for (const psr of PSR_REGIONS) {
    const dLat = lat - psr.lat;
    const dLon = (lon - psr.lon) * Math.cos((lat * Math.PI) / 180);
    const dist = Math.sqrt(dLat * dLat + dLon * dLon);
    if (dist <= psr.radius * 1.5 && dist < minDistance) {
      minDistance = dist;
      matchedPsr = psr;
    }
  }

  const polarDist = 90 + lat;
  const polarFactor = Math.max(0, 1 - polarDist / 25.0);

  const elevBase = Math.sin(lat * 0.1) * 800 + Math.cos(lon * 0.08) * 1200;
  let elevation = elevBase;

  let iceProbability = Math.round(Math.max(0, polarFactor * 35 + Math.sin(lat * 12 + lon * 8) * 15));
  let neutronCount = Math.round(210 - polarFactor * 45 + Math.cos(lat * 5) * 10);
  let temperature = Math.round(260 - polarFactor * 160 + Math.sin(lon * 0.1) * 20);
  let slope = Math.round(Math.abs(Math.sin(lat * 3) * Math.cos(lon * 4)) * 22 + 4);
  let illumination = Math.round(Math.min(100, Math.max(2, 50 + lat * 0.4 + Math.cos(lon * Math.PI / 180) * 20)));

  if (matchedPsr) {
    const isInside = minDistance <= matchedPsr.radius;
    const proximity = 1 - minDistance / (matchedPsr.radius * 1.5);

    if (isInside) {
      iceProbability = Math.round(matchedPsr.iceConcentration * 15.5 + 10);
      neutronCount = Math.round(180 + matchedPsr.neutronAnomaly);
      temperature = matchedPsr.temperature;
      slope = Math.round(12 + Math.sin(minDistance * 20) * 18);
      illumination = matchedPsr.illumination;
      elevation = -matchedPsr.maxDepth + Math.sin(minDistance * 50) * 300;
    } else {
      iceProbability = Math.round(iceProbability + proximity * 30);
      neutronCount = Math.round(neutronCount + proximity * matchedPsr.neutronAnomaly * 0.5);
      temperature = Math.round(temperature - proximity * 40);
      slope = Math.round(slope + proximity * 15);
      illumination = Math.round(illumination * (1 - proximity * 0.7));
    }
  }

  iceProbability = Math.max(0, Math.min(100, iceProbability));
  neutronCount = Math.max(90, Math.min(240, neutronCount));
  temperature = Math.max(25, Math.min(380, temperature));
  slope = Math.max(0, Math.min(45, slope));
  illumination = Math.max(0, Math.min(100, illumination));

  return {
    lat: Number(lat.toFixed(4)),
    lon: Number(lon.toFixed(4)),
    elevation: Math.round(elevation),
    iceProbability,
    neutronCount,
    temperature,
    slope,
    illumination,
    psrId: matchedPsr?.id
  };
}

export function getColormapRGB(
  value: number,
  min: number,
  max: number,
  colormap: string
): [number, number, number] {
  const norm = Math.max(0, Math.min(1, (value - min) / (max - min || 1)));

  let stops: Array<[number, number, number, number]> = [];

  switch (colormap) {
    case 'viridis':
      stops = [
        [0.0, 68, 1, 84],
        [0.25, 59, 82, 139],
        [0.5, 33, 145, 140],
        [0.75, 94, 201, 98],
        [1.0, 253, 231, 37]
      ];
      break;

    case 'plasma':
      stops = [
        [0.0, 13, 8, 135],
        [0.25, 126, 3, 168],
        [0.5, 204, 71, 120],
        [0.75, 248, 149, 64],
        [1.0, 240, 249, 33]
      ];
      break;

    case 'blues':
      stops = [
        [0.0, 8, 48, 107],
        [0.25, 33, 113, 181],
        [0.5, 107, 174, 214],
        [0.75, 198, 219, 239],
        [1.0, 56, 189, 248]
      ];
      break;

    case 'RdBu_r':
      stops = [
        [0.0, 5, 48, 97],
        [0.25, 103, 169, 207],
        [0.5, 247, 247, 247],
        [0.75, 244, 165, 130],
        [1.0, 103, 0, 31]
      ];
      break;

    default:
      stops = [
        [0.0, 68, 1, 84],
        [0.5, 33, 145, 140],
        [1.0, 253, 231, 37]
      ];
      break;
  }

  for (let i = 0; i < stops.length - 1; i++) {
    const [s1, r1, g1, b1] = stops[i];
    const [s2, r2, g2, b2] = stops[i + 1];

    if (norm >= s1 && norm <= s2) {
      const factor = (norm - s1) / (s2 - s1);
      const r = Math.round(r1 + factor * (r2 - r1));
      const g = Math.round(g1 + factor * (g2 - g1));
      const b = Math.round(b1 + factor * (b2 - b1));
      return [r, g, b];
    }
  }

  const last = stops[stops.length - 1];
  return [last[1], last[2], last[3]];
}
