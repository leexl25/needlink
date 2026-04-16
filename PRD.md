# Demandly - 需求投票平台 PRD（产品需求文档）

## 一、产品定位

**一句话描述：** 用户提交痛点需求，社区投票筛选，开发者（你）将最高票需求快速开发成产品上线。

**核心理念：** 用真实需求驱动产品开发，避免闭门造车。

**产品形态：** 需求排行榜 + 投票筛选 + 快速实现展示平台。

---

## 二、目标用户

| 角色 | 画像 | 核心行为 |
|------|------|----------|
| 需求提交者 | 有痛点但无开发能力的人（上班族、自媒体、学生） | 提交结构化需求、拉票 |
| 投票用户 | 对新工具新产品感兴趣的人 | 浏览、投票、分享 |
| 开发者（你） | 独立全栈开发者 | 筛选需求、开发产品、上线变现 |

---

## 三、核心用户流程

```
提交需求 → 投票筛选 → 排行榜竞争 → 开发者选Top需求开发 → 上线产品 → 通知投票用户
```

**关键闭环：** 用户投票 → 产品上线 → 通知用户 → 用户使用/付费

---

## 四、功能模块（MVP）

### 4.1 首页（核心转化页）

首页分为 5 个区块，从上到下：

**第一屏 - Hero 区**
- 主标题：「做大家真正想要的产品」
- 副标题：「你投票，我开发。票数最高的需求，每周上线一个」
- CTA 按钮：[查看热门需求] [提交需求]
- 右侧：实时滚动需求榜（伪实时，自动滚动展示 Top 需求及票数）

**第二屏 - 今日热门需求（卡片流）**
- 3 列卡片布局，每张卡片包含：
  - 需求标题
  - 问题描述（截断显示）
  - 投票按钮组：👍 想要（数量） / 💰 愿付费（数量）
  - 查看详情按钮
- 卡片 hover 微放大动效

**第三屏 - 排行榜（Tab 切换）**
- Tab：🔥 最热（综合票数） / 💰 最赚钱（付费票数） / 🆕 最新
- 榜单样式（类似 Product Hunt）：
  - 排名编号 + 需求标题 + 票数 + 趋势箭头（↑↓）

**第四屏 - 已上线产品（信任建设）**
- 产品卡片展示：
  - 产品名称
  - 上线天数
  - 使用人数
  - CTA 按钮：[立即使用]

**第五屏 - CTA（引导提交需求）**
- 文案：「没找到你想要的？写下你的需求，也许下一个爆款就是它」
- 按钮：[提交需求]

### 4.2 需求详情页

- 需求标题
- 结构化描述：
  - 问题：遇到了什么麻烦
  - 现状：当前怎么解决的
  - 理想：希望怎么解决
  - 受众：谁会用
- 当前排名 + 距离上一名的差距
- 今日新增票数
- 投票按钮：👍 想要 / 💰 愿付费
- 分享按钮：复制链接 / Twitter / 微信
- 状态标签：投票中 / 开发中 / 已上线

### 4.3 提交需求页

结构化表单（降低垃圾需求）：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| 你是谁（角色） | 选择 + 自定义 | 是 | 如：上班族/自媒体/学生/开发者... |
| 你遇到的问题 | 文本域 | 是 | 具体场景描述，最少20字 |
| 你现在怎么解决 | 文本域 | 否 | 当前解决方案 |
| 你希望怎么解决 | 文本域 | 否 | 理想方案 |
| 是否愿意付费 | 单选 | 是 | 不付费 / $5/月 / $10/月 / $20+ |

提交后展示：需求已提交，审核通过后会上榜。

### 4.4 投票机制

- **投票类型：**
  - 👍 想要（免费，表示兴趣）
  - 💰 愿付费（高价值信号）
- **限制：**
  - 未登录用户可投票，基于 Cookie/IP 限制
  - 同一用户对同一需求只能投一票
  - 每人每日投票上限（防刷）
- **投票后触发裂变弹窗：**
  - 显示当前排名
  - 显示距离目标的差距：「再获得 XX 票就会被开发」
  - 分享按钮：复制链接 / Twitter / 微信

### 4.5 排名算法

```
综合得分 = 想要票数 + 愿付费票数 × 3
```

付费意愿权重更高，体现真实需求价值。

---

## 五、裂变传播机制

### 5.1 投票后分享引导

投票成功后弹窗：
- 「这个需求很有机会被开发！当前排名 #3，再获得 57 票就会被开发」
- 分享按钮组：复制链接 / Twitter / 微信

### 5.2 排行榜竞争感

- 每个需求显示：「距离上一名还差 XX 票」
- 制造「只差一点点」的紧迫感

### 5.3 发起人荣誉

- 需求卡片显示：「由 @xxx 发起」
- 发起人可看到：「你的需求当前第 X 名，拉到前 3 名就会开发」

### 5.4 开发承诺

- 首页固定文案：「每周开发票数最高的需求」
- 投票倒计时：「本轮投票还剩 X 天 X 小时」

---

## 六、技术架构

### 6.1 技术栈

| 层级 | 技术选型 | 理由 |
|------|----------|------|
| 前端框架 | Vue 3 + Vite | 用户熟悉，开发快 |
| 样式方案 | TailwindCSS | 快速出 UI，深色主题友好 |
| 状态管理 | Pinia | Vue 3 标准方案 |
| 后端框架 | Node.js + Express | 轻量，MVP 够用 |
| ORM | Prisma | 类型安全，开发体验好 |
| 数据库 | PostgreSQL | 关系型，适合排序/统计 |
| 部署-前端 | Vercel | 免费额度，自动部署 |
| 部署-后端 | Railway / Render | 简单部署 Node.js |
| 部署-数据库 | Supabase | 免费额度，托管 PG |

### 6.2 前端目录结构

```
src/
├── pages/
│   ├── index.vue              # 首页
│   ├── demand/[id].vue        # 需求详情页
│   └── submit.vue             # 提交需求页
├── components/
│   ├── HeroSection.vue        # 首页 Hero 区
│   ├── DemandCard.vue         # 需求卡片
│   ├── RankingList.vue        # 排行榜
│   ├── VoteButtons.vue        # 投票按钮组
│   ├── ShareModal.vue         # 分享弹窗（裂变核心）
│   ├── LaunchedProducts.vue   # 已上线产品
│   └── SubmitForm.vue         # 提交表单
├── stores/
│   └── demandStore.ts         # 需求数据状态管理
├── services/
│   └── api.ts                 # API 请求封装
├── layouts/
│   └── default.vue            # 默认布局
└── assets/
    └── styles/                # 全局样式
```

### 6.3 后端目录结构

```
server/
├── controllers/
│   └── demand.controller.ts   # 需求控制器
├── services/
│   └── demand.service.ts      # 需求业务逻辑
├── routes/
│   └── demand.routes.ts       # 路由定义
├── middleware/
│   └── rateLimit.ts           # 投票限流中间件
├── prisma/
│   └── schema.prisma          # 数据库模型
└── utils/
    └── ranking.ts             # 排名算法
```

### 6.4 API 设计

| 方法 | 路径 | 说明 | 请求体 |
|------|------|------|--------|
| GET | `/api/demands?sort=hot\|paid\|latest&limit=20` | 获取需求列表 | Query 参数 |
| GET | `/api/demands/:id` | 获取需求详情 | - |
| POST | `/api/demands` | 创建需求 | 结构化表单 JSON |
| POST | `/api/demands/:id/vote` | 投票 | `{ type: "like"\|"pay" }` |
| GET | `/api/products` | 获取已上线产品 | - |

### 6.5 数据库模型（Prisma Schema）

```prisma
model Demand {
  id              String   @id @default(uuid())
  title           String
  problem         String                    // 遇到的问题
  currentSolution String?                   // 当前怎么解决
  idealSolution   String?                   // 希望怎么解决
  targetUser      String                    // 目标用户角色
  submitterName   String?                   // 提交人昵称
  votes           Int      @default(0)      // 想要票数
  paidVotes       Int      @default(0)      // 愿付费票数
  status          String   @default("open") // open | building | launched
  createdAt       DateTime @default(now())

  votes_relation  Vote[]
  product         Product?
}

model Vote {
  id        String   @id @default(uuid())
  demandId  String
  type      String   // "like" | "pay"
  ipAddress String
  cookieId  String
  createdAt DateTime @default(now())

  demand    Demand   @relation(fields: [demandId], references: [id])

  @@unique([demandId, ipAddress])  // 同一IP对同一需求只能投一票
}

model Product {
  id          String   @id @default(uuid())
  name        String
  description String
  launchUrl   String
  usersCount  Int      @default(0)
  revenue     Int      @default(0)    // 单位：美元
  launchedAt  DateTime @default(now())
  demandId    String   @unique

  demand      Demand   @relation(fields: [demandId], references: [id])
}
```

---

## 七、UI 设计规范

### 7.1 视觉风格

- 深色科技风（参考 Linear / Vercel）
- 高对比度
- 卡片化布局
- 圆角 + 微阴影

### 7.2 颜色系统

| 用途 | 色值 | 说明 |
|------|------|------|
| 背景色 | `#0F1115` | 深黑 |
| 卡片背景 | `#1A1D23` | 深灰 |
| 主色 | `#6C5CE7` | 科技紫 |
| 强调色 | `#00D1FF` | 亮蓝 |
| 成功色 | `#00E676` | 绿 |
| 警告色 | `#FF5252` | 红 |
| 正文色 | `#E4E4E7` | 浅灰白 |
| 次要文字 | `#9CA3AF` | 灰色 |

### 7.3 关键交互

- 需求卡片：hover 微放大（scale 1.02）
- 投票按钮：点击后有动画反馈（数字 +1 弹出）
- 排行榜：排名变化有 ↑↓ 趋势指示
- 分享弹窗：投票成功后自动弹出

---

## 八、开发计划

### Phase 1（3-5 天）- 核心可用

- [ ] 项目初始化（前端 + 后端）
- [ ] 数据库建表
- [ ] 首页（Hero + 热门需求卡片列表）
- [ ] 需求列表 API
- [ ] 投票功能（API + 前端）
- [ ] 基础部署

### Phase 2（3 天）- 完整体验

- [ ] 提交需求表单页
- [ ] 需求详情页
- [ ] 排行榜（Tab 切换）
- [ ] 投票后分享弹窗
- [ ] 投票限流（IP + Cookie）

### Phase 3（3 天）- 信任 + 闭环

- [ ] 已上线产品展示模块
- [ ] 需求状态流转（open → building → launched）
- [ ] 种子数据填充（10 个高质量初始需求）
- [ ] SEO 基础优化

---

## 九、种子需求（首批 10 个）

上线时预填充的高质量需求，来源为 Reddit / Twitter / 小红书高频痛点：

| # | 标题 | 目标用户 | 付费潜力 |
|---|------|----------|----------|
| 1 | AI 自动生成周报/日报 | 上班族 | 高 |
| 2 | 录音自动转会议纪要 + 待办 | 团队协作 | 高 |
| 3 | PDF 批量翻译保留格式 | 学生/职场 | 高 |
| 4 | 一句话自动生成 PPT | 上班族/学生 | 高 |
| 5 | AI 写简历 + 针对性优化 | 求职者 | 中高 |
| 6 | 批量处理图片（压缩/裁剪/水印） | 自媒体 | 中 |
| 7 | 自动剪辑视频（去废话 + 加字幕） | 短视频创作者 | 高 |
| 8 | AI 帮你回复消息（社交场景） | 年轻用户 | 中 |
| 9 | 消费自动记账 + 智能分析 | 所有人 | 中 |
| 10 | AI 总结合同/条款重点 + 风险提示 | 租房/签合同 | 高 |

---

## 十、冷启动策略

1. **预填充内容：** 自己整理 30-50 个高质量结构化需求（从 Reddit / Indie Hackers / Twitter 搬运）
2. **内容引流：** 在 Twitter / 小红书 / 抖音发布「我做了个网站，票数最高的需求我直接开发」
3. **Build in Public：** 公开开发过程，每周更新进度，吸引关注
4. **社区分发：** 发到 V2EX、掘金、Hacker News、Indie Hackers

---

## 十一、V1 不做的事

- 用户登录注册系统（先用 Cookie/IP 匿名）
- 评论系统
- 复杂推荐算法
- 社交功能
- 开发者入驻（只有你自己）
- 需求众筹
- 支付系统
