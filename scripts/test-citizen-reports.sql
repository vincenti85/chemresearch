-- ============================================================================
-- Test Queries for citizen_reports Table
-- ============================================================================

-- 1. INSERT: Create a new report (odor complaint)
-- ============================================================================
INSERT INTO citizen_reports (
  user_id,
  reporter_name,
  reporter_email,
  is_anonymous,
  report_type,
  description,
  latitude,
  longitude,
  location_name,
  severity,
  status
) VALUES (
  '123e4567-e89b-12d3-a456-426614174000', -- Sample user_id
  'John Doe',
  'john.doe@example.com',
  false,
  'odor',
  'Strong chemical smell near ABC Coke facility. Started around 2pm and persisting for hours.',
  33.5186, -- Birmingham, AL latitude
  -86.8104, -- Birmingham, AL longitude
  'North Birmingham',
  'high',
  'pending'
);

-- 2. INSERT: Anonymous report with photos
-- ============================================================================
INSERT INTO citizen_reports (
  is_anonymous,
  report_type,
  description,
  latitude,
  longitude,
  location_name,
  photos,
  severity
) VALUES (
  true,
  'visual',
  'Dark smoke emission from industrial stack observed at 11:30am',
  33.5130,
  -86.8050,
  'Fairfield',
  ARRAY[
    'https://storage.supabase.co/citizen-reports/smoke-20260106-1.jpg',
    'https://storage.supabase.co/citizen-reports/smoke-20260106-2.jpg'
  ],
  'medium'
);

-- 3. SELECT: Get all pending reports (for admin review)
-- ============================================================================
SELECT
  id,
  report_type,
  description,
  location_name,
  severity,
  created_at,
  array_length(photos, 1) as photo_count
FROM citizen_reports
WHERE status = 'pending'
ORDER BY created_at DESC
LIMIT 50;

-- 4. SELECT: Get verified reports in last 30 days (public view)
-- ============================================================================
SELECT
  id,
  report_type,
  description,
  location_name,
  latitude,
  longitude,
  severity,
  created_at
FROM citizen_reports
WHERE
  status = 'verified'
  AND created_at >= NOW() - INTERVAL '30 days'
ORDER BY created_at DESC;

-- 5. SELECT: Get reports by specific user
-- ============================================================================
SELECT
  id,
  report_type,
  description,
  status,
  severity,
  created_at,
  updated_at
FROM citizen_reports
WHERE user_id = '123e4567-e89b-12d3-a456-426614174000'
ORDER BY created_at DESC;

-- 6. SELECT: Get reports by type with statistics
-- ============================================================================
SELECT
  report_type,
  COUNT(*) as total_count,
  COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
  COUNT(*) FILTER (WHERE status = 'verified') as verified_count,
  COUNT(*) FILTER (WHERE status = 'dismissed') as dismissed_count,
  AVG(CASE
    WHEN severity = 'low' THEN 1
    WHEN severity = 'medium' THEN 2
    WHEN severity = 'high' THEN 3
  END) as avg_severity
FROM citizen_reports
GROUP BY report_type
ORDER BY total_count DESC;

-- 7. SELECT: Get recent reports near a location (within 10km)
-- ============================================================================
-- Using earth_distance function (requires earthdistance extension)
-- First run: CREATE EXTENSION IF NOT EXISTS earthdistance CASCADE;
SELECT
  id,
  report_type,
  description,
  location_name,
  latitude,
  longitude,
  earth_distance(
    ll_to_earth(latitude, longitude),
    ll_to_earth(33.5186, -86.8104) -- Birmingham coordinates
  ) / 1000 as distance_km,
  created_at
FROM citizen_reports
WHERE
  latitude IS NOT NULL
  AND longitude IS NOT NULL
  AND earth_box(
    ll_to_earth(33.5186, -86.8104),
    10000 -- 10km radius
  ) @> ll_to_earth(latitude, longitude)
ORDER BY distance_km ASC
LIMIT 20;

-- 8. UPDATE: Verify a report (admin action)
-- ============================================================================
UPDATE citizen_reports
SET
  status = 'verified',
  verified_by = 'admin-user-id',
  verified_at = NOW(),
  verification_notes = 'Confirmed with site inspection and air quality readings'
WHERE id = 'report-id-here';

-- 9. UPDATE: Dismiss a report (admin action)
-- ============================================================================
UPDATE citizen_reports
SET
  status = 'dismissed',
  verified_by = 'admin-user-id',
  verified_at = NOW(),
  verification_notes = 'Unable to confirm. No evidence found during site visit.'
WHERE id = 'report-id-here';

-- 10. SELECT: Reports with photo evidence
-- ============================================================================
SELECT
  id,
  report_type,
  description,
  location_name,
  array_length(photos, 1) as photo_count,
  photos,
  created_at
FROM citizen_reports
WHERE
  array_length(photos, 1) > 0
  AND status = 'verified'
ORDER BY created_at DESC;

-- 11. SELECT: Monthly report trends
-- ============================================================================
SELECT
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as total_reports,
  COUNT(*) FILTER (WHERE report_type = 'odor') as odor_reports,
  COUNT(*) FILTER (WHERE report_type = 'visual') as visual_reports,
  COUNT(*) FILTER (WHERE report_type = 'health') as health_reports,
  COUNT(*) FILTER (WHERE severity = 'high') as high_severity
FROM citizen_reports
WHERE created_at >= NOW() - INTERVAL '6 months'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- 12. SELECT: Most active locations
-- ============================================================================
SELECT
  location_name,
  COUNT(*) as report_count,
  COUNT(*) FILTER (WHERE status = 'verified') as verified_count,
  MAX(created_at) as latest_report
FROM citizen_reports
WHERE location_name IS NOT NULL
GROUP BY location_name
HAVING COUNT(*) >= 3
ORDER BY report_count DESC
LIMIT 10;

-- 13. DELETE: Remove old dismissed reports (cleanup, admin only)
-- ============================================================================
-- WARNING: This permanently deletes data. Use with caution.
DELETE FROM citizen_reports
WHERE
  status = 'dismissed'
  AND created_at < NOW() - INTERVAL '2 years';

-- 14. SELECT: Full report details for single report
-- ============================================================================
SELECT
  cr.*,
  u1.email as reporter_email_verified,
  u2.email as verified_by_email
FROM citizen_reports cr
LEFT JOIN auth.users u1 ON cr.user_id = u1.id
LEFT JOIN auth.users u2 ON cr.verified_by = u2.id
WHERE cr.id = 'report-id-here';

-- ============================================================================
-- TESTING RLS POLICIES
-- ============================================================================

-- Test as authenticated user (should see only own reports)
SET ROLE authenticated;
SET request.jwt.claims.sub TO '123e4567-e89b-12d3-a456-426614174000';

SELECT * FROM citizen_reports;
-- Should only return reports where user_id matches

-- Test as admin (should see all reports)
SET ROLE authenticated;
SET request.jwt.claims.sub TO 'admin-user-id';

SELECT * FROM citizen_reports;
-- Should return all reports

-- Test as anonymous (should see only verified reports)
SET ROLE anon;

SELECT * FROM citizen_reports;
-- Should only return reports where status = 'verified'

-- Reset role
RESET ROLE;

-- ============================================================================
-- PERFORMANCE TESTING
-- ============================================================================

-- Check index usage
EXPLAIN ANALYZE
SELECT * FROM citizen_reports
WHERE status = 'pending'
ORDER BY created_at DESC
LIMIT 10;

-- Should use: idx_citizen_reports_status_created

-- Check location query performance
EXPLAIN ANALYZE
SELECT *
FROM citizen_reports
WHERE latitude IS NOT NULL
  AND earth_box(ll_to_earth(33.5186, -86.8104), 10000)
    @> ll_to_earth(latitude, longitude)
LIMIT 20;

-- Should use: idx_citizen_reports_location (GIST index)
