-- ============================================================
-- Supabase SQL Setup for Mobile Shop
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Products ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name        TEXT NOT NULL,
  price       NUMERIC(10, 2) NOT NULL DEFAULT 0,
  category    TEXT NOT NULL CHECK (category IN ('phones', 'accessories')),
  description TEXT DEFAULT '',
  image_url   TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ─── Repair Services ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS repair_services (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name            TEXT NOT NULL,
  price           NUMERIC(10, 2) NOT NULL DEFAULT 0,
  estimated_time  TEXT DEFAULT '',
  description     TEXT DEFAULT '',
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ─── Shop Config (key-value store) ────────────────────────
CREATE TABLE IF NOT EXISTS shop_config (
  id    UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key   TEXT UNIQUE NOT NULL,
  value TEXT DEFAULT ''
);

-- ─── Default Config Values ────────────────────────────────
INSERT INTO shop_config (key, value) VALUES
  ('shop_name',    'MobileHub'),
  ('tagline',      'Your Trusted Mobile Phone Specialists'),
  ('phone',        '+44 7700 900123'),
  ('whatsapp',     '447700900123'),
  ('email',        'hello@mobilehub.com'),
  ('address',      '123 High Street, London, EC1A 1BB'),
  ('accent_color', '#f97316')
ON CONFLICT (key) DO NOTHING;

-- ─── Sample Products (optional, delete if not needed) ─────
INSERT INTO products (name, price, category, description, image_url) VALUES
  ('iPhone 15 Pro Max',  1299.99, 'phones',      'Latest Apple flagship with titanium design and A17 Pro chip.', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600'),
  ('Samsung Galaxy S24',  899.99, 'phones',      'Samsung flagship with AI features and stunning AMOLED display.', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600'),
  ('Google Pixel 8',      699.99, 'phones',      'Pure Android experience with the best camera AI.', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600'),
  ('AirPods Pro 2',       249.99, 'accessories', 'Active noise cancellation with adaptive audio.', 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600'),
  ('MagSafe Charger',      39.99, 'accessories', 'Wireless magnetic charger for iPhone 12 and later.', 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=600');

-- ─── Sample Repair Services (optional) ───────────────────
INSERT INTO repair_services (name, price, estimated_time, description) VALUES
  ('iPhone Screen Replacement',  89.99, '45 min',  'Original quality LCD/OLED screen replacement for all iPhone models.'),
  ('Battery Replacement',        49.99, '30 min',  'Genuine replacement battery with full health restoration.'),
  ('Water Damage Repair',       129.99, '2–3 hrs', 'Ultrasonic cleaning and component-level board repair.'),
  ('Charging Port Repair',       59.99, '45 min',  'Fix or replace damaged USB-C / Lightning charging ports.'),
  ('Back Glass Replacement',     79.99, '1 hr',    'Laser removal and replacement of cracked back glass.');

-- ─── Row Level Security (RLS) ─────────────────────────────
-- Enable RLS on all tables
ALTER TABLE products        ENABLE ROW LEVEL SECURITY;
ALTER TABLE repair_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_config     ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read products"        ON products        FOR SELECT USING (true);
CREATE POLICY "Public read repair_services" ON repair_services FOR SELECT USING (true);
CREATE POLICY "Public read shop_config"     ON shop_config     FOR SELECT USING (true);

-- Service role (admin) full access — the service_role key bypasses RLS by default,
-- so these policies are mainly for the anon key to have read-only access.

-- ─── Storage bucket for product images ────────────────────
-- Run this if you want image uploads:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true)
-- ON CONFLICT DO NOTHING;
