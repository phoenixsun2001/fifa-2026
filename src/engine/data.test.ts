import { describe, expect, it } from 'vitest';
import { teamMetadata, initialGroups, initialMatches } from './data';

describe('数据层完整性（迁移防回归）', () => {
  it('teamMetadata 含 48 支球队', () => {
    expect(Object.keys(teamMetadata)).toHaveLength(48);
  });

  it('每支球队元数据含 rank/region/flag/code/formBoost', () => {
    for (const [name, m] of Object.entries(teamMetadata)) {
      expect(m).toHaveProperty('rank');
      expect(m).toHaveProperty('region');
      expect(m).toHaveProperty('flag');
      expect(m).toHaveProperty('code');
      expect(m).toHaveProperty('formBoost');
    }
  });

  it('initialGroups 含 12 个小组，每组 4 队', () => {
    const groups = Object.values(initialGroups);
    expect(groups).toHaveLength(12);
    for (const g of groups) {
      expect(g.teams).toHaveLength(4);
    }
  });

  it('所有小组球队都存在于 teamMetadata', () => {
    for (const g of Object.values(initialGroups)) {
      for (const t of g.teams) {
        expect(teamMetadata).toHaveProperty(t);
      }
    }
  });

  it('initialMatches 含 72 场小组赛', () => {
    expect(initialMatches).toHaveLength(72);
  });

  it('所有比赛的主客队都存在于 teamMetadata', () => {
    for (const m of initialMatches) {
      expect(teamMetadata).toHaveProperty(m.home);
      expect(teamMetadata).toHaveProperty(m.away);
    }
  });
});
