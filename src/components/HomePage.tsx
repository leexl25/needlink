"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getDemandScore } from "@/types/demand";
import type { Demand, Product } from "@/types/demand";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Flame } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import DemandCard from "@/components/DemandCard";
import RankingList from "@/components/RankingList";
import LaunchedProducts from "@/components/LaunchedProducts";

export default function HomePage() {
  const [demands, setDemands] = useState<Demand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const initialFetchDone = useRef(false);

  // 初始加载：只跑一次
  useEffect(() => {
    if (initialFetchDone.current) return;
    initialFetchDone.current = true;

    async function load() {
      const [demandsRes, productsRes] = await Promise.all([
        supabase.from("demands").select("*").limit(50),
        supabase.from("products").select("*").order("launched_at", { ascending: false }).limit(6),
      ]);
      if (demandsRes.data) setDemands(demandsRes.data as Demand[]);
      if (productsRes.data) setProducts(productsRes.data as Product[]);
      setLoading(false);
    }
    load();
  }, []);

  // 投票后刷新：不触发 loading 状态
  const refresh = useCallback(async () => {
    const [demandsRes, productsRes] = await Promise.all([
      supabase.from("demands").select("*").limit(50),
      supabase.from("products").select("*").order("launched_at", { ascending: false }).limit(6),
    ]);
    if (demandsRes.data) setDemands(demandsRes.data as Demand[]);
    if (productsRes.data) setProducts(productsRes.data as Product[]);
  }, []);

  // 首页展示：按综合分排序取前 9
  const topDemands = [...demands]
    .sort((a, b) => getDemandScore(b) - getDemandScore(a))
    .slice(0, 9);

  return (
    <main>
      <HeroSection />

      {/* 分隔线 */}
      <div className="section-divider" />

      {/* 热门需求 */}
      <section id="demands" className="py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Flame className="size-7 gradient-text" style={{ WebkitTextFillColor: 'unset', color: '#6C5CE7' }} />
            今日最热需求
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
              <Card key={i} className="bg-bg-card">
                <CardHeader>
                  <Skeleton className="h-5 w-16 mb-2" />
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : topDemands.length === 0 ? (
          <div className="text-center py-20 text-text-secondary">
            <p className="text-lg mb-4">还没有需求</p>
            <Link href="/submit" className="text-primary hover:underline">
              提交第一个需求 →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topDemands.map((demand) => (
              <DemandCard key={demand.id} demand={demand} onVoted={refresh} />
            ))}
          </div>
        )}
      </section>

      <div className="section-divider" />
      <RankingList allDemands={demands} />

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
