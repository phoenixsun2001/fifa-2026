import { describe, expect, it } from 'vitest';
import { createRng } from './rng';
import { getPoissonGoal, simulateMatchRealistic, tau, dixonColesJoint } from './sim';

describe('getPoissonGoal', () => {
  it('同一种子+lambda 产生确定结果（可复现）', () => {
    const a = createRng(7);
    const b = createRng(7);
    expect(getPoissonGoal(a, 1.5)).toBe(getPoissonGoal(b, 1.5));
  });

  it('结果落在 [0, 9]（Knuth 上限 k<10 → 返回 k-1 ≤ 9）', () => {
    const rng = createRng(100);
    for (let i = 0; i < 2000; i++) {
      const g = getPoissonGoal(rng, 2.0);
      expect(g).toBeGreaterThanOrEqual(0);
      expect(g).toBeLessThanOrEqual(9);
    }
  });

  it('大样本均值收敛到 lambda', () => {
    const lambda = 2.3;
    let sum = 0;
    const N = 6000;
    for (let i = 0; i < N; i++) {
      sum += getPoissonGoal(createRng(2000 + i), lambda);
    }
    const mean = sum / N;
    expect(mean).toBeGreaterThan(lambda - 0.15);
    expect(mean).toBeLessThan(lambda + 0.15);
  });
});

describe('simulateMatchRealistic', () => {
  it('同一种子+对阵产生确定的比分（可复现）', () => {
    const a = createRng(42);
    const b = createRng(42);
    expect(simulateMatchRealistic(a, '巴西', '海地')).toEqual(
      simulateMatchRealistic(b, '巴西', '海地')
    );
  });

  it('比分都是非负整数', () => {
    const rng = createRng(321);
    for (let i = 0; i < 500; i++) {
      const r = simulateMatchRealistic(rng, '法国', '新西兰');
      expect(Number.isInteger(r.homeScore)).toBe(true);
      expect(Number.isInteger(r.awayScore)).toBe(true);
      expect(r.homeScore).toBeGreaterThanOrEqual(0);
      expect(r.awayScore).toBeGreaterThanOrEqual(0);
    }
  });

  it('强队对弱队：强队胜率显著更高（统计性）', () => {
    let strongWins = 0;
    const N = 1000;
    for (let i = 0; i < N; i++) {
      const r = simulateMatchRealistic(createRng(5000 + i), '西班牙', '新西兰');
      if (r.homeScore > r.awayScore) strongWins++;
    }
    // 西班牙(rank1) vs 新西兰(rank86)，主场胜率应远超 50%
    expect(strongWins / N).toBeGreaterThan(0.7);
  });
});

describe('Dixon-Coles τ 低分相关性修正', () => {
  it('tau 低分格修正值正确，其余格恒为 1', () => {
    const lh = 1.5, la = 1.3, rho = -0.13;
    expect(tau(0, 0, lh, la, rho)).toBeCloseTo(1 - lh * la * rho, 6);
    expect(tau(0, 1, lh, la, rho)).toBeCloseTo(1 + lh * rho, 6);
    expect(tau(1, 0, lh, la, rho)).toBeCloseTo(1 + la * rho, 6);
    expect(tau(1, 1, lh, la, rho)).toBeCloseTo(1 - rho, 6);
    expect(tau(2, 1, lh, la, rho)).toBe(1);
    expect(tau(3, 0, lh, la, rho)).toBe(1);
  });
});

describe('dixonColesJoint 联合得分分布', () => {
  const lh = 1.5, la = 1.3, rho = -0.13;

  it('概率矩阵归一化（所有格之和≈1）', () => {
    const m = dixonColesJoint(lh, la, rho);
    let sum = 0;
    for (const row of m) for (const c of row) sum += c;
    expect(sum).toBeCloseTo(1, 6);
  });

  it('ρ<0 提升低分平局 P(0,0)/P(1,1)，高于独立泊松（修正「低估平局」核心缺陷）', () => {
    const dc = dixonColesJoint(lh, la, rho);
    const ind = dixonColesJoint(lh, la, 0); // ρ=0 ≡ 独立泊松
    expect(dc[0][0]).toBeGreaterThan(ind[0][0]);
    expect(dc[1][1]).toBeGreaterThan(ind[1][1]);
  });

  it('ρ<0 压低 1-0/0-1 窄胜概率，低于独立泊松', () => {
    const dc = dixonColesJoint(lh, la, rho);
    const ind = dixonColesJoint(lh, la, 0);
    expect(dc[1][0]).toBeLessThan(ind[1][0]);
    expect(dc[0][1]).toBeLessThan(ind[0][1]);
  });
});
