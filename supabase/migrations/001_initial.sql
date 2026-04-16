-- 需求表
CREATE TABLE demands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  problem TEXT NOT NULL,
  current_solution TEXT,
  ideal_solution TEXT,
  target_user TEXT NOT NULL,
  submitter_name TEXT,
  votes INTEGER DEFAULT 0 NOT NULL,
  paid_votes INTEGER DEFAULT 0 NOT NULL,
  status TEXT DEFAULT 'open' NOT NULL CHECK (status IN ('open', 'building', 'launched')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 投票表
CREATE TABLE votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  demand_id UUID NOT NULL REFERENCES demands(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('like', 'pay')),
  ip_address TEXT NOT NULL,
  cookie_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(demand_id, ip_address)
);

-- 已上线产品表
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  launch_url TEXT NOT NULL,
  users_count INTEGER DEFAULT 0 NOT NULL,
  demand_id UUID UNIQUE REFERENCES demands(id) ON DELETE SET NULL,
  launched_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 索引
CREATE INDEX idx_demands_status ON demands(status);
CREATE INDEX idx_demands_votes ON demands(votes DESC);
CREATE INDEX idx_demands_paid_votes ON demands(paid_votes DESC);
CREATE INDEX idx_demands_created_at ON demands(created_at DESC);
CREATE INDEX idx_votes_demand_id ON votes(demand_id);

-- RLS 策略（公开读写，适合 MVP）
ALTER TABLE demands ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "公开读取需求" ON demands FOR SELECT USING (true);
CREATE POLICY "公开插入需求" ON demands FOR INSERT WITH CHECK (true);
CREATE POLICY "公开更新需求" ON demands FOR UPDATE USING (true);
CREATE POLICY "公开读取投票" ON votes FOR SELECT USING (true);
CREATE POLICY "公开插入投票" ON votes FOR INSERT WITH CHECK (true);
CREATE POLICY "公开读取产品" ON products FOR SELECT USING (true);
