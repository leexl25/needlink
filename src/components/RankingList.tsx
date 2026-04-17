"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Flame, DollarSign, Clock, Trophy, TrendingUp } from "lucide-react";
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
    <section className="py-16 relative">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center gap-2 mb-3">
          <Trophy className="size-6 gradient-text" style={{ WebkitTextFillColor: 'unset', color: '#6C5CE7' }} />
          <h2 className="text-2xl md:text-3xl font-bold">排行榜</h2>
        </div>
        <p className="text-text-secondary text-sm">实时票数排名，你的投票决定开发优先级</p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as SortType)}
        className="max-w-3xl mx-auto"
      >
        <TabsList className="mx-auto bg-white/[0.04] border border-white/[0.06]">
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
            <div className="glass-card overflow-hidden">
              {rankedDemands.map((demand, index) => {
                const score = getDemandScore(demand);
                const gapToPrev =
                  index > 0 ? getDemandScore(rankedDemands[index - 1]) - score : 0;

                return (
                  <Link
                    key={demand.id}
                    href={`/demand/${demand.id}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.03] transition-colors group border-b border-white/[0.04] last:border-b-0"
                  >
                    {/* 排名 */}
                    <span
                      className={`text-2xl font-bold w-10 text-center tabular-nums ${
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
                          距上一名还差 {gapToPrev} 分
                        </span>
                      )}
                    </div>

                    {/* 分数 */}
                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold tabular-nums">
                        <span className={index < 3 ? "gradient-text" : "text-text-primary"}>
                          {score}
                        </span>
                      </div>
                      <div className="text-[10px] text-text-muted">综合分</div>
                    </div>
                  </Link>
                );
              })}

              {rankedDemands.length === 0 && (
                <div className="px-6 py-12 text-center text-text-secondary text-sm">
                  暂无需求，快来提交第一个吧！
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
