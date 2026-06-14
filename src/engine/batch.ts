// ==================== 批量蒙特卡洛聚合纯函数（B1：从 UI 抽离，供主线程/Worker 共用） ====================
// 把 N 次整届杯赛模拟的「计数 → 归一化 → 排序 → 置信区间 → 冷门」全部封进纯函数，
// 这样 Web Worker 与主线程降级路径调用同一份逻辑，零分叉（Phase 0 DRY 精神延续）。

import { createRng } from './rng';
import { simulateTournament } from './tournament';
import { teamMetadata, initialMatches } from './data';

export interface Score { homeScore: number; awayScore: number; }

export interface BatchTeamStat {
  name: string;
  flag: string;
  rank: number;
  region: string;
  formBoost: number;
  qualifiedPct: string;
  qualifiedCi: string;
  r16Pct: string;
  qfPct: string;
  sfPct: string;
  finalPct: string;
  champPct: string;
  champCi: string;
  darkHorsePct: string;
  darkHorseRuns: number;
}

export interface BatchStats {
  teams: BatchTeamStat[];
  avgGoals: string;
  totalSims: number;
  seed: number;
  topUpsets: { match: string; count: number }[];
}

/**
 * 95% 置信区间半宽（Wilson score interval，比例单位）。
 * 取代 Wald（p(1-p)/n）：Wald 在罕见事件（弱队夺冠率）下给 0 甚至负值，虚假确定；
 * Wilson 恒落 [0,1]、零观测也给出非零区间，是专业级比例区间标准。
 * B4 方差缩减：实测 antithetic variates 对本锦标赛非单调映射净正相关（无效），
 * 故转向「准确区间估计 + Worker 大样本」这条诚实有效的路径。
 */
export function ciHalfWidth(p: number, n: number): number {
  const z = 1.96;
  const denom = 1 + (z * z) / n;
  return (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / denom;
}

/**
 * 运行 count 次整届杯赛蒙特卡洛，聚合出大盘统计。
 * @param seed  基础种子，第 run 次用 createRng(seed + run) → 同 seed+count 完全可复现
 * @param count 模拟次数
 * @param lockedMap 已锁定的真实赛果（matchId → 比分），不重新模拟
 */
export function runBatchSimulation(
  seed: number,
  count: number,
  lockedMap: Record<number, Score>
): BatchStats {
  // 初始化全 48 队统计桶
  const tracker: Record<string, {
    name: string; qualifiedCount: number; r16Count: number; qfCount: number;
    sfCount: number; runnerUpCount: number; champCount: number;
    groupMatchesGoals: number; darkHorseRuns: number;
  }> = {};
  for (const name of Object.keys(teamMetadata)) {
    tracker[name] = { name, qualifiedCount: 0, r16Count: 0, qfCount: 0, sfCount: 0, runnerUpCount: 0, champCount: 0, groupMatchesGoals: 0, darkHorseRuns: 0 };
  }

  let totalGoalsSimmed = 0;
  const upsetsRecorded: { winner: string; loser: string; score: string }[] = [];

  for (let run = 0; run < count; run++) {
    const rng = createRng(seed + run); // B2：每次推演派生自基础种子 → 可整批复现
    const t = simulateTournament(rng, lockedMap);

    // 小组赛进球 + 冷门（FIFA 排名相差 30 以上低位战胜高位）
    for (const m of initialMatches) {
      const sc = t.groupScores[m.id];
      totalGoalsSimmed += sc.homeScore + sc.awayScore;
      const rankHome = teamMetadata[m.home]?.rank || 50;
      const rankAway = teamMetadata[m.away]?.rank || 50;
      if (Math.abs(rankHome - rankAway) >= 30) {
        if ((sc.homeScore > sc.awayScore && rankHome > rankAway) || (sc.awayScore > sc.homeScore && rankAway > rankHome)) {
          upsetsRecorded.push({
            winner: sc.homeScore > sc.awayScore ? m.home : m.away,
            loser: sc.homeScore > sc.awayScore ? m.away : m.home,
            score: `${Math.max(sc.homeScore, sc.awayScore)}-${Math.min(sc.homeScore, sc.awayScore)}`
          });
        }
      }
    }

    // 出线计数：小组前两名 + 8 个最佳第三名
    for (const gid of Object.keys(t.standings)) {
      tracker[t.standings[gid][0].name].qualifiedCount++;
      tracker[t.standings[gid][1].name].qualifiedCount++;
    }
    for (const name of t.top8Thirds) tracker[name].qualifiedCount++;

    // 淘汰赛计数
    for (const m of t.r16) tracker[m.winner].r16Count++;
    for (const m of t.qf) tracker[m.winner].qfCount++;
    for (const m of t.sf) tracker[m.winner].sfCount++;
    tracker[t.champion].champCount++;
    tracker[t.runnerUp].runnerUpCount++;

    // 黑马追踪：FIFA 排名 20 以外进入四强（qf 胜者 = 四强席位）
    for (const m of t.qf) {
      if ((teamMetadata[m.winner]?.rank || 50) > 20) tracker[m.winner].darkHorseRuns++;
    }
  }

  const teams: BatchTeamStat[] = Object.keys(tracker).map((name) => {
    const tt = tracker[name];
    const qP = tt.qualifiedCount / count;
    const cP = tt.champCount / count;
    return {
      name,
      flag: teamMetadata[name]?.flag || '🏳️',
      rank: teamMetadata[name]?.rank || 50,
      region: teamMetadata[name]?.region || '欧洲',
      formBoost: teamMetadata[name]?.formBoost || 0,
      qualifiedPct: (qP * 100).toFixed(1),
      qualifiedCi: (ciHalfWidth(qP, count) * 100).toFixed(1),
      r16Pct: ((tt.r16Count / count) * 100).toFixed(1),
      qfPct: ((tt.qfCount / count) * 100).toFixed(1),
      sfPct: ((tt.sfCount / count) * 100).toFixed(1),
      finalPct: (((tt.champCount + tt.runnerUpCount) / count) * 100).toFixed(1),
      champPct: (cP * 100).toFixed(1),
      champCi: (ciHalfWidth(cP, count) * 100).toFixed(1),
      darkHorsePct: ((tt.darkHorseRuns / count) * 100).toFixed(1),
      darkHorseRuns: tt.darkHorseRuns
    };
  });
  teams.sort((a, b) => parseFloat(b.champPct) - parseFloat(a.champPct) || a.rank - b.rank);

  const upsetSummary = upsetsRecorded.reduce<Record<string, number>>((acc, c) => {
    const key = `${c.winner} 胜 ${c.loser}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const topUpsets = Object.keys(upsetSummary)
    .map((k) => ({ match: k, count: upsetSummary[k] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  return {
    teams,
    avgGoals: (totalGoalsSimmed / (count * 72)).toFixed(2), // 72 场小组赛平均
    totalSims: count,
    seed,
    topUpsets
  };
}
