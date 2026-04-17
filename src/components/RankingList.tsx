"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Flame, DollarSign, Clock, Trophy } from "lucide-react";
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
    <section className="py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 flex items-center justify-center gap-2">
        <Trophy className="size-7 text-primary" />
        排行榜
      </h2>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as SortType)}
        className="max-w-3xl mx-auto"
      >
        <TabsList className="mx-auto">
          <TabsTrigger value="hot">
            <Flame className="size-4" />
            最热
          </TabsTrigger>
          <TabsTrigger value="paid">
            <DollarSign className="size-4" />
            最赚钱
          </TabsTrigger>
          <TabsTrigger value="latest">
            <Clock className="size-4" />
            最新
          </TabsTrigger>
        </TabsList>

        {["hot", "paid", "latest"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <div className="bg-bg-card rounded-xl border border-white/5 divide-y divide-white/5">
              {rankedDemands.map((demand, index) => {
                const score = getDemandScore(demand);
                const gapToPrev =
                  index > 0 ? getDemandScore(rankedDemands[index - 1]) - score : 0;

                return (
                  <Link
                    key={demand.id}
                    href={`/demand/${demand.id}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-bg-hover transition-colors group"
                  >
                    <span
                      className={`text-2xl font-bold w-10 text-center ${
                        index < 3 ? "text-primary" : "text-text-secondary"
                      }`}
                    >
                      #{index + 1}
                    </span>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium group-hover:text-primary transition-colors truncate">
                        {demand.title}
                      </h3>
                      {gapToPrev > 0 && (
                        <span className="text-xs text-text-secondary">
                          距离上一名还差 {gapToPrev} 分
                        </span>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-primary font-bold">{score}</div>
                      <div className="text-xs text-text-secondary">综合分</div>
                    </div>
                  </Link>
                );
              })}

              {rankedDemands.length === 0 && (
                <div className="px-6 py-12 text-center text-text-secondary">
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
