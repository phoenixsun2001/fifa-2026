import { describe, expect, it } from 'vitest';
import { createRng } from './rng';
import { simulateTournament } from './tournament';
import { teamMetadata } from './data';

describe('simulateTournament', () => {
  it('同一种子产生完全相同的结果（可复现）', () => {
    const a = simulateTournament(createRng(123), {});
    const b = simulateTournament(createRng(123), {});
    expect(a).toEqual(b);
  });

  it('R32 恰好 16 场、32 个参赛队都存在于元数据', () => {
    const r = simulateTournament(createRng(1), {});
    expect(r.r32).toHaveLength(16);
    for (const m of r.r32) {
      expect(teamMetadata).toHaveProperty(m.home);
      expect(teamMetadata).toHaveProperty(m.away);
    }
  });

  it('冠军与亚军都是 48 队之一', () => {
    const r = simulateTournament(createRng(2), {});
    expect(teamMetadata).toHaveProperty(r.champion);
    expect(teamMetadata).toHaveProperty(r.runnerUp);
  });

  it('无任何淘汰赛对阵出现占位符（每场 home/away 已确定且有胜者）', () => {
    const r = simulateTournament(createRng(3), {});
    const all = [...r.r32, ...r.r16, ...r.qf, ...r.sf, r.final];
    for (const m of all) {
      expect(typeof m.home).toBe('string');
      expect(typeof m.away).toBe('string');
      expect(m.winner).toBeTruthy();
      expect(m.winner === m.home || m.winner === m.away).toBe(true);
    }
  });

  it('lockedMap 强制的赛果反映在 groupScores', () => {
    const r = simulateTournament(createRng(4), { 1: { homeScore: 5, awayScore: 0 } });
    expect(r.groupScores[1]).toEqual({ homeScore: 5, awayScore: 0 });
  });

  it('每场淘汰赛胜者参与下一轮正确串接（final 胜者=冠军）', () => {
    const r = simulateTournament(createRng(5), {});
    expect(r.final.winner).toBe(r.champion);
  });

  it('R32 配对遵循 FIFA 官方跨组槽位映射', () => {
    const r = simulateTournament(createRng(6), {});
    const win = (g: string) => r.standings[g][0].name;   // 小组第一
    const run = (g: string) => r.standings[g][1].name;   // 小组第二
    const t8 = r.top8Thirds;
    // 校验各 R32 槽位的 home/away 来源（r32_N 按 1..16 顺序）
    expect(r.r32[0]).toMatchObject({ home: win('Group A'), away: t8[0] });
    expect(r.r32[1]).toMatchObject({ home: run('Group B'), away: run('Group F') });
    expect(r.r32[2]).toMatchObject({ home: win('Group C'), away: t8[4] });
    expect(r.r32[4]).toMatchObject({ home: win('Group E'), away: run('Group A') });
    expect(r.r32[14]).toMatchObject({ home: t8[3], away: t8[6] });
    expect(r.r32[15]).toMatchObject({ home: t8[7], away: win('Group B') });
  });

  it('每轮场次数量正确（R32=16 / R16=8 / QF=4 / SF=2 / Final=1）', () => {
    const r = simulateTournament(createRng(7), {});
    expect(r.r32).toHaveLength(16);
    expect(r.r16).toHaveLength(8);
    expect(r.qf).toHaveLength(4);
    expect(r.sf).toHaveLength(2);
  });

  it('集成：300 次模拟冠军分布合理（强队夺冠率显著高于弱队 + 多样性）', () => {
    const champCount: Record<string, number> = {};
    const N = 300;
    for (let i = 0; i < N; i++) {
      const r = simulateTournament(createRng(80000 + i), {});
      champCount[r.champion] = (champCount[r.champion] || 0) + 1;
    }
    const spain = (champCount['西班牙'] || 0) / N;
    const nz = (champCount['新西兰'] || 0) / N;
    const distinctChamps = Object.keys(champCount).length;
    // 西班牙(排名1)夺冠率应明显高于新西兰(排名86)
    expect(spain).toBeGreaterThan(nz);
    // 300 次里至少 10 支不同冠军 —— 不是退化分布
    expect(distinctChamps).toBeGreaterThanOrEqual(10);
  });
});
