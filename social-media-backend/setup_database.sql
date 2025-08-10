-- Create users table
CREATE TABLE IF NOT EXISTS "user" (
    "id" SERIAL PRIMARY KEY,
    "email" VARCHAR UNIQUE NOT NULL,
    "password" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "linkedinAccessToken" VARCHAR,
    "linkedinRefreshToken" VARCHAR,
    "linkedinTokenExpiresAt" BIGINT,
    "linkedinUserId" VARCHAR
);

-- Create social_accounts table
CREATE TABLE IF NOT EXISTS "social_accounts" (
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

-- Create experts table (from your previous setup)
CREATE TABLE IF NOT EXISTS "experts" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR NOT NULL,
    "phone_number" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "gender" VARCHAR NOT NULL,
    "currently_employed" BOOLEAN NOT NULL,
    "contract_type" VARCHAR,
    "expertise_areas" TEXT NOT NULL,
    "experience" VARCHAR NOT NULL,
    "certifications_url" TEXT,
    "passport_photo_url" TEXT,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sme_registry table
CREATE TABLE IF NOT EXISTS "sme_registry" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL,
    "company_name" VARCHAR(255) NOT NULL,
    "phone_number" VARCHAR(20) NOT NULL,
    "company_logo_url" TEXT,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "IDX_user_email" ON "user"("email");
CREATE INDEX IF NOT EXISTS "IDX_social_accounts_user_id" ON "social_accounts"("user_id");
CREATE INDEX IF NOT EXISTS "IDX_social_accounts_platform" ON "social_accounts"("platform");
CREATE INDEX IF NOT EXISTS "IDX_experts_email" ON "experts"("email"); 