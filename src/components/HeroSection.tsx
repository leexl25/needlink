"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Flame, Plus } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="py-20 md:py-28 flex flex-col md:flex-row items-center gap-12">
      {/* 左侧文案 */}
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          做大家
          <span className="text-primary"> 真正想要 </span>
          的产品
        </h1>
        <p className="mt-4 text-lg md:text-xl text-text-secondary max-w-lg">
          你投票，我开发。票数最高的需求，每周上线一个。
        </p>
        <div className="mt-8 flex gap-4 justify-center md:justify-start">
          <Link href="#demands">
            <Button size="lg">
              <Flame className="size-4" />
              查看热门需求
            </Button>
          </Link>
          <Link href="/submit">
            <Button variant="outline" size="lg">
              <Plus className="size-4" />
              提一个需求
            </Button>
          </Link>
        </div>
      </div>

      {/* 右侧滚动榜 */}
      <div className="flex-1 w-full max-w-md">
        <div className="bg-bg-card rounded-xl border border-white/5 p-6">
          <h3 className="text-sm font-medium text-text-secondary mb-4">
            实时需求榜
          </h3>
          <TrendingPreview />
        </div>
      </div>
    </section>
  );
}

function TrendingPreview() {
  const items = [
    { title: "AI 自动生成周报/日报", votes: 1280 },
    { title: "录音自动转会议纪要", votes: 940 },
    { title: "PDF 批量翻译保留格式", votes: 870 },
    { title: "一句话自动生成 PPT", votes: 756 },
    { title: "AI 写简历 + 针对性优化", votes: 623 },
  ];

  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex items-center justify-between text-sm group cursor-pointer"
        >
          <span className="text-text-secondary group-hover:text-text-primary transition-colors">
            <span className="text-accent font-mono mr-2">#{i + 1}</span>
            {item.title}
          </span>
          <span className="text-primary font-medium flex items-center gap-1">
            <Flame className="size-3" />
            {item.votes}
          </span>
        </li>
      ))}
    </ul>
  );
}
