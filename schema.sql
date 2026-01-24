-- RiskFortress Content Database Schema
-- Run this in Cloudflare D1 dashboard to initialize the database

CREATE TABLE IF NOT EXISTS content (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK(type IN ('case', 'article', 'blog')),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL DEFAULT '',
    summary TEXT NOT NULL DEFAULT '',
    thumbnail TEXT,
    images TEXT, -- JSON array stored as text
    author TEXT NOT NULL DEFAULT 'RiskFortress Intelligence Team',
    keywords TEXT, -- JSON array stored as text
    status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'archived')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    published_at TEXT,
    sector TEXT,
    threat_level TEXT CHECK(threat_level IN ('Low', 'Medium', 'High', 'Critical') OR threat_level IS NULL),
    confidence INTEGER CHECK(confidence >= 0 AND confidence <= 100 OR confidence IS NULL),
    location TEXT,
    case_status TEXT CHECK(case_status IN ('Active', 'Monitoring', 'Neutralized', 'Resolved', 'Ongoing') OR case_status IS NULL)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_content_status ON content(status);
CREATE INDEX IF NOT EXISTS idx_content_type ON content(type);
CREATE INDEX IF NOT EXISTS idx_content_slug ON content(slug);
CREATE INDEX IF NOT EXISTS idx_content_published_at ON content(published_at);
