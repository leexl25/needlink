"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Target, User } from "lucide-react";
import type { Demand } from "@/types/demand";
import VoteButtons from "./VoteButtons";

interface DemandCardProps {
  demand: Demand;
  onVoted?: () => void;
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; color: string }> = {
  open: { label: "投票中", variant: "default", color: "text-primary" },
  building: { label: "开发中", variant: "secondary", color: "text-accent" },
  launched: { label: "已上线", variant: "outline", color: "text-success" },
};

export default function DemandCard({ demand, onVoted }: DemandCardProps) {
  const status = statusConfig[demand.status] || statusConfig.open;

  return (
    <Link href={`/demand/${demand.id}`}>
      <div className="glass-card glow-border p-5 h-full flex flex-col cursor-pointer group hover:-translate-y-1">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-3">
          <Badge variant={status.variant} className="text-[11px]">
            {status.label}
          </Badge>
          {demand.submitter_name && (
            <span className="text-xs text-text-muted flex items-center gap-1">
              <User className="size-3" />
              @{demand.submitter_name}
            </span>
          )}
        </div>

        {/* 标题 */}
        <h3 className="font-semibold text-base mb-2 group-hover:text-primary transition-colors leading-snug">
          {demand.title}
        </h3>

        {/* 问题描述 */}
        <p className="text-sm text-text-secondary line-clamp-2 mb-3 flex-1 leading-relaxed">
          {demand.problem}
        </p>

        {/* 目标用户 */}
        <div className="text-xs text-text-muted flex items-center gap-1 mb-4">
          <Target className="size-3" />
          {demand.target_user}
        </div>

        {/* 投票按钮 */}
        <div onClick={(e) => e.preventDefault()}>
          <VoteButtons demand={demand} compact onVoted={onVoted} />
        </div>
      </div>
    </Link>
  );
}
