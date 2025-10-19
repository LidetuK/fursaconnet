-- Create posts table to store posts made from the dashboard
CREATE TABLE IF NOT EXISTS "posts" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER NOT NULL,
    "platform" VARCHAR(32) NOT NULL,
    "content" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'scheduled', 'draft', 'failed')),
    "platform_post_id" VARCHAR(255), -- ID from the platform (e.g., tweet ID, LinkedIn post ID)
    "published_at" TIMESTAMP,
    "scheduled_at" TIMESTAMP,
    "error_message" TEXT,
    "metadata" JSONB, -- Store additional platform-specific data
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("user_id") REFERENCES "smes"("id") ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "IDX_posts_user_id" ON "posts"("user_id");
CREATE INDEX IF NOT EXISTS "IDX_posts_platform" ON "posts"("platform");
CREATE INDEX IF NOT EXISTS "IDX_posts_status" ON "posts"("status");
CREATE INDEX IF NOT EXISTS "IDX_posts_published_at" ON "posts"("published_at" DESC);
CREATE INDEX IF NOT EXISTS "IDX_posts_created_at" ON "posts"("created_at" DESC);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_posts_updated_at 
    BEFORE UPDATE ON "posts" 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 