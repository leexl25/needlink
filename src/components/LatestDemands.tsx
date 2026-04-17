import Link from "next/link";
import { Clock, ThumbsUp } from "lucide-react";
import type { Demand } from "@/types/demand";
import { getDemandScore } from "@/types/demand";

interface LatestDemandsProps {
  allDemands: Demand[];
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "刚刚";
  if (mins < 60) return `${mins} 分钟前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} 小时前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} 天前`;
  return `${Math.floor(days / 7)} 周前`;
}

export default function LatestDemands({ allDemands }: LatestDemandsProps) {
  const latest = [...allDemands]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  if (latest.length === 0) return null;

  return (
    <div className="glass-card overflow-hidden">
      <div className="px-5 py-4 border-b border-white/[0.06]">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Clock className="size-4 text-accent" />
          最新需求
        </h3>
      </div>

      <div className="divide-y divide-white/[0.04]">
        {latest.map((demand) => {
          const score = getDemandScore(demand);
          return (
            <Link
              key={demand.id}
              href={`/demand/${demand.id}`}
              className="flex items-start gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors group"
            >
              {/* 时间线圆点 */}
              <div className="mt-1.5 shrink-0">
                <div className="size-2 rounded-full bg-accent/40 group-hover:bg-accent transition-colors" />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium group-hover:text-accent transition-colors truncate">
                  {demand.title}
                </h4>
                <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
                  <span>{relativeTime(demand.created_at)}</span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="size-3" />
                    {score}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
