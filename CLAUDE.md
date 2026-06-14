# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

2026 FIFA World Cup (美加墨世界杯) interactive simulator — Vite + React 18 + TypeScript SPA. The prediction engine is fully extracted into a modular, tested `src/engine/` layer (~45 vitest tests); `2026.tsx` is the UI/state layer. Originally single-file, refactored across Phase 0–3 (see `docs/预测引擎优化路线图.md`).

## Architecture

### Engine modules (`src/engine/`) — the prediction core

| Module | Role |
|---|---|
| `rng.ts` | mulberry32 seedable PRNG (reproducible runs) |
| `data.ts` | teamMetadata / initialGroups / initialMatches |
| `squads.ts` | 48-team squad rosters (single source of truth) |
| `ratings.ts` | club-tier → per-team attack/defense (normalized to mean 1.0) |
| `sim.ts` | `simulateMatchRealistic()` — Dixon-Coles joint sampling + τ low-score correction; λ = 1.35 × attack_i / defense_j |
| `tournament.ts` | `simulateTournament(rng, lockedMap)` — full-cup pure function |
| `batch.ts` | `runBatchSimulation(seed, count, lockedMap)` — Monte Carlo aggregation + Wilson score ±95% CI |
| `batch.worker.ts` | off-main-thread batch runner (up to 10,000 runs) |

### Key sections within `2026.tsx` (UI layer):

1. **Data**: `teamMetadata`, `initialGroups`, `initialMatches`, `venuesData` (mirrored in `src/engine/data.ts`). `teamSquads` stays inline here for the squad-browse tab (engine copy in `squads.ts`).
2. **React state & computed data**: `App` component with tabs (schedule / groups / bracket / stats / venues / squads / format). Core `useMemo` chains: `groupStandings` → `thirdPlaceRankings` → `top8ThirdTeams` → `qualifiedTeams` → `r32Matches` → … → `finalMatch`.
3. **Batch simulation**: `handleBatchSimulation()` posts `{seed, count, lockedMap}` to `batch.worker.ts`; falls back to inline `runBatchSimulation` if Worker unavailable. Seed auto-rolls to a new random value after each run.
4. **JSX rendering**: Tab-based UI — schedule cards, group tables, knockout bracket, stats dashboard, venue/squad cards.
5. **KnockoutMatchCard**: Reusable bracket card with click-to-advance and manual score input.

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
