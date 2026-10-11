-- Add social permissions to existing team members
-- This migration updates all existing team members to include the new social permissions

-- Update all owners to include social permissions
UPDATE "TeamMember"
SET permissions = jsonb_set(
  permissions,
  '{permissions}',
  (
    SELECT jsonb_agg(DISTINCT value)
    FROM (
      SELECT jsonb_array_elements_text(permissions->'permissions') as value
      UNION ALL
      SELECT 'view_socials'
      UNION ALL
      SELECT 'manage_socials'
    ) combined
  )
)
WHERE role = 'owner';

-- Update all admins to include social permissions
UPDATE "TeamMember"
SET permissions = jsonb_set(
  permissions,
  '{permissions}',
  (
    SELECT jsonb_agg(DISTINCT value)
    FROM (
      SELECT jsonb_array_elements_text(permissions->'permissions') as value
      UNION ALL
      SELECT 'view_socials'
      UNION ALL
      SELECT 'manage_socials'
    ) combined
  )
)
WHERE role = 'admin';

-- Update all moderators to include view_socials permission
UPDATE "TeamMember"
SET permissions = jsonb_set(
  permissions,
  '{permissions}',
  (
    SELECT jsonb_agg(DISTINCT value)
    FROM (
      SELECT jsonb_array_elements_text(permissions->'permissions') as value
      UNION ALL
      SELECT 'view_socials'
    ) combined
  )
)
WHERE role = 'moderator';

-- Update all viewers to include view_socials permission
UPDATE "TeamMember"
SET permissions = jsonb_set(
  permissions,
  '{permissions}',
  (
    SELECT jsonb_agg(DISTINCT value)
    FROM (
      SELECT jsonb_array_elements_text(permissions->'permissions') as value
      UNION ALL
      SELECT 'view_socials'
    ) combined
  )
)
WHERE role = 'viewer';
