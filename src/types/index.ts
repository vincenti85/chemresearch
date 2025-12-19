export interface PollutionData {
  timestamp: Date;
  benzeneLevel: number;
  windDirection: number;
  windSpeed: number;
  temperature: number;
  humidity: number;
  aqi: number;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number;
}

export interface Violation {
  id: string;
  company: string;
  facilityId: string;
  violationType: string;
  description: string;
  amount: number;
  date: Date;
  status: 'active' | 'resolved' | 'under_review';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
}

export interface CommunityReport {
  id: string;
  location: [number, number];
  type: 'odor' | 'visual' | 'health' | 'noise' | 'other';
  description: string;
  timestamp: Date;
  userId?: string;
  isAnonymous: boolean;
  status: 'pending' | 'verified' | 'dismissed';
  photos?: string[];
  severity: number;
}

export interface WaterQualityData {
  timestamp: Date;
  siteId: string;
  siteName: string;
  pfasLevel: number;
  pfosLevel: number;
  pfoaLevel: number;
  leadLevel: number;
  pH: number;
  turbidity: number;
  temperature: number;
  flowRate: number;
  location: {
    lat: number;
    lng: number;
  };
}

export interface Facility {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  type: string;
  industry: string;
  violations: number;
  lastInspection: Date;
  complianceStatus: 'compliant' | 'non-compliant' | 'under_review';
  emissions: {
    benzene: number;
    voc: number;
    particulates: number;
    co2: number;
  };
}

export interface GeologicalFormation {
  id: string;
  name: string;
  type: string;
  area: number;
  depth: number;
  capacity: number;
  suitability: number;
  location: {
    lat: number;
    lng: number;
  };
  geometry: GeoJSON.Geometry;
}

export interface UserStats {
  activeUsers: number;
  totalReports: number;
  resolvedViolations: number;
  monitoringSites: number;
}

export interface AlertConfig {
  id: string;
  userId: string;
  type: 'aqi' | 'benzene' | 'pfas' | 'violation';
  threshold: number;
  location?: [number, number];
  radius?: number;
  enabled: boolean;
  notificationMethod: ('push' | 'email' | 'sms')[];
}

export interface HistoricalTrend {
  date: Date;
  value: number;
  category?: string;
}

export interface WeatherData {
  timestamp: Date;
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  windGust: number;
  precipitation: number;
  cloudCover: number;
  visibility: number;
  conditions: string;
}

export type AQILevel = 'good' | 'moderate' | 'unhealthy_sensitive' | 'unhealthy' | 'very_unhealthy' | 'hazardous';

export interface AQIInfo {
  value: number;
  level: AQILevel;
  color: string;
  description: string;
  healthImplications: string;
  cautionaryStatement: string;
}

export type TimeRange = '24h' | '7d' | '30d' | '90d' | '1y';

export interface ChartDataPoint {
  timestamp: number;
  value: number;
  label?: string;
}

export interface MapMarker {
  id: string;
  type: 'facility' | 'report' | 'sensor' | 'violation';
  location: [number, number];
  data: Facility | CommunityReport | Violation;
  icon: string;
  color: string;
}

export interface CurriculumMapping {
  id: string;
  unit_code: string;
  topic_title: string;
  popup_content: string;
  target_metric: string;
  chemistry_concept: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminConfig {
  id: string;
  config_key: string;
  config_value: Record<string, unknown>;
  updated_at: string;
}

export type APChemUnit = 'Unit 3.1' | 'Unit 3.2' | 'Unit 3.3' | 'Unit 5' | 'Unit 7' | null;
