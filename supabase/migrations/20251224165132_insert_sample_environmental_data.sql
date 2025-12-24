/*
  # Insert Sample Environmental Monitoring Data
  
  This migration populates the Alabama Environmental Monitoring Platform with realistic
  sample data for demonstration and testing purposes.
  
  ## Sample Data Inserted
  
  ### 1. monitoring_sites (6 sites)
  Representative monitoring locations across Alabama including Birmingham, Mobile, Huntsville
  
  ### 2. air_quality_data (5 records)
  Hourly air quality measurements from Birmingham area
  
  ### 3. water_quality_data (4 records)
  Water quality samples from Alabama rivers
  
  ### 4. weather_data (3 records)
  Weather station measurements from Birmingham
  
  ### 5. citizen_reports (4 records)
  Community-submitted environmental observations
  
  ### 6. environmental_violations (3 records)
  EPA enforcement actions in Alabama
  
  ### 7. facilities (4 records)
  Industrial facility registry
  
  ## Notes
  
  - All coordinates use real Alabama locations
  - Data values are realistic but synthetic
  - Timestamps are recent for demonstration purposes
  - All data is safe to display publicly
*/

-- Insert monitoring sites across Alabama
INSERT INTO monitoring_sites (site_name, site_type, location, county, address, installation_date, status) VALUES
  (
    'Birmingham Central Air Monitor',
    'air',
    ST_SetSRID(ST_MakePoint(-86.8024, 33.5186), 4326)::geography,
    'Jefferson',
    '710 20th Street North, Birmingham, AL 35203',
    '2015-03-15',
    'active'
  ),
  (
    'Cahaba River Water Station',
    'water',
    ST_SetSRID(ST_MakePoint(-86.7461, 33.3970), 4326)::geography,
    'Shelby',
    'Cahaba River National Wildlife Refuge',
    '2010-06-01',
    'active'
  ),
  (
    'Mobile Bay Coastal Monitor',
    'coastal',
    ST_SetSRID(ST_MakePoint(-87.8806, 30.2436), 4326)::geography,
    'Baldwin',
    'Gulf Shores Public Beach',
    '2018-04-20',
    'active'
  ),
  (
    'Huntsville Weather Station',
    'weather',
    ST_SetSRID(ST_MakePoint(-86.5861, 34.7304), 4326)::geography,
    'Madison',
    'UAH Campus, Huntsville, AL 35899',
    '2012-01-10',
    'active'
  ),
  (
    'Tuscaloosa Aquifer Well #12',
    'groundwater',
    ST_SetSRID(ST_MakePoint(-87.5692, 33.2098), 4326)::geography,
    'Tuscaloosa',
    'University of Alabama Research Site',
    '2008-09-05',
    'active'
  ),
  (
    'Montgomery Air Quality Station',
    'air',
    ST_SetSRID(ST_MakePoint(-86.2999, 32.3668), 4326)::geography,
    'Montgomery',
    '301 S Ripley St, Montgomery, AL 36104',
    '2016-11-12',
    'active'
  );

-- Insert air quality data for Birmingham
INSERT INTO air_quality_data (site_id, timestamp, aqi, pm25, pm10, ozone, no2, so2, co, benzene, temperature, humidity, wind_speed, wind_direction, data_source)
SELECT 
  id,
  NOW() - INTERVAL '1 hour',
  87,
  28.5,
  42.3,
  0.045,
  18.2,
  5.3,
  0.8,
  12.5,
  22.3,
  65.2,
  8.5,
  225,
  'airnow'
FROM monitoring_sites WHERE site_name = 'Birmingham Central Air Monitor';

INSERT INTO air_quality_data (site_id, timestamp, aqi, pm25, pm10, ozone, no2, so2, co, benzene, temperature, humidity, wind_speed, wind_direction, data_source)
SELECT 
  id,
  NOW() - INTERVAL '2 hours',
  82,
  26.1,
  39.8,
  0.042,
  16.8,
  4.9,
  0.7,
  11.8,
  21.8,
  67.3,
  7.2,
  210,
  'airnow'
FROM monitoring_sites WHERE site_name = 'Birmingham Central Air Monitor';

INSERT INTO air_quality_data (site_id, timestamp, aqi, pm25, pm10, ozone, no2, so2, co, benzene, temperature, humidity, wind_speed, wind_direction, data_source)
SELECT 
  id,
  NOW() - INTERVAL '3 hours',
  78,
  24.2,
  37.5,
  0.038,
  15.3,
  4.5,
  0.6,
  10.9,
  21.2,
  69.1,
  6.8,
  205,
  'airnow'
FROM monitoring_sites WHERE site_name = 'Birmingham Central Air Monitor';

INSERT INTO air_quality_data (site_id, timestamp, aqi, pm25, pm10, ozone, no2, so2, co, benzene, temperature, humidity, wind_speed, wind_direction, data_source)
SELECT 
  id,
  NOW() - INTERVAL '6 hours',
  92,
  31.8,
  46.2,
  0.051,
  21.5,
  6.2,
  0.9,
  14.2,
  24.1,
  58.4,
  11.3,
  240,
  'airnow'
FROM monitoring_sites WHERE site_name = 'Birmingham Central Air Monitor';

INSERT INTO air_quality_data (site_id, timestamp, aqi, pm25, pm10, ozone, no2, so2, co, benzene, temperature, humidity, wind_speed, wind_direction, data_source)
SELECT 
  id,
  NOW() - INTERVAL '1 hour',
  65,
  18.3,
  28.7,
  0.032,
  12.1,
  3.8,
  0.5,
  7.2,
  24.5,
  62.1,
  5.4,
  180,
  'airnow'
FROM monitoring_sites WHERE site_name = 'Montgomery Air Quality Station';

-- Insert water quality data for Cahaba River
INSERT INTO water_quality_data (site_id, timestamp, water_type, ph, dissolved_oxygen, temperature, turbidity, conductivity, flow_rate, nitrate, phosphate, pfas_total, lead, data_source)
SELECT 
  id,
  NOW() - INTERVAL '1 day',
  'surface',
  7.2,
  8.5,
  18.3,
  12.5,
  245.8,
  523.4,
  0.85,
  0.12,
  28.3,
  0.8,
  'alabama_water_watch'
FROM monitoring_sites WHERE site_name = 'Cahaba River Water Station';

INSERT INTO water_quality_data (site_id, timestamp, water_type, ph, dissolved_oxygen, temperature, turbidity, conductivity, flow_rate, nitrate, phosphate, pfas_total, lead, data_source)
SELECT 
  id,
  NOW() - INTERVAL '2 days',
  'surface',
  7.1,
  8.3,
  17.9,
  13.2,
  248.1,
  498.2,
  0.92,
  0.14,
  26.7,
  0.7,
  'alabama_water_watch'
FROM monitoring_sites WHERE site_name = 'Cahaba River Water Station';

INSERT INTO water_quality_data (site_id, timestamp, water_type, ph, dissolved_oxygen, temperature, turbidity, conductivity, flow_rate, nitrate, phosphate, pfas_total, lead, data_source)
SELECT 
  id,
  NOW() - INTERVAL '3 days',
  'surface',
  7.3,
  8.7,
  18.1,
  11.8,
  243.5,
  545.6,
  0.78,
  0.11,
  29.1,
  0.9,
  'alabama_water_watch'
FROM monitoring_sites WHERE site_name = 'Cahaba River Water Station';

INSERT INTO water_quality_data (site_id, timestamp, water_type, ph, dissolved_oxygen, temperature, turbidity, conductivity, flow_rate, nitrate, phosphate, pfas_total, lead, data_source)
SELECT 
  id,
  NOW() - INTERVAL '7 days',
  'surface',
  6.9,
  8.1,
  17.5,
  15.3,
  251.2,
  467.8,
  1.05,
  0.16,
  31.2,
  1.1,
  'alabama_water_watch'
FROM monitoring_sites WHERE site_name = 'Cahaba River Water Station';

-- Insert coastal monitoring data
INSERT INTO coastal_monitoring (site_id, timestamp, beach_name, enterococci_count, swimming_advisory, water_temperature, salinity, sample_location, data_source)
SELECT 
  id,
  NOW() - INTERVAL '1 day',
  'Gulf Shores Public Beach',
  35,
  false,
  26.8,
  32.5,
  'knee_depth',
  'alabama_dph'
FROM monitoring_sites WHERE site_name = 'Mobile Bay Coastal Monitor';

INSERT INTO coastal_monitoring (site_id, timestamp, beach_name, enterococci_count, swimming_advisory, water_temperature, salinity, sample_location, data_source)
SELECT 
  id,
  NOW() - INTERVAL '2 days',
  'Gulf Shores Public Beach',
  42,
  false,
  27.1,
  32.3,
  'knee_depth',
  'alabama_dph'
FROM monitoring_sites WHERE site_name = 'Mobile Bay Coastal Monitor';

INSERT INTO coastal_monitoring (site_id, timestamp, beach_name, enterococci_count, swimming_advisory, water_temperature, salinity, sample_location, data_source)
SELECT 
  id,
  NOW() - INTERVAL '7 days',
  'Gulf Shores Public Beach',
  28,
  false,
  25.9,
  32.8,
  'knee_depth',
  'alabama_dph'
FROM monitoring_sites WHERE site_name = 'Mobile Bay Coastal Monitor';

-- Insert weather station
INSERT INTO weather_stations (site_id, station_name, elevation_feet, station_type)
SELECT 
  id,
  'UAH Campus Weather Station',
  650,
  'school'
FROM monitoring_sites WHERE site_name = 'Huntsville Weather Station';

-- Insert weather data
INSERT INTO weather_data (station_id, timestamp, temperature, humidity, pressure, wind_speed, wind_direction, precipitation, solar_radiation, conditions, data_source)
SELECT 
  id,
  NOW() - INTERVAL '1 hour',
  72.5,
  65.2,
  30.12,
  8.5,
  225,
  0.0,
  456.3,
  'Partly Cloudy',
  'nws'
FROM weather_stations WHERE station_name = 'UAH Campus Weather Station';

INSERT INTO weather_data (station_id, timestamp, temperature, humidity, pressure, wind_speed, wind_direction, precipitation, solar_radiation, conditions, data_source)
SELECT 
  id,
  NOW() - INTERVAL '2 hours',
  71.8,
  67.1,
  30.11,
  7.2,
  210,
  0.0,
  523.7,
  'Clear',
  'nws'
FROM weather_stations WHERE station_name = 'UAH Campus Weather Station';

INSERT INTO weather_data (station_id, timestamp, temperature, humidity, pressure, wind_speed, wind_direction, precipitation, solar_radiation, conditions, data_source)
SELECT 
  id,
  NOW() - INTERVAL '3 hours',
  70.2,
  69.3,
  30.10,
  6.8,
  205,
  0.0,
  612.4,
  'Clear',
  'nws'
FROM weather_stations WHERE station_name = 'UAH Campus Weather Station';

-- Insert citizen reports
INSERT INTO citizen_reports (location, timestamp, report_type, severity, description, is_anonymous, verification_status) VALUES
  (
    ST_SetSRID(ST_MakePoint(-86.8050, 33.5210), 4326)::geography,
    NOW() - INTERVAL '2 hours',
    'odor',
    3,
    'Strong chemical smell near industrial area on 1st Avenue North. Started around 2pm and persisting.',
    false,
    'pending'
  ),
  (
    ST_SetSRID(ST_MakePoint(-86.7980, 33.5165), 4326)::geography,
    NOW() - INTERVAL '1 day',
    'visual',
    2,
    'Visible black smoke coming from facility smokestack. Lasted approximately 30 minutes.',
    false,
    'verified'
  ),
  (
    ST_SetSRID(ST_MakePoint(-86.8100, 33.5230), 4326)::geography,
    NOW() - INTERVAL '3 days',
    'air_quality',
    4,
    'Difficulty breathing and eye irritation reported by multiple residents in Collegeville neighborhood.',
    false,
    'verified'
  ),
  (
    ST_SetSRID(ST_MakePoint(-86.7461, 33.3970), 4326)::geography,
    NOW() - INTERVAL '5 days',
    'water_quality',
    2,
    'Unusual discoloration in Cahaba River near Helena. Water appears brownish-orange.',
    false,
    'pending'
  );

-- Insert environmental violations
INSERT INTO environmental_violations (company_name, location, address, violation_type, description, violation_date, penalty_amount, status, severity, epa_case_number) VALUES
  (
    'ABC Manufacturing Corp',
    ST_SetSRID(ST_MakePoint(-86.8124, 33.5289), 4326)::geography,
    '1234 Industrial Blvd, Birmingham, AL 35234',
    'air',
    'Exceeded permitted benzene emission limits on multiple occasions. Failed to maintain required pollution control equipment.',
    '2024-03-15',
    125000.00,
    'under_review',
    'high',
    'CAA-2024-AL-001'
  ),
  (
    'Riverside Chemical Plant',
    ST_SetSRID(ST_MakePoint(-87.5850, 33.2145), 4326)::geography,
    '5678 River Road, Tuscaloosa, AL 35487',
    'water',
    'Unpermitted discharge of industrial wastewater into Black Warrior River. NPDES permit violations.',
    '2024-01-22',
    250000.00,
    'active',
    'critical',
    'CWA-2024-AL-003'
  ),
  (
    'Southern Steel Works',
    ST_SetSRID(ST_MakePoint(-86.8001, 33.5178), 4326)::geography,
    '910 Finley Avenue West, Birmingham, AL 35204',
    'air',
    'Particulate matter emissions exceeded permit limits during Q4 2023. Inadequate dust control measures.',
    '2023-12-08',
    75000.00,
    'resolved',
    'medium',
    'CAA-2023-AL-089'
  );

-- Insert facilities
INSERT INTO facilities (facility_name, location, address, city, county, state, zip_code, facility_type, industry_sector, compliance_status, emissions) VALUES
  (
    'ABC Manufacturing Corp',
    ST_SetSRID(ST_MakePoint(-86.8124, 33.5289), 4326)::geography,
    '1234 Industrial Blvd',
    'Birmingham',
    'Jefferson',
    'AL',
    '35234',
    'chemical',
    'Petrochemicals',
    'non_compliant',
    '{"benzene": 850.5, "voc": 2340.8, "particulates": 156.2, "co2": 45600.0}'::jsonb
  ),
  (
    'Riverside Chemical Plant',
    ST_SetSRID(ST_MakePoint(-87.5850, 33.2145), 4326)::geography,
    '5678 River Road',
    'Tuscaloosa',
    'Tuscaloosa',
    'AL',
    '35487',
    'chemical',
    'Industrial Chemicals',
    'under_review',
    '{"benzene": 320.1, "voc": 1890.5, "particulates": 98.7, "co2": 32100.0}'::jsonb
  ),
  (
    'Southern Steel Works',
    ST_SetSRID(ST_MakePoint(-86.8001, 33.5178), 4326)::geography,
    '910 Finley Avenue West',
    'Birmingham',
    'Jefferson',
    'AL',
    '35204',
    'manufacturing',
    'Steel Manufacturing',
    'compliant',
    '{"benzene": 45.2, "voc": 678.3, "particulates": 234.5, "co2": 78900.0}'::jsonb
  ),
  (
    'Valley Power Station',
    ST_SetSRID(ST_MakePoint(-86.3102, 32.3715), 4326)::geography,
    '200 Energy Drive',
    'Montgomery',
    'Montgomery',
    'AL',
    '36117',
    'power_plant',
    'Electric Power Generation',
    'compliant',
    '{"benzene": 12.8, "voc": 234.1, "particulates": 567.8, "co2": 156000.0}'::jsonb
  );

-- Insert wildlife observations
INSERT INTO wildlife_observations (location, timestamp, species_name, common_name, scientific_name, count, habitat_type, observation_method, verification_status) VALUES
  (
    ST_SetSRID(ST_MakePoint(-86.7461, 33.3970), 4326)::geography,
    NOW() - INTERVAL '2 days',
    'Great Blue Heron',
    'Great Blue Heron',
    'Ardea herodias',
    3,
    'wetland',
    'visual',
    'verified'
  ),
  (
    ST_SetSRID(ST_MakePoint(-86.8024, 33.5186), 4326)::geography,
    NOW() - INTERVAL '5 days',
    'Red-tailed Hawk',
    'Red-tailed Hawk',
    'Buteo jamaicensis',
    1,
    'urban',
    'visual',
    'verified'
  );
