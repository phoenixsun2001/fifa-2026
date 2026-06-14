// ==================== 整届杯赛模拟纯函数（E1 去重核心） ====================
// 统一原 handleAutoSimulateOnce 与 handleBatchSimulation 各自重复的 ~140 行
// 「小组积分 → 第三名排名 → R32 配对 → R16 → QF → SF → Final」逻辑。
// 纯函数、注入 rng、可单测、可复现。UI 批量/单次两个入口都基于它派生。

import type { Rng } from './rng';
import type { Score } from './sim';
import { simulateMatchRealistic } from './sim';
import { teamMetadata, initialGroups, initialMatches } from './data';

export interface TeamStanding {
  name: string;
  pts: number;
  gd: number;
  gf: number;
  ga: number;
  won: number;
  rank: number;
}

export interface KoMatch {
  id: string;
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
  winner: string;
}

export interface TournamentResult {
  groupScores: Record<number, Score>;       // matchId → 比分（锁定或模拟）
  standings: Record<string, TeamStanding[]>; // groupId → 排序后的 4 队
  top8Thirds: string[];
  r32: KoMatch[];
  r16: KoMatch[];
  qf: KoMatch[];
  sf: KoMatch[];
  final: KoMatch;
  champion: string;
  runnerUp: string;
}

// 积分排序：积分→净胜球→进球→胜场→FIFA排名
function sortStandings(teams: TeamStanding[]): TeamStanding[] {
  return [...teams].sort(
    (a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || b.won - a.won || a.rank - b.rank
  );
}

const rankOf = (name: string) => teamMetadata[name]?.rank || 50;

// 淘汰赛单场：平局则点球，实力（排名）高者点球胜率略高；点球胜者比分 +1
function koResolve(rng: Rng, t1: string, t2: string, id: string): KoMatch {
  const res = simulateMatchRealistic(rng, t1, t2, true);
  let hs = res.homeScore;
  let as = res.awayScore;
  if (hs === as) {
    const rank1 = rankOf(t1);
    const rank2 = rankOf(t2);
    if (rng.next() < 0.5 + (rank2 - rank1) * 0.003) {
      hs += 1;
    } else {
      as += 1;
    }
  }
  return { id, home: t1, away: t2, homeScore: hs, awayScore: as, winner: hs > as ? t1 : t2 };
}

/**
 * 模拟完整一届世界杯。
 * @param rng 种子化随机源
 * @param lockedMap { matchId: {homeScore, awayScore} } 已锁定的真实赛果，不重新模拟
 */
export function simulateTournament(
  rng: Rng,
  lockedMap: Record<number, Score>
): TournamentResult {
  // A. 小组赛
  const groupScores: Record<number, Score> = {};
  const groupPoints: Record<string, TeamStanding[]> = {};
  for (const gid of Object.keys(initialGroups)) {
    groupPoints[gid] = initialGroups[gid].teams.map((t) => ({
      name: t, pts: 0, gd: 0, gf: 0, ga: 0, won: 0, rank: rankOf(t)
    }));
  }

  for (const m of initialMatches) {
    let hs: number;
    let as: number;
    const locked = lockedMap[m.id];
    if (locked) {
      hs = locked.homeScore;
      as = locked.awayScore;
    } else {
      const res = simulateMatchRealistic(rng, m.home, m.away); // 只调用一次，保持随机消耗顺序
      hs = res.homeScore;
      as = res.awayScore;
    }
    groupScores[m.id] = { homeScore: hs, awayScore: as };

    const pool = groupPoints[m.group];
    const hTeam = pool.find((t) => t.name === m.home);
    const aTeam = pool.find((t) => t.name === m.away);
    if (hTeam && aTeam) {
      hTeam.gf += hs; hTeam.ga += as; hTeam.gd += hs - as;
      aTeam.gf += as; aTeam.ga += hs; aTeam.gd += as - hs;
      if (hs > as) { hTeam.pts += 3; hTeam.won += 1; }
      else if (hs < as) { aTeam.pts += 3; aTeam.won += 1; }
      else { hTeam.pts += 1; aTeam.pts += 1; }
    }
  }

  // B. 排序小组 + 第三名排名
  const standings: Record<string, TeamStanding[]> = {};
  for (const gid of Object.keys(groupPoints)) {
    standings[gid] = sortStandings(groupPoints[gid]);
  }
  const thirds = Object.keys(groupPoints).map((gid) => ({ ...standings[gid][2], groupId: gid }));
  const sortedThirds = sortStandings(thirds as TeamStanding[]);
  const top8Thirds = sortedThirds.slice(0, 8).map((t) => t.name);

  const w: Record<string, string> = {};
  const r: Record<string, string> = {};
  for (const gid of Object.keys(standings)) {
    const key = gid.split(' ')[1];
    w[key] = standings[gid][0].name;
    r[key] = standings[gid][1].name;
  }

  // C. R32（FIFA 官方跨组配对）
  const t8 = top8Thirds;
  const r32: KoMatch[] = [
    koResolve(rng, w['A'], t8[0], 'r32_1'),    koResolve(rng, r['B'], r['F'], 'r32_2'),
    koResolve(rng, w['C'], t8[4], 'r32_3'),    koResolve(rng, w['D'], t8[5], 'r32_4'),
    koResolve(rng, w['E'], r['A'], 'r32_5'),    koResolve(rng, w['F'], r['C'], 'r32_6'),
    koResolve(rng, w['G'], t8[1], 'r32_7'),    koResolve(rng, w['H'], t8[2], 'r32_8'),
    koResolve(rng, w['I'], r['E'], 'r32_9'),    koResolve(rng, w['J'], r['D'], 'r32_10'),
    koResolve(rng, w['K'], r['G'], 'r32_11'),   koResolve(rng, w['L'], r['H'], 'r32_12'),
    koResolve(rng, r['I'], r['J'], 'r32_13'),   koResolve(rng, r['K'], r['L'], 'r32_14'),
    koResolve(rng, t8[3], t8[6], 'r32_15'),     koResolve(rng, t8[7], w['B'], 'r32_16')
  ];

  const playRound = (prev: KoMatch[], prefix: string): KoMatch[] => {
    const out: KoMatch[] = [];
    for (let i = 0; i < prev.length; i += 2) {
      out.push(koResolve(rng, prev[i].winner, prev[i + 1].winner, `${prefix}_${i / 2 + 1}`));
    }
    return out;
  };

  const r16 = playRound(r32, 'r16');
  const qf = playRound(r16, 'qf');
  const sf = playRound(qf, 'sf');
  const finalMatch = koResolve(rng, sf[0].winner, sf[1].winner, 'final');

  return {
    groupScores,
    standings,
    top8Thirds,
    r32, r16, qf, sf,
    final: finalMatch,
    champion: finalMatch.winner,
    runnerUp: finalMatch.winner === sf[0].winner ? sf[1].winner : sf[0].winner
  };
}
