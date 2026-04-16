import HeroSection from "@/components/HeroSection";
import DemandCard from "@/components/DemandCard";
import RankingList from "@/components/RankingList";
import LaunchedProducts from "@/components/LaunchedProducts";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function HomePage() {
  let demands = [];

  try {
    const { data } = await supabase
      .from("demands")
      .select("*")
      .order("votes", { ascending: false })
      .limit(9);
    demands = data || [];
  } catch {
    // Supabase 未配置时使用空数据
  }

  return (
    <main>
      {/* 第一屏：Hero */}
      <HeroSection />

      {/* 第二屏：热门需求 */}
      <section id="demands" className="py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">🔥 今日最热需求</h2>
          <Link
            href="/submit"
            className="text-sm text-primary hover:underline"
          >
            + 提交需求
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {demands.map((demand: any) => (
            <DemandCard key={demand.id} demand={demand} />
          ))}
        </div>

        {demands.length === 0 && (
          <div className="text-center py-20 text-text-secondary">
            <p className="text-lg mb-4">还没有需求</p>
            <Link
              href="/submit"
              className="text-primary hover:underline"
            >
              提交第一个需求 →
            </Link>
          </div>
        )}
      </section>

      {/* 第三屏：排行榜 */}
      <RankingList />

      {/* 第四屏：已上线产品 */}
      <LaunchedProducts />

      {/* 第五屏：CTA */}
      <section className="py-20 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          没找到你想要的？
        </h2>
        <p className="text-text-secondary mb-8">
          写下你的需求，也许下一个爆款就是它
        </p>
        <Link
          href="/submit"
          className="px-8 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors inline-block"
        >
          提交需求
        </Link>
        <div className="mt-6 text-sm text-text-secondary">
          每周开发票数最高的需求
        </div>
      </section>
    </main>
  );
}
