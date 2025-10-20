-- Fix Telegram connection user ID issue
-- The Telegram connection is being saved under user ID 8 instead of user ID 7

-- 1. Check current state
SELECT 'Current Telegram connections:' as info;
SELECT id, user_id, platform, screen_name, platform_user_id, created_at, updated_at 
FROM social_accounts 
WHERE platform = 'telegram'
ORDER BY created_at DESC;

-- 2. Check if user ID 7 exists
SELECT 'User ID 7 in smes table:' as info;
SELECT id, email, company_name 
FROM smes 
WHERE id = 7;

-- 3. Update Telegram connection from user ID 8 to user ID 7
UPDATE social_accounts 
SET user_id = 7, updated_at = NOW()
WHERE platform = 'telegram' AND user_id = 8;

-- 4. Verify the update
SELECT 'After update - Telegram connections:' as info;
SELECT id, user_id, platform, screen_name, platform_user_id, created_at, updated_at 
FROM social_accounts 
WHERE platform = 'telegram'
ORDER BY created_at DESC;
