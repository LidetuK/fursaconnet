-- Check current user data and social accounts
-- Let's see what's in the database right now

-- 1. Check all users in smes table
SELECT 'SMES Table - All Users:' as info;
SELECT id, email, company_name, created_at FROM smes ORDER BY id;

-- 2. Check all social accounts
SELECT 'SOCIAL_ACCOUNTS Table - All Records:' as info;
SELECT id, user_id, platform, screen_name, platform_user_id, created_at FROM social_accounts ORDER BY user_id, platform;

-- 3. Check specifically for user ID 7 (from JWT token)
SELECT 'Checking User ID 7:' as info;
SELECT 'smes' as table_name, COUNT(*) as count FROM smes WHERE id = 7
UNION ALL
SELECT 'social_accounts' as table_name, COUNT(*) as count FROM social_accounts WHERE user_id = 7;

-- 4. Check specifically for user ID 8 (from previous Telegram connection)
SELECT 'Checking User ID 8:' as info;
SELECT 'smes' as table_name, COUNT(*) as count FROM smes WHERE id = 8
UNION ALL
SELECT 'social_accounts' as table_name, COUNT(*) as count FROM social_accounts WHERE user_id = 8;

-- 5. Show the latest social accounts entries
SELECT 'Latest Social Accounts (last 5):' as info;
SELECT id, user_id, platform, screen_name, platform_user_id, created_at 
FROM social_accounts 
ORDER BY created_at DESC 
LIMIT 5;
