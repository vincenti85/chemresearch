-- Migration: Create air_quality_data table
-- Description: Stores air quality measurements from AirNow API, sensors, and monitoring stations
-- Created: 2026-01-08
-- Agent: DB Architect

-- ============================================================================
-- STEP 1: Create ENUM types for air quality
-- ============================================================================

-- Air Quality Index (AQI) category classification
CREATE TYPE aqi_category_enum AS ENUM (
  'good',                    -- AQI 0-50 (Green)
  'moderate',                -- AQI 51-100 (Yellow)
  'unhealthy_sensitive',     -- AQI 101-150 (Orange)
  'unhealthy',               -- AQI 151-200 (Red)
  'very_unhealthy',          -- AQI 201-300 (Purple)
  'hazardous'                -- AQI 301+ (Maroon)
);

-- Primary pollutant responsible for AQI
CREATE TYPE pollutant_type_enum AS ENUM (
  'pm25',                    -- Particulate Matter 2.5 micrometers
  'pm10',                    -- Particulate Matter 10 micrometers
  'o3',                      -- Ozone
  'no2',                     -- Nitrogen Dioxide
  'so2',                     -- Sulfur Dioxide
  'co'                       -- Carbon Monoxide
);

-- Data source type
CREATE TYPE air_data_source_enum AS ENUM (
  'airnow_api',              -- AirNow.gov API
  'epa_sensor',              -- EPA monitoring station
  'purpleair',               -- PurpleAir community sensor
  'manual_reading',          -- Manual measurement
  'weather_station',         -- Weather station with air quality
  'other'
);

-- Measurement status
CREATE TYPE measurement_status_enum AS ENUM (
  'validated',               -- QA/QC passed
  'preliminary',             -- Not yet validated
  'flagged',                 -- Potential issues detected
  'invalid'                  -- Failed validation
);

-- ============================================================================
-- STEP 2: Create air_quality_data table
-- ============================================================================

CREATE TABLE IF NOT EXISTS air_quality_data (
  -- Primary identifier
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Monitoring site information
  site_name VARCHAR(255),
  site_id VARCHAR(100),             -- External site identifier (AQS ID, sensor ID, etc.)
  agency VARCHAR(100),              -- Monitoring agency (EPA, ADEM, etc.)

  -- Location
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  elevation_meters INTEGER,
  city VARCHAR(100),
  state VARCHAR(2) DEFAULT 'AL',
  zip_code VARCHAR(10),

  -- Temporal information
  measurement_timestamp TIMESTAMPTZ NOT NULL,
  local_time_zone VARCHAR(50) DEFAULT 'America/Chicago',
  averaging_period VARCHAR(20) DEFAULT '1-hour',  -- 1-hour, 8-hour, 24-hour

  -- Air Quality Index (AQI)
  aqi INTEGER CHECK (aqi >= 0 AND aqi <= 500),
  aqi_category aqi_category_enum,
  primary_pollutant pollutant_type_enum,

  -- Individual Pollutant Measurements (in µg/m³ unless noted)
  pm25_concentration DECIMAL(8, 2),     -- PM2.5 (µg/m³)
  pm25_aqi INTEGER,

  pm10_concentration DECIMAL(8, 2),     -- PM10 (µg/m³)
  pm10_aqi INTEGER,

  ozone_concentration DECIMAL(8, 3),    -- O3 (ppm)
  ozone_aqi INTEGER,

  no2_concentration DECIMAL(8, 2),      -- NO2 (ppb)
  no2_aqi INTEGER,

  so2_concentration DECIMAL(8, 2),      -- SO2 (ppb)
  so2_aqi INTEGER,

  co_concentration DECIMAL(8, 2),       -- CO (ppm)
  co_aqi INTEGER,

  -- Environmental context
  temperature_celsius DECIMAL(5, 2),
  relative_humidity INTEGER CHECK (relative_humidity >= 0 AND relative_humidity <= 100),
  wind_speed_mph DECIMAL(5, 2),
  wind_direction INTEGER CHECK (wind_direction >= 0 AND wind_direction < 360),
  barometric_pressure_mb DECIMAL(6, 2),

  -- Data quality and metadata
  data_source air_data_source_enum NOT NULL,
  source_url TEXT,
  measurement_status measurement_status_enum DEFAULT 'preliminary',
  quality_control_flags TEXT[],         -- Array of QC flags

  -- Health advisory information
  health_message TEXT,
  action_day BOOLEAN DEFAULT false,     -- EPA "Action Day" flag

  -- Raw data storage (for debugging/auditing)
  raw_data JSONB,                       -- Store complete API response

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_aqi_category CHECK (
    (aqi IS NULL AND aqi_category IS NULL) OR
    (aqi IS NOT NULL AND aqi_category IS NOT NULL)
  ),
  CONSTRAINT valid_coordinates CHECK (
    latitude >= -90 AND latitude <= 90 AND
    longitude >= -180 AND longitude <= 180
  )
);

-- ============================================================================
-- STEP 3: Create indexes for performance
-- ============================================================================

-- Primary search indexes
CREATE INDEX idx_air_quality_timestamp ON air_quality_data(measurement_timestamp DESC);
CREATE INDEX idx_air_quality_location ON air_quality_data(city, state);
CREATE INDEX idx_air_quality_site ON air_quality_data(site_id, site_name);
CREATE INDEX idx_air_quality_aqi ON air_quality_data(aqi DESC) WHERE aqi IS NOT NULL;
CREATE INDEX idx_air_quality_category ON air_quality_data(aqi_category);
CREATE INDEX idx_air_quality_pollutant ON air_quality_data(primary_pollutant);

-- Composite indexes for common queries
CREATE INDEX idx_air_quality_time_location ON air_quality_data(measurement_timestamp DESC, city);
CREATE INDEX idx_air_quality_time_aqi ON air_quality_data(measurement_timestamp DESC, aqi DESC);
CREATE INDEX idx_air_quality_site_time ON air_quality_data(site_id, measurement_timestamp DESC);

-- Geospatial index for location-based queries
CREATE INDEX idx_air_quality_geolocation ON air_quality_data
  USING GIST (ll_to_earth(latitude, longitude));

-- Data source tracking
CREATE INDEX idx_air_quality_source ON air_quality_data(data_source);
CREATE INDEX idx_air_quality_status ON air_quality_data(measurement_status);

-- Pollutant-specific indexes (for trend analysis)
CREATE INDEX idx_air_quality_pm25 ON air_quality_data(pm25_concentration) WHERE pm25_concentration IS NOT NULL;
CREATE INDEX idx_air_quality_ozone ON air_quality_data(ozone_concentration) WHERE ozone_concentration IS NOT NULL;

-- JSONB index for raw data queries
CREATE INDEX idx_air_quality_raw_data ON air_quality_data USING GIN (raw_data);

-- ============================================================================
-- STEP 4: Create trigger for updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_air_quality_data_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER air_quality_data_updated_at_trigger
  BEFORE UPDATE ON air_quality_data
  FOR EACH ROW
  EXECUTE FUNCTION update_air_quality_data_updated_at();

-- ============================================================================
-- STEP 5: Create helper function for AQI category calculation
-- ============================================================================

CREATE OR REPLACE FUNCTION calculate_aqi_category(aqi_value INTEGER)
RETURNS aqi_category_enum AS $$
BEGIN
  IF aqi_value IS NULL THEN
    RETURN NULL;
  ELSIF aqi_value <= 50 THEN
    RETURN 'good';
  ELSIF aqi_value <= 100 THEN
    RETURN 'moderate';
  ELSIF aqi_value <= 150 THEN
    RETURN 'unhealthy_sensitive';
  ELSIF aqi_value <= 200 THEN
    RETURN 'unhealthy';
  ELSIF aqi_value <= 300 THEN
    RETURN 'very_unhealthy';
  ELSE
    RETURN 'hazardous';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================================
-- STEP 6: Create trigger to auto-calculate AQI category
-- ============================================================================

CREATE OR REPLACE FUNCTION auto_calculate_aqi_category()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.aqi IS NOT NULL AND NEW.aqi_category IS NULL THEN
    NEW.aqi_category := calculate_aqi_category(NEW.aqi);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER air_quality_aqi_category_trigger
  BEFORE INSERT OR UPDATE ON air_quality_data
  FOR EACH ROW
  EXECUTE FUNCTION auto_calculate_aqi_category();

-- ============================================================================
-- STEP 7: Row Level Security (RLS) Policies
-- ============================================================================

-- Enable RLS
ALTER TABLE air_quality_data ENABLE ROW LEVEL SECURITY;

-- Policy 1: Public read access (air quality data is public)
CREATE POLICY "Public users can view all air quality data"
  ON air_quality_data
  FOR SELECT
  USING (true);

-- Policy 2: Authenticated users can insert data (for community sensors)
CREATE POLICY "Authenticated users can submit air quality readings"
  ON air_quality_data
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy 3: Only admins can update data
CREATE POLICY "Only admins can update air quality data"
  ON air_quality_data
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Policy 4: Only admins can delete data
CREATE POLICY "Only admins can delete air quality data"
  ON air_quality_data
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
-- STEP 8: Create helpful views
-- ============================================================================

-- Current air quality (most recent reading per site)
CREATE OR REPLACE VIEW current_air_quality AS
SELECT DISTINCT ON (site_id)
  id,
  site_name,
  site_id,
  city,
  latitude,
  longitude,
  measurement_timestamp,
  aqi,
  aqi_category,
  primary_pollutant,
  pm25_concentration,
  ozone_concentration,
  temperature_celsius,
  data_source
FROM air_quality_data
WHERE measurement_timestamp >= NOW() - INTERVAL '2 hours'
ORDER BY site_id, measurement_timestamp DESC;

-- Unhealthy air quality readings
CREATE OR REPLACE VIEW unhealthy_air_quality AS
SELECT
  site_name,
  city,
  measurement_timestamp,
  aqi,
  aqi_category,
  primary_pollutant,
  pm25_concentration,
  ozone_concentration,
  latitude,
  longitude
FROM air_quality_data
WHERE aqi_category IN ('unhealthy_sensitive', 'unhealthy', 'very_unhealthy', 'hazardous')
  AND measurement_timestamp >= NOW() - INTERVAL '24 hours'
ORDER BY aqi DESC, measurement_timestamp DESC;

-- Daily air quality summary (24-hour averages per site)
CREATE OR REPLACE VIEW daily_air_quality_summary AS
SELECT
  site_id,
  site_name,
  city,
  DATE(measurement_timestamp) as measurement_date,
  AVG(aqi)::INTEGER as avg_aqi,
  MAX(aqi) as max_aqi,
  MIN(aqi) as min_aqi,
  AVG(pm25_concentration)::DECIMAL(8,2) as avg_pm25,
  MAX(pm25_concentration) as max_pm25,
  AVG(ozone_concentration)::DECIMAL(8,3) as avg_ozone,
  MAX(ozone_concentration) as max_ozone,
  COUNT(*) as reading_count
FROM air_quality_data
WHERE measurement_timestamp >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY site_id, site_name, city, DATE(measurement_timestamp)
ORDER BY measurement_date DESC, avg_aqi DESC;

-- Action days (EPA action days in last 7 days)
CREATE OR REPLACE VIEW recent_action_days AS
SELECT
  city,
  measurement_timestamp,
  aqi,
  aqi_category,
  primary_pollutant,
  health_message
FROM air_quality_data
WHERE action_day = true
  AND measurement_timestamp >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY measurement_timestamp DESC;

-- ============================================================================
-- STEP 9: Add comments for documentation
-- ============================================================================

COMMENT ON TABLE air_quality_data IS 'Real-time and historical air quality measurements from monitoring stations and sensors';
COMMENT ON COLUMN air_quality_data.aqi IS 'Air Quality Index (0-500 scale), calculated using EPA standards';
COMMENT ON COLUMN air_quality_data.aqi_category IS 'AQI health category: good(0-50), moderate(51-100), unhealthy_sensitive(101-150), unhealthy(151-200), very_unhealthy(201-300), hazardous(301+)';
COMMENT ON COLUMN air_quality_data.pm25_concentration IS 'Fine particulate matter concentration in µg/m³';
COMMENT ON COLUMN air_quality_data.ozone_concentration IS 'Ground-level ozone concentration in ppm';
COMMENT ON COLUMN air_quality_data.averaging_period IS 'Time period for measurement averaging (1-hour, 8-hour, or 24-hour)';
COMMENT ON COLUMN air_quality_data.action_day IS 'EPA Action Day flag: air quality is unhealthy, sensitive groups should limit outdoor activity';
COMMENT ON COLUMN air_quality_data.raw_data IS 'Complete API response in JSON format for debugging and auditing';

COMMENT ON FUNCTION calculate_aqi_category IS 'Converts numeric AQI value to EPA health category';

-- ============================================================================
-- STEP 10: Grant permissions
-- ============================================================================

GRANT SELECT ON current_air_quality TO anon, authenticated;
GRANT SELECT ON unhealthy_air_quality TO anon, authenticated;
GRANT SELECT ON daily_air_quality_summary TO anon, authenticated;
GRANT SELECT ON recent_action_days TO anon, authenticated;

-- ============================================================================
-- SUCCESS
-- ============================================================================
