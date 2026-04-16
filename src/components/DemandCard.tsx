"use client";

import Link from "next/link";
import type { Demand } from "@/types/demand";
import VoteButtons from "./VoteButtons";

interface DemandCardProps {
  demand: Demand;
}

const statusLabels: Record<string, { text: string; color: string }> = {
  open: { text: "投票中", color: "bg-primary/20 text-primary" },
  building: { text: "开发中", color: "bg-accent/20 text-accent" },
  launched: { text: "已上线", color: "bg-success/20 text-success" },
};

export default function DemandCard({ demand }: DemandCardProps) {
  const statusInfo = statusLabels[demand.status] || statusLabels.open;

  return (
    <Link href={`/demand/${demand.id}`}>
      <div className="bg-bg-card rounded-xl border border-white/5 p-5 hover:scale-[1.02] hover:border-primary/20 transition-all cursor-pointer group">
        {/* 状态标签 */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${statusInfo.color}`}
          >
            {statusInfo.text}
          </span>
          {demand.submitter_name && (
            <span className="text-xs text-text-secondary">
              由 @{demand.submitter_name} 发起
            </span>
          )}
        </div>

        {/* 标题 */}
        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors mb-2">
          {demand.title}
        </h3>

        {/* 问题描述 */}
        <p className="text-sm text-text-secondary line-clamp-2 mb-4">
          {demand.problem}
        </p>

        {/* 目标用户 */}
        <div className="text-xs text-text-secondary mb-4">
          🎯 目标用户：{demand.target_user}
        </div>

        {/* 投票按钮 */}
        <div onClick={(e) => e.preventDefault()}>
          <VoteButtons demand={demand} />
        </div>
      </div>
    </Link>
  );
}
