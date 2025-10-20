-- Check if Telegram connection was saved for user ID 9
-- The pop-up said "Telegram connected successfully!" but frontend shows disconnected

-- 1. Check all social accounts for user ID 9
SELECT 'Social accounts for User ID 9:' as info;
SELECT id, user_id, platform, screen_name, platform_user_id, created_at, updated_at 
FROM social_accounts 
WHERE user_id = 9
ORDER BY created_at DESC;

-- 2. Check all Telegram connections
SELECT 'All Telegram connections:' as info;
SELECT id, user_id, platform, screen_name, platform_user_id, created_at, updated_at 
FROM social_accounts 
WHERE platform = 'telegram'
ORDER BY created_at DESC;

-- 3. Check if user ID 9 exists in smes table
SELECT 'User ID 9 in smes table:' as info;
SELECT id, email, company_name, created_at 
FROM smes 
WHERE id = 9;

-- 4. Show recent social accounts (last 5)
SELECT 'Recent social accounts (last 5):' as info;
SELECT id, user_id, platform, screen_name, platform_user_id, created_at, updated_at 
FROM social_accounts 
ORDER BY created_at DESC 
LIMIT 5;
