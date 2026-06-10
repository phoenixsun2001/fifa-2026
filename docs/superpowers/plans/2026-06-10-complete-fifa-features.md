# 2026 FIFA World Cup Simulator — 完整功能实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 2026 FIFA 世界杯模拟器打造成完整可运行的独立应用，包含全部72场小组赛、16个场馆数据。

**Architecture:** 单页 React SPA，Vite 构建，Tailwind CSS 样式。现有 `2026.tsx` 作为主组件，补全全部赛程和场馆数据。

**Tech Stack:** React 18, Vite 5, TypeScript, Tailwind CSS 3

---

## 文件结构

```
FIFA/
├── package.json              — 新建：项目依赖
├── vite.config.ts            — 新建：Vite 配置
├── tsconfig.json             — 新建：TypeScript 配置
├── tsconfig.node.json        — 新建：Node TS 配置
├── index.html                — 新建：Vite 入口 HTML
├── tailwind.config.js        — 新建：Tailwind 配置
├── postcss.config.js         — 新建：PostCSS 配置
├── CLAUDE.md                 — 已有：项目文档
├── 2026.tsx                  — 修改：补全72场赛程 + 16个场馆
├── src/
│   ├── main.tsx              — 新建：React 入口
│   └── index.css             — 新建：Tailwind 指令
└── docs/
    └── superpowers/plans/    — 已有：本计划
```

---

## 差距分析

| 项目 | 当前 | 目标 | 缺口 |
|------|------|------|------|
| 小组赛场次 | 30 | 72 | **42场** |
| 场馆数量 | 4 | 16 | **12个** |
| 项目脚手架 | 无 | Vite+React+Tailwind | **完整搭建** |

### 各组缺失比赛明细

每组4队 → C(4,2) = 6场 → 12组 × 6 = 72场

| 组别 | 已有 | 缺失场次 |
|------|------|----------|
| A | 4 | 墨西哥vs捷克、南非vs韩国 (2) |
| B | 4 | 加拿大vs瑞士、波黑vs卡塔尔 (2) |
| C | 3 | 巴西vs苏格兰、摩洛哥vs海地、摩洛哥vs苏格兰 (3) |
| D | 3 | 美国vs土耳其、巴拉圭vs澳大利亚、巴拉圭vs土耳其 (3) |
| E | 2 | 德国vs科特迪瓦、库拉索vs厄瓜多尔、德国vs厄瓜多尔、库拉索vs科特迪瓦 (4) |
| F | 2 | 荷兰vs瑞典、日本vs突尼斯、荷兰vs突尼斯、日本vs瑞典 (4) |
| G | 2 | 比利时vs伊朗、埃及vs新西兰、比利时vs新西兰、埃及vs伊朗 (4) |
| H | 2 | 西班牙vs沙特、佛得角vs乌拉圭、西班牙vs乌拉圭、佛得角vs沙特 (4) |
| I | 2 | 法国vs挪威、塞内加尔vs伊拉克、法国vs伊拉克、塞内加尔vs挪威 (4) |
| J | 2 | 阿根廷vs奥地利、阿尔及利亚vs约旦、阿根廷vs约旦、阿尔及利亚vs奥地利 (4) |
| K | 2 | 葡萄牙vs乌兹别克、民主刚果vs哥伦比亚、葡萄牙vs哥伦比亚、民主刚果vs乌兹别克 (4) |
| L | 2 | 英格兰vs加纳、克罗地亚vs巴拿马、英格兰vs巴拿马、克罗地亚vs加纳 (4) |

---

### Task 1: Vite + React + Tailwind 项目搭建

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `index.html`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `src/main.tsx`
- Create: `src/index.css`

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "fifa-2026-simulator",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.16",
    "typescript": "^5.6.3",
    "vite": "^5.4.11"
  }
}
```

- [ ] **Step 2: 创建 vite.config.ts**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

- [ ] **Step 3: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "allowJs": true
  },
  "include": ["src", "2026.tsx"]
}
```

- [ ] **Step 4: 创建 tsconfig.node.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 5: 创建 index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>2026 美加墨世界杯模拟器</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: 创建 tailwind.config.js**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./2026.tsx",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

- [ ] **Step 7: 创建 postcss.config.js**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 8: 创建 src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 9: 创建 src/main.tsx**

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '../2026'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 10: 安装依赖并验证启动**

Run: `cd "/Users/phoenix/Documents/Claude Playground/FIFA" && npm install`
Run: `npm run dev`
Expected: Vite 开发服务器启动，浏览器打开后显示世界杯模拟器界面

---

### Task 2: 补全全部72场小组赛数据

**Files:**
- Modify: `2026.tsx:84-115` (initialMatches 数组)

**说明:** 现有30场比赛覆盖了 MD1 全部 + MD2 部分场次。需补全 MD2 剩余（18场）和 MD3 全部（24场），共42场。新比赛 id 从 31 到 72。

- [ ] **Step 1: 在 initialMatches 数组末尾（id 30 之后），追加42场比赛**

在 `2026.tsx` 第114行 `];` 之前插入以下内容：

```js
  // ===== MD2 剩余 (June 20-23) =====
  { id: 31, date: '2026-06-20', time: '06:00', group: 'Group D', home: '巴拉圭', away: '土耳其', venue: '箭头体育场', city: '堪萨斯城', country: '美国', homeScore: '', awayScore: '', isMajor: false },
  { id: 32, date: '2026-06-20', time: '09:00', group: 'Group C', home: '摩洛哥', away: '苏格兰', venue: '硬石体育场', city: '迈阿密', country: '美国', homeScore: '', awayScore: '', isMajor: false },

  { id: 33, date: '2026-06-21', time: '03:00', group: 'Group E', home: '德国', away: '科特迪瓦', venue: '卢门球场', city: '西雅图', country: '美国', homeScore: '', awayScore: '', isMajor: true },
  { id: 34, date: '2026-06-21', time: '03:00', group: 'Group F', home: '荷兰', away: '瑞典', venue: '奔驰体育场', city: '亚特兰大', country: '美国', homeScore: '', awayScore: '', isMajor: true },
  { id: 35, date: '2026-06-21', time: '07:00', group: 'Group E', home: '库拉索', away: '厄瓜多尔', venue: '阿克伦体育场', city: '瓜达拉哈拉', country: '墨西哥', homeScore: '', awayScore: '', isMajor: false },
  { id: 36, date: '2026-06-21', time: '07:00', group: 'Group F', home: '日本', away: '突尼斯', venue: 'BBVA体育场', city: '蒙特雷', country: '墨西哥', homeScore: '', awayScore: '', isMajor: false },
  { id: 37, date: '2026-06-21', time: '09:00', group: 'Group G', home: '比利时', away: '伊朗', venue: 'NRG体育场', city: '休斯敦', country: '美国', homeScore: '', awayScore: '', isMajor: true },
  { id: 38, date: '2026-06-21', time: '09:00', group: 'Group H', home: '佛得角', away: '乌拉圭', venue: '林肯金融体育场', city: '费城', country: '美国', homeScore: '', awayScore: '', isMajor: false },

  { id: 39, date: '2026-06-22', time: '03:00', group: 'Group G', home: '埃及', away: '新西兰', venue: '吉列体育场', city: '波士顿', country: '美国', homeScore: '', awayScore: '', isMajor: false },
  { id: 40, date: '2026-06-22', time: '03:00', group: 'Group H', home: '西班牙', away: '沙特阿拉伯', venue: '硬石体育场', city: '迈阿密', country: '美国', homeScore: '', awayScore: '', isMajor: true },
  { id: 41, date: '2026-06-22', time: '06:00', group: 'Group I', home: '法国', away: '挪威', venue: '大都会人寿体育场', city: '纽约/新泽西', country: '美国', homeScore: '', awayScore: '', isMajor: true },
  { id: 42, date: '2026-06-22', time: '06:00', group: 'Group I', home: '塞内加尔', away: '伊拉克', venue: '李维斯体育场', city: '旧金山湾区', country: '美国', homeScore: '', awayScore: '', isMajor: false },
  { id: 43, date: '2026-06-22', time: '09:00', group: 'Group J', home: '阿根廷', away: '奥地利', venue: '箭头体育场', city: '堪萨斯城', country: '美国', homeScore: '', awayScore: '', isMajor: true },
  { id: 44, date: '2026-06-22', time: '09:00', group: 'Group J', home: '阿尔及利亚', away: '约旦', venue: 'BC Place体育场', city: '温哥华', country: '加拿大', homeScore: '', awayScore: '', isMajor: false },

  { id: 45, date: '2026-06-23', time: '03:00', group: 'Group K', home: '葡萄牙', away: '乌兹别克斯坦', venue: '阿兹特克体育场', city: '墨西哥城', country: '墨西哥', homeScore: '', awayScore: '', isMajor: true },
  { id: 46, date: '2026-06-23', time: '03:00', group: 'Group K', home: '民主刚果', away: '哥伦比亚', venue: 'SoFi体育场', city: '洛杉矶', country: '美国', homeScore: '', awayScore: '', isMajor: false },
  { id: 47, date: '2026-06-23', time: '06:00', group: 'Group L', home: '英格兰', away: '加纳', venue: 'AT&T体育场', city: '达拉斯', country: '美国', homeScore: '', awayScore: '', isMajor: true },
  { id: 48, date: '2026-06-23', time: '06:00', group: 'Group L', home: '克罗地亚', away: '巴拿马', venue: '多伦多体育场', city: '多伦多', country: '加拿大', homeScore: '', awayScore: '', isMajor: false },

  // ===== MD3 第三轮 (June 24-27) =====
  { id: 49, date: '2026-06-24', time: '03:00', group: 'Group A', home: '墨西哥', away: '捷克', venue: '阿兹特克体育场', city: '墨西哥城', country: '墨西哥', homeScore: '', awayScore: '', isMajor: true },
  { id: 50, date: '2026-06-24', time: '03:00', group: 'Group A', home: '南非', away: '韩国', venue: '阿克伦体育场', city: '瓜达拉哈拉', country: '墨西哥', homeScore: '', awayScore: '', isMajor: false },
  { id: 51, date: '2026-06-24', time: '07:00', group: 'Group B', home: '加拿大', away: '瑞士', venue: '多伦多体育场', city: '多伦多', country: '加拿大', homeScore: '', awayScore: '', isMajor: true },
  { id: 52, date: '2026-06-24', time: '07:00', group: 'Group B', home: '波黑', away: '卡塔尔', venue: 'BC Place体育场', city: '温哥华', country: '加拿大', homeScore: '', awayScore: '', isMajor: false },
  { id: 53, date: '2026-06-24', time: '09:00', group: 'Group C', home: '巴西', away: '苏格兰', venue: '大都会人寿体育场', city: '纽约/新泽西', country: '美国', homeScore: '', awayScore: '', isMajor: true },
  { id: 54, date: '2026-06-24', time: '09:00', group: 'Group C', home: '摩洛哥', away: '海地', venue: '吉列体育场', city: '波士顿', country: '美国', homeScore: '', awayScore: '', isMajor: false },

  { id: 55, date: '2026-06-25', time: '03:00', group: 'Group D', home: '美国', away: '土耳其', venue: 'SoFi体育场', city: '洛杉矶', country: '美国', homeScore: '', awayScore: '', isMajor: true },
  { id: 56, date: '2026-06-25', time: '03:00', group: 'Group D', home: '巴拉圭', away: '澳大利亚', venue: 'NRG体育场', city: '休斯敦', country: '美国', homeScore: '', awayScore: '', isMajor: false },
  { id: 57, date: '2026-06-25', time: '06:00', group: 'Group E', home: '德国', away: '厄瓜多尔', venue: 'AT&T体育场', city: '达拉斯', country: '美国', homeScore: '', awayScore: '', isMajor: true },
  { id: 58, date: '2026-06-25', time: '06:00', group: 'Group E', home: '库拉索', away: '科特迪瓦', venue: 'BBVA体育场', city: '蒙特雷', country: '墨西哥', homeScore: '', awayScore: '', isMajor: false },
  { id: 59, date: '2026-06-25', time: '09:00', group: 'Group F', home: '荷兰', away: '突尼斯', venue: '奔驰体育场', city: '亚特兰大', country: '美国', homeScore: '', awayScore: '', isMajor: true },
  { id: 60, date: '2026-06-25', time: '09:00', group: 'Group F', home: '日本', away: '瑞典', venue: '林肯金融体育场', city: '费城', country: '美国', homeScore: '', awayScore: '', isMajor: false },

  { id: 61, date: '2026-06-26', time: '03:00', group: 'Group G', home: '比利时', away: '新西兰', venue: '箭头体育场', city: '堪萨斯城', country: '美国', homeScore: '', awayScore: '', isMajor: false },
  { id: 62, date: '2026-06-26', time: '03:00', group: 'Group G', home: '埃及', away: '伊朗', venue: '李维斯体育场', city: '旧金山湾区', country: '美国', homeScore: '', awayScore: '', isMajor: false },
  { id: 63, date: '2026-06-26', time: '06:00', group: 'Group H', home: '西班牙', away: '乌拉圭', venue: '硬石体育场', city: '迈阿密', country: '美国', homeScore: '', awayScore: '', isMajor: true },
  { id: 64, date: '2026-06-26', time: '06:00', group: 'Group H', home: '佛得角', away: '沙特阿拉伯', venue: '卢门球场', city: '西雅图', country: '美国', homeScore: '', awayScore: '', isMajor: false },
  { id: 65, date: '2026-06-26', time: '09:00', group: 'Group I', home: '法国', away: '伊拉克', venue: '大都会人寿体育场', city: '纽约/新泽西', country: '美国', homeScore: '', awayScore: '', isMajor: true },
  { id: 66, date: '2026-06-26', time: '09:00', group: 'Group I', home: '塞内加尔', away: '挪威', venue: '吉列体育场', city: '波士顿', country: '美国', homeScore: '', awayScore: '', isMajor: false },

  { id: 67, date: '2026-06-27', time: '03:00', group: 'Group J', home: '阿根廷', away: '约旦', venue: 'AT&T体育场', city: '达拉斯', country: '美国', homeScore: '', awayScore: '', isMajor: true },
  { id: 68, date: '2026-06-27', time: '03:00', group: 'Group J', home: '阿尔及利亚', away: '奥地利', venue: 'NRG体育场', city: '休斯敦', country: '美国', homeScore: '', awayScore: '', isMajor: false },
  { id: 69, date: '2026-06-27', time: '06:00', group: 'Group K', home: '葡萄牙', away: '哥伦比亚', venue: '奔驰体育场', city: '亚特兰大', country: '美国', homeScore: '', awayScore: '', isMajor: true },
  { id: 70, date: '2026-06-27', time: '06:00', group: 'Group K', home: '民主刚果', away: '乌兹别克斯坦', venue: '阿兹特克体育场', city: '墨西哥城', country: '墨西哥', homeScore: '', awayScore: '', isMajor: false },
  { id: 71, date: '2026-06-27', time: '09:00', group: 'Group L', home: '英格兰', away: '巴拿马', venue: 'SoFi体育场', city: '洛杉矶', country: '美国', homeScore: '', awayScore: '', isMajor: true },
  { id: 72, date: '2026-06-27', time: '09:00', group: 'Group L', home: '克罗地亚', away: '加纳', venue: '多伦多体育场', city: '多伦多', country: '加拿大', homeScore: '', awayScore: '', isMajor: false }
```

- [ ] **Step 2: 验证赛程数据完整性**

Run: 在浏览器打开日程表 Tab，确认显示72场比赛，覆盖6月12日至6月27日，12组每组均有6场。

Expected: 每个小组恰好6场比赛，所有组别的3个比赛日均已填满。

---

### Task 3: 补全全部16个场馆数据

**Files:**
- Modify: `2026.tsx:117-122` (venuesData 数组)

**说明:** 现有4个场馆（纽约/新泽西、墨西哥城、达拉斯、洛杉矶），需补全12个。所有场馆名已在赛程数据中引用，只需在 venuesData 中补充信息卡片。

- [ ] **Step 1: 替换 venuesData 为完整的16个场馆**

将 `2026.tsx` 中 `venuesData` 数组（第117-122行）替换为：

```js
const venuesData = [
  { city: '纽约/新泽西', stadium: '大都会人寿体育场', capacity: '82,500', country: '美国', desc: '决赛举办地。全美顶级综合体育殿堂，纽约大都会标志性建筑。' },
  { city: '墨西哥城', stadium: '阿兹特克体育场', capacity: '87,523', country: '墨西哥', desc: '揭幕战举办地。世界足球殿堂，唯一两次承办世界杯决赛的传奇球场。' },
  { city: '达拉斯', stadium: 'AT&T体育场', capacity: '92,967', country: '美国', desc: '半决赛举办地。无柱悬顶巨型室内场馆，可容纳近10万名观众。' },
  { city: '洛杉矶', stadium: 'SoFi体育场', capacity: '70,000', country: '美国', desc: '造价高昂的顶级巨幕智能场馆，好莱坞级视听体验。' },
  { city: '迈阿密', stadium: '硬石体育场', capacity: '65,000', country: '美国', desc: '南美球迷主场氛围。热带风情与足球激情的完美融合。' },
  { city: '亚特兰大', stadium: '奔驰体育场', capacity: '71,000', country: '美国', desc: '可伸缩穹顶设计，先进的360度环形LED屏幕。' },
  { city: '西雅图', stadium: '卢门球场', capacity: '69,000', country: '美国', desc: '太平洋西北足球圣地，MLS球迷文化最浓厚的城市之一。' },
  { city: '波士顿', stadium: '吉列体育场', capacity: '65,000', country: '美国', desc: '新英格兰地区体育圣地，美国足球传统重镇。' },
  { city: '休斯敦', stadium: 'NRG体育场', capacity: '72,000', country: '美国', desc: '德州巨无霸，可伸缩穹顶适应各种气候条件。' },
  { city: '费城', stadium: '林肯金融体育场', capacity: '69,000', country: '美国', desc: '美国独立之城，历史与现代体育文化的交汇点。' },
  { city: '堪萨斯城', stadium: '箭头体育场', capacity: '76,000', country: '美国', desc: '全美最响亮的主场氛围，声浪震撼的足球圣殿。' },
  { city: '旧金山湾区', stadium: '李维斯体育场', capacity: '68,000', country: '美国', desc: '硅谷科技心脏地带，绿色环保建造标杆场馆。' },
  { city: '多伦多', stadium: '多伦多体育场', capacity: '45,000', country: '加拿大', desc: '加拿大足球大本营，多元文化城市的体育名片。' },
  { city: '温哥华', stadium: 'BC Place体育场', capacity: '54,000', country: '加拿大', desc: '太平洋明珠，可伸缩穹顶球场，北美最美城市天际线背景。' },
  { city: '瓜达拉哈拉', stadium: '阿克伦体育场', capacity: '49,000', country: '墨西哥', desc: '墨西哥足球重镇，拉丁足球热情的典型代表。' },
  { city: '蒙特雷', stadium: 'BBVA体育场', capacity: '53,000', country: '墨西哥', desc: '墨西哥北部工业重镇，现代化山地球场。' }
];
```

- [ ] **Step 2: 验证场馆 Tab 显示16个场馆卡片**

Run: 在浏览器打开场馆指南 Tab
Expected: 16个场馆卡片全部显示，包含美国11个 + 加拿大2个 + 墨西哥3个

---

### Task 4: 验证所有功能并构建

**Files:** 无新文件

- [ ] **Step 1: 启动开发服务器，逐一验证6个 Tab**

Run: `npm run dev`

验证清单：
1. **📅 北京时间日程表** — 显示72场比赛，按日期排列（6月12日-27日），筛选和搜索功能正常
2. **🏆 12组积分模拟** — 12个小组积分榜完整，每组4队、6场赛后排名正确，第三名出线排位显示12队前8名晋级
3. **🌿 32强树状模拟** — 点击"⚡智能模拟单次"后，R32→R16→QF→SF→Final 全链路自动填入，点击队名可手动选择晋级
4. **📊 AI 大数据统计预测** — 选择100次模拟，点击启动，表格展示48队胜率排行，夺冠前5展示正确
5. **🏟️ 场馆指南** — 16个场馆卡片全部显示
6. **ℹ️ 赛制规则** — 赛制说明页面正常显示

- [ ] **Step 2: 验证模拟引擎准确性**

手动操作：
1. 在日程表 Tab 点击"⚡智能模拟单次"
2. 切换到积分 Tab，确认每组恰好6场比赛有结果，排名逻辑正确
3. 切换到树状 Tab，确认淘汰赛从R32到决赛全链路完整
4. 切换到统计 Tab，确认批量模拟可正常运行

- [ ] **Step 3: 构建生产版本**

Run: `npm run build`
Expected: 构建成功，生成 `dist/` 目录

Run: `npm run preview`
Expected: 预览服务器启动，生产版本运行正常

- [ ] **Step 4: 更新 CLAUDE.md 开发命令**

在 CLAUDE.md 的 "Development Notes" 部分追加：

```markdown
## Development Commands

- `npm run dev` — 启动 Vite 开发服务器
- `npm run build` — TypeScript 编译 + Vite 生产构建
- `npm run preview` — 预览生产构建结果
```

- [ ] **Step 5: Commit**

```bash
git init
git add .
git commit -m "feat: complete FIFA 2026 simulator with all 72 matches, 16 venues, and Vite project setup"
```

---

## 自检清单

- [x] **Spec 覆盖率:** 赛程（72场）✅、积分（12组）✅、淘汰赛（32强）✅、统计（蒙特卡洛）✅、场馆（16个）✅、赛制 ✅
- [x] **无占位符:** 所有代码步骤包含完整内容，无 TBD/TODO
- [x] **类型一致性:** 新增比赛的字段名与已有30场完全一致（id, date, time, group, home, away, venue, city, country, homeScore, awayScore, isMajor）
