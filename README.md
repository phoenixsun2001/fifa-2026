<div align="center">

# ⚽ FIFA 2026 World Cup Interactive Simulator

### 2026 美加墨世界杯互动模拟器

**Poisson Distribution × Monte Carlo Simulation × React SPA**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[English](#-english) · [中文](#-中文)

</div>

---

## 🇬🇧 English

### Overview

An interactive simulator for the **2026 FIFA World Cup** (USA/Canada/Mexico), featuring a scientifically-grounded match prediction engine powered by **Poisson distribution** and **Monte Carlo simulation**.

### ✨ Features

| Tab | Description |
|-----|-------------|
| 📅 **Schedule** | 72 group-stage matches with Beijing time (CST), venue & city info |
| 🏆 **Group Standings** | 12 groups × 4 teams, live standings with FIFA tiebreaker rules |
| 🌿 **Knockout Bracket** | 9-column left/right half layout — R32 → R16 → QF → SF → Final → Champion |
| 📊 **AI Statistics** | Monte Carlo batch simulation (up to 1000 runs) — champion odds, dark horse tracker, upset statistics |
| 🔮 **Team Journey** | Pick any team → deep-dive simulation with group analysis, round-by-round path, and AI-generated insights |
| 🏟️ **Venues** | 16 stadiums across USA (11), Canada (2), Mexico (3) |
| ℹ️ **Format Rules** | 48-team expanded format, third-place ranking tiebreakers |

### 🔬 Simulation Engine

- **Match prediction**: Converts FIFA ranking delta into expected goals (xG) using Poisson distribution (Knuth algorithm)
- **Home advantage**: Host nation bonus for USA/CAN/MEX matches
- **Region weighting**: Strength adjustment for South American and European teams
- **formBoost**: Performance modifier based on recent form and squad quality (e.g., Norway +15, Japan +10)
- **Penalty shootout**: Rank-weighted probability for knockout draws
- **Batch simulation**: Runs N full tournaments (up to 1000) with per-team tracking across all stages

### 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build
npm run build
```

### 🏗️ Architecture

Single-file SPA (`2026.tsx`, ~2200 lines) with no external state management.

```
2026.tsx
├── Data Layer (teams, groups, matches, venues)
├── Simulation Engine (Poisson + Monte Carlo)
├── React State & Computed Data (useMemo chains)
├── Batch Simulation Engine (formBoost + dark horse tracking)
├── Team Journey Engine (per-team deep analysis)
└── JSX Rendering (7 tabs + KnockoutMatchCard component)
```

### 📊 Key Data

- **48 teams** with FIFA ranking, region, flag, and formBoost
- **72 group-stage matches** across 12 groups (June 12–27, 2026)
- **32-team knockout** following official FIFA 2026 cross-group pairing
- **16 venues** across 3 host nations

---

## 🇨🇳 中文

### 项目简介

**2026 美加墨世界杯互动模拟器**——基于 **泊松分布** 与 **蒙特卡洛仿真** 的科学足球预测引擎，以单文件 React SPA 实现完整的世界杯模拟体验。

### ✨ 功能亮点

| 页签 | 说明 |
|------|------|
| 📅 **北京时间日程表** | 72场小组赛完整赛程，已转换为北京时间(CST) |
| 🏆 **12组积分模拟** | 实时积分榜，支持手动输入比分或一键模拟，完整FIFA排名规则 |
| 🌿 **32强树状模拟** | 9列左右半区布局，从32强到冠军一目了然 |
| 📊 **AI 大数据统计预测** | 蒙特卡洛批量仿真（最高1000次），夺冠率/黑马榜/冷门统计 |
| 🔮 **球队之旅** | 选择任意球队 → 深度推演世界杯之路，含小组分析、逐轮路径、AI洞察 |
| 🏟️ **场馆指南** | 16座场馆（美国11 + 加拿大2 + 墨西哥3）详细信息 |
| ℹ️ **赛制规则** | 48队扩军新规、第三名横向排名晋级细则 |

### 🔬 仿真引擎

- **比赛预测**: 基于 FIFA 排名差 → 期望进球(xG) → 泊松分布随机进球（Knuth 算法）
- **主场优势**: 美国/加拿大/墨西哥在本土比赛获得额外加成
- **区域加权**: 南美洲/欧洲球队获得实力校正
- **formBoost 状态修正**: 基于近期表现和阵容质量的实力调整（如挪威+15、日本+10、厄瓜多尔+10）
- **点球大战**: 排名加权概率决定淘汰赛平局胜负
- **批量仿真**: 运行 N 次完整世界杯（最高1000次），追踪每支球队在每一轮的晋级/淘汰数据

### 🔮 球队之旅特色

选择一支球队后，系统将：

1. 运行蒙特卡洛模拟，追踪该队在每一轮的详细数据
2. 分析小组赛三个对手的胜率和典型比分
3. 展示淘汰赛逐轮到达率、可能对手、过关概率
4. 自动生成 **4-5条AI深度洞察**（利好🟢 / 风险🔴 / 关键节点🟡）

### 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生产构建
npm run build
```

### 🏗️ 技术架构

单文件 SPA（`2026.tsx`，约2200行），零外部状态管理库。

```
2026.tsx
├── 数据层（48支球队、12个小组、72场比赛、16座场馆）
├── 仿真引擎（泊松分布 + 蒙特卡洛）
├── React 状态与计算数据（useMemo 链式计算）
├── 批量仿真引擎（formBoost + 黑马追踪）
├── 球队之旅引擎（单队深度分析 + 洞察生成）
└── JSX 渲染（7个页签 + KnockoutMatchCard 组件）
```

### 📊 核心数据

- **48支球队**: FIFA排名、大区、国旗、formBoost状态修正
- **72场小组赛**: 12组×6场，2026年6月12日–27日
- **32强淘汰赛**: 遵循FIFA 2026官方跨组配对规则
- **16座场馆**: 美国（11）+ 加拿大（2）+ 墨西哥（3）

### 🛠️ 技术栈

| Technology | Purpose |
|-----------|---------|
| React 18 | UI framework |
| Vite 5 | Build tool & dev server |
| TypeScript | Type system (strict: false for single-file compatibility) |
| Tailwind CSS 3 | Utility-first styling, dark theme (slate-950) |

---

<div align="center">

**Made with ⚽ and science**

</div>
