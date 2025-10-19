-- Debug script to check the Telegram foreign key issue
-- Let's see what's in each table and understand the problem

-- 1. Check what users exist in the smes table
SELECT 'SMES Table Contents:' as info;
SELECT id, email, company_name, created_at FROM smes ORDER BY id;

-- 2. Check what users exist in the user table  
SELECT 'USER Table Contents:' as info;
SELECT id, email, name, created_at FROM "user" ORDER BY id;

-- 3. Check what's currently in social_accounts table
SELECT 'SOCIAL_ACCOUNTS Table Contents:' as info;
SELECT id, user_id, platform, screen_name, created_at FROM social_accounts ORDER BY user_id, platform;

-- 4. Check the foreign key constraints
SELECT 'Foreign Key Constraints:' as info;
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'social_accounts';

-- 5. Check if user ID 8 exists in any table
SELECT 'Checking for User ID 8:' as info;
SELECT 'smes' as table_name, COUNT(*) as count FROM smes WHERE id = 8
UNION ALL
SELECT 'user' as table_name, COUNT(*) as count FROM "user" WHERE id = 8
UNION ALL
SELECT 'social_accounts' as table_name, COUNT(*) as count FROM social_accounts WHERE user_id = 8;
