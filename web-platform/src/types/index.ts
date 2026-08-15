export type DataLayerType = 'neutron' | 'nir' | 'fused' | 'temperature' | 'elevation';

export interface Mission {
  name: string;
  leadCountry: string;
  partner: string;
  launchTarget: string;
  launchWindow: string;
  phase1StartDateIso: string;
  targetLaunchDateIso: string;
  githubRepo: string;
  vision: string;
  missionStatement: string;
  missionDuration: string;
  totalBudget: string;
}

export interface SpacecraftSpecs {
  formFactor: string;
  mass: string;
  power: string;
  battery: string;
  adcs: string;
  thermal: string;
  propulsion: string;
}

export interface PayloadSpec {
  id: string;
  name: string;
  abbreviation: string;
  type: string;
  mass: string;
  power: string;
  function: string;
  specifications: string[];
}

export interface CommsSpec {
  uplink: string;
  downlink: string;
  groundStations: string;
  storage: string;
}

export interface OrbitProfile {
  trajectory: string;
  targetOrbit: string;
  altitudeRange: string;
  inclination: string;
  period: string;
}

export interface TimelinePhase {
  number: number;
  name: string;
  period: string;
  milestone: string;
  status: 'completed' | 'in-progress' | 'planned';
  details: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  domain: string;
  description: string;
  status: 'active' | 'standby' | 'training';
  avatar?: string;
}

export interface BudgetItem {
  category: string;
  amount: number;
  note: string;
}

export interface BudgetSummary {
  items: BudgetItem[];
  total: number;
  formattedTotal: string;
}

export interface DocLink {
  id: string;
  title: string;
  status: 'completed' | 'draft' | 'planned';
  version: string;
  description: string;
  url?: string;
}

export interface PSRRegion {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  diameterKm: number;
  areaKm2: number;
  estimatedIceMassTons: number;
  averageTempKelvin: number;
  maxDepthMeters: number;
  description: string;
  artemisTarget?: boolean;
}

export interface LandingSite {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  elevationKm: number;
  psrProximityKm: number;
  iceConcentrationPct: number;
  artemisPriority: 'High' | 'Critical' | 'Medium';
  description: string;
  keyFeatures: string[];
}

export interface Dataset {
  id: string;
  title: string;
  instrument: string;
  format: string;
  sizeMb: number;
  iceProbability: number;
  dataPointsCount: number;
  recordedDate: string;
  description: string;
  downloadUrl: string;
}

export interface SubsystemHealth {
  name: string;
  status: 'NOMINAL' | 'WARNING' | 'CRITICAL';
  value: string;
  unit?: string;
}

export interface Telemetry {
  satelliteId: string;
  timestamp: string;
  batteryLevel: number; // percentage
  solarPower: number; // Watts
  coreTemp: number; // Celsius
  signalStrength: number; // dBm
  subsystems: SubsystemHealth[];
}

export interface User {
  id: string;
  name: string;
  role: string;
  organization: string;
  email: string;
  avatarUrl?: string;
}

export interface Paper {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  doi: string;
  year: number;
  abstract: string;
}

export interface DataPoint {
  id: string;
  lat: number;
  lng: number;
  value: number;
  label?: string;
}

export interface DataLayer {
  id: string;
  name: string;
  type: DataLayerType;
  description: string;
  visible: boolean;
  opacity: number;
}

export interface MissionOverview {
  missionGoal: string;
  keyObjectives: string[];
  scientificImpact: string;
}
