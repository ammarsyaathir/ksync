-- ============================================================================
-- K-Sync Malaysia - fix stray trust_level on VERIFIED events
--
-- Problem : six imported events carry trust_level = 'VERIFIED', which is not a
--           valid trust tier. The admin approval form only offers OFFICIAL and
--           COMMUNITY, and views/event-details.ejs renders a trust badge for
--           those two values only - so those six listings currently show a
--           "verified" badge but NO trust-level badge.
--
-- Cause   : the rows were imported straight from official promoter sources
--           (Live Nation Malaysia, Three Angles Production) and written as
--           VERIFIED instead of OFFICIAL.
--
-- Effect  : sets trust_level = 'OFFICIAL' for those six rows only.
--           verification_status is not changed, so nothing becomes visible or
--           hidden - all nine pending/rejected rows stay exactly as they are.
--
-- Safe    : idempotent. Re-running the statement affects 0 rows.
--           A brand-new submission is created as PENDING/PENDING and will never
--           match this WHERE clause, so the verification gate is untouched.
-- ============================================================================

UPDATE `events`
   SET `trust_level` = 'OFFICIAL'
 WHERE `verification_status` = 'VERIFIED'
   AND `trust_level` = 'VERIFIED';

-- ----------------------------------------------------------------------------
-- Verify: expect a single row, OFFICIAL = 8, COMMENT = 0 stray values.
-- ----------------------------------------------------------------------------
SELECT `trust_level`, COUNT(*) AS `event_count`
  FROM `events`
 WHERE `verification_status` = 'VERIFIED'
 GROUP BY `trust_level`
 ORDER BY `trust_level`;

-- ----------------------------------------------------------------------------
-- OPTIONAL - one further misclassification you may want to correct.
--
-- Event KS-2026-SVT009 ("CARAT Malaysia: SEVENTEEN 9th Anniversary Cafe
-- Cupsleeve & Photocard Gathering") is a fan-organised cupsleeve event run by a
-- fan union (organizer_type = 'Fanclub', source: https://x.com/Carat_MY). Under
-- this project's own definition - OFFICIAL = organizer/agency/venue official
-- channel, COMMUNITY = fan-organised - it should be COMMUNITY, not OFFICIAL.
--
-- Run this statement only if you agree with that classification.
-- ----------------------------------------------------------------------------
-- UPDATE `events`
--    SET `trust_level` = 'COMMUNITY'
--  WHERE `tracking_code` = 'KS-2026-SVT009'
--    AND `verification_status` = 'VERIFIED';
