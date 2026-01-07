-- Migration: Create environmental_violations table
-- Description: Stores EPA environmental violation data from facilities
-- Created: 2026-01-06
-- Agent: DB Architect

-- ============================================================================
-- STEP 1: Create ENUM types for violations
-- ============================================================================

-- Violation type categorization based on EPA regulations
CREATE TYPE violation_type_enum AS ENUM (
  'clean_air_act',           -- CAA violations
  'clean_water_act',         -- CWA violations
  'rcra',                    -- Resource Conservation and Recovery Act
  'cercla',                  -- Superfund (CERCLA) violations
  'tsca',                    -- Toxic Substances Control Act
  'epcra',                   -- Emergency Planning & Community Right-to-Know
  'sdwa',                    -- Safe Drinking Water Act
  'fifra',                   -- Federal Insecticide, Fungicide, Rodenticide Act
  'other'
);

-- Violation status tracking
CREATE TYPE violation_status_enum AS ENUM (
  'active',                  -- Currently under violation
  'under_review',            -- EPA is reviewing the case
  'resolved',                -- Violation has been resolved
  'appealed',                -- Company has appealed
  'dismissed'                -- Case dismissed
);

-- Severity classification
CREATE TYPE violation_severity_enum AS ENUM (
  'critical',                -- Immediate threat to public health
  'high',                    -- Significant environmental impact
  'medium',                  -- Moderate impact
  'low'                      -- Minor technical violation
);

-- ============================================================================
-- STEP 2: Create environmental_violations table
-- ============================================================================

CREATE TABLE IF NOT EXISTS environmental_violations (
  -- Primary identifier
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Company and facility information
  company_name VARCHAR(255) NOT NULL,
  facility_name VARCHAR(255) NOT NULL,
  facility_address TEXT,
  city VARCHAR(100),
  state VARCHAR(2) DEFAULT 'AL',  -- Default to Alabama
  zip_code VARCHAR(10),

  -- Violation details
  violation_type violation_type_enum NOT NULL,
  description TEXT NOT NULL,
  violation_date DATE NOT NULL,
  discovery_date DATE,             -- When EPA discovered the violation

  -- Financial and legal
  penalty_amount NUMERIC(15, 2),   -- Dollar amount (up to billions)
  settlement_amount NUMERIC(15, 2),
  epa_case_number VARCHAR(100) UNIQUE,
  docket_number VARCHAR(100),

  -- Status tracking
  status violation_status_enum DEFAULT 'active',
  severity violation_severity_enum DEFAULT 'medium',

  -- Resolution details
  resolution_date DATE,
  resolution_notes TEXT,

  -- Geolocation (for mapping)
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Metadata
  data_source VARCHAR(100) DEFAULT 'EPA ECHO',  -- EPA Enforcement & Compliance History Online
  source_url TEXT,                   -- Link to EPA case file

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_penalty CHECK (penalty_amount >= 0),
  CONSTRAINT valid_settlement CHECK (settlement_amount >= 0),
  CONSTRAINT valid_dates CHECK (violation_date <= COALESCE(resolution_date, CURRENT_DATE))
);

-- ============================================================================
-- STEP 3: Create indexes for performance
-- ============================================================================

-- Primary search indexes
CREATE INDEX idx_violations_company ON environmental_violations(company_name);
CREATE INDEX idx_violations_facility ON environmental_violations(facility_name);
CREATE INDEX idx_violations_date ON environmental_violations(violation_date DESC);
CREATE INDEX idx_violations_status ON environmental_violations(status);
CREATE INDEX idx_violations_severity ON environmental_violations(severity);
CREATE INDEX idx_violations_type ON environmental_violations(violation_type);

-- Composite indexes for common queries
CREATE INDEX idx_violations_status_severity ON environmental_violations(status, severity);
CREATE INDEX idx_violations_state_city ON environmental_violations(state, city);
CREATE INDEX idx_violations_date_status ON environmental_violations(violation_date DESC, status);

-- Geospatial index for location-based queries
CREATE INDEX idx_violations_location ON environmental_violations
  USING GIST (ll_to_earth(latitude, longitude))
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Full-text search index for descriptions
CREATE INDEX idx_violations_description_fts ON environmental_violations
  USING GIN (to_tsvector('english', description));

-- Case number lookup
CREATE INDEX idx_violations_epa_case ON environmental_violations(epa_case_number);

-- ============================================================================
-- STEP 4: Create trigger for updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_environmental_violations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER environmental_violations_updated_at_trigger
  BEFORE UPDATE ON environmental_violations
  FOR EACH ROW
  EXECUTE FUNCTION update_environmental_violations_updated_at();

-- ============================================================================
-- STEP 5: Row Level Security (RLS) Policies
-- ============================================================================

-- Enable RLS
ALTER TABLE environmental_violations ENABLE ROW LEVEL SECURITY;

-- Policy 1: Public read access (violations are public record)
CREATE POLICY "Public users can view all violations"
  ON environmental_violations
  FOR SELECT
  USING (true);

-- Policy 2: Authenticated users can insert reports (for community reporting)
CREATE POLICY "Authenticated users can report violations"
  ON environmental_violations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy 3: Only admins can update violations
CREATE POLICY "Only admins can update violations"
  ON environmental_violations
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Policy 4: Only admins can delete violations
CREATE POLICY "Only admins can delete violations"
  ON environmental_violations
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- ============================================================================
-- STEP 6: Add comments for documentation
-- ============================================================================

COMMENT ON TABLE environmental_violations IS 'Stores EPA environmental violation records from facilities in Alabama';
COMMENT ON COLUMN environmental_violations.epa_case_number IS 'Unique EPA case identifier from ECHO database';
COMMENT ON COLUMN environmental_violations.penalty_amount IS 'Initial penalty assessed by EPA in USD';
COMMENT ON COLUMN environmental_violations.settlement_amount IS 'Final settlement amount paid in USD';
COMMENT ON COLUMN environmental_violations.data_source IS 'Source of the violation data (EPA ECHO, manual entry, etc.)';
COMMENT ON COLUMN environmental_violations.severity IS 'Impact severity: critical (immediate health threat), high (significant impact), medium (moderate), low (technical)';

-- ============================================================================
-- STEP 7: Create helpful views
-- ============================================================================

-- Active violations view for dashboard
CREATE OR REPLACE VIEW active_violations AS
SELECT
  id,
  company_name,
  facility_name,
  city,
  violation_type,
  violation_date,
  penalty_amount,
  severity,
  epa_case_number
FROM environmental_violations
WHERE status = 'active'
ORDER BY violation_date DESC;

-- High-severity violations view
CREATE OR REPLACE VIEW critical_violations AS
SELECT
  id,
  company_name,
  facility_name,
  city,
  violation_type,
  description,
  violation_date,
  penalty_amount,
  severity,
  status
FROM environmental_violations
WHERE severity IN ('critical', 'high')
ORDER BY violation_date DESC;

-- Recent violations (last 30 days)
CREATE OR REPLACE VIEW recent_violations AS
SELECT
  id,
  company_name,
  facility_name,
  violation_type,
  violation_date,
  severity,
  status
FROM environmental_violations
WHERE violation_date >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY violation_date DESC;

-- ============================================================================
-- SUCCESS
-- ============================================================================

-- Grant permissions
GRANT SELECT ON active_violations TO anon, authenticated;
GRANT SELECT ON critical_violations TO anon, authenticated;
GRANT SELECT ON recent_violations TO anon, authenticated;
