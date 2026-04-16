export type DemandStatus = "open" | "building" | "launched";
export type VoteType = "like" | "pay";

export interface Demand {
  id: string;
  title: string;
  problem: string;
  current_solution: string | null;
  ideal_solution: string | null;
  target_user: string;
  submitter_name: string | null;
  votes: number;
  paid_votes: number;
  status: DemandStatus;
  created_at: string;
}

export interface Vote {
  id: string;
  demand_id: string;
  type: VoteType;
  ip_address: string;
  cookie_id: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  launch_url: string;
  users_count: number;
  demand_id: string | null;
  launched_at: string;
}

export type SortType = "hot" | "paid" | "latest";

/** 综合得分：想要票数 + 愿付费票数 × 3 */
export function getDemandScore(d: Demand): number {
  return d.votes + d.paid_votes * 3;
}
