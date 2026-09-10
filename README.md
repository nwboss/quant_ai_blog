# 智量双线 | Quant & AI 技术博客

> 建设以中文阅读为主的量化研究与人工智能前沿双主线个人技术博客。

本项目参考 [agents-quant.com](https://agents-quant.com/) 优秀的双主线设计理念与工程架构，基于 **Astro 5 + TypeScript + Tailwind CSS** 深度定制开发，具备极致的首屏渲染速度、严谨的投研数学公式支持、代码高亮复制与开箱即用的离线全文检索能力。

---

## 🌟 核心特性

- **双主线平等架构**：
  - **量化频道 (`/quant/`)**：数据工程、因子研究、策略回测、市场观察、研报复现，采用翡翠绿 (`quant-*`) 视觉系统。
  - **AI 频道 (`/ai/`)**：大模型与论文、Agent 智能体工作流、工具评测、工程经验，采用科技紫/靛蓝 (`ai-*`) 视觉系统。
- **全功能路由与阅读体验**：
  - 首页双主线平衡呈现，精选推荐与分主线最新文章并列，避免高频资讯挤占研究深度。
  - 文章详情页支持**桌面端粘性吸附目录 (TOC) + 滚动监听高亮**、移动端抽屉目录。
  - 自动中英文混排**阅读时长估算**、相关文章智能推荐与上一篇/下一篇跳转。
  - 严谨的**参考来源 (Sources)** 与**配套代码仓库 (Code URL)** 专属展示区。
- **科学计算与工程排版**：
  - 集成 `remark-math` + `rehype-katex`，完美支持行内公式 $\$E=mc^2\$$ 与独立块级复杂数学公式渲染。
  - 集成 Shiki 语法高亮与一键复制代码按钮，支持宽表格与大代码块自适应局部横向滚动。
- **静态全文检索**：
  - 集成 **Pagefind**，在构建期生成轻量化静态索引，支持中文分词与双频道快速筛选，开发环境提供智能回退。
- **多渠道订阅与 SEO**：
  - 全站 RSS (`/rss.xml`) 与分频道专属订阅 (`/quant/rss.xml`、`/ai/rss.xml`)。
  - 自动生成符合规范的 `sitemap-index.xml` 与 `robots.txt`。
  - Open Graph、Twitter Cards 社交分享卡片与无闪烁明暗主题切换。
- **零泄漏草稿发布机制**：
  - 统一内容层查询逻辑，`draft: true` 或未来发布时间的文章**绝对不会**进入生产路由、分页、标签列表、专题索引、RSS 或搜索索引。

---

## 📁 目录结构

```text
blog_quant/
├── public/
│   ├── favicon.svg             # 网站双主线图标
│   └── robots.txt              # 爬虫与站点地图指引
├── src/
│   ├── components/
│   │   ├── common/             # Header, Footer, ThemeToggle, SeoHead
│   │   ├── blog/               # PostCard, Pagination, TableOfContents, TrackBadge
│   │   └── home/               # DualTrackSection, FeaturedSection, LatestDualTrackSection, SeriesSection, SubscribeBox
│   ├── content/
│   │   ├── posts/              # 文章 Markdown（按 quant/ 与 ai/ 组织）
│   │   └── series/             # 专题专栏路线 Markdown
│   ├── layouts/
│   │   ├── BaseLayout.astro    # 基础骨架、主题脚本、代码复制器
│   │   ├── PageLayout.astro    # 通用单页布局
│   │   └── PostLayout.astro    # 文章详情布局（含双栏目录与相关推荐）
│   ├── lib/
│   │   ├── content.ts          # 强类型内容查询、草稿过滤与标签聚合
│   │   ├── readingTime.ts      # 中英文阅读耗时统计
│   │   └── utils.ts            # 日期与 Slug 工具
│   ├── pages/
│   │   ├── index.astro         # 首页
│   │   ├── quant/              # 量化主线专区与量化 RSS
│   │   ├── ai/                 # AI 主线专区与 AI RSS
│   │   ├── blog/               # 全部文章归档、分页与详情页 ([slug].astro)
│   │   ├── series/             # 专题路线与详情页 ([slug].astro)
│   │   ├── tags/               # 标签聚合与过滤页 ([tag].astro)
│   │   ├── search.astro        # 全文检索页面
│   │   ├── about.astro         # 关于与投研理念
│   │   ├── 404.astro           # 404 未找到页面
│   │   └── rss.xml.ts          # 全站 RSS 源
│   ├── content.config.ts       # Astro 5 Content Layer Schema 定义
│   ├── site.config.ts          # 站点全局元配置
│   └── styles/
│       └── global.css          # 全局排版、KaTeX 样式与主题变量
├── DEVELOPMENT_PLAN.md         # 原始完整开发规划
├── package.json
└── README.md
```

---

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 本地开发

```bash
npm run dev
```

浏览器访问 `http://localhost:4321` 即可进行本地创作与实时热更新预览。

### 3. 类型检查与质量校验

```bash
npm run check
```

### 4. 生产构建与搜索索引生成

```bash
npm run build
```

该命令会依次执行 `astro check` -> `astro build` -> `pagefind --site dist`，将纯静态页面与 Pagefind 中文全文搜索索引输出至 `dist/` 目录。

### 5. 本地生产预览

```bash
npm run preview
```

---

## ✍️ 写作指南

### 创建新文章

在 `src/content/posts/quant/` 或 `src/content/posts/ai/` 目录下创建 `.md` 文件，Frontmatter 规范如下：

```yaml
---
title: "你的文章标题"
description: "文章摘要，用于列表展示与 SEO。"
track: "quant" # 必填：'quant' 或 'ai'
category: "backtesting" # 对应 site.config.ts 中的分类 ID
format: "research" # 必填：'tutorial' | 'research' | 'evaluation' | 'review' | 'weekly'
tags: ["动量", "Python", "ETF"]
publishedAt: "2026-09-10T10:00:00+08:00"
updatedAt: "2026-09-10T15:00:00+08:00" # 可选：实质更新日期
draft: false # 是否为草稿，true 时绝对不会在生产环境中发布
featured: true # 可选：是否在首页精选展示
sources: # 可选：参考来源与论文
  - title: "学术论文或报告标题"
    url: "https://example.com"
    accessDate: "2026-09-10"
codeUrl: "https://github.com/example/repo" # 可选：配套开源代码仓库
---

这里开始正文内容。支持行内公式 $E=mc^2$，也支持独立公式块：

$$
\text{Sharpe} = \frac{E[R_p - R_f]}{\sigma_p}
$$
```

### 创建新专题路线

在 `src/content/series/` 下新建 `.md` 文件：

```yaml
---
title: "专题名称"
description: "专题介绍"
track: "quant" # 'quant' | 'ai' | 'mixed'
order: 1
posts:
  - "first-post-slug"
  - "second-post-slug"
---

专题概述正文...
```

---

## 🌐 部署说明 (Cloudflare Pages / GitHub Pages)

本博客为纯静态（SSG）架构，无需 Node.js 服务端或数据库：

- **Framework preset**: `Astro`
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Node.js version**: `>= 18.17.1` (推荐 20.x / 22.x)

在 Cloudflare Pages 或 GitHub Pages 设置上述构建命令后，推送代码即可实现自动构建发布与自动化搜索引擎索引生成。
