-- ============================================================
-- Supabase Multi-Tenant Migration
-- Run this AFTER the initial supabase-setup.sql
-- ============================================================

-- Enable UUID generation (if not already)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── 1. SHOPS TABLE ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS shops (
  id                UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name              TEXT NOT NULL,
  slug              TEXT UNIQUE NOT NULL,
  tagline           TEXT DEFAULT '',
  phone             TEXT DEFAULT '',
  whatsapp          TEXT DEFAULT '',
  email             TEXT DEFAULT '',
  address           TEXT DEFAULT '',
  google_maps_embed_url TEXT DEFAULT '',
  logo_url          TEXT DEFAULT '',
  hero_image_url    TEXT DEFAULT '',
  accent_color      TEXT DEFAULT '#f97316',
  opening_hours     JSONB DEFAULT '[]'::jsonb,
  services          JSONB DEFAULT '[]'::jsonb,
  active            BOOLEAN DEFAULT true,
  created_at        TIMESTAMPTZ DEFAULT now()
);

-- ─── 2. ADD shop_id TO products ───────────────────────────
ALTER TABLE products ADD COLUMN IF NOT EXISTS shop_id UUID REFERENCES shops(id) ON DELETE CASCADE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- ─── 3. ADD shop_id TO repair_services ────────────────────
ALTER TABLE repair_services ADD COLUMN IF NOT EXISTS shop_id UUID REFERENCES shops(id) ON DELETE CASCADE;
ALTER TABLE repair_services ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- ─── 4. REVIEWS TABLE ────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  shop_id         UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  reviewer_name   TEXT NOT NULL,
  review_text     TEXT NOT NULL,
  rating          INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ─── 5. INDEXES ──────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_shops_slug ON shops(slug);
CREATE INDEX IF NOT EXISTS idx_products_shop_id ON products(shop_id);
CREATE INDEX IF NOT EXISTS idx_repair_services_shop_id ON repair_services(shop_id);
CREATE INDEX IF NOT EXISTS idx_reviews_shop_id ON reviews(shop_id);

-- ─── 6. ROW LEVEL SECURITY ──────────────────────────────
ALTER TABLE shops   ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read shops"   ON shops   FOR SELECT USING (true);
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (true);

-- ─── 7. SAMPLE DATA ─────────────────────────────────────
INSERT INTO shops (name, slug, tagline, phone, whatsapp, email, address, google_maps_embed_url, hero_image_url, accent_color, opening_hours, services) VALUES
(
  'MobileHub',
  'mobilehub',
  'Your Trusted Mobile Phone Specialists',
  '+44 7700 900123',
  '447700900123',
  'hello@mobilehub.com',
  '123 High Street, London, EC1A 1BB',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.542339!2d-0.0877321!3d51.5074!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTHCsDMwJzI2LjYiTiAwwrAwNScxNS44Ilc!5e0!3m2!1sen!2suk!4v1700000000000',
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1920&auto=format&fit=crop',
  '#f97316',
  '[{"day":"Monday","hours":"9:00 AM – 6:00 PM"},{"day":"Tuesday","hours":"9:00 AM – 6:00 PM"},{"day":"Wednesday","hours":"9:00 AM – 6:00 PM"},{"day":"Thursday","hours":"9:00 AM – 7:00 PM"},{"day":"Friday","hours":"9:00 AM – 7:00 PM"},{"day":"Saturday","hours":"10:00 AM – 5:00 PM"},{"day":"Sunday","hours":"Closed"}]',
  '[{"title":"Phone Repair","icon":"wrench"},{"title":"Phone Sales","icon":"smartphone"},{"title":"Accessories","icon":"headphones"},{"title":"SIM Cards & Unlocking","icon":"sim"}]'
)
ON CONFLICT (slug) DO NOTHING;

-- Link existing products and repairs to the sample shop
UPDATE products SET shop_id = (SELECT id FROM shops WHERE slug = 'mobilehub') WHERE shop_id IS NULL;
UPDATE repair_services SET shop_id = (SELECT id FROM shops WHERE slug = 'mobilehub') WHERE shop_id IS NULL;

-- Sample reviews
INSERT INTO reviews (shop_id, reviewer_name, review_text, rating) VALUES
  ((SELECT id FROM shops WHERE slug = 'mobilehub'), 'Sarah M.', 'Brilliant service! Had my screen replaced in under an hour. Prices are very fair and the staff are super friendly.', 5),
  ((SELECT id FROM shops WHERE slug = 'mobilehub'), 'James K.', 'Bought a refurbished iPhone here — works like new. They even threw in a free case. Highly recommend!', 5),
  ((SELECT id FROM shops WHERE slug = 'mobilehub'), 'Priya D.', 'Best phone shop in town. Quick unlocking service and great advice on which phone to buy. Five stars!', 5);
