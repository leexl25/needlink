"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Flame, Plus, Zap, TrendingUp } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* 背景光晕 */}
      <div className="absolute inset-0 hero-glow pointer-events-none" />
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-40" />

      <div className="relative flex flex-col md:flex-row items-center gap-12">
        {/* 左侧文案 */}
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
            <Zap className="size-3" />
            每周上线一个票数最高的需求
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
            做大家
            <span className="gradient-text"> 真正想要 </span>
            的产品
          </h1>
          <p className="mt-5 text-lg md:text-xl text-text-secondary max-w-lg leading-relaxed">
            你投票，我开发。票数最高的需求，每周上线一个。
          </p>
          <div className="mt-8 flex gap-4 justify-center md:justify-start">
            <Link href="#demands">
              <Button size="lg" className="glow-button-primary border-0">
                <Flame className="size-4" />
                查看热门需求
              </Button>
            </Link>
            <Link href="/submit">
              <Button variant="outline" size="lg" className="border-white/10 hover:border-primary/40 hover:bg-primary/5">
                <Plus className="size-4" />
                提一个需求
              </Button>
            </Link>
          </div>
        </div>

        {/* 右侧滚动榜 */}
        <div className="flex-1 w-full max-w-md">
          <div className="glass-card glow-border p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="size-2 rounded-full bg-success animate-breathe" />
              <h3 className="text-sm font-medium text-text-secondary">
                实时需求热榜
              </h3>
            </div>
            <TrendingPreview />
          </div>
        </div>
      </div>
    </section>
  );
}

function TrendingPreview() {
  const items = [
    { title: "AI 自动生成周报/日报", votes: 1280, change: "+12%" },
    { title: "录音自动转会议纪要", votes: 940, change: "+8%" },
    { title: "PDF 批量翻译保留格式", votes: 870, change: "+15%" },
    { title: "一句话自动生成 PPT", votes: 756, change: "+5%" },
    { title: "AI 写简历 + 针对性优化", votes: 623, change: "+9%" },
  ];

  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex items-center justify-between text-sm group cursor-pointer rounded-lg px-2 py-2 -mx-2 hover:bg-white/[0.03] transition-colors"
        >
          <span className="text-text-secondary group-hover:text-text-primary transition-colors flex items-center gap-3">
            <span className={`font-mono text-xs w-5 text-right ${i < 3 ? 'gradient-text font-bold' : 'text-text-muted'}`}>
              {i + 1}
            </span>
            {item.title}
          </span>
          <span className="flex items-center gap-2">
            <span className="text-xs text-success hidden group-hover:inline-flex items-center">
              <TrendingUp className="size-3" />
              {item.change}
            </span>
            <span className="text-primary font-medium flex items-center gap-1 text-xs">
              <Flame className="size-3" />
              {item.votes}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
