"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Demand, SortType } from "@/types/demand";
import { getDemandScore } from "@/types/demand";

const tabs: { key: SortType; label: string }[] = [
  { key: "hot", label: "🔥 最热" },
  { key: "paid", label: "💰 最赚钱" },
  { key: "latest", label: "🆕 最新" },
];

export default function RankingList() {
  const [activeTab, setActiveTab] = useState<SortType>("hot");
  const [demands, setDemands] = useState<Demand[]>([]);

  useEffect(() => {
    fetchDemands(activeTab);
  }, [activeTab]);

  async function fetchDemands(sort: SortType) {
    let query = supabase.from("demands").select("*");

    switch (sort) {
      case "hot":
        query = query.order("votes", { ascending: false });
        break;
      case "paid":
        query = query.order("paid_votes", { ascending: false });
        break;
      case "latest":
        query = query.order("created_at", { ascending: false });
        break;
    }

    const { data } = await query.limit(10);
    if (data) setDemands(data as Demand[]);
  }

  return (
    <section className="py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
        排行榜
      </h2>

      {/* Tab 切换 */}
      <div className="flex justify-center gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-primary text-white"
                : "bg-bg-card text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 榜单 */}
      <div className="bg-bg-card rounded-xl border border-white/5 divide-y divide-white/5">
        {demands.map((demand, index) => {
          const score = getDemandScore(demand);
          const gapToPrev =
            index > 0 ? getDemandScore(demands[index - 1]) - score : 0;

          return (
            <Link
              key={demand.id}
              href={`/demand/${demand.id}`}
              className="flex items-center gap-4 px-6 py-4 hover:bg-bg-hover transition-colors group"
            >
              {/* 排名 */}
              <span
                className={`text-2xl font-bold w-10 text-center ${
                  index < 3 ? "text-primary" : "text-text-secondary"
                }`}
              >
                #{index + 1}
              </span>

              {/* 内容 */}
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

              {/* 分数 */}
              <div className="text-right shrink-0">
                <div className="text-primary font-bold">{score}</div>
                <div className="text-xs text-text-secondary">综合分</div>
              </div>
            </Link>
          );
        })}

        {demands.length === 0 && (
          <div className="px-6 py-12 text-center text-text-secondary">
            暂无需求，快来提交第一个吧！
          </div>
        )}
      </div>
    </section>
  );
}
