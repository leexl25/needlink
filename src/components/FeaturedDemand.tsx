"use client";

import Link from "next/link";
import { Crown, User, Target } from "lucide-react";
import type { Demand } from "@/types/demand";
import { getDemandScore } from "@/types/demand";
import VoteButtons from "./VoteButtons";

interface FeaturedDemandProps {
  demand: Demand;
  onVoted?: () => void;
}

export default function FeaturedDemand({ demand, onVoted }: FeaturedDemandProps) {
  const score = getDemandScore(demand);

  return (
    <section className="py-10">
      <div className="relative">
        {/* 背景光晕 */}
        <div className="absolute -inset-4 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-3xl blur-2xl pointer-events-none" />

        <div className="relative glass-card glow-border p-6 md:p-8">
          {/* 标签 */}
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
              <Crown className="size-3.5" />
              当前榜首
            </span>
            <span className="text-sm text-text-muted">
              综合分 <span className="gradient-text font-bold text-base">{score}</span>
            </span>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
            {/* 左侧信息 */}
            <div className="flex-1 min-w-0">
              <Link href={`/demand/${demand.id}`}>
                <h2 className="text-xl md:text-2xl font-bold mb-3 hover:text-primary transition-colors leading-snug">
                  {demand.title}
                </h2>
              </Link>

              <p className="text-text-secondary leading-relaxed mb-4 line-clamp-3">
                {demand.problem}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
                {demand.submitter_name && (
                  <span className="flex items-center gap-1.5">
                    <User className="size-3.5" />
                    @{demand.submitter_name}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Target className="size-3.5" />
                  {demand.target_user}
                </span>
              </div>
            </div>

            {/* 右侧投票 */}
            <div className="shrink-0 lg:border-l lg:border-white/[0.06] lg:pl-8 flex lg:flex-col items-center lg:items-start gap-3">
              <div className="text-xs text-text-muted uppercase tracking-wider mb-1 hidden lg:block">投票支持</div>
              <VoteButtons demand={demand} onVoted={onVoted} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
