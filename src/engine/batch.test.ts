import { describe, expect, it } from 'vitest';
import { runBatchSimulation, ciHalfWidth } from './batch';

describe('runBatchSimulation', () => {
  it('同一种子+次数产生完全相同的结果（可复现）', () => {
    const a = runBatchSimulation(42, 60, {});
    const b = runBatchSimulation(42, 60, {});
    expect(a).toEqual(b);
  });

  it('结果形状完整：48队 + 顶层统计字段 + 每队含出线/夺冠率与置信区间', () => {
    const r = runBatchSimulation(7, 50, {});
    expect(r.teams).toHaveLength(48);
    expect(r.totalSims).toBe(50);
    expect(r.seed).toBe(7);
    expect(r.avgGoals).toBeDefined();
    expect(Array.isArray(r.topUpsets)).toBe(true);
    const t = r.teams[0];
    for (const k of ['name', 'flag', 'rank', 'qualifiedPct', 'qualifiedCi', 'champPct', 'champCi']) {
      expect(t).toHaveProperty(k);
    }
    // 夺冠率降序：第一名夺冠率 >= 最后一名
    const first = parseFloat(r.teams[0].champPct);
    const last = parseFloat(r.teams[r.teams.length - 1].champPct);
    expect(first).toBeGreaterThanOrEqual(last);
  });

  it('强队夺冠率显著高于弱队（西班牙 rank1 > 新西兰 rank86）', () => {
    const r = runBatchSimulation(99, 120, {});
    const byName = Object.fromEntries(r.teams.map((t) => [t.name, t]));
    expect(parseFloat(byName['西班牙'].champPct)).toBeGreaterThan(parseFloat(byName['新西兰'].champPct));
  });

  it('不同种子产生不同结果（种子确实驱动随机）', () => {
    const a = runBatchSimulation(1, 40, {});
    const b = runBatchSimulation(2, 40, {});
    expect(a).not.toEqual(b);
  });

  it('lockedMap 锁定的赛果不改变（空 map 与锁定 map 结果不同）', () => {
    const free = runBatchSimulation(5, 40, {});
    const locked = runBatchSimulation(5, 40, { 1: { homeScore: 10, awayScore: 0 } });
    expect(free).not.toEqual(locked);
  });
});

describe('ciHalfWidth (Wilson score 95% 半宽)', () => {
  it('零观测事件仍给出非零置信区间（Wald 会错误地给 0）', () => {
    // 一支球队 N 次模拟一次没夺冠：Wald=0（虚假确定），Wilson>0（诚实）
    expect(ciHalfWidth(0, 100)).toBeGreaterThan(0);
    expect(ciHalfWidth(0, 1000)).toBeGreaterThan(0);
  });

  it('p=0.5 大样本下收敛于 Wald 公式', () => {
    const n = 100000;
    const wald = 1.96 * Math.sqrt((0.5 * 0.5) / n);
    expect(ciHalfWidth(0.5, n)).toBeCloseTo(wald, 4);
  });

  it('半宽恒为有限非负数，且对 p∈[0,1] 不越界（×100 落在 [0,100]）', () => {
    for (const p of [0, 0.001, 0.05, 0.3, 0.5, 0.95, 1]) {
      const h = ciHalfWidth(p, 500) * 100;
      expect(Number.isFinite(h)).toBe(true);
      expect(h).toBeGreaterThanOrEqual(0);
      expect(h).toBeLessThanOrEqual(100);
    }
  });

  it('样本越大半宽越小（单调性）', () => {
    expect(ciHalfWidth(0.2, 100)).toBeGreaterThan(ciHalfWidth(0.2, 10000));
  });
});
