-- Plans table
CREATE TABLE IF NOT EXISTS plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price_monthly INTEGER NOT NULL DEFAULT 0,
  price_yearly INTEGER NOT NULL DEFAULT 0,
  features JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default plans
INSERT INTO plans (id, name, price_monthly, price_yearly, features) VALUES
('free', 'Free', 0, 0, '{"max_links": 5, "analytics": false, "custom_themes": false, "remove_branding": false, "lead_capture": false, "multiple_cards": false, "max_cards": 1}'),
('pro', 'Pro', 149, 1199, '{"max_links": -1, "analytics": true, "custom_themes": true, "remove_branding": true, "lead_capture": true, "multiple_cards": true, "max_cards": 10}')
ON CONFLICT (id) DO NOTHING;

-- Add plan_id to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plan_id TEXT DEFAULT 'free' REFERENCES plans(id);

-- Profile scans/analytics table
CREATE TABLE IF NOT EXISTS profile_scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  scanned_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  country TEXT,
  city TEXT
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id TEXT REFERENCES plans(id),
  status TEXT DEFAULT 'active', -- active, cancelled, expired
  razorpay_subscription_id TEXT,
  razorpay_payment_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lead captures table
CREATE TABLE IF NOT EXISTS lead_captures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  phone TEXT,
  message TEXT,
  captured_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies
ALTER TABLE profile_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_captures ENABLE ROW LEVEL SECURITY;

-- Profile scans: insert by anyone (anonymous), select by profile owner
DROP POLICY IF EXISTS "Anyone can insert scans" ON profile_scans;
CREATE POLICY "Anyone can insert scans" ON profile_scans FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Profile owners can view their scans" ON profile_scans;
CREATE POLICY "Profile owners can view their scans" ON profile_scans FOR SELECT USING (profile_id = auth.uid());

-- Subscriptions: only profile owner
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (profile_id = auth.uid());

-- Lead captures: insert by anyone, select by profile owner  
DROP POLICY IF EXISTS "Anyone can submit leads" ON lead_captures;
CREATE POLICY "Anyone can submit leads" ON lead_captures FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Profile owners can view their leads" ON lead_captures;
CREATE POLICY "Profile owners can view their leads" ON lead_captures FOR SELECT USING (profile_id = auth.uid());

-- Profile shares table (for tracking share analytics)
-- Orders table for Cashfree payments
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'created',
  cashfree_order_id TEXT,
  payment_session_id TEXT,
  payment_id TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (user_id = auth.uid());

-- Add user_id to subscriptions as unique for upsert
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS cashfree_order_id TEXT;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS amount NUMERIC;

-- Ensure user_id is unique on subscriptions for upsert
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'subscriptions_user_id_key') THEN
    ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_user_id_key UNIQUE (user_id);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS profile_shares (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  shared_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profile_shares ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert shares" ON profile_shares;
CREATE POLICY "Anyone can insert shares" ON profile_shares FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Profile owners can view their shares" ON profile_shares;
CREATE POLICY "Profile owners can view their shares" ON profile_shares FOR SELECT USING (profile_id = auth.uid());
