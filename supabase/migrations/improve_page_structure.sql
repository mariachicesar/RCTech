-- Migration to improve page structure
-- Date: 2025-09-01

-- Add new columns to existing page table
ALTER TABLE page 
ADD COLUMN IF NOT EXISTS page_type VARCHAR(50) DEFAULT 'custom',
ADD COLUMN IF NOT EXISTS parent_id INTEGER REFERENCES page(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_main_nav BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS template_type VARCHAR(50) DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS meta_keywords TEXT,
ADD COLUMN IF NOT EXISTS featured_image_url TEXT,
ADD COLUMN IF NOT EXISTS excerpt TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Create page categories table (skip if exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'page_category') THEN
    CREATE TABLE page_category (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      description TEXT,
      parent_id INTEGER REFERENCES page_category(id) ON DELETE CASCADE,
      sort_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      website_id INTEGER REFERENCES website(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  END IF;
END $$;

-- Create page_category junction table (skip if exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'page_page_category') THEN
    CREATE TABLE page_page_category (
      id SERIAL PRIMARY KEY,
      page_id INTEGER REFERENCES page(id) ON DELETE CASCADE,
      category_id INTEGER REFERENCES page_category(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(page_id, category_id)
    );
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_page_type ON page(page_type);
CREATE INDEX IF NOT EXISTS idx_page_parent ON page(parent_id);
CREATE INDEX IF NOT EXISTS idx_page_website_published ON page(website_id, is_published);
CREATE INDEX IF NOT EXISTS idx_page_main_nav ON page(is_main_nav);
CREATE INDEX IF NOT EXISTS idx_page_category_website ON page_category(website_id);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for page table
DROP TRIGGER IF EXISTS update_page_updated_at ON page;
CREATE TRIGGER update_page_updated_at
  BEFORE UPDATE ON page
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for page_category table
DROP TRIGGER IF EXISTS update_page_category_updated_at ON page_category;
CREATE TRIGGER update_page_category_updated_at
  BEFORE UPDATE ON page_category
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default page categories for new websites (only if they don't exist)
INSERT INTO page_category (name, slug, description, website_id, sort_order) 
SELECT 
  'Services', 'services', 'Business services and offerings', w.id, 1
FROM website w 
WHERE NOT EXISTS (
  SELECT 1 FROM page_category pc 
  WHERE pc.website_id = w.id AND pc.slug = 'services'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO page_category (name, slug, description, website_id, sort_order) 
SELECT 
  'Blog', 'blog', 'Blog posts and articles', w.id, 2
FROM website w 
WHERE NOT EXISTS (
  SELECT 1 FROM page_category pc 
  WHERE pc.website_id = w.id AND pc.slug = 'blog'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO page_category (name, slug, description, website_id, sort_order) 
SELECT 
  'Gallery', 'gallery', 'Photo galleries and portfolios', w.id, 3
FROM website w 
WHERE NOT EXISTS (
  SELECT 1 FROM page_category pc 
  WHERE pc.website_id = w.id AND pc.slug = 'gallery'
)
ON CONFLICT (slug) DO NOTHING;

-- Update existing pages to use new structure
-- Set default page_type based on current type field
UPDATE page SET 
  page_type = CASE 
    WHEN type = 'service' THEN 'service'
    WHEN type = 'blog' THEN 'blog-post'
    WHEN type = 'gallery' THEN 'gallery'
    WHEN type = 'main' THEN 'main-page'
    ELSE 'custom'
  END,
  template_type = CASE 
    WHEN type = 'service' THEN 'service'
    WHEN type = 'blog' THEN 'blog-post'
    WHEN type = 'gallery' THEN 'gallery'
    ELSE 'standard'
  END,
  is_published = true,
  is_main_nav = CASE 
    WHEN type = 'main' THEN true
    WHEN slug IN ('home', 'about', 'contact', 'services') THEN true
    ELSE false
  END
WHERE page_type IS NULL OR page_type = 'custom';
