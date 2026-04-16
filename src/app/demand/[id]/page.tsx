import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import type { Demand } from "@/types/demand";
import { getDemandScore } from "@/types/demand";
import DemandDetailClient from "./DemandDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DemandDetailPage({ params }: Props) {
  const { id } = await params;

  let demand: Demand | null = null;
  let allDemands: Demand[] = [];

  try {
    const { data } = await supabase
      .from("demands")
      .select("*")
      .eq("id", id)
      .single();
    demand = data as Demand | null;

    if (demand) {
      const { data: all } = await supabase
        .from("demands")
        .select("id, votes, paid_votes");
      allDemands = (all as Demand[]) || [];
    }
  } catch {
    notFound();
  }

  if (!demand) {
    notFound();
  }

  let rank = 0;
  let gapToPrev = 0;
  if (allDemands.length > 0) {
    const sorted = allDemands.sort(
      (a, b) => getDemandScore(b) - getDemandScore(a)
    );
    rank = sorted.findIndex((d) => d.id === id) + 1;
    if (rank > 1) {
      gapToPrev = getDemandScore(sorted[rank - 2]) - getDemandScore(demand);
    }
  }

  const statusLabels: Record<string, { text: string; color: string }> = {
    open: { text: "投票中", color: "bg-primary/20 text-primary" },
    building: { text: "开发中", color: "bg-accent/20 text-accent" },
    launched: { text: "已上线", color: "bg-success/20 text-success" },
  };
  const statusInfo = statusLabels[demand.status] || statusLabels.open;

  return (
    <main className="py-12 max-w-3xl mx-auto">
      <a
        href="/"
        className="text-sm text-text-secondary hover:text-text-primary mb-6 inline-block"
      >
        ← 返回首页
      </a>

      <span
        className={`inline-block text-xs px-2 py-0.5 rounded-full mb-4 ${statusInfo.color}`}
      >
        {statusInfo.text}
      </span>

      <h1 className="text-3xl font-bold mb-2">{demand.title}</h1>

      <div className="flex items-center gap-4 text-sm text-text-secondary mb-8">
        {demand.submitter_name && <span>由 @{demand.submitter_name} 发起</span>}
        {rank > 0 && <span>当前排名 #{rank}</span>}
        {gapToPrev > 0 && (
          <span className="text-primary">距离上一名还差 {gapToPrev} 分</span>
        )}
      </div>

      <div className="space-y-6 mb-10">
        <InfoBlock label="遇到了什么问题" content={demand.problem} />
        {demand.current_solution && (
          <InfoBlock label="当前的解决方案" content={demand.current_solution} />
        )}
        {demand.ideal_solution && (
          <InfoBlock label="期望的解决方案" content={demand.ideal_solution} />
        )}
        <InfoBlock label="目标用户" content={demand.target_user} />
      </div>

      <DemandDetailClient demand={demand} rank={rank} />
    </main>
  );
}

function InfoBlock({ label, content }: { label: string; content: string }) {
  return (
    <div className="bg-bg-card rounded-xl border border-white/5 p-5">
      <h3 className="text-sm font-medium text-text-secondary mb-2">{label}</h3>
      <p className="text-text-primary">{content}</p>
    </div>
  );
}
