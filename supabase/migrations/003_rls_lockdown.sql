-- RLS 收紧：保护管理操作
-- 公开用户只能 INSERT demands 和 votes，不能 UPDATE/DELETE

-- 1. 收紧 demands: 去掉公开 UPDATE（仅 service role 可改）
DROP POLICY IF EXISTS "demands 公开可写" ON demands;

CREATE POLICY "demands 公开可读" ON demands
  FOR SELECT USING (true);

CREATE POLICY "demands 公开可提交" ON demands
  FOR INSERT WITH CHECK (true);

-- UPDATE 和 DELETE 仅通过 service role（绕过 RLS）

-- 2. votes: 保持公开 INSERT（投票），不允许 UPDATE/DELETE
-- 当前已有，无需改动

-- 3. products: 仅 service role 可操作（已在 001 中设置，无需改动）
