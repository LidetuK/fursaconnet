-- Create smes table for SME authentication
CREATE TABLE IF NOT EXISTS "smes" (
    "id" SERIAL PRIMARY KEY,
    "email" VARCHAR UNIQUE NOT NULL,
    "company_name" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "company_logo" VARCHAR,
    "linkedinAccessToken" VARCHAR,
    "linkedinRefreshToken" VARCHAR,
    "linkedinTokenExpiresAt" BIGINT,
    "linkedinUserId" VARCHAR,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS "IDX_smes_email" ON "smes"("email");
