-- Database Performance Optimization Migration
-- This file contains SQL commands to optimize frequently used queries

-- EVENTS TABLE OPTIMIZATIONS
-- Index for ordering events by date (most common query)
CREATE INDEX IF NOT EXISTS "idx_events_date" ON "events"("date" DESC);

-- Index for filtering past/upcoming events
CREATE INDEX IF NOT EXISTS "idx_events_ispast" ON "events"("isPast");

-- Composite index for common queries (isPast + date)
CREATE INDEX IF NOT EXISTS "idx_events_ispast_date" ON "events"("isPast", "date" DESC);

-- VIDEOS TABLE OPTIMIZATIONS
-- Index for ordering videos by display order
CREATE INDEX IF NOT EXISTS "idx_videos_order" ON "videos"("order" ASC);

-- Index for YouTube ID lookups (if needed for admin operations)
CREATE INDEX IF NOT EXISTS "idx_videos_youtubeid" ON "videos"("youtubeId");

-- LYRICS TABLE OPTIMIZATIONS
-- Index for ordering lyrics by display order
CREATE INDEX IF NOT EXISTS "idx_lyrics_order" ON "lyrics"("order" ASC);

-- Index for filtering instrumental vs vocal tracks
CREATE INDEX IF NOT EXISTS "idx_lyrics_instrumental" ON "lyrics"("isInstrumental");

-- INVENTORY TABLE OPTIMIZATIONS
-- Index for inventory title searches/lookups
CREATE INDEX IF NOT EXISTS "idx_inventory_title" ON "inventory"("title");

-- GENERAL PERFORMANCE INDEXES
-- Ensure all tables have efficient createdAt/updatedAt indexes for admin operations
CREATE INDEX IF NOT EXISTS "idx_events_created" ON "events"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS "idx_videos_created" ON "videos"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS "idx_lyrics_created" ON "lyrics"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS "idx_inventory_updated" ON "inventory"("updatedAt" DESC);

-- BIO TABLE (single record, but index for consistency)
CREATE INDEX IF NOT EXISTS "idx_bio_updated" ON "bio"("updatedAt" DESC);

-- ANALYZE TABLES for query planner optimization (PostgreSQL specific)
ANALYZE "events";
ANALYZE "videos";
ANALYZE "lyrics";
ANALYZE "inventory";
ANALYZE "bio";
