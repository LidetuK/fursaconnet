-- Check current Telegram connection status
-- Let's see what happened after disconnect/reconnect

-- 1. Check all social accounts for user ID 7
SELECT 'All social accounts for User ID 7:' as info;
SELECT id, user_id, platform, screen_name, platform_user_id, created_at, updated_at 
FROM social_accounts 
WHERE user_id = 7
ORDER BY created_at DESC;

-- 2. Check specifically for Telegram connections
SELECT 'Telegram connections for User ID 7:' as info;
SELECT id, user_id, platform, screen_name, platform_user_id, created_at, updated_at 
FROM social_accounts 
WHERE user_id = 7 AND platform = 'telegram';

-- 3. Check if user ID 7 exists in smes table
SELECT 'User ID 7 in smes table:' as info;
SELECT id, email, company_name, created_at 
FROM smes 
WHERE id = 7;

-- 4. Show all recent social accounts (last 10)
SELECT 'Recent social accounts (last 10):' as info;
SELECT id, user_id, platform, screen_name, platform_user_id, created_at, updated_at 
FROM social_accounts 
ORDER BY updated_at DESC 
LIMIT 10;
