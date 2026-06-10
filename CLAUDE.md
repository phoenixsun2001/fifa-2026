# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

2026 FIFA World Cup (美加墨世界杯) interactive simulator — a single-file React TSX application with Poisson-based match prediction and Monte Carlo batch simulation. The entire app lives in `2026.tsx`.

## Architecture

Single-file SPA (~1580 lines) with no build tooling, no package.json, no bundler. Designed to run in a React + Tailwind CSS environment (e.g. imported into a Vite/Next.js host or a sandbox like CodeSandbox/StackBlitz).

### Key sections within `2026.tsx`:

1. **Data layer** (lines 1–122): Hardcoded `teamMetadata` (48 teams with FIFA rank, region, flag), `initialGroups` (12 groups A–L), `initialMatches` (30 group-stage matches with Beijing time), `venuesData`.
2. **Simulation engine** (lines 124–174): `getPoissonGoal(lambda)` — Knuth algorithm for Poisson random goals; `simulateMatchRealistic()` — converts FIFA rank delta into xG expectations with home advantage and region weighting.
3. **React state & computed data** (lines 178–754): `App` component with tabs (schedule / groups / bracket / stats / venues / format). Core `useMemo` chains: `groupStandings` → `thirdPlaceRankings` → `top8ThirdTeams` → `qualifiedTeams` → `r32Matches` → `r16Matches` → `qfMatches` → `sfMatches` → `finalMatch`.
4. **Batch Monte Carlo engine** (lines 503–691): `handleBatchSimulation()` runs N full tournament simulations (default 100, up to 1000) in a `setTimeout` to avoid blocking the UI thread. Tracks qualification/advancement rates per team and top upsets.
5. **JSX rendering** (lines 756–1514): Tab-based UI with schedule cards, group tables, 5-column knockout bracket, stats dashboard, venue cards, and format rules.
6. **KnockoutMatchCard** (lines 1517–1579): Reusable bracket card with click-to-advance and manual score input.

### Data flow:

- Group match scores (manual input or simulated) → `groupStandings` (useMemo) → determines R32 matchups
- Knockout winners flow forward: R32 → R16 → QF → SF → Final via `knockoutWinners` state
- Single simulation (`handleAutoSimulateOnce`) computes both group and knockout phases synchronously in one pass to avoid stale state
- Batch simulation runs independently with its own temp standings, not touching React state until complete

## Domain Knowledge

- 2026 World Cup format: 48 teams → 12 groups of 4 → top 2 per group + 8 best 3rd-place teams = 32-team knockout
- Third-place ranking tiebreakers: points → GD → GF → wins → fair play → FIFA ranking
- R32 matchup table follows FIFA's official cross-group pairing (see `r32Matches` array for the mapping)
- All times are CST (Beijing, UTC+8); countdown targets `2026-06-12T03:00:00+08:00`

## Development Notes

- No npm scripts or build commands — this file is meant to be dropped into a host project or sandbox
- When editing the bracket logic, the R32→Final chain is order-dependent: each round's `useMemo` depends on `knockoutWinners` from the previous round
- The `handleAutoSimulateOnce` function duplicates the group standings calculation locally (not from React state) to avoid stale-closure issues — maintain this pattern if adding new simulation features
- Tailwind classes are used inline throughout; the color scheme is slate-950 dark theme with emerald/teal accents

## Development Commands

- `npm run dev` — 启动 Vite 开发服务器
- `npm run build` — TypeScript 编译 + Vite 生产构建
- `npm run preview` — 预览生产构建结果
