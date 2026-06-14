// ==================== 种子化伪随机数生成器 ====================
// mulberry32：轻量、快速、可种子化的 PRNG。
// 替代 Math.random()，使所有模拟可复现 —— 同一种子必出同一序列。
// 这是「AI 大数据统计预测」可量化、可分享、可回测的基石。

/** 生成一个 mulberry32 PRNG 函数，返回 [0,1) 浮点。 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 引擎统一使用的 RNG 接口：next() 返回 [0,1)。 */
export interface Rng {
  next(): number;
}

/** 由种子创建 RNG 对象。供引擎各模块依赖注入，便于测试与复现。 */
export function createRng(seed: number): Rng {
  const raw = mulberry32(seed);
  return { next: raw };
}
