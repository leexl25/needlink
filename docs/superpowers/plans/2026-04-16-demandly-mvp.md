# Demandly MVP 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个需求投票平台 MVP，用户可浏览需求、投票、提交需求，开发者可展示已上线产品。

**Architecture:** Next.js 14 App Router 纯前端应用，直连 Supabase（PostgreSQL），无自建后端。深色科技风 UI。

**Tech Stack:** Next.js 14, TailwindCSS, Supabase JS SDK, TypeScript

**Design Spec:** `docs/superpowers/specs/2026-04-16-demandly-design.md`

---

## File Structure

```
needlink/
├── src/
│   ├── app/
│   │   ├── globals.css              # Tailwind + 自定义暗色样式
│   │   ├── layout.tsx               # 根布局（字体 + 元数据）
│   │   ├── page.tsx                 # 首页（5 屏结构）
│   │   ├── demand/[id]/page.tsx     # 需求详情页
│   │   └── submit/page.tsx          # 提交需求页
│   ├── components/
│   │   ├── HeroSection.tsx          # 首屏 Hero
│   │   ├── DemandCard.tsx           # 需求卡片
│   │   ├── VoteButtons.tsx          # 投票按钮（client component）
│   │   ├── ShareModal.tsx           # 分享弹窗（client component）
│   │   ├── RankingList.tsx          # 排行榜
│   │   ├── LaunchedProducts.tsx     # 已上线产品
│   │   └── SubmitForm.tsx           # 提交需求表单（client component）
│   ├── lib/
│   │   └── supabase.ts             # Supabase 客户端
│   └── types/
│       └── demand.ts               # TS 类型定义
├── supabase/
│   └── migrations/
│       └── 001_initial.sql         # 建表 + 种子数据
├── .env.local.example              # 环境变量模板
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

---

### Task 1: 项目初始化

**Files:**
- Create: `package.json` (via create-next-app)
- Create: `.env.local.example`
- Create: `tailwind.config.ts` (修改)
- Create: `src/app/globals.css` (修改)

- [ ] **Step 1: 用 create-next-app 初始化项目**

在 `needlink` 目录的**父目录**执行：

```bash
cd "F:/项目/start-business"
npx create-next-app@latest needlink --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

如果提示目录已存在，选择覆盖或删除后重新创建。

- [ ] **Step 2: 安装 Supabase SDK**

```bash
cd "F:/项目/start-business/needlink"
npm install @supabase/supabase-js
```

- [ ] **Step 3: 配置 TailwindCSS 暗色主题颜色**

修改 `tailwind.config.ts`：

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0F1115",
          card: "#1A1D23",
          hover: "#252830",
        },
        primary: {
          DEFAULT: "#6C5CE7",
          hover: "#7B6CF0",
        },
        accent: {
          DEFAULT: "#00D1FF",
          hover: "#33DAFF",
        },
        success: "#00E676",
        danger: "#FF5252",
        text: {
          primary: "#E4E4E7",
          secondary: "#9CA3AF",
        },
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 4: 设置全局样式**

替换 `src/app/globals.css` 内容：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  color-scheme: dark;
}

body {
  background-color: #0F1115;
  color: #E4E4E7;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #0F1115;
}
::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 3px;
}
```

- [ ] **Step 5: 创建环境变量模板**

创建 `.env.local.example`：

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

- [ ] **Step 6: 验证项目可运行**

```bash
cd "F:/项目/start-business/needlink"
npm run dev
```

浏览器打开 http://localhost:3000，确认 Next.js 默认页面正常显示。

- [ ] **Step 7: Commit**

```bash
git init
git add .
git commit -m "feat: 初始化 Next.js + TailwindCSS + Supabase 项目"
```

---

### Task 2: 数据库迁移 SQL

**Files:**
- Create: `supabase/migrations/001_initial.sql`

- [ ] **Step 1: 创建建表 SQL**

创建 `supabase/migrations/001_initial.sql`：

```sql
-- 需求表
CREATE TABLE demands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  problem TEXT NOT NULL,
  current_solution TEXT,
  ideal_solution TEXT,
  target_user TEXT NOT NULL,
  submitter_name TEXT,
  votes INTEGER DEFAULT 0 NOT NULL,
  paid_votes INTEGER DEFAULT 0 NOT NULL,
  status TEXT DEFAULT 'open' NOT NULL CHECK (status IN ('open', 'building', 'launched')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 投票表
CREATE TABLE votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  demand_id UUID NOT NULL REFERENCES demands(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('like', 'pay')),
  ip_address TEXT NOT NULL,
  cookie_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(demand_id, ip_address)
);

-- 已上线产品表
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  launch_url TEXT NOT NULL,
  users_count INTEGER DEFAULT 0 NOT NULL,
  demand_id UUID UNIQUE REFERENCES demands(id) ON DELETE SET NULL,
  launched_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 索引
CREATE INDEX idx_demands_status ON demands(status);
CREATE INDEX idx_demands_votes ON demands(votes DESC);
CREATE INDEX idx_demands_paid_votes ON demands(paid_votes DESC);
CREATE INDEX idx_demands_created_at ON demands(created_at DESC);
CREATE INDEX idx_votes_demand_id ON votes(demand_id);

-- 排名计算用的函数：综合得分
-- score = votes + paid_votes * 3
CREATE OR REPLACE FUNCTION demand_score(d demands) RETURNS INTEGER AS $$
BEGIN
  RETURN d.votes + d.paid_votes * 3;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- RLS 策略（公开读，写入通过 API key）
ALTER TABLE demands ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "公开读取需求" ON demands FOR SELECT USING (true);
CREATE POLICY "公开插入需求" ON demands FOR INSERT WITH CHECK (true);
CREATE POLICY "公开读取投票" ON votes FOR SELECT USING (true);
CREATE POLICY "公开插入投票" ON votes FOR INSERT WITH CHECK (true);
CREATE POLICY "公开读取产品" ON products FOR SELECT USING (true);
```

- [ ] **Step 2: 在 Supabase 控制台执行 SQL**

打开 Supabase Dashboard → SQL Editor → 粘贴上面的 SQL → Run。

- [ ] **Step 3: Commit**

```bash
git add supabase/
git commit -m "feat: 添加数据库建表 SQL (demands, votes, products)"
```

---

### Task 3: TypeScript 类型定义 + Supabase 客户端

**Files:**
- Create: `src/types/demand.ts`
- Create: `src/lib/supabase.ts`

- [ ] **Step 1: 创建类型定义文件**

创建 `src/types/demand.ts`：

```typescript
export type DemandStatus = "open" | "building" | "launched";
export type VoteType = "like" | "pay";

export interface Demand {
  id: string;
  title: string;
  problem: string;
  current_solution: string | null;
  ideal_solution: string | null;
  target_user: string;
  submitter_name: string | null;
  votes: number;
  paid_votes: number;
  status: DemandStatus;
  created_at: string;
}

export interface Vote {
  id: string;
  demand_id: string;
  type: VoteType;
  ip_address: string;
  cookie_id: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  launch_url: string;
  users_count: number;
  demand_id: string | null;
  launched_at: string;
}

export type SortType = "hot" | "paid" | "latest";

/** 综合得分：想要票数 + 愿付费票数 × 3 */
export function getDemandScore(d: Demand): number {
  return d.votes + d.paid_votes * 3;
}
```

- [ ] **Step 2: 创建 Supabase 客户端**

创建 `src/lib/supabase.ts`：

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

- [ ] **Step 3: 创建 .env.local（用户需自行填写）**

创建 `.env.local`（用户需要从 Supabase Dashboard 获取值填入）：

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

同时确保 `.gitignore` 中包含 `.env.local`。

- [ ] **Step 4: Commit**

```bash
git add src/types/ src/lib/ .env.local.example
git commit -m "feat: 添加 TypeScript 类型定义和 Supabase 客户端"
```

---

### Task 4: 全局布局

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: 编写根布局**

替换 `src/app/layout.tsx`：

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Demandly - 做大家真正想要的产品",
  description:
    "你投票，我开发。提交你的需求，票数最高的需求每周上线一个。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="bg-bg text-text-primary antialiased min-h-screen">
        <div className="max-w-6xl mx-auto px-4">{children}</div>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: 验证**

```bash
npm run dev
```

打开 http://localhost:3000，确认深色背景生效，无样式错误。

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx src/app/globals.css
git commit -m "feat: 配置全局布局（中文、深色主题、元数据）"
```

---

### Task 5: HeroSection 组件

**Files:**
- Create: `src/components/HeroSection.tsx`

- [ ] **Step 1: 编写 HeroSection**

创建 `src/components/HeroSection.tsx`：

```tsx
import Link from "next/link";

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
          <Link
            href="#demands"
            className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors"
          >
            查看热门需求
          </Link>
          <Link
            href="/submit"
            className="px-6 py-3 border border-primary text-primary hover:bg-primary/10 rounded-lg font-medium transition-colors"
          >
            提一个需求
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

/** 伪实时滚动预览 — 后续接入真实数据 */
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
          <span className="text-primary font-medium">{item.votes} 票</span>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/HeroSection.tsx
git commit -m "feat: 添加首页 Hero 区组件"
```

---

### Task 6: DemandCard + VoteButtons 组件

**Files:**
- Create: `src/components/DemandCard.tsx`
- Create: `src/components/VoteButtons.tsx`

- [ ] **Step 1: 编写 VoteButtons（Client Component）**

创建 `src/components/VoteButtons.tsx`：

```tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Demand } from "@/types/demand";

interface VoteButtonsProps {
  demand: Demand;
  compact?: boolean;
}

export default function VoteButtons({ demand, compact = false }: VoteButtonsProps) {
  const [votes, setVotes] = useState(demand.votes);
  const [paidVotes, setPaidVotes] = useState(demand.paid_votes);
  const [voted, setVoted] = useState<"like" | "pay" | null>(null);
  const [loading, setLoading] = useState(false);
  const [showShareHint, setShowShareHint] = useState(false);

  async function handleVote(type: "like" | "pay") {
    if (loading || voted) return;
    setLoading(true);

    try {
      // 获取或创建 cookie ID
      let cookieId = getCookie("demandly_cookie_id");
      if (!cookieId) {
        cookieId = crypto.randomUUID();
        document.cookie = `demandly_cookie_id=${cookieId};path=/;max-age=${60 * 60 * 24 * 365}`;
      }

      const { error } = await supabase.from("votes").insert({
        demand_id: demand.id,
        type,
        ip_address: "client", // Supabase 不直接暴露 IP，用 cookie 替代
        cookie_id: cookieId,
      });

      if (error) {
        if (error.code === "23505") {
          // 唯一约束冲突 = 已经投过票
          setVoted(type);
        }
        return;
      }

      // 更新本地状态
      if (type === "like") {
        setVotes((v) => v + 1);
      } else {
        setPaidVotes((v) => v + 1);
      }
      setVoted(type);
      setShowShareHint(true);
    } finally {
      setLoading(false);
    }
  }

  const size = compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleVote("like")}
        disabled={loading || voted !== null}
        className={`${size} rounded-lg transition-all ${
          voted === "like"
            ? "bg-primary/20 text-primary border border-primary/30"
            : "bg-bg-hover text-text-secondary hover:text-text-primary border border-transparent hover:border-white/10"
        } disabled:opacity-50`}
      >
        👍 想要 {votes}
      </button>
      <button
        onClick={() => handleVote("pay")}
        disabled={loading || voted !== null}
        className={`${size} rounded-lg transition-all ${
          voted === "pay"
            ? "bg-accent/20 text-accent border border-accent/30"
            : "bg-bg-hover text-text-secondary hover:text-text-primary border border-transparent hover:border-white/10"
        } disabled:opacity-50`}
      >
        💰 愿付费 {paidVotes}
      </button>
      {showShareHint && (
        <span className="text-xs text-primary animate-pulse">已投票！分享让更多人看到</span>
      )}
    </div>
  );
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}
```

- [ ] **Step 2: 编写 DemandCard**

创建 `src/components/DemandCard.tsx`：

```tsx
import Link from "next/link";
import type { Demand } from "@/types/demand";
import VoteButtons from "./VoteButtons";

interface DemandCardProps {
  demand: Demand;
}

const statusLabels: Record<string, { text: string; color: string }> = {
  open: { text: "投票中", color: "bg-primary/20 text-primary" },
  building: { text: "开发中", color: "bg-accent/20 text-accent" },
  launched: { text: "已上线", color: "bg-success/20 text-success" },
};

export default function DemandCard({ demand }: DemandCardProps) {
  const statusInfo = statusLabels[demand.status] || statusLabels.open;

  return (
    <Link href={`/demand/${demand.id}`}>
      <div className="bg-bg-card rounded-xl border border-white/5 p-5 hover:scale-[1.02] hover:border-primary/20 transition-all cursor-pointer group">
        {/* 状态标签 */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${statusInfo.color}`}
          >
            {statusInfo.text}
          </span>
          {demand.submitter_name && (
            <span className="text-xs text-text-secondary">
              由 @{demand.submitter_name} 发起
            </span>
          )}
        </div>

        {/* 标题 */}
        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors mb-2">
          {demand.title}
        </h3>

        {/* 问题描述 */}
        <p className="text-sm text-text-secondary line-clamp-2 mb-4">
          {demand.problem}
        </p>

        {/* 目标用户 */}
        <div className="text-xs text-text-secondary mb-4">
          🎯 目标用户：{demand.target_user}
        </div>

        {/* 投票按钮 */}
        <div onClick={(e) => e.preventDefault()}>
          <VoteButtons demand={demand} />
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/DemandCard.tsx src/components/VoteButtons.tsx
git commit -m "feat: 添加需求卡片和投票按钮组件"
```

---

### Task 7: RankingList 组件

**Files:**
- Create: `src/components/RankingList.tsx`

- [ ] **Step 1: 编写 RankingList**

创建 `src/components/RankingList.tsx`：

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/RankingList.tsx
git commit -m "feat: 添加排行榜组件（Tab 切换 + 综合得分）"
```

---

### Task 8: LaunchedProducts 组件

**Files:**
- Create: `src/components/LaunchedProducts.tsx`

- [ ] **Step 1: 编写 LaunchedProducts**

创建 `src/components/LaunchedProducts.tsx`：

```tsx
import { supabase } from "@/lib/supabase";
import type { Product } from "@/types/demand";

export default async function LaunchedProducts() {
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("launched_at", { ascending: false })
    .limit(6);

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
        🚀 已上线产品
      </h2>
      <p className="text-text-secondary text-center mb-8">
        这些都是投票选出的需求，已经开发完成
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(products as Product[]).map((product) => {
          const daysSinceLaunch = Math.floor(
            (Date.now() - new Date(product.launched_at).getTime()) /
              (1000 * 60 * 60 * 24)
          );

          return (
            <div
              key={product.id}
              className="bg-bg-card rounded-xl border border-white/5 p-5 flex flex-col"
            >
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-sm text-text-secondary mb-4 flex-1">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">
                  已上线 {daysSinceLaunch} 天 · {product.users_count} 人在用
                </span>
                <a
                  href={product.launch_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-accent hover:underline"
                >
                  立即使用 →
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/LaunchedProducts.tsx
git commit -m "feat: 添加已上线产品展示组件"
```

---

### Task 9: ShareModal 组件

**Files:**
- Create: `src/components/ShareModal.tsx`

- [ ] **Step 1: 编写 ShareModal**

创建 `src/components/ShareModal.tsx`：

```tsx
"use client";

import { useState } from "react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  demandTitle: string;
  rank: number;
  gapToNext: number;
  demandId: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  demandTitle,
  rank,
  gapToNext,
  demandId,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/demand/${demandId}`
      : "";
  const shareText = `我发起的需求正在冲榜！🔥 ${demandTitle}，当前排名 #${rank}，帮我顶上去！`;

  async function copyLink() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function shareToTwitter() {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-bg-card rounded-xl border border-white/10 p-6 max-w-sm w-full mx-4">
        <h3 className="text-lg font-bold mb-2">🎉 投票成功！</h3>
        <p className="text-text-secondary text-sm mb-4">
          「{demandTitle}」当前排名 #{rank}
        </p>

        {gapToNext > 0 && (
          <div className="bg-primary/10 rounded-lg px-4 py-3 mb-4 text-sm">
            <span className="text-primary font-medium">
              再获得 {gapToNext} 票就会被开发
            </span>
          </div>
        )}

        <p className="text-sm text-text-secondary mb-4">
          分享给朋友，让更多人投票！
        </p>

        <div className="flex gap-3">
          <button
            onClick={copyLink}
            className="flex-1 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors"
          >
            {copied ? "已复制！" : "复制链接"}
          </button>
          <button
            onClick={shareToTwitter}
            className="flex-1 px-4 py-2 bg-bg-hover border border-white/10 rounded-lg text-sm font-medium hover:border-primary/30 transition-colors"
          >
            分享到 Twitter
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full text-center text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          关闭
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ShareModal.tsx
git commit -m "feat: 添加分享弹窗组件（裂变核心）"
```

---

### Task 10: 首页组装

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: 编写首页**

替换 `src/app/page.tsx`：

```tsx
import HeroSection from "@/components/HeroSection";
import DemandCard from "@/components/DemandCard";
import RankingList from "@/components/RankingList";
import LaunchedProducts from "@/components/LaunchedProducts";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function HomePage() {
  const { data: demands } = await supabase
    .from("demands")
    .select("*")
    .order("votes", { ascending: false })
    .limit(9);

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
          {(demands || []).map((demand) => (
            <DemandCard key={demand.id} demand={demand} />
          ))}
        </div>

        {(!demands || demands.length === 0) && (
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
```

- [ ] **Step 2: 验证首页完整渲染**

```bash
npm run dev
```

打开 http://localhost:3000，确认：
- Hero 区显示正常
- 热门需求区显示（暂无数据时显示空状态）
- 排行榜 Tab 可切换
- CTA 按钮可点击

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: 组装首页（Hero + 热门需求 + 排行榜 + 已上线 + CTA）"
```

---

### Task 11: 需求详情页

**Files:**
- Create: `src/app/demand/[id]/page.tsx`

- [ ] **Step 1: 编写需求详情页**

创建 `src/app/demand/[id]/page.tsx`：

```tsx
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import type { Demand } from "@/types/demand";
import { getDemandScore } from "@/types/demand";
import DemandDetailClient from "./DemandDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DemandDetailPage({ params }: Props) {
  const { id } = await params;

  const { data: demand } = await supabase
    .from("demands")
    .select("*")
    .eq("id", id)
    .single();

  if (!demand) {
    notFound();
  }

  // 获取排名
  const { data: allDemands } = await supabase
    .from("demands")
    .select("id, votes, paid_votes");

  let rank = 0;
  let gapToPrev = 0;
  if (allDemands) {
    const sorted = (allDemands as Demand[]).sort(
      (a, b) => getDemandScore(b) - getDemandScore(a)
    );
    rank = sorted.findIndex((d) => d.id === id) + 1;
    if (rank > 1) {
      gapToPrev = getDemandScore(sorted[rank - 2]) - getDemandScore(demand);
    }
  }

  const statusLabels: Record<string, { text: string; color: string }> = {
    open: { text: "投票中", color: "bg-primary/20 text-primary" },
    building: { text: "开发中", color: "bg-accent/20 text-accent" },
    launched: { text: "已上线", color: "bg-success/20 text-success" },
  };
  const statusInfo = statusLabels[demand.status] || statusLabels.open;

  return (
    <main className="py-12 max-w-3xl mx-auto">
      {/* 返回首页 */}
      <a
        href="/"
        className="text-sm text-text-secondary hover:text-text-primary mb-6 inline-block"
      >
        ← 返回首页
      </a>

      {/* 状态 */}
      <span
        className={`inline-block text-xs px-2 py-0.5 rounded-full mb-4 ${statusInfo.color}`}
      >
        {statusInfo.text}
      </span>

      {/* 标题 */}
      <h1 className="text-3xl font-bold mb-2">{demand.title}</h1>

      {/* 发起人 + 排名 */}
      <div className="flex items-center gap-4 text-sm text-text-secondary mb-8">
        {demand.submitter_name && <span>由 @{demand.submitter_name} 发起</span>}
        <span>当前排名 #{rank}</span>
        {gapToPrev > 0 && (
          <span className="text-primary">距离上一名还差 {gapToPrev} 分</span>
        )}
      </div>

      {/* 结构化描述 */}
      <div className="space-y-6 mb-10">
        <InfoBlock label="遇到了什么问题" content={demand.problem} />
        {demand.current_solution && (
          <InfoBlock
            label="当前的解决方案"
            content={demand.current_solution}
          />
        )}
        {demand.ideal_solution && (
          <InfoBlock label="期望的解决方案" content={demand.ideal_solution} />
        )}
        <InfoBlock label="目标用户" content={demand.target_user} />
      </div>

      {/* 投票 + 分享（客户端组件） */}
      <DemandDetailClient demand={demand} rank={rank} />
    </main>
  );
}

function InfoBlock({
  label,
  content,
}: {
  label: string;
  content: string;
}) {
  return (
    <div className="bg-bg-card rounded-xl border border-white/5 p-5">
      <h3 className="text-sm font-medium text-text-secondary mb-2">
        {label}
      </h3>
      <p className="text-text-primary">{content}</p>
    </div>
  );
}
```

- [ ] **Step 2: 创建详情页客户端组件**

创建 `src/app/demand/[id]/DemandDetailClient.tsx`：

```tsx
"use client";

import { useState } from "react";
import type { Demand } from "@/types/demand";
import VoteButtons from "@/components/VoteButtons";
import ShareModal from "@/components/ShareModal";

interface Props {
  demand: Demand;
  rank: number;
}

export default function DemandDetailClient({ demand, rank }: Props) {
  const [showShare, setShowShare] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <VoteButtons demand={demand} />
        <button
          onClick={() => setShowShare(true)}
          className="px-4 py-2 bg-bg-hover border border-white/10 rounded-lg text-sm hover:border-primary/30 transition-colors"
        >
          分享
        </button>
      </div>

      <ShareModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        demandTitle={demand.title}
        rank={rank}
        gapToNext={50}
        demandId={demand.id}
      />
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/demand/
git commit -m "feat: 添加需求详情页（结构化描述 + 投票 + 分享）"
```

---

### Task 12: 提交需求页

**Files:**
- Create: `src/app/submit/page.tsx`
- Create: `src/components/SubmitForm.tsx`

- [ ] **Step 1: 编写 SubmitForm（Client Component）**

创建 `src/components/SubmitForm.tsx`：

```tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const ROLES = ["上班族", "自媒体", "学生", "开发者", "电商卖家", "设计师", "其他"];

export default function SubmitForm() {
  const [form, setForm] = useState({
    title: "",
    problem: "",
    current_solution: "",
    ideal_solution: "",
    target_user: "",
    submitter_name: "",
    custom_role: "",
  });
  const [selectedRole, setSelectedRole] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleRoleSelect(role: string) {
    setSelectedRole(role);
    setForm((f) => ({ ...f, target_user: role === "其他" ? "" : role }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.problem || !form.target_user) return;

    setSubmitting(true);
    try {
      const targetUser =
        selectedRole === "其他" ? form.custom_role : form.target_user;

      const { error } = await supabase.from("demands").insert({
        title: form.title,
        problem: form.problem,
        current_solution: form.current_solution || null,
        ideal_solution: form.ideal_solution || null,
        target_user: targetUser,
        submitter_name: form.submitter_name || null,
      });

      if (!error) {
        setSubmitted(true);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2">需求已提交！</h2>
        <p className="text-text-secondary mb-8">
          审核通过后会在首页展示，请关注排行榜。
        </p>
        <a
          href="/"
          className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors inline-block"
        >
          返回首页
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {/* 你是谁 */}
      <div>
        <label className="block text-sm font-medium mb-2">
          你是谁（角色）<span className="text-danger">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {ROLES.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => handleRoleSelect(role)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                selectedRole === role
                  ? "bg-primary text-white"
                  : "bg-bg-card text-text-secondary hover:bg-bg-hover"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
        {selectedRole === "其他" && (
          <input
            type="text"
            value={form.custom_role}
            onChange={(e) =>
              setForm((f) => ({ ...f, custom_role: e.target.value, target_user: e.target.value }))
            }
            placeholder="请描述你的角色"
            className="mt-2 w-full px-4 py-2 bg-bg-card border border-white/10 rounded-lg text-sm focus:border-primary focus:outline-none"
          />
        )}
      </div>

      {/* 需求标题 */}
      <div>
        <label className="block text-sm font-medium mb-2">
          需求标题 <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          required
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="一句话描述你想要的产品"
          className="w-full px-4 py-2 bg-bg-card border border-white/10 rounded-lg text-sm focus:border-primary focus:outline-none"
        />
      </div>

      {/* 问题描述 */}
      <div>
        <label className="block text-sm font-medium mb-2">
          你遇到了什么问题 <span className="text-danger">*</span>
        </label>
        <textarea
          required
          minLength={20}
          rows={3}
          value={form.problem}
          onChange={(e) => setForm((f) => ({ ...f, problem: e.target.value }))}
          placeholder="具体描述你遇到的痛点场景（至少20字）"
          className="w-full px-4 py-2 bg-bg-card border border-white/10 rounded-lg text-sm focus:border-primary focus:outline-none resize-none"
        />
      </div>

      {/* 当前方案 */}
      <div>
        <label className="block text-sm font-medium mb-2">
          你现在怎么解决的（选填）
        </label>
        <textarea
          rows={2}
          value={form.current_solution}
          onChange={(e) =>
            setForm((f) => ({ ...f, current_solution: e.target.value }))
          }
          placeholder="你目前是怎么处理这个问题的"
          className="w-full px-4 py-2 bg-bg-card border border-white/10 rounded-lg text-sm focus:border-primary focus:outline-none resize-none"
        />
      </div>

      {/* 理想方案 */}
      <div>
        <label className="block text-sm font-medium mb-2">
          你希望怎么解决（选填）
        </label>
        <textarea
          rows={2}
          value={form.ideal_solution}
          onChange={(e) =>
            setForm((f) => ({ ...f, ideal_solution: e.target.value }))
          }
          placeholder="如果有工具能解决，你希望它是什么样的"
          className="w-full px-4 py-2 bg-bg-card border border-white/10 rounded-lg text-sm focus:border-primary focus:outline-none resize-none"
        />
      </div>

      {/* 昵称 */}
      <div>
        <label className="block text-sm font-medium mb-2">
          你的昵称（选填，会显示为发起人）
        </label>
        <input
          type="text"
          value={form.submitter_name}
          onChange={(e) =>
            setForm((f) => ({ ...f, submitter_name: e.target.value }))
          }
          placeholder="不填则匿名"
          className="w-full px-4 py-2 bg-bg-card border border-white/10 rounded-lg text-sm focus:border-primary focus:outline-none"
        />
      </div>

      {/* 提交按钮 */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors disabled:opacity-50"
      >
        {submitting ? "提交中..." : "提交需求"}
      </button>
    </form>
  );
}
```

- [ ] **Step 2: 创建提交页面**

创建 `src/app/submit/page.tsx`：

```tsx
import SubmitForm from "@/components/SubmitForm";

export const metadata = {
  title: "提交需求 - Demandly",
};

export default function SubmitPage() {
  return (
    <main className="py-12">
      <a
        href="/"
        className="text-sm text-text-secondary hover:text-text-primary mb-6 inline-block"
      >
        ← 返回首页
      </a>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">写下你的需求</h1>
        <p className="text-text-secondary">
          也许下一个爆款产品就是它
        </p>
      </div>

      <SubmitForm />
    </main>
  );
}
```

- [ ] **Step 3: 验证提交页面**

```bash
npm run dev
```

打开 http://localhost:3000/submit，确认表单显示正常，角色选择可点击。

- [ ] **Step 4: Commit**

```bash
git add src/app/submit/ src/components/SubmitForm.tsx
git commit -m "feat: 添加提交需求页（结构化表单 + 角色选择）"
```

---

### Task 13: 种子数据 SQL

**Files:**
- Create: `supabase/migrations/002_seed_data.sql`

- [ ] **Step 1: 编写种子数据**

创建 `supabase/migrations/002_seed_data.sql`：

```sql
-- 10 个高质量种子需求
INSERT INTO demands (title, problem, target_user, votes, paid_votes, submitter_name) VALUES
  ('AI 自动生成周报/日报', '每周最痛苦的事情就是写周报，明明干了很多活但写不出来，写出来的又不够正式', '上班族', 1280, 312, '职场小白'),
  ('录音自动转会议纪要 + 待办', '开会多、记录烦，重点容易遗漏，会后整理纪要太耗时间', '团队协作', 940, 245, '项目经理阿伟'),
  ('PDF 批量翻译保留格式', '学术和工作 PDF 翻译很痛苦，复制粘贴后格式全乱，手动重新排版浪费时间', '学生', 870, 198, '留学生小王'),
  ('一句话自动生成 PPT', '做 PPT 太耗时间了，找模板、排版、配图，经常花半天就为了汇报 10 分钟', '上班族', 756, 167, '社畜小李'),
  ('AI 写简历 + 针对性优化', '不会写简历，投了很多都石沉大海，不知道怎么针对不同岗位优化', '求职者', 623, 143, '应届生小陈'),
  ('批量处理图片（压缩/裁剪/水印）', '做自媒体每天要处理大量图片，工具零散，一个个处理太慢', '自媒体', 542, 89, '博主阿花'),
  ('自动剪辑视频（去废话 + 加字幕）', '剪视频太耗时间，尤其是去废话和加字幕，一条视频要剪好几个小时', '短视频创作者', 498, 134, '抖音达人'),
  ('AI 帮你回复消息', '不知道怎么回复老板的消息，有时候想了半天才憋出一句，社交恐惧太痛苦', '年轻用户', 387, 56, '社恐患者'),
  ('消费自动记账 + 智能分析', '记账坚持不下来，也不知道钱都花哪了，月底一看余额就焦虑', '所有人', 345, 78, '月光族小张'),
  ('AI 总结合同/条款重点 + 风险提示', '看不懂合同和法律条款，租房、签合同容易踩坑，请律师又太贵', '租房族', 312, 156, '北漂小刘');
```

- [ ] **Step 2: 在 Supabase SQL Editor 中执行此 SQL**

- [ ] **Step 3: 刷新首页验证数据加载**

打开 http://localhost:3000，确认 10 条种子需求在首页和排行榜中正确显示。

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/002_seed_data.sql
git commit -m "feat: 添加 10 条种子需求数据"
```

---

### Task 14: 全流程验证 + 修复

**Files:** 无新文件，可能修复现有文件

- [ ] **Step 1: 验证首页全流程**

```bash
npm run dev
```

打开 http://localhost:3000，检查：
1. Hero 区文案和按钮正常
2. 热门需求卡片列表显示种子数据
3. 排行榜三个 Tab 切换正常
4. CTA 区按钮可跳转

- [ ] **Step 2: 验证投票功能**

点击任意需求卡片的「👍 想要」按钮：
- 按钮状态变化
- 票数 +1
- 已投票提示出现

- [ ] **Step 3: 验证需求详情页**

点击需求卡片进入详情页：
- 结构化描述正确显示
- 返回首页链接正常
- 投票 + 分享按钮可用

- [ ] **Step 4: 验证提交需求页**

打开 http://localhost:3000/submit：
- 角色选择可点击
- 表单验证（必填项）
- 提交后显示成功提示

- [ ] **Step 5: 修复发现的问题**

根据验证结果修复任何 bug。

- [ ] **Step 6: 最终 Commit**

```bash
git add -A
git commit -m "fix: 全流程验证修复"
```

---

### Task 15: 构建验证 + 收尾

**Files:** 可能修改配置文件

- [ ] **Step 1: 运行生产构建**

```bash
npm run build
```

确保无编译错误。

- [ ] **Step 2: 如有构建错误，逐一修复**

常见问题：
- Server Component 中误用 `"use client"` 的模块（如 useState）
- 异步 params 需要 `await`（Next.js 15）
- Supabase 环境变量缺失时的构建报错

- [ ] **Step 3: 最终 Commit**

```bash
git add -A
git commit -m "chore: 构建验证通过，MVP 完成"
```
