import { describe, expect, it } from 'vitest';
import { mulberry32, createRng } from './rng';

describe('mulberry32 种子化 PRNG', () => {
  it('返回一个产生 [0,1) 浮点的函数', () => {
    const rng = mulberry32(42);
    for (let i = 0; i < 100; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it('同一种子产生完全相同的序列（确定性 / 可复现）', () => {
    const a = mulberry32(12345);
    const b = mulberry32(12345);
    const seqA = Array.from({ length: 10 }, () => a());
    const seqB = Array.from({ length: 10 }, () => b());
    expect(seqA).toEqual(seqB);
  });

  it('不同种子产生不同序列', () => {
    const a = mulberry32(1);
    const b = mulberry32(2);
    const seqA = Array.from({ length: 10 }, () => a());
    const seqB = Array.from({ length: 10 }, () => b());
    expect(seqA).not.toEqual(seqB);
  });
});

describe('createRng', () => {
  it('返回带 next() 的对象，next() 等价于 mulberry32 同种子', () => {
    const rng = createRng(999);
    const raw = mulberry32(999);
    const fromObj = Array.from({ length: 5 }, () => rng.next());
    const fromRaw = Array.from({ length: 5 }, () => raw());
    expect(fromObj).toEqual(fromRaw);
  });
});
