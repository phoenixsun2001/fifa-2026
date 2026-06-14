// ==================== 批量推演 Web Worker（B1） ====================
// 主线程 postMessage({seed,count,lockedMap}) → 此 worker 在后台线程跑完 N 次整届杯赛模拟
// → postMessage(BatchStats) 回主线程。主线程零阻塞，支持 10000+ 次。
// 逻辑全部委托给纯函数 runBatchSimulation，与主线程降级路径完全一致（同种子同结果）。

import { runBatchSimulation } from './batch';

self.onmessage = (e: MessageEvent<{ seed: number; count: number; lockedMap: Record<number, { homeScore: number; awayScore: number }> }>) => {
  const { seed, count, lockedMap } = e.data;
  const result = runBatchSimulation(seed, count, lockedMap);
  (self as unknown as Worker).postMessage(result);
};
