"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, User } from "lucide-react";
import type { Demand } from "@/types/demand";
import VoteButtons from "./VoteButtons";

interface DemandCardProps {
  demand: Demand;
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  open: { label: "投票中", variant: "default" },
  building: { label: "开发中", variant: "secondary" },
  launched: { label: "已上线", variant: "outline" },
};

export default function DemandCard({ demand }: DemandCardProps) {
  const status = statusConfig[demand.status] || statusConfig.open;

  return (
    <Link href={`/demand/${demand.id}`}>
      <Card className="hover:scale-[1.02] hover:border-primary/20 transition-all cursor-pointer group bg-bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant={status.variant}>{status.label}</Badge>
            {demand.submitter_name && (
              <span className="text-xs text-text-secondary flex items-center gap-1">
                <User className="size-3" />
                @{demand.submitter_name}
              </span>
            )}
          </div>
          <CardTitle className="group-hover:text-primary transition-colors">
            {demand.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-text-secondary line-clamp-2">
            {demand.problem}
          </p>
          <div className="text-xs text-text-secondary flex items-center gap-1">
            <Target className="size-3" />
            目标用户：{demand.target_user}
          </div>
          <div onClick={(e) => e.preventDefault()}>
            <VoteButtons demand={demand} compact />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
