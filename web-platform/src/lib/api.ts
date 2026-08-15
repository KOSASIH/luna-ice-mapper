import { Dataset, Telemetry, LandingSite, PSRRegion } from '@/types';
import { SAMPLE_DATASETS, INITIAL_TELEMETRY, ARTEMIS_LANDING_SITES, PSR_REGIONS } from './constants';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchDatasets(): Promise<Dataset[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/datasets`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch datasets from API');
    return await res.json();
  } catch {
    // Fallback to sample static data
    return SAMPLE_DATASETS;
  }
}

export async function fetchTelemetry(): Promise<Telemetry> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/telemetry`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch telemetry');
    return await res.json();
  } catch {
    // Fallback live simulated telemetry with slight jitter
    const now = new Date();
    return {
      ...INITIAL_TELEMETRY,
      timestamp: now.toISOString(),
      solarPower: parseFloat((34.5 + Math.sin(now.getTime() / 2000) * 1.5).toFixed(1)),
      batteryLevel: parseFloat((94.0 + Math.cos(now.getTime() / 5000) * 0.5).toFixed(1)),
      coreTemp: parseFloat((18.5 + Math.sin(now.getTime() / 3000) * 0.8).toFixed(1)),
      signalStrength: parseFloat((-78.4 + Math.sin(now.getTime() / 4000) * 2.0).toFixed(1)),
    };
  }
}

export async function fetchLandingSites(): Promise<LandingSite[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/landing-sites`);
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch {
    return ARTEMIS_LANDING_SITES;
  }
}

export async function fetchPSRRegions(): Promise<PSRRegion[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/psr-regions`);
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch {
    return PSR_REGIONS;
  }
}

export async function analyzeCoordinates(lat: number, lng: number) {
  // Simulate analytical calculation for given lunar coordinates
  const distFromSouthPole = Math.abs(lat - (-90.0));
  const isInPsr = distFromSouthPole < 6.0;
  const estimatedIcePct = isInPsr ? Math.min(12.5, Math.max(0.5, (6.0 - distFromSouthPole) * 2.1 + (Math.sin(lng) * 0.5))) : 0.05;
  const tempK = isInPsr ? Math.round(38 + distFromSouthPole * 2) : Math.round(120 + distFromSouthPole * 15);

  return {
    latitude: lat,
    longitude: lng,
    isInPsr,
    estimatedIceConcentrationPct: parseFloat(estimatedIcePct.toFixed(2)),
    averageTemperatureKelvin: tempK,
    regolithHydrogenPpm: Math.round(estimatedIcePct * 1111), // 1% H2O ~ 1111 ppm H
    suitabilityScore: isInPsr ? Math.round(Math.min(99, estimatedIcePct * 8.5 + 40)) : 12,
  };
}

export async function exportData(format: 'json' | 'csv' | 'geotiff'): Promise<{ url: string; filename: string }> {
  // Mock export link generator
  const timestamp = new Date().toISOString().split('T')[0];
  return {
    url: `#export-${format}-${timestamp}`,
    filename: `luna-ice-mapper-data-${timestamp}.${format}`,
  };
}
