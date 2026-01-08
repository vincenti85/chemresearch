/**
 * Database Type Definitions
 * Auto-generated types for Supabase tables
 *
 * Generated: 2026-01-06
 */

// ============================================================================
// ENUMS
// ============================================================================

export type ReportType = 'odor' | 'visual' | 'health' | 'noise' | 'other';
export type ReportStatus = 'pending' | 'verified' | 'dismissed';
export type Severity = 'low' | 'medium' | 'high';

// ============================================================================
// CITIZEN REPORTS
// ============================================================================

/**
 * Community-submitted environmental observations
 */
export interface CitizenReport {
  id: string;

  // User information
  user_id: string | null;
  reporter_name: string | null;
  reporter_email: string | null;
  is_anonymous: boolean;

  // Report details
  report_type: ReportType;
  description: string;

  // Location
  latitude: number | null;
  longitude: number | null;
  location_name: string | null;

  // Evidence
  photos: string[]; // Array of photo URLs

  // Status and severity
  status: ReportStatus;
  severity: Severity;

  // Verification
  verified_by: string | null;
  verified_at: string | null;
  verification_notes: string | null;

  // Timestamps
  created_at: string;
  updated_at: string;
}

/**
 * Type for inserting new citizen reports
 */
export type CitizenReportInsert = Omit<
  CitizenReport,
  'id' | 'created_at' | 'updated_at' | 'verified_by' | 'verified_at' | 'verification_notes'
> & {
  // Make optional fields actually optional for insert
  user_id?: string | null;
  reporter_name?: string | null;
  reporter_email?: string | null;
  is_anonymous?: boolean;
  latitude?: number | null;
  longitude?: number | null;
  location_name?: string | null;
  photos?: string[];
  status?: ReportStatus;
  severity?: Severity;
};

/**
 * Type for updating citizen reports
 */
export type CitizenReportUpdate = Partial<
  Omit<CitizenReport, 'id' | 'created_at' | 'updated_at'>
>;

/**
 * Type for admin verification
 */
export interface CitizenReportVerification {
  status: 'verified' | 'dismissed';
  verification_notes?: string;
  verified_by: string;
  verified_at: string;
}

// ============================================================================
// ENVIRONMENTAL VIOLATIONS
// ============================================================================

export type ViolationType =
  | 'clean_air_act'
  | 'clean_water_act'
  | 'rcra'
  | 'cercla'
  | 'tsca'
  | 'epcra'
  | 'sdwa'
  | 'fifra'
  | 'other';

export type ViolationStatus =
  | 'active'
  | 'under_review'
  | 'resolved'
  | 'appealed'
  | 'dismissed';

export type ViolationSeverity = 'critical' | 'high' | 'medium' | 'low';

/**
 * EPA environmental violation records
 */
export interface EnvironmentalViolation {
  id: string;

  // Company and facility
  company_name: string;
  facility_name: string;
  facility_address: string | null;
  city: string | null;
  state: string;
  zip_code: string | null;

  // Violation details
  violation_type: ViolationType;
  description: string;
  violation_date: string; // ISO date string
  discovery_date: string | null;

  // Financial and legal
  penalty_amount: number | null;
  settlement_amount: number | null;
  epa_case_number: string | null;
  docket_number: string | null;

  // Status tracking
  status: ViolationStatus;
  severity: ViolationSeverity;

  // Resolution
  resolution_date: string | null;
  resolution_notes: string | null;

  // Location
  latitude: number | null;
  longitude: number | null;

  // Metadata
  data_source: string;
  source_url: string | null;

  // Timestamps
  created_at: string;
  updated_at: string;
}

/**
 * Type for inserting new violations
 */
export type EnvironmentalViolationInsert = Omit<
  EnvironmentalViolation,
  'id' | 'created_at' | 'updated_at'
> & {
  id?: string;
  facility_address?: string | null;
  city?: string | null;
  state?: string;
  zip_code?: string | null;
  discovery_date?: string | null;
  penalty_amount?: number | null;
  settlement_amount?: number | null;
  epa_case_number?: string | null;
  docket_number?: string | null;
  status?: ViolationStatus;
  severity?: ViolationSeverity;
  resolution_date?: string | null;
  resolution_notes?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  data_source?: string;
  source_url?: string | null;
};

/**
 * Type for updating violations
 */
export type EnvironmentalViolationUpdate = Partial<
  Omit<EnvironmentalViolation, 'id' | 'created_at' | 'updated_at'>
>;

/**
 * Violation summary for listings
 */
export interface ViolationSummary {
  id: string;
  company_name: string;
  facility_name: string;
  violation_type: ViolationType;
  violation_date: string;
  penalty_amount: number | null;
  severity: ViolationSeverity;
  status: ViolationStatus;
}

// ============================================================================
// AIR QUALITY DATA
// ============================================================================

export type AQICategory =
  | 'good'
  | 'moderate'
  | 'unhealthy_sensitive'
  | 'unhealthy'
  | 'very_unhealthy'
  | 'hazardous';

export type PollutantType = 'pm25' | 'pm10' | 'o3' | 'no2' | 'so2' | 'co';

export type AirDataSource =
  | 'airnow_api'
  | 'epa_sensor'
  | 'purpleair'
  | 'manual_reading'
  | 'weather_station'
  | 'other';

export type MeasurementStatus = 'validated' | 'preliminary' | 'flagged' | 'invalid';

/**
 * Air quality measurements from monitoring stations and sensors
 */
export interface AirQualityData {
  id: string;

  // Monitoring site
  site_name: string | null;
  site_id: string | null;
  agency: string | null;

  // Location
  latitude: number;
  longitude: number;
  elevation_meters: number | null;
  city: string | null;
  state: string;
  zip_code: string | null;

  // Temporal information
  measurement_timestamp: string;
  local_time_zone: string;
  averaging_period: string;

  // Air Quality Index
  aqi: number | null;
  aqi_category: AQICategory | null;
  primary_pollutant: PollutantType | null;

  // Individual pollutants
  pm25_concentration: number | null;
  pm25_aqi: number | null;

  pm10_concentration: number | null;
  pm10_aqi: number | null;

  ozone_concentration: number | null;
  ozone_aqi: number | null;

  no2_concentration: number | null;
  no2_aqi: number | null;

  so2_concentration: number | null;
  so2_aqi: number | null;

  co_concentration: number | null;
  co_aqi: number | null;

  // Environmental context
  temperature_celsius: number | null;
  relative_humidity: number | null;
  wind_speed_mph: number | null;
  wind_direction: number | null;
  barometric_pressure_mb: number | null;

  // Data quality and metadata
  data_source: AirDataSource;
  source_url: string | null;
  measurement_status: MeasurementStatus;
  quality_control_flags: string[] | null;

  // Health advisory
  health_message: string | null;
  action_day: boolean;

  // Raw data storage
  raw_data: Record<string, any> | null;

  // Timestamps
  created_at: string;
  updated_at: string;
}

/**
 * Type for inserting new air quality data
 */
export type AirQualityDataInsert = Omit<
  AirQualityData,
  'id' | 'created_at' | 'updated_at'
> & {
  id?: string;
  site_name?: string | null;
  site_id?: string | null;
  agency?: string | null;
  elevation_meters?: number | null;
  city?: string | null;
  state?: string;
  zip_code?: string | null;
  local_time_zone?: string;
  averaging_period?: string;
  aqi?: number | null;
  aqi_category?: AQICategory | null;
  primary_pollutant?: PollutantType | null;
  pm25_concentration?: number | null;
  pm25_aqi?: number | null;
  pm10_concentration?: number | null;
  pm10_aqi?: number | null;
  ozone_concentration?: number | null;
  ozone_aqi?: number | null;
  no2_concentration?: number | null;
  no2_aqi?: number | null;
  so2_concentration?: number | null;
  so2_aqi?: number | null;
  co_concentration?: number | null;
  co_aqi?: number | null;
  temperature_celsius?: number | null;
  relative_humidity?: number | null;
  wind_speed_mph?: number | null;
  wind_direction?: number | null;
  barometric_pressure_mb?: number | null;
  source_url?: string | null;
  measurement_status?: MeasurementStatus;
  quality_control_flags?: string[] | null;
  health_message?: string | null;
  action_day?: boolean;
  raw_data?: Record<string, any> | null;
};

/**
 * Type for updating air quality data
 */
export type AirQualityDataUpdate = Partial<
  Omit<AirQualityData, 'id' | 'created_at' | 'updated_at'>
>;

/**
 * Current air quality summary (for map display)
 */
export interface CurrentAirQuality {
  id: string;
  site_name: string | null;
  site_id: string | null;
  city: string | null;
  latitude: number;
  longitude: number;
  measurement_timestamp: string;
  aqi: number | null;
  aqi_category: AQICategory | null;
  primary_pollutant: PollutantType | null;
  pm25_concentration: number | null;
  ozone_concentration: number | null;
  temperature_celsius: number | null;
  data_source: AirDataSource;
}

/**
 * Daily air quality summary
 */
export interface DailyAirQualitySummary {
  site_id: string | null;
  site_name: string | null;
  city: string | null;
  measurement_date: string;
  avg_aqi: number | null;
  max_aqi: number | null;
  min_aqi: number | null;
  avg_pm25: number | null;
  max_pm25: number | null;
  avg_ozone: number | null;
  max_ozone: number | null;
  reading_count: number;
}

// ============================================================================
// DATABASE SCHEMA TYPE (for Supabase client)
// ============================================================================

export interface Database {
  public: {
    Tables: {
      citizen_reports: {
        Row: CitizenReport;
        Insert: CitizenReportInsert;
        Update: CitizenReportUpdate;
      };
      environmental_violations: {
        Row: EnvironmentalViolation;
        Insert: EnvironmentalViolationInsert;
        Update: EnvironmentalViolationUpdate;
      };
      air_quality_data: {
        Row: AirQualityData;
        Insert: AirQualityDataInsert;
        Update: AirQualityDataUpdate;
      };
    };
    Views: {
      active_violations: {
        Row: ViolationSummary;
      };
      critical_violations: {
        Row: Pick<
          EnvironmentalViolation,
          | 'id'
          | 'company_name'
          | 'facility_name'
          | 'city'
          | 'violation_type'
          | 'description'
          | 'violation_date'
          | 'penalty_amount'
          | 'severity'
          | 'status'
        >;
      };
      recent_violations: {
        Row: Pick<
          EnvironmentalViolation,
          | 'id'
          | 'company_name'
          | 'facility_name'
          | 'violation_type'
          | 'violation_date'
          | 'severity'
          | 'status'
        >;
      };
      current_air_quality: {
        Row: CurrentAirQuality;
      };
      unhealthy_air_quality: {
        Row: Pick<
          AirQualityData,
          | 'site_name'
          | 'city'
          | 'measurement_timestamp'
          | 'aqi'
          | 'aqi_category'
          | 'primary_pollutant'
          | 'pm25_concentration'
          | 'ozone_concentration'
          | 'latitude'
          | 'longitude'
        >;
      };
      daily_air_quality_summary: {
        Row: DailyAirQualitySummary;
      };
      recent_action_days: {
        Row: Pick<
          AirQualityData,
          | 'city'
          | 'measurement_timestamp'
          | 'aqi'
          | 'aqi_category'
          | 'primary_pollutant'
          | 'health_message'
        >;
      };
    };
    Functions: {
      calculate_aqi_category: {
        Args: { aqi_value: number | null };
        Returns: AQICategory | null;
      };
    };
    Enums: {
      report_type_enum: ReportType;
      report_status_enum: ReportStatus;
      severity_enum: Severity;
      violation_type_enum: ViolationType;
      violation_status_enum: ViolationStatus;
      violation_severity_enum: ViolationSeverity;
      aqi_category_enum: AQICategory;
      pollutant_type_enum: PollutantType;
      air_data_source_enum: AirDataSource;
      measurement_status_enum: MeasurementStatus;
    };
  };
}

// ============================================================================
// HELPER TYPES
// ============================================================================

/**
 * Location coordinates
 */
export interface Location {
  latitude: number;
  longitude: number;
  name?: string;
}

/**
 * Report summary for listings
 */
export interface CitizenReportSummary {
  id: string;
  report_type: ReportType;
  description: string;
  location_name: string | null;
  status: ReportStatus;
  severity: Severity;
  created_at: string;
  photo_count: number;
}

/**
 * Report statistics
 */
export interface ReportStatistics {
  total_reports: number;
  pending_reports: number;
  verified_reports: number;
  dismissed_reports: number;
  by_type: Record<ReportType, number>;
  by_severity: Record<Severity, number>;
}
