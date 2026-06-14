import { describe, expect, it } from 'vitest';
import { clubTier, rawRatings, teamRatings } from './ratings';
import type { SquadPlayer } from './squads';

const elite = (pos: SquadPlayer['pos']): SquadPlayer => ({ name: 'x', pos, num: 1, club: '曼城' });
const weak = (pos: SquadPlayer['pos']): SquadPlayer => ({ name: 'x', pos, num: 1, club: '某弱旅' });

describe('clubTier 俱乐部分级', () => {
  it('精英欧洲豪门=5，未知/弱旅=1', () => {
    expect(clubTier('曼城')).toBe(5);
    expect(clubTier('皇家马德里')).toBe(5);
    expect(clubTier('拜仁慕尼黑')).toBe(5);
    expect(clubTier('某弱旅')).toBe(1);
  });
});

describe('rawRatings 攻防分离（Phase 3 核心突破）', () => {
  it('前锋堆叠的阵容：attack 显著高于 defense', () => {
    const fwHeavy: SquadPlayer[] = [elite('FW'), elite('FW'), elite('FW'), weak('GK'), weak('DF')];
    const r = rawRatings(fwHeavy);
    expect(r.attack).toBeGreaterThan(r.defense);
  });

  it('后卫/门将堆叠的阵容：defense 显著高于 attack', () => {
    const dfHeavy: SquadPlayer[] = [elite('DF'), elite('DF'), elite('GK'), weak('FW'), weak('MF')];
    const r = rawRatings(dfHeavy);
    expect(r.defense).toBeGreaterThan(r.attack);
  });

  it('同等阵容下精英球员（曼城）攻防均高于弱旅', () => {
    const sameShape: SquadPlayer[] = [elite('FW'), elite('MF'), elite('DF'), elite('GK')];
    const weakShape: SquadPlayer[] = [weak('FW'), weak('MF'), weak('DF'), weak('GK')];
    expect(rawRatings(sameShape).attack).toBeGreaterThan(rawRatings(weakShape).attack);
    expect(rawRatings(sameShape).defense).toBeGreaterThan(rawRatings(weakShape).defense);
  });
});

describe('teamRatings 全局归一化', () => {
  it('48 队齐全，每队 attack/defense 为正有限值', () => {
    for (const name of Object.keys(teamRatings)) {
      const r = teamRatings[name];
      expect(Number.isFinite(r.attack)).toBe(true);
      expect(Number.isFinite(r.defense)).toBe(true);
      expect(r.attack).toBeGreaterThan(0);
      expect(r.defense).toBeGreaterThan(0);
    }
    expect(Object.keys(teamRatings).length).toBeGreaterThanOrEqual(48);
  });

  it('全局均值≈1.0（归一化后强弱以倍率表达）', () => {
    const vals = Object.values(teamRatings);
    const meanAtk = vals.reduce((s, r) => s + r.attack, 0) / vals.length;
    const meanDef = vals.reduce((s, r) => s + r.defense, 0) / vals.length;
    expect(meanAtk).toBeCloseTo(1, 1);
    expect(meanDef).toBeCloseTo(1, 1);
  });

  it('强队 attack 显著高于弱队（西班牙/法国 > 新西兰）', () => {
    expect(teamRatings['西班牙'].attack).toBeGreaterThan(teamRatings['新西兰'].attack);
    expect(teamRatings['法国'].attack).toBeGreaterThan(teamRatings['新西兰'].attack);
  });
});
