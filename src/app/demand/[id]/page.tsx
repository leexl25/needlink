import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Trophy, TrendingUp, AlertCircle, Lightbulb, Target } from "lucide-react";
import type { Demand } from "@/types/demand";
import { getDemandScore } from "@/types/demand";
import DemandDetailClient from "./DemandDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  open: { label: "投票中", variant: "default" },
  building: { label: "开发中", variant: "secondary" },
  launched: { label: "已上线", variant: "outline" },
};

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

  const status = statusConfig[demand.status] || statusConfig.open;

  return (
    <main className="py-12 max-w-3xl mx-auto">
      <a
        href="/"
        className="text-sm text-text-secondary hover:text-primary transition-colors mb-8 inline-flex items-center gap-1"
      >
        <ArrowLeft className="size-4" />
        返回首页
      </a>

      <Badge variant={status.variant} className="mb-4">
        {status.label}
      </Badge>

      <h1 className="text-3xl font-bold mb-3 leading-tight">{demand.title}</h1>

      <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary mb-8">
        {demand.submitter_name && (
          <span className="flex items-center gap-1.5">
            <User className="size-4" />
            由 @{demand.submitter_name} 发起
          </span>
        )}
        {rank > 0 && (
          <span className="flex items-center gap-1.5">
            <Trophy className="size-4" />
            当前排名 <span className="gradient-text font-bold">#{rank}</span>
          </span>
        )}
        {gapToPrev > 0 && (
          <span className="text-primary flex items-center gap-1.5">
            <TrendingUp className="size-4" />
            距离上一名还差 {gapToPrev} 分
          </span>
        )}
      </div>

      <div className="space-y-3 mb-10">
        <InfoBlock icon={<AlertCircle className="size-4 text-primary" />} label="遇到了什么问题" content={demand.problem} />
        {demand.current_solution && (
          <InfoBlock icon={<Lightbulb className="size-4 text-accent" />} label="当前的解决方案" content={demand.current_solution} />
        )}
        {demand.ideal_solution && (
          <InfoBlock icon={<Lightbulb className="size-4 text-success" />} label="期望的解决方案" content={demand.ideal_solution} />
        )}
        <InfoBlock icon={<Target className="size-4 text-primary" />} label="目标用户" content={demand.target_user} />
      </div>

      <DemandDetailClient demand={demand} rank={rank} gapToPrev={gapToPrev} />
    </main>
  );
}

function InfoBlock({ icon, label, content }: { icon: React.ReactNode; label: string; content: string }) {
  return (
    <div className="glass-card p-5">
      <h3 className="text-xs font-medium text-text-muted mb-2 flex items-center gap-2 uppercase tracking-wider">
        {icon}
        {label}
      </h3>
      <p className="text-text-primary leading-relaxed">{content}</p>
    </div>
  );
}
