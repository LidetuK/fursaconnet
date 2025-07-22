-- Create analytics tracking tables
CREATE TABLE IF NOT EXISTS "analytics_tracking" (
    "id" SERIAL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "tracking_id" VARCHAR(50) UNIQUE NOT NULL,
    "website_url" TEXT NOT NULL,
    "tracking_name" VARCHAR(255) NOT NULL,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "analytics_events" (
    "id" SERIAL PRIMARY KEY,
    "tracking_id" VARCHAR(50) NOT NULL,
    "event_type" VARCHAR(100) NOT NULL,
    "event_data" JSONB,
    "page_url" TEXT,
    "user_agent" TEXT,
    "ip_address" INET,
    "referrer" TEXT,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "IDX_analytics_tracking_user_id" ON "analytics_tracking"("user_id");
CREATE INDEX IF NOT EXISTS "IDX_analytics_tracking_tracking_id" ON "analytics_tracking"("tracking_id");
CREATE INDEX IF NOT EXISTS "IDX_analytics_events_tracking_id" ON "analytics_events"("tracking_id");
CREATE INDEX IF NOT EXISTS "IDX_analytics_events_event_type" ON "analytics_events"("event_type");
CREATE INDEX IF NOT EXISTS "IDX_analytics_events_created_at" ON "analytics_events"("created_at");
CREATE INDEX IF NOT EXISTS "IDX_analytics_events_ip_address" ON "analytics_events"("ip_address");

-- Add foreign key constraint
ALTER TABLE "analytics_events" ADD CONSTRAINT "fk_analytics_events_tracking" 
FOREIGN KEY ("tracking_id") REFERENCES "analytics_tracking"("tracking_id") ON DELETE CASCADE;

-- Add comments for documentation
COMMENT ON TABLE "analytics_tracking" IS 'Stores user tracking script configurations';
COMMENT ON TABLE "analytics_events" IS 'Stores analytics events from tracking scripts'; 