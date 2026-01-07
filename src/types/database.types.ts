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
    };
    Functions: {
      // Functions will be added here
    };
    Enums: {
      report_type_enum: ReportType;
      report_status_enum: ReportStatus;
      severity_enum: Severity;
      violation_type_enum: ViolationType;
      violation_status_enum: ViolationStatus;
      violation_severity_enum: ViolationSeverity;
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
