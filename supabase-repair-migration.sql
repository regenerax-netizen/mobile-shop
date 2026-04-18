-- ============================================================
-- Repair Orders Migration
-- Run this in: Supabase → SQL Editor → New query → Run
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── repair_orders ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS repair_orders (
  id                    UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  shop_id               UUID REFERENCES shops(id) ON DELETE CASCADE,
  order_number          TEXT UNIQUE NOT NULL,
  status                TEXT NOT NULL DEFAULT 'pending',

  customer_name         TEXT NOT NULL,
  customer_email        TEXT NOT NULL,
  customer_phone        TEXT NOT NULL,
  customer_address      JSONB NOT NULL DEFAULT '{}'::jsonb,
  customer_approved     BOOLEAN,

  device_model_id       UUID,
  device_brand          TEXT NOT NULL DEFAULT '',
  device_name           TEXT NOT NULL,
  device_issue          TEXT,

  repair_types          TEXT[] NOT NULL DEFAULT '{}',
  pricing_mode          TEXT NOT NULL DEFAULT 'estimate',
  quoted_price          NUMERIC(10,2),
  estimated_cost        NUMERIC(10,2),
  final_cost            NUMERIC(10,2),
  shipping_fee          NUMERIC(10,2) NOT NULL DEFAULT 9.99,

  approval_token        TEXT,
  inbound_tracking      JSONB,
  outbound_tracking     JSONB,
  photos                TEXT[] NOT NULL DEFAULT '{}',
  notes                 TEXT,

  created_at            TIMESTAMPTZ DEFAULT now(),
  updated_at            TIMESTAMPTZ DEFAULT now()
);

-- ─── repair_order_events ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS repair_order_events (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id    UUID REFERENCES repair_orders(id) ON DELETE CASCADE,
  event_type  TEXT NOT NULL,
  old_value   TEXT,
  new_value   TEXT,
  metadata    JSONB DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ─── Indexes ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_repair_orders_shop_id      ON repair_orders(shop_id);
CREATE INDEX IF NOT EXISTS idx_repair_orders_order_number ON repair_orders(order_number);
CREATE INDEX IF NOT EXISTS idx_repair_orders_status       ON repair_orders(status);
CREATE INDEX IF NOT EXISTS idx_repair_order_events_order  ON repair_order_events(order_id);

-- ─── Auto-update updated_at ──────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS repair_orders_updated_at ON repair_orders;
CREATE TRIGGER repair_orders_updated_at
  BEFORE UPDATE ON repair_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── RLS: service role bypasses, anon read own order by number ─
ALTER TABLE repair_orders        ENABLE ROW LEVEL SECURITY;
ALTER TABLE repair_order_events  ENABLE ROW LEVEL SECURITY;

-- Service role (used by the app) can do everything
CREATE POLICY "service_role_all_repair_orders"
  ON repair_orders FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "service_role_all_repair_events"
  ON repair_order_events FOR ALL
  USING (auth.role() = 'service_role');

-- ─── device_models ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS device_models (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  shop_id         UUID REFERENCES shops(id) ON DELETE CASCADE,
  brand           TEXT NOT NULL,
  model_name      TEXT NOT NULL,
  model_image_url TEXT,
  sort_order      INT DEFAULT 0,
  active          BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ─── repair_prices ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS repair_prices (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  device_model_id UUID REFERENCES device_models(id) ON DELETE CASCADE,
  shop_id         UUID REFERENCES shops(id) ON DELETE CASCADE,
  repair_type     TEXT NOT NULL,
  price           NUMERIC(10,2) NOT NULL,
  estimated_time  TEXT DEFAULT '1-2 Stunden',
  active          BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_device_models_shop  ON device_models(shop_id);
CREATE INDEX IF NOT EXISTS idx_repair_prices_model ON repair_prices(device_model_id);
CREATE INDEX IF NOT EXISTS idx_repair_prices_shop  ON repair_prices(shop_id);
