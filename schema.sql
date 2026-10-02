-- ==============================================================================
-- Sahayak Database Schema & Row-Level Security (RLS)
-- "Your Inventory Assistant, Just a Message Away"
-- ==============================================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  shop_name TEXT NOT NULL,
  phone TEXT,
  preferred_language TEXT DEFAULT 'hi-IN',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  sku TEXT,
  quantity INTEGER NOT NULL DEFAULT 0,
  minimum_stock INTEGER NOT NULL DEFAULT 5,
  unit TEXT NOT NULL DEFAULT 'packets',
  cost_price NUMERIC(10, 2) DEFAULT 0,
  selling_price NUMERIC(10, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_user_profile FOREIGN KEY (user_id) REFERENCES profiles(user_id) ON DELETE CASCADE
);

-- 3. Inventory Transactions Table
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  product_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('stock_in', 'stock_out', 'adjustment', 'undo')),
  quantity INTEGER NOT NULL,
  previous_quantity INTEGER,
  new_quantity INTEGER,
  source_message TEXT,
  source_type TEXT DEFAULT 'voice_or_text',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_trans_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 4. Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  raw_text TEXT NOT NULL,
  parsed_intent JSONB,
  confidence NUMERIC(3, 2) DEFAULT 0.95,
  status TEXT DEFAULT 'processed' CHECK (status IN ('pending', 'confirmed', 'rejected', 'processed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Alerts Table
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  product_id UUID NOT NULL,
  type TEXT NOT NULL DEFAULT 'low_stock' CHECK (type IN ('low_stock', 'out_of_stock', 'restock_suggestion')),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_alert_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_products_user ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON inventory_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_product ON inventory_transactions(product_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user_unread ON alerts(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_messages_user ON messages(user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Ensures store owners only access their own inventory data
-- ==============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view and update only their own profile
CREATE POLICY "Users can manage own profile"
  ON profiles FOR ALL
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- Products: Users can CRUD only their own products
CREATE POLICY "Users can manage own products"
  ON products FOR ALL
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- Transactions: Users can access and record only their own transactions
CREATE POLICY "Users can manage own transactions"
  ON inventory_transactions FOR ALL
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- Messages: Users can access only their own NLP messages
CREATE POLICY "Users can manage own messages"
  ON messages FOR ALL
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- Alerts: Users can view and update only their own store alerts
CREATE POLICY "Users can manage own alerts"
  ON alerts FOR ALL
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);
