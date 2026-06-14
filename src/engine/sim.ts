// ==================== 单场比赛模拟引擎 ====================
// 从 2026.tsx 提取。算法与原版完全一致，唯一改动：用注入的种子化 rng 替代 Math.random()，
// 使单场结果可复现。Phase 2 会在此升级为攻防分离 + Dixon-Coles。

import type { Rng } from './rng';
import { teamMetadata } from './data';
import { teamRatings } from './ratings';

export interface Score {
  homeScore: number;
  awayScore: number;
}

// Knuth 算法生成泊松分布的随机目标数（上限 k<10 → 返回 k-1）
export function getPoissonGoal(rng: Rng, lambda: number): number {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= rng.next();
  } while (p > L && k < 10);
  return k - 1;
}

const DC_RHO = -0.13; // Dixon-Coles 相关性参数（负值：提升低分平局、压低窄胜，对齐真实足球两队进球的负相关）

// 泊松分布概率质量函数 PMF
function poissonPmf(k: number, lambda: number): number {
  let fact = 1;
  for (let i = 2; i <= k; i++) fact *= i;
  return (Math.exp(-lambda) * Math.pow(lambda, k)) / fact;
}

/** Dixon-Coles τ 低分相关性修正因子（仅 0-0/0-1/1-0/1-1 四格非 1）。 */
export function tau(x: number, y: number, lh: number, la: number, rho: number): number {
  if (x === 0 && y === 0) return 1 - lh * la * rho;
  if (x === 0 && y === 1) return 1 + lh * rho;
  if (x === 1 && y === 0) return 1 + la * rho;
  if (x === 1 && y === 1) return 1 - rho;
  return 1;
}

/** Dixon-Coles 联合得分概率矩阵（归一化），x=主队进球、y=客队进球，范围 0..maxGoals。 */
export function dixonColesJoint(lh: number, la: number, rho: number, maxGoals = 8): number[][] {
  const m: number[][] = [];
  let sum = 0;
  for (let x = 0; x <= maxGoals; x++) {
    m[x] = [];
    for (let y = 0; y <= maxGoals; y++) {
      const w = tau(x, y, lh, la, rho) * poissonPmf(x, lh) * poissonPmf(y, la);
      m[x][y] = w;
      sum += w;
    }
  }
  for (let x = 0; x <= maxGoals; x++) for (let y = 0; y <= maxGoals; y++) m[x][y] /= sum;
  return m;
}

// 从联合分布矩阵采样一个 (x,y)，仅消耗 1 个随机数（替代两次独立 getPoissonGoal）
function sampleJoint(rng: Rng, m: number[][]): [number, number] {
  const u = rng.next();
  let cum = 0;
  for (let x = 0; x < m.length; x++) {
    for (let y = 0; y < m[x].length; y++) {
      cum += m[x][y];
      if (u <= cum) return [x, y];
    }
  }
  return [m.length - 1, m[0].length - 1]; // 浮点兜底
}

// 模拟单场比赛的核心科学引擎
// isNeutral: 淘汰赛视为中立场（无东道主场地加成）
export function simulateMatchRealistic(
  rng: Rng,
  homeName: string,
  awayName: string,
  isNeutral = false,
  _hostCountry = ''
): Score {
  const homeMeta = teamMetadata[homeName] || { rank: 50, region: '欧洲', code: '', flag: '🏳️', formBoost: 0 };
  const awayMeta = teamMetadata[awayName] || { rank: 50, region: '欧洲', code: '', flag: '🏳️', formBoost: 0 };

  // Phase 3 (C1/A1)：攻防分离 —— 从阵容俱乐部级别派生 attack/defense 双维评分，
  // 以 Dixon-Coles 乘性形式 λ = BASE × atk_i / def_j 替代旧「单一排名差镜像」。
  // 让挪威(攻强守弱)对摩洛哥(守强攻弱)踢出真实风格差异，全下游概率受益。
  const rH = teamRatings[homeName] || { attack: 1, defense: 1 };
  const rA = teamRatings[awayName] || { attack: 1, defense: 1 };
  const BASE_LAMBDA = 1.35; // 平均场均进球期望（两队各约 1.35，全场 ~2.7 球）
  let homeExp = (BASE_LAMBDA * rH.attack) / rA.defense;
  let awayExp = (BASE_LAMBDA * rA.attack) / rH.defense;

  // 地利因素：东道主加成（美加墨在境内算主场优势）
  if (!isNeutral) {
    if (homeMeta.code === 'USA' || homeMeta.code === 'MEX' || homeMeta.code === 'CAN') {
      homeExp += 0.25;
    }
    if (awayMeta.code === 'USA' || awayMeta.code === 'MEX' || awayMeta.code === 'CAN') {
      awayExp += 0.10;
    }
  }

  // 大区加权校正
  if (homeMeta.region === '南美洲' || homeMeta.region === '欧洲') homeExp += 0.1;
  if (awayMeta.region === '南美洲' || awayMeta.region === '欧洲') awayExp += 0.1;

  // 边界约束（A6 放宽：0.5~3.5 → 0.4~4.0，让悬殊局能正确拉开进球差）
  homeExp = Math.max(0.4, Math.min(4.0, homeExp));
  awayExp = Math.max(0.4, Math.min(4.0, awayExp));

  // Phase 2 (A2)：Dixon-Coles 联合采样替代独立双泊松 —— 捕捉两队进球的负相关，
  // 修正独立泊松对 0-0/1-1 的低估与对 1-0/0-1 的高估（roadmap 核心缺陷 #2）。
  const joint = dixonColesJoint(homeExp, awayExp, DC_RHO);
  const [hs, as] = sampleJoint(rng, joint);
  return { homeScore: hs, awayScore: as };
}
