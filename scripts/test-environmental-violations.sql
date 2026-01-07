-- ============================================================================
-- Test Queries for environmental_violations table
-- Purpose: Comprehensive testing and example queries
-- Created: 2026-01-06
-- Agent: DB Architect
-- ============================================================================

-- ============================================================================
-- SECTION 1: Sample Data Insertion
-- ============================================================================

-- Test 1: Insert a Clean Air Act violation
INSERT INTO environmental_violations (
  company_name,
  facility_name,
  facility_address,
  city,
  state,
  zip_code,
  violation_type,
  description,
  violation_date,
  discovery_date,
  penalty_amount,
  epa_case_number,
  status,
  severity,
  latitude,
  longitude,
  data_source,
  source_url
) VALUES (
  'ABC Coke Company',
  'North Birmingham Coke Plant',
  '3501 27th Avenue North',
  'Birmingham',
  'AL',
  '35207',
  'clean_air_act',
  'Excessive emissions of particulate matter (PM2.5) exceeding permitted limits. Monitoring data shows violations on multiple dates with peak concentrations reaching 3x the allowable threshold.',
  '2024-08-15',
  '2024-09-10',
  2500000.00,
  'CAA-2024-AL-001',
  'active',
  'critical',
  33.5581,
  -86.7913,
  'EPA ECHO',
  'https://echo.epa.gov/case/CAA-2024-AL-001'
);

-- Test 2: Insert a Clean Water Act violation
INSERT INTO environmental_violations (
  company_name,
  facility_name,
  city,
  state,
  violation_type,
  description,
  violation_date,
  penalty_amount,
  settlement_amount,
  epa_case_number,
  status,
  severity,
  latitude,
  longitude
) VALUES (
  'Industrial Chemical Corp',
  'Mobile Bay Facility',
  'Mobile',
  'AL',
  'clean_water_act',
  'Unauthorized discharge of untreated wastewater into Mobile Bay. Water samples contained elevated levels of heavy metals including mercury and cadmium.',
  '2024-11-20',
  1800000.00,
  1500000.00,
  'CWA-2024-AL-005',
  'resolved',
  'high',
  30.6954,
  -88.0399
);

-- Test 3: Insert an RCRA violation (hazardous waste)
INSERT INTO environmental_violations (
  company_name,
  facility_name,
  city,
  state,
  violation_type,
  description,
  violation_date,
  penalty_amount,
  status,
  severity
) VALUES (
  'Southern Manufacturing Inc',
  'Huntsville Production Plant',
  'Huntsville',
  'AL',
  'rcra',
  'Improper storage of hazardous waste materials. Facility failed to maintain proper containment systems and documentation for over 500 drums of chemical waste.',
  '2024-06-12',
  750000.00,
  'under_review',
  'high'
);

-- Test 4: Insert a TSCA violation (toxic substances)
INSERT INTO environmental_violations (
  company_name,
  facility_name,
  city,
  state,
  violation_type,
  description,
  violation_date,
  status,
  severity
) VALUES (
  'Alabama Plastics Manufacturing',
  'Montgomery Plastics Facility',
  'Montgomery',
  'AL',
  'tsca',
  'Failure to report PFAS usage and releases as required under TSCA Section 8. Company did not file mandatory reports for 2023 production year.',
  '2024-10-05',
  'active',
  'medium'
);

-- Test 5: Insert a resolved violation with resolution details
INSERT INTO environmental_violations (
  company_name,
  facility_name,
  city,
  state,
  violation_type,
  description,
  violation_date,
  discovery_date,
  penalty_amount,
  settlement_amount,
  status,
  severity,
  resolution_date,
  resolution_notes
) VALUES (
  'Green Energy Solutions',
  'Birmingham Solar Facility',
  'Birmingham',
  'AL',
  'clean_water_act',
  'Stormwater runoff violations during construction phase. Sediment controls were inadequate.',
  '2024-03-15',
  '2024-04-01',
  50000.00,
  35000.00,
  'resolved',
  'low',
  '2024-11-30',
  'Company installed improved erosion controls and conducted employee training. EPA verified compliance through 3 follow-up inspections.'
);

-- ============================================================================
-- SECTION 2: Basic Queries
-- ============================================================================

-- Query 1: Get all active violations
SELECT
  company_name,
  facility_name,
  violation_type,
  violation_date,
  penalty_amount,
  severity
FROM environmental_violations
WHERE status = 'active'
ORDER BY violation_date DESC;

-- Query 2: Get critical and high severity violations
SELECT
  company_name,
  facility_name,
  city,
  violation_type,
  description,
  severity,
  status
FROM environmental_violations
WHERE severity IN ('critical', 'high')
ORDER BY severity DESC, violation_date DESC;

-- Query 3: Get violations by specific company
SELECT
  facility_name,
  violation_type,
  violation_date,
  penalty_amount,
  status,
  severity
FROM environmental_violations
WHERE company_name = 'ABC Coke Company'
ORDER BY violation_date DESC;

-- ============================================================================
-- SECTION 3: Aggregate Queries
-- ============================================================================

-- Query 4: Count violations by type
SELECT
  violation_type,
  COUNT(*) as violation_count,
  SUM(penalty_amount) as total_penalties,
  AVG(penalty_amount) as avg_penalty
FROM environmental_violations
GROUP BY violation_type
ORDER BY violation_count DESC;

-- Query 5: Violations by city (top polluting cities)
SELECT
  city,
  COUNT(*) as violation_count,
  COUNT(DISTINCT company_name) as unique_companies,
  SUM(penalty_amount) as total_penalties
FROM environmental_violations
WHERE city IS NOT NULL
GROUP BY city
ORDER BY violation_count DESC
LIMIT 10;

-- Query 6: Monthly violation trend (last 12 months)
SELECT
  DATE_TRUNC('month', violation_date) as month,
  COUNT(*) as violations,
  SUM(penalty_amount) as total_penalties
FROM environmental_violations
WHERE violation_date >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', violation_date)
ORDER BY month DESC;

-- Query 7: Violations by status
SELECT
  status,
  COUNT(*) as count,
  ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM environmental_violations)), 2) as percentage
FROM environmental_violations
GROUP BY status
ORDER BY count DESC;

-- ============================================================================
-- SECTION 4: Advanced Queries
-- ============================================================================

-- Query 8: Companies with multiple violations
SELECT
  company_name,
  COUNT(*) as violation_count,
  SUM(penalty_amount) as total_penalties,
  MAX(severity) as worst_severity,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as active_violations
FROM environmental_violations
GROUP BY company_name
HAVING COUNT(*) > 1
ORDER BY violation_count DESC;

-- Query 9: Recent violations (last 30 days)
SELECT
  company_name,
  facility_name,
  violation_type,
  violation_date,
  severity,
  status,
  penalty_amount
FROM environmental_violations
WHERE violation_date >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY violation_date DESC;

-- Query 10: Geospatial query - violations near specific coordinates
-- Example: Find violations within ~10 miles of Birmingham city center (33.5186, -86.8104)
SELECT
  company_name,
  facility_name,
  city,
  violation_type,
  severity,
  latitude,
  longitude,
  earth_distance(
    ll_to_earth(33.5186, -86.8104),
    ll_to_earth(latitude, longitude)
  ) / 1609.34 as distance_miles
FROM environmental_violations
WHERE
  latitude IS NOT NULL
  AND longitude IS NOT NULL
  AND earth_distance(
    ll_to_earth(33.5186, -86.8104),
    ll_to_earth(latitude, longitude)
  ) / 1609.34 <= 10
ORDER BY distance_miles;

-- Query 11: Full-text search in violation descriptions
SELECT
  company_name,
  facility_name,
  violation_type,
  description,
  violation_date,
  severity
FROM environmental_violations
WHERE to_tsvector('english', description) @@ to_tsquery('english', 'PFAS | mercury | cadmium')
ORDER BY violation_date DESC;

-- ============================================================================
-- SECTION 5: Views Testing
-- ============================================================================

-- Query 12: Test active_violations view
SELECT * FROM active_violations
LIMIT 10;

-- Query 13: Test critical_violations view
SELECT * FROM critical_violations
ORDER BY violation_date DESC;

-- Query 14: Test recent_violations view
SELECT * FROM recent_violations
ORDER BY violation_date DESC;

-- ============================================================================
-- SECTION 6: Statistics Queries (for Dashboard)
-- ============================================================================

-- Query 15: Overall statistics
SELECT
  COUNT(*) as total_violations,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as active_violations,
  COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_violations,
  COUNT(CASE WHEN severity IN ('critical', 'high') THEN 1 END) as high_severity,
  SUM(penalty_amount) as total_penalties_assessed,
  SUM(CASE WHEN status = 'resolved' THEN settlement_amount END) as total_settlements_paid,
  COUNT(DISTINCT company_name) as unique_violators,
  AVG(penalty_amount) as avg_penalty
FROM environmental_violations;

-- Query 16: Violation type breakdown with percentages
SELECT
  violation_type,
  COUNT(*) as count,
  ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM environmental_violations)), 2) as percentage,
  SUM(penalty_amount) as total_penalties,
  AVG(penalty_amount)::NUMERIC(15,2) as avg_penalty
FROM environmental_violations
GROUP BY violation_type
ORDER BY count DESC;

-- ============================================================================
-- SECTION 7: Data Quality Checks
-- ============================================================================

-- Query 17: Check for violations missing location data
SELECT
  COUNT(*) as violations_without_location,
  ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM environmental_violations)), 2) as percentage
FROM environmental_violations
WHERE latitude IS NULL OR longitude IS NULL;

-- Query 18: Check for violations missing penalty amounts
SELECT
  COUNT(*) as violations_without_penalty,
  violation_type,
  status
FROM environmental_violations
WHERE penalty_amount IS NULL
GROUP BY violation_type, status;

-- Query 19: Check for violations with resolution date but still active
SELECT
  id,
  company_name,
  facility_name,
  status,
  resolution_date
FROM environmental_violations
WHERE status = 'active' AND resolution_date IS NOT NULL;

-- ============================================================================
-- SECTION 8: Update and Maintenance Queries
-- ============================================================================

-- Query 20: Update violation status (admin operation)
-- Example: Resolve a violation
/*
UPDATE environmental_violations
SET
  status = 'resolved',
  resolution_date = CURRENT_DATE,
  resolution_notes = 'Company completed corrective actions. EPA verified compliance.'
WHERE epa_case_number = 'CAA-2024-AL-001';
*/

-- Query 21: Add settlement amount to violation (admin operation)
/*
UPDATE environmental_violations
SET settlement_amount = 2000000.00
WHERE epa_case_number = 'CAA-2024-AL-001';
*/

-- ============================================================================
-- SECTION 9: Export Queries (for Reports)
-- ============================================================================

-- Query 22: Annual report - all violations for current year
SELECT
  company_name,
  facility_name,
  city,
  violation_type,
  violation_date,
  penalty_amount,
  settlement_amount,
  status,
  severity,
  epa_case_number
FROM environmental_violations
WHERE EXTRACT(YEAR FROM violation_date) = EXTRACT(YEAR FROM CURRENT_DATE)
ORDER BY violation_date DESC;

-- Query 23: Company profile report
-- Replace 'ABC Coke Company' with actual company name
SELECT
  facility_name,
  violation_type,
  violation_date,
  description,
  penalty_amount,
  settlement_amount,
  status,
  severity,
  resolution_date,
  resolution_notes
FROM environmental_violations
WHERE company_name = 'ABC Coke Company'
ORDER BY violation_date DESC;

-- ============================================================================
-- SECTION 10: Performance Testing
-- ============================================================================

-- Query 24: Test index performance on company_name
EXPLAIN ANALYZE
SELECT * FROM environmental_violations
WHERE company_name = 'ABC Coke Company';

-- Query 25: Test index performance on date range
EXPLAIN ANALYZE
SELECT * FROM environmental_violations
WHERE violation_date >= '2024-01-01'
  AND violation_date < '2025-01-01';

-- Query 26: Test geospatial index performance
EXPLAIN ANALYZE
SELECT company_name, facility_name, latitude, longitude
FROM environmental_violations
WHERE earth_distance(
  ll_to_earth(33.5186, -86.8104),
  ll_to_earth(latitude, longitude)
) / 1609.34 <= 10
AND latitude IS NOT NULL;

-- ============================================================================
-- SUCCESS - All test queries complete
-- ============================================================================
