"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getDemandScore } from "@/types/demand";
import type { Demand, Product } from "@/types/demand";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus, Flame } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import StatsBar from "@/components/StatsBar";
import FeaturedDemand from "@/components/FeaturedDemand";
import DemandCard from "@/components/DemandCard";
import RankingList from "@/components/RankingList";
import LatestDemands from "@/components/LatestDemands";
import LaunchedProducts from "@/components/LaunchedProducts";

export default function HomePage() {
  const [demands, setDemands] = useState<Demand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const initialFetchDone = useRef(false);

  useEffect(() => {
    if (initialFetchDone.current) return;
    initialFetchDone.current = true;

    async function load() {
      try {
        const [demandsRes, productsRes] = await Promise.all([
          supabase.from("demands").select("*").limit(50),
          supabase.from("products").select("*").order("launched_at", { ascending: false }).limit(6),
        ]);
        if (demandsRes.data) setDemands(demandsRes.data as Demand[]);
        if (productsRes.data) setProducts(productsRes.data as Product[]);
        setLoading(false);
      } catch {
        setLoading(false);
        setError(true);
      }
    }
    load();
  }, []);

  const refresh = useCallback(async () => {
    try {
      const [demandsRes, productsRes] = await Promise.all([
        supabase.from("demands").select("*").limit(50),
        supabase.from("products").select("*").order("launched_at", { ascending: false }).limit(6),
      ]);
      if (demandsRes.data) setDemands(demandsRes.data as Demand[]);
      if (productsRes.data) setProducts(productsRes.data as Product[]);
      setError(false);
    } catch {
      setError(true);
    }
  }, []);

  const sortedDemands = [...demands].sort((a, b) => getDemandScore(b) - getDemandScore(a));
  const topDemand = sortedDemands[0] || null;
  const restDemands = sortedDemands.slice(1, 9);

  return (
    <main>
      {error && (
        <div className="text-center py-4">
          <p className="text-text-secondary text-sm mb-2">数据加载失败</p>
          <Button variant="outline" size="sm" onClick={refresh}>
            重新加载
          </Button>
        </div>
      )}
      <HeroSection demands={demands} />

      {/* 统计条 */}
      <StatsBar demands={demands} products={products} />

      {/* 冠军需求 */}
      {loading ? (
        <section className="py-10">
          <div className="glass-card p-6 md:p-8">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-8 w-3/4 mb-3" />
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-5 w-2/3 mb-4" />
            <div className="flex gap-3">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
        </section>
      ) : topDemand ? (
        <FeaturedDemand demand={topDemand} onVoted={refresh} />
      ) : null}

      <div className="section-divider" />

      {/* 热门需求 Bento Grid */}
      <section id="demands" className="py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <Flame className="size-6 gradient-text" style={{ WebkitTextFillColor: 'unset', color: '#6C5CE7' }} />
            热门需求
          </h2>
          <Link href="/submit">
            <Button variant="outline" size="sm" className="border-white/10 hover:border-primary/40 hover:bg-primary/5">
              <Plus className="size-4" />
              提交需求
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card p-5">
                <Skeleton className="h-4 w-16 mb-3" />
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : restDemands.length === 0 && !topDemand ? (
          <div className="text-center py-16 text-text-secondary">
            <p className="text-lg mb-4">还没有需求</p>
            <Link href="/submit" className="gradient-text hover:underline font-medium">
              提交第一个需求 →
            </Link>
          </div>
        ) : (
          /* Bento Grid: 大小卡混合 */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {restDemands.map((demand, index) => {
              const isLarge = index === 0 || index === 5;
              return (
                <div key={demand.id} className={isLarge ? "md:col-span-2" : ""}>
                  <DemandCard demand={demand} onVoted={refresh} />
                </div>
              );
            })}
          </div>
        )}
      </section>

      <div className="section-divider" />

      {/* 双栏：排行榜 + 最新需求 */}
      <section className="py-12">
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-bold">排行榜</h2>
          <p className="text-sm text-text-muted mt-1">实时票数排名，你的投票决定开发优先级</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0">
            <RankingList allDemands={demands} />
          </div>
          <div className="lg:w-80 xl:w-96 shrink-0">
            <LatestDemands allDemands={demands} />
          </div>
        </div>
      </section>

      <div className="section-divider" />

      <LaunchedProducts products={products} />

      <div className="section-divider" />

      {/* CTA */}
      <section className="py-20 text-center relative">
        <div className="absolute inset-0 hero-glow pointer-events-none opacity-50" />
        <div className="relative">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            没找到你想要的？
          </h2>
          <p className="text-text-secondary mb-8">
            写下你的需求，也许下一个爆款就是它
          </p>
          <Link href="/submit">
            <Button size="lg" className="glow-button-primary border-0">
              提交需求
            </Button>
          </Link>
          <div className="mt-6 text-sm text-text-muted">
            每周开发票数最高的需求
          </div>
        </div>
      </section>
    </main>
  );
}
