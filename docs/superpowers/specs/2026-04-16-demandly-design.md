# Demandly - 需求投票平台设计文档

## 产品概述

用户提交痛点需求，社区投票筛选，开发者将最高票需求快速开发成产品上线。

**核心理念：** 用真实需求驱动产品开发，避免闭门造车。

## 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端 | Next.js 14 (App Router) | React 框架，SSR/SSG 支持 |
| 样式 | TailwindCSS | 快速出 UI |
| 数据库 | Supabase (PostgreSQL) | 托管数据库 + RESTful API |
| 部署 | Vercel | 前端自动部署 |

**架构：** 纯前端应用，Next.js 直接调用 Supabase SDK，无需自建后端。

## 项目结构

```
needlink/
├── src/
│   ├── app/
│   │   ├── layout.tsx            # 全局布局（深色主题）
│   │   ├── page.tsx              # 首页（5 屏结构）
│   │   ├── demand/[id]/page.tsx  # 需求详情页
│   │   └── submit/page.tsx       # 提交需求页
│   ├── components/
│   │   ├── HeroSection.tsx       # 首页 Hero 区
│   │   ├── DemandCard.tsx        # 需求卡片
│   │   ├── RankingList.tsx       # 排行榜（Tab 切换）
│   │   ├── VoteButtons.tsx       # 投票按钮组
│   │   ├── ShareModal.tsx        # 分享弹窗（裂变）
│   │   ├── LaunchedProducts.tsx  # 已上线产品
│   │   └── SubmitForm.tsx        # 提交需求表单
│   ├── lib/
│   │   └── supabase.ts           # Supabase 客户端初始化
│   └── types/
│       └── demand.ts             # TypeScript 类型定义
├── supabase/
│   └── migrations/
│       └── 001_initial.sql       # 建表 SQL
├── public/                       # 静态资源
└── package.json
```

## 数据库设计

### demands 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid (PK) | 主键 |
| title | text | 需求标题 |
| problem | text | 遇到的问题 |
| current_solution | text | 当前解决方案（可空） |
| ideal_solution | text | 理想解决方案（可空） |
| target_user | text | 目标用户角色 |
| submitter_name | text | 提交人昵称（可空） |
| votes | int (default 0) | 想要票数 |
| paid_votes | int (default 0) | 愿付费票数 |
| status | text (default 'open') | open / building / launched |
| created_at | timestamptz | 创建时间 |

### votes 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid (PK) | 主键 |
| demand_id | uuid (FK) | 关联需求 |
| type | text | 'like' / 'pay' |
| ip_address | text | 投票者 IP |
| cookie_id | text | 投票者 Cookie ID |
| created_at | timestamptz | 创建时间 |

唯一约束：(demand_id, ip_address) - 同一 IP 对同一需求只能投一票

### products 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid (PK) | 主键 |
| name | text | 产品名称 |
| description | text | 产品描述 |
| launch_url | text | 产品链接 |
| users_count | int | 使用人数 |
| demand_id | uuid (FK, unique) | 关联需求 |

## 页面设计

### 首页（5 屏结构）

1. **Hero 区** - 主标题 + 副标题 + CTA 按钮 + 右侧滚动榜
2. **热门需求** - 3 列卡片流，每卡片含标题/问题/投票按钮
3. **排行榜** - Tab 切换（最热/最赚钱/最新），排名 + 票数 + 趋势
4. **已上线产品** - 产品卡片（名称/使用人数/链接）
5. **CTA** - 提交需求引导

### 需求详情页

- 结构化描述（问题/现状/理想/受众）
- 当前排名 + 差距
- 投票按钮 + 分享按钮
- 状态标签

### 提交需求页

- 结构化表单：角色/问题/当前方案/理想方案/付费意愿
- 提交后展示审核提示

## 投票机制

- 两种投票：👍 想要 / 💰 愿付费
- 匿名投票，基于 IP + Cookie 去重
- 每人每需求限一票
- 投票后弹出分享引导弹窗

## 排名算法

```
score = votes + paid_votes * 3
```

## 裂变机制

1. 投票后弹窗显示排名 + 差距 + 分享按钮
2. 排行榜竞争感（距离上一名差 XX 票）
3. 发起人署名（由 @xxx 发起）
4. 开发承诺：「每周开发票数最高的需求」

## UI 规范

- 深色科技风（参考 Linear / Vercel）
- 背景 #0F1115 / 卡片 #1A1D23 / 主色 #6C5CE7 / 强调 #00D1FF
- 卡片 hover 微放大 / 投票 +1 动画 / 趋势箭头

## V1 不做的事

- 用户登录注册
- 评论系统
- 推荐算法
- 社交功能
- 支付系统
- 多语言

## 开发阶段

### Phase 1 - 核心可用（3-5 天）
- 项目初始化 + Supabase 配置
- 数据库建表
- 首页（Hero + 热门需求）
- 投票功能

### Phase 2 - 完整体验（3 天）
- 提交需求页
- 需求详情页
- 排行榜
- 分享弹窗

### Phase 3 - 信任闭环（3 天）
- 已上线产品模块
- 种子数据填充
- SEO 基础
