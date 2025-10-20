-- Transfer Telegram connection from user ID 8 to user ID 7
-- This will allow the current user to see their Telegram connection

-- First, let's see what we're transferring
SELECT 'Current Telegram connection (User ID 8):' as info;
SELECT id, user_id, platform, screen_name, platform_user_id, created_at 
FROM social_accounts 
WHERE user_id = 8 AND platform = 'telegram';

-- Update the Telegram connection to belong to user ID 7
UPDATE social_accounts 
SET user_id = 7, updated_at = CURRENT_TIMESTAMP
WHERE user_id = 8 AND platform = 'telegram';

-- Verify the transfer
SELECT 'Telegram connection after transfer (User ID 7):' as info;
SELECT id, user_id, platform, screen_name, platform_user_id, created_at 
FROM social_accounts 
WHERE user_id = 7 AND platform = 'telegram';

-- Show all social accounts for user ID 7
SELECT 'All social accounts for User ID 7:' as info;
SELECT id, user_id, platform, screen_name, platform_user_id, created_at 
FROM social_accounts 
WHERE user_id = 7;
