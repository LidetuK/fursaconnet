-- Fix social_accounts table user_id field type
-- Change from UUID to INTEGER to match User.id field type

-- First, drop the existing table if it exists (since it's likely empty or has issues)
DROP TABLE IF EXISTS "social_accounts";

-- Recreate the social_accounts table with correct user_id type
CREATE TABLE "social_accounts" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER NOT NULL,
    "platform" VARCHAR(32) NOT NULL,
    "access_token" TEXT,
    "token_secret" TEXT,
    "refresh_token" TEXT,
    "platform_user_id" VARCHAR(128),
    "screen_name" VARCHAR(128),
    "expires_at" TIMESTAMP,
    "metadata" JSONB,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("user_id", "platform")
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "IDX_social_accounts_user_id" ON "social_accounts"("user_id");
CREATE INDEX IF NOT EXISTS "IDX_social_accounts_platform" ON "social_accounts"("platform");

-- Add foreign key constraint to ensure data integrity
ALTER TABLE "social_accounts" 
ADD CONSTRAINT "fk_social_accounts_user" 
FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE; 