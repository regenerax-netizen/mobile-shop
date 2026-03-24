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

-- Drop first so this script is safe to re-run
DROP POLICY IF EXISTS "Public read shops"   ON shops;
DROP POLICY IF EXISTS "Public read reviews" ON reviews;

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

-- ─── 7b. SAMPLE PRODUCTS ────────────────────────────────
INSERT INTO products (shop_id, name, price, category, description, image_url, active) VALUES
  ((SELECT id FROM shops WHERE slug = 'mobilehub'), 'iPhone 15 Pro Max', 1299, 'phones', 'Das neueste Apple-Flaggschiff mit Titan-Design, A17 Pro Chip und 48 MP Kamera. USB-C, Action-Button, Titangehäuse — die beste iPhone-Generation.', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80', true),
  ((SELECT id FROM shops WHERE slug = 'mobilehub'), 'Samsung Galaxy S24 Ultra', 1199, 'phones', 'Samsungs Premium-Smartphone mit integriertem S Pen, 200 MP Kamera, Snapdragon 8 Gen 3 und brillantem AMOLED-Display.', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80', true),
  ((SELECT id FROM shops WHERE slug = 'mobilehub'), 'iPhone 14 – Generalüberholt', 699, 'phones', 'Leistungsstarkes iPhone mit A15 Bionic, fortschrittlichem Dual-Kamera-System und ganztägiger Akkulaufzeit. Geprüfte Qualität, 12 Monate Garantie.', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80', true),
  ((SELECT id FROM shops WHERE slug = 'mobilehub'), 'Samsung Galaxy A54', 349, 'phones', 'Samsungs beliebtes Mittelklasse-Smartphone mit AMOLED-Display, Triple-Kamera und wassergeschütztem Gehäuse. Perfekt für jeden Alltag.', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80', true),
  ((SELECT id FROM shops WHERE slug = 'mobilehub'), 'Apple AirPods Pro 2', 249, 'accessories', 'Premium In-Ear-Kopfhörer mit aktiver Geräuschunterdrückung, adaptiver Transparenz und personalisiertem 3D-Audio.', 'https://images.unsplash.com/photo-1588423771073-b8903fdes564?w=800&q=80', true),
  ((SELECT id FROM shops WHERE slug = 'mobilehub'), 'Schutzglas & Hülle Bundle', 29, 'accessories', '2-teiliges Rundum-Schutzset: 9H Panzerglas + stoßfeste Silikonhülle. Verfügbar für alle gängigen Modelle. Perfekte Passform garantiert.', 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80', true)
ON CONFLICT DO NOTHING;

-- ─── 7c. SAMPLE REPAIRS ─────────────────────────────────
INSERT INTO repair_services (shop_id, name, price, estimated_time, description, active) VALUES
  ((SELECT id FROM shops WHERE slug = 'mobilehub'), 'Display-Reparatur', 89, '30–60 Min', 'Professioneller Austausch von gebrochenen oder beschädigten Displays für alle gängigen Smartphone-Modelle. Original-Qualität garantiert.', true),
  ((SELECT id FROM shops WHERE slug = 'mobilehub'), 'Akku-Austausch', 59, '20–40 Min', 'Neuer Akku für mehr Laufzeit. Wir verwenden hochwertige Ersatzakkus mit voller Kapazität und 6 Monate Garantie.', true),
  ((SELECT id FROM shops WHERE slug = 'mobilehub'), 'Wasserschaden-Behandlung', 79, '2–24 Std', 'Spezialreinigung und Trocknung bei Wasserschäden. Schnelles Handeln erhöht die Erfolgschancen erheblich.', true),
  ((SELECT id FROM shops WHERE slug = 'mobilehub'), 'Ladeanschluss-Reparatur', 69, '30–60 Min', 'Reparatur oder Austausch defekter Ladebuchsen (USB-C / Lightning). Wieder zuverlässig und schnell laden.', true),
  ((SELECT id FROM shops WHERE slug = 'mobilehub'), 'Rückglas-Austausch', 99, '45–90 Min', 'Professioneller Austausch des rückseitigen Glases bei iPhone und Samsung Galaxy Modellen. Wie neu.', true),
  ((SELECT id FROM shops WHERE slug = 'mobilehub'), 'Kamera-Reparatur', 89, '30–60 Min', 'Austausch defekter Front- oder Rückkameras. Scharfe Fotos und Videos wie am ersten Tag.', true)
ON CONFLICT DO NOTHING;

-- ─── 8. PHASE 9 — New columns for hero_images, secondary_color, partner_services
ALTER TABLE shops ADD COLUMN IF NOT EXISTS hero_images        JSONB DEFAULT '[]'::jsonb;
ALTER TABLE shops ADD COLUMN IF NOT EXISTS secondary_color    TEXT DEFAULT '';
ALTER TABLE shops ADD COLUMN IF NOT EXISTS partner_services   JSONB DEFAULT '[]'::jsonb;
ALTER TABLE shops ADD COLUMN IF NOT EXISTS partner_logos      JSONB DEFAULT '{}'::jsonb;

-- Backfill sample shop
UPDATE shops SET
  hero_images = '["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1920&auto=format&fit=crop","https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=1920&auto=format&fit=crop","https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=1920&auto=format&fit=crop","https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1920&auto=format&fit=crop","https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?q=80&w=1920&auto=format&fit=crop"]'::jsonb,
  secondary_color = '#1e3a5f',
  partner_services = '["Lyca Mobile","Ortel Mobile","Lebara","MoneyGram"]'::jsonb
WHERE slug = 'mobilehub';

-- Fix English tagline → German
UPDATE shops SET tagline = 'Ihr zuverlässiger Handy-Spezialist vor Ort'
WHERE slug = 'mobilehub' AND (tagline = 'Your Trusted Mobile Phone Specialists' OR tagline = '');

-- Sample reviews (German)
INSERT INTO reviews (shop_id, reviewer_name, review_text, rating) VALUES
  ((SELECT id FROM shops WHERE slug = 'mobilehub'), 'Sarah M.', 'Toller Service! Mein Display wurde in unter einer Stunde ausgetauscht. Faire Preise und super freundliches Personal.', 5),
  ((SELECT id FROM shops WHERE slug = 'mobilehub'), 'Thomas K.', 'Habe hier ein generalüberholtes iPhone gekauft — funktioniert wie neu. Sehr zu empfehlen!', 5),
  ((SELECT id FROM shops WHERE slug = 'mobilehub'), 'Priya D.', 'Bester Handyladen der Stadt. Schneller Entsperrservice und tolle Beratung beim Handykauf. Fünf Sterne!', 5),
  ((SELECT id FROM shops WHERE slug = 'mobilehub'), 'Lukas W.', 'Schnelle Akku-Reparatur zu einem fairen Preis. Funktioniert wieder einwandfrei. Kann ich nur weiterempfehlen!', 5),
  ((SELECT id FROM shops WHERE slug = 'mobilehub'), 'Maria G.', 'Habe mein altes Samsung hier verkauft und direkt ein neues bekommen. Sehr faire Ankaufspreise und tolle Beratung.', 4),
  ((SELECT id FROM shops WHERE slug = 'mobilehub'), 'Ahmed R.', 'Mein Handy hatte einen Wasserschaden und ich dachte, es sei verloren. Die haben es tatsächlich gerettet! Profis!', 5),
  ((SELECT id FROM shops WHERE slug = 'mobilehub'), 'Julia S.', 'Beste Anlaufstelle für Handyzubehör. Große Auswahl, gute Qualität und faire Preise. Komme immer wieder.', 4),
  ((SELECT id FROM shops WHERE slug = 'mobilehub'), 'Max B.', 'Ladeanschluss kaputt — innerhalb von 45 Minuten repariert. Super schnell und zuverlässig. Vielen Dank!', 5),
  ((SELECT id FROM shops WHERE slug = 'mobilehub'), 'Fatima H.', 'Sehr freundliches Team, das sich wirklich Zeit für die Beratung nimmt. Fühle mich als Kundin gut aufgehoben.', 5)
ON CONFLICT DO NOTHING;

-- ─── 9. SUPABASE STORAGE — public bucket for shop hero images ───────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'shop-images',
  'shop-images',
  true,
  10485760,
  ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif','image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read of shop-images
DROP POLICY IF EXISTS "Public read shop-images" ON storage.objects;
CREATE POLICY "Public read shop-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'shop-images');

