-- ============================================================================
-- Test Queries for air_quality_data table
-- Purpose: Comprehensive testing and example queries
-- Created: 2026-01-08
-- Agent: DB Architect
-- ============================================================================

-- ============================================================================
-- SECTION 1: Sample Data Insertion
-- ============================================================================

-- Test 1: Insert good air quality reading
INSERT INTO air_quality_data (
  site_name,
  site_id,
  agency,
  latitude,
  longitude,
  city,
  state,
  measurement_timestamp,
  aqi,
  primary_pollutant,
  pm25_concentration,
  pm25_aqi,
  ozone_concentration,
  ozone_aqi,
  temperature_celsius,
  relative_humidity,
  wind_speed_mph,
  data_source,
  measurement_status
) VALUES (
  'Birmingham - Jefferson County',
  'AQS-01-073-0023',
  'EPA',
  33.5186,
  -86.8104,
  'Birmingham',
  'AL',
  NOW() - INTERVAL '1 hour',
  42,
  'pm25',
  10.5,
  42,
  0.035,
  35,
  18.3,
  65,
  8.5,
  'airnow_api',
  'validated'
);

-- Test 2: Insert moderate air quality with multiple pollutants
INSERT INTO air_quality_data (
  site_name,
  site_id,
  latitude,
  longitude,
  city,
  state,
  measurement_timestamp,
  aqi,
  primary_pollutant,
  pm25_concentration,
  pm25_aqi,
  pm10_concentration,
  pm10_aqi,
  ozone_concentration,
  ozone_aqi,
  no2_concentration,
  no2_aqi,
  temperature_celsius,
  data_source,
  measurement_status
) VALUES (
  'Mobile - Brookley Field',
  'AQS-01-097-1002',
  30.6954,
  -88.0399,
  'Mobile',
  'AL',
  NOW() - INTERVAL '30 minutes',
  78,
  'ozone',
  18.2,
  62,
  32.5,
  45,
  0.068,
  78,
  15.3,
  35,
  24.5,
  'airnow_api',
  'validated'
);

-- Test 3: Insert unhealthy air quality (PM2.5 spike)
INSERT INTO air_quality_data (
  site_name,
  site_id,
  latitude,
  longitude,
  city,
  state,
  measurement_timestamp,
  aqi,
  primary_pollutant,
  pm25_concentration,
  pm25_aqi,
  temperature_celsius,
  data_source,
  measurement_status,
  action_day,
  health_message
) VALUES (
  'North Birmingham Industrial Area',
  'PURPLEAIR-12345',
  33.5581,
  -86.7913,
  'Birmingham',
  'AL',
  NOW() - INTERVAL '15 minutes',
  165,
  'pm25',
  78.3,
  165,
  19.2,
  'purpleair',
  'preliminary',
  true,
  'Air quality is unhealthy. Everyone should reduce prolonged or heavy outdoor exertion.'
);

-- Test 4: Insert very unhealthy air quality (wildfire smoke)
INSERT INTO air_quality_data (
  site_name,
  latitude,
  longitude,
  city,
  state,
  measurement_timestamp,
  aqi,
  primary_pollutant,
  pm25_concentration,
  pm25_aqi,
  data_source,
  measurement_status,
  action_day,
  health_message,
  quality_control_flags
) VALUES (
  'Huntsville Community Sensor',
  34.7304,
  -86.5861,
  'Huntsville',
  'AL',
  NOW() - INTERVAL '2 hours',
  245,
  'pm25',
  165.8,
  245,
  'purpleair',
  'flagged',
  true,
  'Health Alert: Air quality is very unhealthy. Everyone should avoid all outdoor physical activity.',
  ARRAY['wildfire_influence', 'rapid_change']
);

-- Test 5: Insert hazardous air quality (extreme event)
INSERT INTO air_quality_data (
  site_name,
  latitude,
  longitude,
  city,
  state,
  measurement_timestamp,
  aqi,
  primary_pollutant,
  pm25_concentration,
  pm25_aqi,
  data_source,
  measurement_status,
  action_day,
  health_message
) VALUES (
  'Montgomery Emergency Sensor',
  32.3668,
  -86.3000,
  'Montgomery',
  'AL',
  NOW() - INTERVAL '3 hours',
  385,
  'pm25',
  312.5,
  385,
  'epa_sensor',
  'validated',
  true,
  'Health Warning: Air quality is hazardous. Everyone should remain indoors and keep activity levels low.'
);

-- Test 6: Insert historical good air quality (24 hours ago)
INSERT INTO air_quality_data (
  site_name,
  site_id,
  latitude,
  longitude,
  city,
  state,
  measurement_timestamp,
  aqi,
  primary_pollutant,
  pm25_concentration,
  pm25_aqi,
  ozone_concentration,
  ozone_aqi,
  data_source,
  measurement_status
) VALUES (
  'Birmingham - Jefferson County',
  'AQS-01-073-0023',
  33.5186,
  -86.8104,
  'Birmingham',
  'AL',
  NOW() - INTERVAL '24 hours',
  35,
  'pm25',
  8.2,
  35,
  0.028,
  28,
  'airnow_api',
  'validated'
);

-- ============================================================================
-- SECTION 2: Basic Queries
-- ============================================================================

-- Query 1: Get current air quality (last 2 hours)
SELECT
  site_name,
  city,
  measurement_timestamp,
  aqi,
  aqi_category,
  primary_pollutant,
  pm25_concentration,
  data_source
FROM air_quality_data
WHERE measurement_timestamp >= NOW() - INTERVAL '2 hours'
ORDER BY measurement_timestamp DESC;

-- Query 2: Get all unhealthy readings
SELECT
  site_name,
  city,
  measurement_timestamp,
  aqi,
  aqi_category,
  primary_pollutant,
  health_message
FROM air_quality_data
WHERE aqi_category IN ('unhealthy_sensitive', 'unhealthy', 'very_unhealthy', 'hazardous')
ORDER BY aqi DESC;

-- Query 3: Get readings by city
SELECT
  site_name,
  measurement_timestamp,
  aqi,
  aqi_category,
  pm25_concentration
FROM air_quality_data
WHERE city = 'Birmingham'
ORDER BY measurement_timestamp DESC
LIMIT 10;

-- Query 4: Get all action days
SELECT
  city,
  measurement_timestamp,
  aqi,
  aqi_category,
  health_message
FROM air_quality_data
WHERE action_day = true
ORDER BY measurement_timestamp DESC;

-- ============================================================================
-- SECTION 3: Aggregate Queries
-- ============================================================================

-- Query 5: Average AQI by city (last 24 hours)
SELECT
  city,
  COUNT(*) as reading_count,
  AVG(aqi)::INTEGER as avg_aqi,
  MAX(aqi) as max_aqi,
  MIN(aqi) as min_aqi
FROM air_quality_data
WHERE measurement_timestamp >= NOW() - INTERVAL '24 hours'
  AND aqi IS NOT NULL
GROUP BY city
ORDER BY avg_aqi DESC;

-- Query 6: Pollutant breakdown
SELECT
  primary_pollutant,
  COUNT(*) as reading_count,
  AVG(aqi)::INTEGER as avg_aqi,
  MAX(aqi) as max_aqi
FROM air_quality_data
WHERE measurement_timestamp >= NOW() - INTERVAL '24 hours'
  AND primary_pollutant IS NOT NULL
GROUP BY primary_pollutant
ORDER BY reading_count DESC;

-- Query 7: AQI category distribution (last 7 days)
SELECT
  aqi_category,
  COUNT(*) as count,
  ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM air_quality_data WHERE measurement_timestamp >= NOW() - INTERVAL '7 days')), 2) as percentage
FROM air_quality_data
WHERE measurement_timestamp >= NOW() - INTERVAL '7 days'
  AND aqi_category IS NOT NULL
GROUP BY aqi_category
ORDER BY
  CASE aqi_category
    WHEN 'good' THEN 1
    WHEN 'moderate' THEN 2
    WHEN 'unhealthy_sensitive' THEN 3
    WHEN 'unhealthy' THEN 4
    WHEN 'very_unhealthy' THEN 5
    WHEN 'hazardous' THEN 6
  END;

-- Query 8: Daily averages by site (last 30 days)
SELECT
  site_id,
  site_name,
  DATE(measurement_timestamp) as measurement_date,
  AVG(aqi)::INTEGER as avg_aqi,
  MAX(aqi) as max_aqi,
  AVG(pm25_concentration)::DECIMAL(8,2) as avg_pm25,
  COUNT(*) as reading_count
FROM air_quality_data
WHERE measurement_timestamp >= CURRENT_DATE - INTERVAL '30 days'
  AND site_id IS NOT NULL
GROUP BY site_id, site_name, DATE(measurement_timestamp)
ORDER BY measurement_date DESC, avg_aqi DESC;

-- ============================================================================
-- SECTION 4: Time Series Queries
-- ============================================================================

-- Query 9: Hourly AQI trend (last 24 hours)
SELECT
  DATE_TRUNC('hour', measurement_timestamp) as hour,
  AVG(aqi)::INTEGER as avg_aqi,
  MAX(aqi) as max_aqi,
  AVG(pm25_concentration)::DECIMAL(8,2) as avg_pm25,
  COUNT(*) as reading_count
FROM air_quality_data
WHERE measurement_timestamp >= NOW() - INTERVAL '24 hours'
GROUP BY DATE_TRUNC('hour', measurement_timestamp)
ORDER BY hour DESC;

-- Query 10: PM2.5 concentration trend for specific site
SELECT
  measurement_timestamp,
  pm25_concentration,
  pm25_aqi,
  aqi_category,
  temperature_celsius,
  wind_speed_mph
FROM air_quality_data
WHERE site_id = 'AQS-01-073-0023'
  AND measurement_timestamp >= NOW() - INTERVAL '48 hours'
ORDER BY measurement_timestamp DESC;

-- Query 11: Ozone trend (last 7 days)
SELECT
  DATE(measurement_timestamp) as date,
  AVG(ozone_concentration)::DECIMAL(8,3) as avg_ozone,
  MAX(ozone_concentration) as max_ozone,
  AVG(ozone_aqi)::INTEGER as avg_ozone_aqi
FROM air_quality_data
WHERE measurement_timestamp >= CURRENT_DATE - INTERVAL '7 days'
  AND ozone_concentration IS NOT NULL
GROUP BY DATE(measurement_timestamp)
ORDER BY date DESC;

-- ============================================================================
-- SECTION 5: Geospatial Queries
-- ============================================================================

-- Query 12: Find monitoring sites near Birmingham city center (within 10 miles)
SELECT
  site_name,
  city,
  latitude,
  longitude,
  earth_distance(
    ll_to_earth(33.5186, -86.8104),
    ll_to_earth(latitude, longitude)
  ) / 1609.34 as distance_miles,
  aqi,
  measurement_timestamp
FROM air_quality_data
WHERE measurement_timestamp >= NOW() - INTERVAL '2 hours'
  AND earth_distance(
    ll_to_earth(33.5186, -86.8104),
    ll_to_earth(latitude, longitude)
  ) / 1609.34 <= 10
ORDER BY distance_miles;

-- Query 13: Get current air quality for all cities with coordinates
SELECT DISTINCT ON (city)
  city,
  latitude,
  longitude,
  aqi,
  aqi_category,
  pm25_concentration,
  measurement_timestamp
FROM air_quality_data
WHERE measurement_timestamp >= NOW() - INTERVAL '2 hours'
  AND city IS NOT NULL
ORDER BY city, measurement_timestamp DESC;

-- ============================================================================
-- SECTION 6: Data Quality Queries
-- ============================================================================

-- Query 14: Check measurement status distribution
SELECT
  measurement_status,
  COUNT(*) as count,
  data_source,
  ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM air_quality_data)), 2) as percentage
FROM air_quality_data
GROUP BY measurement_status, data_source
ORDER BY count DESC;

-- Query 15: Find flagged readings
SELECT
  site_name,
  city,
  measurement_timestamp,
  aqi,
  primary_pollutant,
  quality_control_flags,
  data_source
FROM air_quality_data
WHERE measurement_status = 'flagged'
  OR array_length(quality_control_flags, 1) > 0
ORDER BY measurement_timestamp DESC;

-- Query 16: Check for data gaps (sites with no recent readings)
SELECT
  site_id,
  site_name,
  MAX(measurement_timestamp) as last_reading,
  EXTRACT(EPOCH FROM (NOW() - MAX(measurement_timestamp)))/3600 as hours_since_last_reading
FROM air_quality_data
WHERE site_id IS NOT NULL
GROUP BY site_id, site_name
HAVING MAX(measurement_timestamp) < NOW() - INTERVAL '3 hours'
ORDER BY last_reading;

-- ============================================================================
-- SECTION 7: Health Advisory Queries
-- ============================================================================

-- Query 17: Current health advisories
SELECT
  city,
  aqi,
  aqi_category,
  primary_pollutant,
  health_message,
  measurement_timestamp
FROM air_quality_data
WHERE action_day = true
  AND measurement_timestamp >= NOW() - INTERVAL '24 hours'
ORDER BY aqi DESC;

-- Query 18: Sites requiring health warnings (AQI > 100)
SELECT
  city,
  site_name,
  aqi,
  aqi_category,
  primary_pollutant,
  CASE
    WHEN aqi <= 50 THEN 'Air quality is satisfactory.'
    WHEN aqi <= 100 THEN 'Air quality is acceptable for most people.'
    WHEN aqi <= 150 THEN 'Sensitive groups should limit prolonged outdoor exertion.'
    WHEN aqi <= 200 THEN 'Everyone should limit prolonged outdoor exertion.'
    WHEN aqi <= 300 THEN 'Everyone should avoid all outdoor physical activity.'
    ELSE 'Health Warning: Everyone should remain indoors.'
  END as health_advisory
FROM air_quality_data
WHERE aqi > 100
  AND measurement_timestamp >= NOW() - INTERVAL '2 hours'
ORDER BY aqi DESC;

-- ============================================================================
-- SECTION 8: Views Testing
-- ============================================================================

-- Query 19: Test current_air_quality view
SELECT * FROM current_air_quality
ORDER BY aqi DESC NULLS LAST;

-- Query 20: Test unhealthy_air_quality view
SELECT * FROM unhealthy_air_quality
ORDER BY aqi DESC;

-- Query 21: Test daily_air_quality_summary view
SELECT * FROM daily_air_quality_summary
ORDER BY measurement_date DESC, avg_aqi DESC
LIMIT 20;

-- Query 22: Test recent_action_days view
SELECT * FROM recent_action_days
ORDER BY measurement_timestamp DESC;

-- ============================================================================
-- SECTION 9: Function Testing
-- ============================================================================

-- Query 23: Test calculate_aqi_category function
SELECT
  generate_series(0, 500, 25) as aqi_value,
  calculate_aqi_category(generate_series(0, 500, 25)) as category;

-- ============================================================================
-- SECTION 10: Statistics Queries (for Dashboard)
-- ============================================================================

-- Query 24: Overall statistics (last 24 hours)
SELECT
  COUNT(*) as total_readings,
  COUNT(DISTINCT site_id) as active_sites,
  COUNT(DISTINCT city) as cities_monitored,
  AVG(aqi)::INTEGER as avg_aqi,
  MAX(aqi) as max_aqi,
  MIN(aqi) as min_aqi,
  COUNT(CASE WHEN aqi_category IN ('unhealthy', 'very_unhealthy', 'hazardous') THEN 1 END) as unhealthy_readings,
  COUNT(CASE WHEN action_day = true THEN 1 END) as action_days,
  AVG(pm25_concentration)::DECIMAL(8,2) as avg_pm25,
  MAX(pm25_concentration) as max_pm25
FROM air_quality_data
WHERE measurement_timestamp >= NOW() - INTERVAL '24 hours';

-- Query 25: Site performance summary
SELECT
  site_id,
  site_name,
  city,
  COUNT(*) as total_readings,
  MIN(measurement_timestamp) as first_reading,
  MAX(measurement_timestamp) as last_reading,
  AVG(aqi)::INTEGER as avg_aqi,
  MAX(aqi) as max_aqi,
  COUNT(CASE WHEN measurement_status = 'validated' THEN 1 END) as validated_readings,
  ROUND((COUNT(CASE WHEN measurement_status = 'validated' THEN 1 END) * 100.0 / COUNT(*)), 2) as validation_rate
FROM air_quality_data
WHERE site_id IS NOT NULL
GROUP BY site_id, site_name, city
ORDER BY total_readings DESC;

-- Query 26: Pollutant statistics (last 30 days)
SELECT
  'PM2.5' as pollutant,
  COUNT(*) as reading_count,
  AVG(pm25_concentration)::DECIMAL(8,2) as avg_concentration,
  MAX(pm25_concentration) as max_concentration,
  STDDEV(pm25_concentration)::DECIMAL(8,2) as std_dev
FROM air_quality_data
WHERE measurement_timestamp >= CURRENT_DATE - INTERVAL '30 days'
  AND pm25_concentration IS NOT NULL

UNION ALL

SELECT
  'Ozone' as pollutant,
  COUNT(*) as reading_count,
  AVG(ozone_concentration)::DECIMAL(8,3) as avg_concentration,
  MAX(ozone_concentration) as max_concentration,
  STDDEV(ozone_concentration)::DECIMAL(8,3) as std_dev
FROM air_quality_data
WHERE measurement_timestamp >= CURRENT_DATE - INTERVAL '30 days'
  AND ozone_concentration IS NOT NULL

ORDER BY reading_count DESC;

-- ============================================================================
-- SECTION 11: Performance Testing
-- ============================================================================

-- Query 27: Test timestamp index performance
EXPLAIN ANALYZE
SELECT * FROM air_quality_data
WHERE measurement_timestamp >= NOW() - INTERVAL '24 hours'
ORDER BY measurement_timestamp DESC;

-- Query 28: Test geospatial index performance
EXPLAIN ANALYZE
SELECT site_name, latitude, longitude, aqi
FROM air_quality_data
WHERE earth_distance(
  ll_to_earth(33.5186, -86.8104),
  ll_to_earth(latitude, longitude)
) / 1609.34 <= 10
AND measurement_timestamp >= NOW() - INTERVAL '2 hours';

-- Query 29: Test AQI index performance
EXPLAIN ANALYZE
SELECT * FROM air_quality_data
WHERE aqi > 100
  AND measurement_timestamp >= NOW() - INTERVAL '24 hours'
ORDER BY aqi DESC;

-- ============================================================================
-- SUCCESS - All test queries complete
-- ============================================================================
