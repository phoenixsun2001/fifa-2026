// ==================== 攻防评分派生（Phase 3 / C1：激活阵容数据） ====================
// 把沉睡的 teamSquads 转化为每队 attack/defense 双维评分 —— 让挪威(攻强守弱)与
// 摩洛哥(守强攻弱)踢出风格差异。这是 Phase 2 诚实延后的 A1 攻防分离的真正落点。
// 质量信号 = 球员所属俱乐部级别（clubTier），按位置加权聚合（FW/MF→attack，DF/GK→defense），
// 全局归一化到均值 1.0，供 sim.ts 以 Dixon-Coles 乘性形式 λ = base × atk_i / def_j 使用。

import { teamSquads } from './squads';
import type { SquadPlayer } from './squads';

// 俱乐部分级：5=世界豪门，4=欧冠劲旅，3=欧战/五大联赛中上游，2=沙特/土耳其/南美顶尖，
// 1=其余（默认）。覆盖数据中出现的所有相关俱乐部。
const CLUB_TIERS: Record<string, number> = {
  // 5 — 世界豪门
  '曼城': 5, '皇家马德里': 5, '拜仁慕尼黑': 5, '巴塞罗那': 5, '巴黎圣日耳曼': 5,
  '利物浦': 5, '阿森纳': 5, '国际米兰': 5, '勒沃库森': 5,
  // 4 — 欧冠劲旅
  '多特蒙德': 4, '马德里竞技': 4, '尤文图斯': 4, 'AC米兰': 4, '那不勒斯': 4,
  '亚特兰大': 4, '热刺': 4, '切尔西': 4, '曼联': 4, '莱比锡': 4, '纽卡斯尔': 4,
  '阿斯顿维拉': 4,
  // 3 — 欧战/五大联赛中上游
  '摩纳哥': 3, '马赛': 3, '罗马': 3, '拉齐奥': 3, '佛罗伦萨': 3, '皇家社会': 3,
  '比利亚雷亚尔': 3, '贝蒂斯': 3, '皇家贝蒂斯': 3, '塞维利亚': 3, '法兰克福': 3,
  '沃尔夫斯堡': 3, '莱斯特城': 3, '埃弗顿': 3, '诺丁汉森林': 3, '西汉姆': 3,
  '水晶宫': 3, '布莱顿': 3, '富勒姆': 3, '雷恩': 3, '里尔': 3, '里昂': 3,
  '本菲卡': 3, '波尔图': 3, '阿贾克斯': 3, '里斯本竞技': 3, '费耶诺德': 3,
  '埃因霍温': 3, 'PSV': 3, '萨尔茨堡': 3, '凯尔特人': 3, '格拉斯哥流浪者': 3,
  '柏林联合': 3, '弗赖堡': 3, '霍芬海姆': 3, '美因茨': 3, '奥格斯堡': 3,
  '门兴': 3, '都灵': 3, '博洛尼亚': 3, '布伦特福德': 3, '狼队': 3,
  '毕尔巴鄂竞技': 3, '奥萨苏纳': 3, '赫塔菲': 3, '马略卡': 3, '帕尔马': 3,
  '乌迪内斯': 3, '伯恩利': 3, '伯恩茅斯': 3, '图卢兹': 3, '南特': 3,
  '蒙彼利埃': 3, '圣保利': 3, '波鸿': 3, '根特': 3, '卡拉巴赫': 3,
  '明尼苏达联': 3, '芝加哥火焰': 2, '纽约红牛': 2,
  // 2 — 沙特/土耳其/南美顶尖
  '利雅得新月': 2, '利雅得胜利': 2, '吉达联合': 2, '吉达国民': 2, '吉达伊蒂哈德': 2,
  '萨德': 2, '杜海勒': 2, '加拉塔萨雷': 2, '费内巴切': 2, '贝西克塔斯': 2,
  '特拉布宗体育': 2, '阿尔阿赫利': 2, '迈阿密国际': 2, '帕尔梅拉斯': 2,
  '弗拉门戈': 2, '河床': 2, '莫斯科火车头': 2, '莫斯科斯巴达': 2, 'AEK雅典': 2,
  '中央陆军': 2,
};

export function clubTier(club: string): number {
  return CLUB_TIERS[club] ?? 1;
}

export interface Ratings { attack: number; defense: number; }

// 位置对 attack/defense 的贡献权重
const ATK_W: Record<SquadPlayer['pos'], number> = { FW: 1.0, MF: 0.55, DF: 0.05, GK: 0 };
const DEF_W: Record<SquadPlayer['pos'], number> = { DF: 1.0, GK: 0.9, MF: 0.4, FW: 0.05 };

/** 原始攻防分（未归一化）：按位置加权累加俱乐部级别。 */
export function rawRatings(players: SquadPlayer[]): Ratings {
  let attack = 0;
  let defense = 0;
  for (const p of players) {
    const q = clubTier(p.club);
    attack += q * ATK_W[p.pos];
    defense += q * DEF_W[p.pos];
  }
  return { attack, defense };
}

// 预计算 48 队归一化评分（模块加载时一次性，主线程与 Worker 共用，无重复开销）
function computeTeamRatings(): Record<string, Ratings> {
  const names = Object.keys(teamSquads);
  const raw: Record<string, Ratings> = {};
  let sumAtk = 0, sumDef = 0;
  for (const name of names) {
    const r = rawRatings(teamSquads[name].players);
    raw[name] = r;
    sumAtk += r.attack;
    sumDef += r.defense;
  }
  const meanAtk = sumAtk / names.length;
  const meanDef = sumDef / names.length;
  const out: Record<string, Ratings> = {};
  for (const name of names) {
    out[name] = { attack: raw[name].attack / meanAtk, defense: raw[name].defense / meanDef };
  }
  return out;
}

export const teamRatings: Record<string, Ratings> = computeTeamRatings();
