"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Flame, DollarSign, Clock, TrendingUp } from "lucide-react";
import type { Demand, SortType } from "@/types/demand";
import { getDemandScore } from "@/types/demand";

interface RankingListProps {
  allDemands: Demand[];
}

export default function RankingList({ allDemands }: RankingListProps) {
  const [activeTab, setActiveTab] = useState<SortType>("hot");

  const rankedDemands = useMemo(() => {
    const sorted = [...allDemands];

    switch (activeTab) {
      case "hot":
        sorted.sort((a, b) => getDemandScore(b) - getDemandScore(a));
        break;
      case "paid":
        sorted.sort((a, b) => b.paid_votes - a.paid_votes);
        break;
      case "latest":
        sorted.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
    }

    return sorted.slice(0, 10);
  }, [allDemands, activeTab]);

  return (
    <Tabs
      value={activeTab}
      onValueChange={(v) => setActiveTab(v as SortType)}
    >
      <TabsList className="bg-white/[0.04] border border-white/[0.06]">
        <TabsTrigger value="hot" className="data-[state=active]:bg-primary/15 data-[state=active]:text-primary">
          <Flame className="size-4" />
          最热
        </TabsTrigger>
        <TabsTrigger value="paid" className="data-[state=active]:bg-accent/15 data-[state=active]:text-accent">
          <DollarSign className="size-4" />
          最赚钱
        </TabsTrigger>
        <TabsTrigger value="latest" className="data-[state=active]:bg-success/15 data-[state=active]:text-success">
          <Clock className="size-4" />
          最新
        </TabsTrigger>
      </TabsList>

      {["hot", "paid", "latest"].map((tab) => (
        <TabsContent key={tab} value={tab}>
          <div className="glass-card overflow-hidden mt-4">
            {rankedDemands.map((demand, index) => {
              const score = getDemandScore(demand);
              const gapToPrev =
                index > 0 ? getDemandScore(rankedDemands[index - 1]) - score : 0;

              return (
                <Link
                  key={demand.id}
                  href={`/demand/${demand.id}`}
                  className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.03] transition-colors group border-b border-white/[0.04] last:border-b-0"
                >
                  {/* 排名 */}
                  <span
                    className={`text-lg font-bold w-7 text-center tabular-nums shrink-0 ${
                      index < 3 ? "gradient-text" : "text-text-muted"
                    }`}
                  >
                    {index + 1}
                  </span>

                  {/* 内容 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium group-hover:text-primary transition-colors truncate text-sm">
                      {demand.title}
                    </h3>
                    {gapToPrev > 0 && (
                      <span className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                        <TrendingUp className="size-3" />
                        差 {gapToPrev} 分
                      </span>
                    )}
                  </div>

                  {/* 分数 */}
                  <div className="text-right shrink-0">
                    <span className={`text-sm font-bold tabular-nums ${index < 3 ? "gradient-text" : "text-text-primary"}`}>
                      {score}
                    </span>
                  </div>
                </Link>
              );
            })}

            {rankedDemands.length === 0 && (
              <div className="px-4 py-10 text-center text-text-secondary text-sm">
                暂无需求
              </div>
            )}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
