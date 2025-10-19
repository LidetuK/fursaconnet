-- Fix Telegram foreign key constraint issue
-- The error shows user_id=8 doesn't exist in smes table

-- Option 1: Check if user exists in smes table
SELECT id, email, company_name FROM smes WHERE id = 8;

-- Option 2: If user doesn't exist, we need to either:
-- A) Add the user to smes table, or
-- B) Temporarily drop the foreign key constraint

-- Let's first check what users exist
SELECT id, email, company_name FROM smes ORDER BY id;

-- If user 8 doesn't exist, we can either:
-- 1. Add a placeholder user (not recommended for production)
-- 2. Drop the foreign key constraint temporarily
-- 3. Fix the foreign key to reference the correct table

-- For now, let's drop the problematic foreign key constraint
-- and recreate it properly

-- Drop the existing foreign key constraint
ALTER TABLE "social_accounts" DROP CONSTRAINT IF EXISTS "fk_social_accounts_smes";

-- The constraint should reference the correct table
-- Based on the auth system, it should reference 'smes' table
-- But we need to make sure the user exists first

-- Let's check what's in the social_accounts table
SELECT * FROM social_accounts WHERE user_id = 8;

-- If there are orphaned records, we might need to clean them up
-- DELETE FROM social_accounts WHERE user_id NOT IN (SELECT id FROM smes);

-- Recreate the foreign key constraint
ALTER TABLE "social_accounts" 
ADD CONSTRAINT "fk_social_accounts_smes" 
FOREIGN KEY ("user_id") REFERENCES "smes"("id") ON DELETE CASCADE;
