-- Migration: Create citizen_reports table
-- Created: 2026-01-06
-- Description: Community-submitted environmental observations and reports

-- Create ENUM types
CREATE TYPE report_type_enum AS ENUM ('odor', 'visual', 'health', 'noise', 'other');
CREATE TYPE report_status_enum AS ENUM ('pending', 'verified', 'dismissed');
CREATE TYPE severity_enum AS ENUM ('low', 'medium', 'high');

-- Create citizen_reports table
CREATE TABLE IF NOT EXISTS citizen_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User information
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reporter_name VARCHAR(255),
  reporter_email VARCHAR(255),
  is_anonymous BOOLEAN DEFAULT false,

  -- Report details
  report_type report_type_enum NOT NULL,
  description TEXT NOT NULL,

  -- Location (storing as separate columns for better querying)
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  location_name VARCHAR(255), -- e.g., "North Birmingham", "Fairfield"

  -- Evidence
  photos TEXT[] DEFAULT '{}', -- Array of photo URLs from Supabase Storage

  -- Status and severity
  status report_status_enum DEFAULT 'pending',
  severity severity_enum DEFAULT 'medium',

  -- Verification
  verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  verification_notes TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_location CHECK (
    (latitude IS NULL AND longitude IS NULL) OR
    (latitude IS NOT NULL AND longitude IS NOT NULL AND
     latitude BETWEEN -90 AND 90 AND
     longitude BETWEEN -180 AND 180)
  ),
  CONSTRAINT valid_photos CHECK (array_length(photos, 1) IS NULL OR array_length(photos, 1) <= 10)
);

-- Create indexes for performance
CREATE INDEX idx_citizen_reports_created_at ON citizen_reports(created_at DESC);
CREATE INDEX idx_citizen_reports_status ON citizen_reports(status);
CREATE INDEX idx_citizen_reports_report_type ON citizen_reports(report_type);
CREATE INDEX idx_citizen_reports_severity ON citizen_reports(severity);
CREATE INDEX idx_citizen_reports_user_id ON citizen_reports(user_id);
CREATE INDEX idx_citizen_reports_location ON citizen_reports USING GIST (
  ll_to_earth(latitude, longitude)
) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Create composite index for common queries
CREATE INDEX idx_citizen_reports_status_created ON citizen_reports(status, created_at DESC);

-- Enable Row Level Security
ALTER TABLE citizen_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can insert (create reports)
CREATE POLICY "Anyone can create reports"
  ON citizen_reports
  FOR INSERT
  TO public
  WITH CHECK (true);

-- RLS Policy: Users can view their own reports
CREATE POLICY "Users can view their own reports"
  ON citizen_reports
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policy: Anonymous users can view their session reports (optional)
CREATE POLICY "Anonymous can view public summaries"
  ON citizen_reports
  FOR SELECT
  TO anon
  USING (status = 'verified'); -- Only verified reports visible to anonymous

-- RLS Policy: Admins can view all reports
CREATE POLICY "Admins can view all reports"
  ON citizen_reports
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- RLS Policy: Admins can update reports (verify/dismiss)
CREATE POLICY "Admins can update reports"
  ON citizen_reports
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- RLS Policy: Users can update their own pending reports
CREATE POLICY "Users can update their own pending reports"
  ON citizen_reports
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id
    AND status = 'pending'
  )
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'pending'
  );

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to citizen_reports
CREATE TRIGGER set_citizen_reports_updated_at
  BEFORE UPDATE ON citizen_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add table comment
COMMENT ON TABLE citizen_reports IS 'Community-submitted environmental observations including odors, visual pollution, and health concerns';

-- Add column comments
COMMENT ON COLUMN citizen_reports.id IS 'Unique identifier for the report';
COMMENT ON COLUMN citizen_reports.user_id IS 'User who submitted the report (nullable for anonymous reports)';
COMMENT ON COLUMN citizen_reports.report_type IS 'Type of environmental issue: odor, visual, health, noise, or other';
COMMENT ON COLUMN citizen_reports.description IS 'Detailed description of the environmental issue';
COMMENT ON COLUMN citizen_reports.latitude IS 'Latitude coordinate of the issue location';
COMMENT ON COLUMN citizen_reports.longitude IS 'Longitude coordinate of the issue location';
COMMENT ON COLUMN citizen_reports.photos IS 'Array of photo URLs stored in Supabase Storage';
COMMENT ON COLUMN citizen_reports.status IS 'Report status: pending, verified, or dismissed';
COMMENT ON COLUMN citizen_reports.severity IS 'Severity level: low, medium, or high';
COMMENT ON COLUMN citizen_reports.verified_by IS 'Admin user who verified/dismissed the report';
COMMENT ON COLUMN citizen_reports.verified_at IS 'Timestamp when report was verified/dismissed';
