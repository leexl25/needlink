-- 1. 投票触发器：插入 votes 时自动更新 demands 计数
CREATE OR REPLACE FUNCTION update_demand_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type = 'like' THEN
    UPDATE demands SET votes = votes + 1 WHERE id = NEW.demand_id;
  ELSIF NEW.type = 'pay' THEN
    UPDATE demands SET paid_votes = paid_votes + 1 WHERE id = NEW.demand_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_vote_insert ON votes;
CREATE TRIGGER trg_vote_insert
  AFTER INSERT ON votes
  FOR EACH ROW EXECUTE FUNCTION update_demand_vote_count();

-- 2. 回修：将已有 votes 统计回写到 demands
UPDATE demands d SET
  votes = COALESCE((SELECT COUNT(*) FROM votes v WHERE v.demand_id = d.id AND v.type = 'like'), 0),
  paid_votes = COALESCE((SELECT COUNT(*) FROM votes v WHERE v.demand_id = d.id AND v.type = 'pay'), 0);
