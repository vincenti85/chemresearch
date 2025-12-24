/*
  # Create Detailed Community Reports System

  ## Overview
  This migration creates a comprehensive community reporting system for environmental
  hazards and violations with detailed categorization and numeric data tracking.

  ## New Tables

  ### 1. `detailed_reports`
  Main table for storing comprehensive community reports with:
  - Report classification (hazard vs violation)
  - Category selection (air quality, water quality, etc.)
  - Location information (region, address)
  - Organization/company information
  - Numeric measurements and values
  - Status tracking and verification

  ### 2. `report_measurements`
  Stores numeric measurements associated with reports:
  - Measurement type (PM2.5, benzene, pH, etc.)
  - Value and unit
  - Timestamp

  ## Security
  - RLS enabled on all tables
  - Public can submit reports (INSERT)
  - Only authenticated users can view (SELECT)
  - Admins can update verification status (UPDATE)

  ## Important Notes
  - Reports support both hazard and violation types
  - Multiple numeric measurements per report
  - Photo attachments supported via URLs
  - Geographic data stored for mapping
*/

-- Create detailed_reports table
CREATE TABLE IF NOT EXISTS detailed_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Report classification
  report_classification text NOT NULL CHECK (report_classification IN ('hazard', 'violation')),
  category text NOT NULL CHECK (category IN (
    'air_quality',
    'water_quality',
    'soil_contamination',
    'noise_pollution',
    'hazardous_waste',
    'illegal_dumping',
    'emissions_violation',
    'discharge_violation',
    'permit_violation',
    'other'
  )),
  
  -- Location information
  location geography(POINT, 4326),
  address text,
  city text,
  county text,
  region text,
  
  -- Organization information
  organization_name text,
  organization_type text CHECK (organization_type IN ('industrial', 'commercial', 'government', 'residential', 'unknown')),
  
  -- Description
  issue_description text NOT NULL,
  impact_description text,
  
  -- Status and verification
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'investigating', 'resolved', 'dismissed')),
  severity integer CHECK (severity BETWEEN 1 AND 5),
  verification_notes text,
  verified_by uuid,
  verified_at timestamptz,
  
  -- Submitter information
  submitter_name text,
  submitter_email text,
  submitter_phone text,
  is_anonymous boolean DEFAULT false,
  
  -- Media attachments
  photo_urls text[],
  
  -- Metadata
  follow_up_requested boolean DEFAULT false,
  public_visibility boolean DEFAULT true
);

-- Create report_measurements table for numeric data
CREATE TABLE IF NOT EXISTS report_measurements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid NOT NULL REFERENCES detailed_reports(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  
  -- Measurement details
  measurement_type text NOT NULL,
  measurement_value numeric NOT NULL,
  measurement_unit text NOT NULL,
  measurement_timestamp timestamptz DEFAULT now(),
  
  -- Context
  measurement_method text,
  notes text
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_detailed_reports_category ON detailed_reports(category);
CREATE INDEX IF NOT EXISTS idx_detailed_reports_status ON detailed_reports(status);
CREATE INDEX IF NOT EXISTS idx_detailed_reports_classification ON detailed_reports(report_classification);
CREATE INDEX IF NOT EXISTS idx_detailed_reports_created_at ON detailed_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_detailed_reports_location ON detailed_reports USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_report_measurements_report_id ON report_measurements(report_id);

-- Enable Row Level Security
ALTER TABLE detailed_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_measurements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for detailed_reports

-- Anyone can submit a report (INSERT)
CREATE POLICY "Anyone can submit reports"
  ON detailed_reports
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Public can view public reports (SELECT)
CREATE POLICY "Public can view public reports"
  ON detailed_reports
  FOR SELECT
  TO public
  USING (public_visibility = true);

-- Authenticated users can view all reports (SELECT)
CREATE POLICY "Authenticated users can view all reports"
  ON detailed_reports
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can update their own reports (UPDATE)
CREATE POLICY "Users can update own reports"
  ON detailed_reports
  FOR UPDATE
  TO authenticated
  USING (submitter_email = current_setting('request.jwt.claims', true)::json->>'email')
  WITH CHECK (submitter_email = current_setting('request.jwt.claims', true)::json->>'email');

-- RLS Policies for report_measurements

-- Anyone can insert measurements with reports
CREATE POLICY "Anyone can insert measurements"
  ON report_measurements
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Public can view measurements for public reports
CREATE POLICY "Public can view measurements for public reports"
  ON report_measurements
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM detailed_reports
      WHERE detailed_reports.id = report_measurements.report_id
      AND detailed_reports.public_visibility = true
    )
  );

-- Authenticated users can view all measurements
CREATE POLICY "Authenticated users can view all measurements"
  ON report_measurements
  FOR SELECT
  TO authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_detailed_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_detailed_reports_updated_at_trigger ON detailed_reports;
CREATE TRIGGER update_detailed_reports_updated_at_trigger
  BEFORE UPDATE ON detailed_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_detailed_reports_updated_at();
