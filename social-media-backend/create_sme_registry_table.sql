-- Create sme_registry table for SME Registry
CREATE TABLE IF NOT EXISTS "sme_registry" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL,
    "company_name" VARCHAR(255) NOT NULL,
    "phone_number" VARCHAR(20) NOT NULL,
    "company_logo_url" TEXT,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS "IDX_sme_registry_company_name" ON "sme_registry"("company_name");
CREATE INDEX IF NOT EXISTS "IDX_sme_registry_phone_number" ON "sme_registry"("phone_number");

-- Insert a test record (optional - remove this line if you don't want test data)
-- INSERT INTO "sme_registry" (name, company_name, phone_number, company_logo_url) 
-- VALUES ('Test User', 'Test Company', '+1234567890', 'https://example.com/logo.png');
