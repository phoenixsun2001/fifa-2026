// ==================== 引擎数据层 ====================
// 从 2026.tsx 迁出的核心预测数据：球队元数据 / 分组 / 小组赛赛程。
// teamSquads（阵容）与 venuesData（场馆）仍属 UI 层，留在 2026.tsx，待 Phase 3 激活。
// 这里只放引擎 simulateTournament 真正依赖的数据。

export interface TeamMeta {
  code: string;
  flag: string;
  rank: number;
  region: string;
  formBoost: number;
}

export interface GroupDef {
  name: string;
  teams: string[];
}

export interface MatchDef {
  id: number;
  date: string;
  time: string;
  group: string;
  home: string;
  away: string;
  venue: string;
  city: string;
  country: string;
  homeScore: string | number;
  awayScore: string | number;
  isMajor: boolean;
  locked: boolean;
}

// 48支球队 FIFA 排名、大区及综合实力元数据
// formBoost: 基于近期状态、阵容质量、赛事表现的实力修正（正值=被FIFA排名低估）
export const teamMetadata: Record<string, TeamMeta> = {
  '墨西哥': { code: 'MEX', flag: '🇲🇽', rank: 15, region: '中北美', formBoost: 8 },
  '南非': { code: 'RSA', flag: '🇿🇦', rank: 61, region: '非洲', formBoost: 0 },
  '韩国': { code: 'KOR', flag: '🇰🇷', rank: 22, region: '亚洲', formBoost: 3 },
  '捷克': { code: 'CZE', flag: '🇨🇿', rank: 31, region: '欧洲', formBoost: 0 },
  '加拿大': { code: 'CAN', flag: '🇨🇦', rank: 27, region: '中北美', formBoost: 3 },
  '波黑': { code: 'BIH', flag: '🇧🇦', rank: 63, region: '欧洲', formBoost: 0 },
  '卡塔尔': { code: 'QAT', flag: '🇶🇦', rank: 51, region: '亚洲', formBoost: 0 },
  '瑞士': { code: 'SUI', flag: '🇨🇭', rank: 12, region: '欧洲', formBoost: 5 },
  '巴西': { code: 'BRA', flag: '🇧🇷', rank: 5, region: '南美洲', formBoost: 2 },
  '摩洛哥': { code: 'MAR', flag: '🇲🇦', rank: 13, region: '非洲', formBoost: 5 },
  '海地': { code: 'HAI', flag: '🇭🇹', rank: 84, region: '中北美', formBoost: 0 },
  '苏格兰': { code: 'SCO', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', rank: 36, region: '欧洲', formBoost: 0 },
  '美国': { code: 'USA', flag: '🇺🇸', rank: 14, region: '中北美', formBoost: 4 },
  '巴拉圭': { code: 'PAR', flag: '🇵🇾', rank: 39, region: '南美洲', formBoost: 0 },
  '澳大利亚': { code: 'AUS', flag: '🇦🇺', rank: 26, region: '亚洲', formBoost: 0 },
  '土耳其': { code: 'TUR', flag: '🇹🇷', rank: 35, region: '欧洲', formBoost: 3 },
  '德国': { code: 'GER', flag: '🇩🇪', rank: 9, region: '欧洲', formBoost: 2 },
  '库拉索': { code: 'CUW', flag: '🇨🇼', rank: 82, region: '中北美', formBoost: 0 },
  '科特迪瓦': { code: 'CIV', flag: '🇨🇮', rank: 42, region: '非洲', formBoost: 0 },
  '厄瓜多尔': { code: 'ECU', flag: '🇪🇨', rank: 23, region: '南美洲', formBoost: 10 },
  '荷兰': { code: 'NED', flag: '🇳🇱', rank: 7, region: '欧洲', formBoost: 2 },
  '日本': { code: 'JPN', flag: '🇯🇵', rank: 18, region: '亚洲', formBoost: 10 },
  '瑞典': { code: 'SWE', flag: '🇸🇪', rank: 21, region: '欧洲', formBoost: 5 },
  '突尼斯': { code: 'TUN', flag: '🇹🇳', rank: 40, region: '非洲', formBoost: 0 },
  '比利时': { code: 'BEL', flag: '🇧🇪', rank: 8, region: '欧洲', formBoost: -2 },
  '埃及': { code: 'EGY', flag: '🇪🇬', rank: 34, region: '非洲', formBoost: 0 },
  '伊朗': { code: 'IRN', flag: '🇮🇷', rank: 20, region: '亚洲', formBoost: 2 },
  '新西兰': { code: 'NZL', flag: '🇳🇿', rank: 86, region: '大洋洲', formBoost: 0 },
  '西班牙': { code: 'ESP', flag: '🇪🇸', rank: 1, region: '欧洲', formBoost: 0 },
  '佛得角': { code: 'CPV', flag: '🇨🇻', rank: 68, region: '非洲', formBoost: 0 },
  '沙特阿拉伯': { code: 'KSA', flag: '🇸🇦', rank: 60, region: '亚洲', formBoost: 0 },
  '乌拉圭': { code: 'URU', flag: '🇺🇾', rank: 11, region: '南美洲', formBoost: 2 },
  '法国': { code: 'FRA', flag: '🇫🇷', rank: 3, region: '欧洲', formBoost: 2 },
  '塞内加尔': { code: 'SEN', flag: '🇸🇳', rank: 17, region: '非洲', formBoost: 8 },
  '挪威': { code: 'NOR', flag: '🇳🇴', rank: 29, region: '欧洲', formBoost: 15 },
  '伊拉克': { code: 'IRQ', flag: '🇮🇶', rank: 55, region: '亚洲', formBoost: 0 },
  '阿根廷': { code: 'ARG', flag: '🇦🇷', rank: 2, region: '南美洲', formBoost: 2 },
  '阿尔及利亚': { code: 'ALG', flag: '🇩🇿', rank: 35, region: '非洲', formBoost: 0 },
  '奥地利': { code: 'AUT', flag: '🇦🇹', rank: 24, region: '欧洲', formBoost: 2 },
  '约旦': { code: 'JOR', flag: '🇯🇴', rank: 66, region: '亚洲', formBoost: 0 },
  '葡萄牙': { code: 'POR', flag: '🇵🇹', rank: 6, region: '欧洲', formBoost: 2 },
  '民主刚果': { code: 'COD', flag: '🇨🇩', rank: 62, region: '非洲', formBoost: 0 },
  '乌兹别克斯坦': { code: 'UZB', flag: '🇺🇿', rank: 50, region: '亚洲', formBoost: 0 },
  '哥伦比亚': { code: 'COL', flag: '🇨🇴', rank: 16, region: '南美洲', formBoost: 8 },
  '英格兰': { code: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rank: 4, region: '欧洲', formBoost: 2 },
  '克罗地亚': { code: 'CRO', flag: '🇭🇷', rank: 10, region: '欧洲', formBoost: -3 },
  '加纳': { code: 'GHA', flag: '🇬🇭', rank: 72, region: '非洲', formBoost: 0 },
  '巴拿马': { code: 'PAN', flag: '🇵🇦', rank: 30, region: '中北美', formBoost: 2 }
};

export const initialGroups: Record<string, GroupDef> = {
  'Group A': { name: 'A组', teams: ['墨西哥', '南非', '韩国', '捷克'] },
  'Group B': { name: 'B组', teams: ['加拿大', '波黑', '卡塔尔', '瑞士'] },
  'Group C': { name: 'C组', teams: ['巴西', '摩洛哥', '海地', '苏格兰'] },
  'Group D': { name: 'D组', teams: ['美国', '巴拉圭', '澳大利亚', '土耳其'] },
  'Group E': { name: 'E组', teams: ['德国', '库拉索', '科特迪瓦', '厄瓜多尔'] },
  'Group F': { name: 'F组', teams: ['荷兰', '日本', '瑞典', '突尼斯'] },
  'Group G': { name: 'G组', teams: ['比利时', '埃及', '伊朗', '新西兰'] },
  'Group H': { name: 'H组', teams: ['西班牙', '佛得角', '沙特阿拉伯', '乌拉圭'] },
  'Group I': { name: 'I组', teams: ['法国', '塞内加尔', '挪威', '伊拉克'] },
  'Group J': { name: 'J组', teams: ['阿根廷', '阿尔及利亚', '奥地利', '约旦'] },
  'Group K': { name: 'K组', teams: ['葡萄牙', '民主刚果', '乌兹别克斯坦', '哥伦比亚'] },
  'Group L': { name: 'L组', teams: ['英格兰', '克罗地亚', '加纳', '巴拿马'] }
};

// 北京时间日程基础数据
export const initialMatches: MatchDef[] = [
  { id: 1, date: '2026-06-12', time: '03:00', group: 'Group A', home: '墨西哥', away: '南非', venue: '阿兹特克体育场', city: '墨西哥城', country: '墨西哥', homeScore: '', awayScore: '', isMajor: true, locked: false },
  { id: 2, date: '2026-06-12', time: '07:00', group: 'Group A', home: '韩国', away: '捷克', venue: '阿克伦体育场', city: '瓜达拉哈拉', country: '墨西哥', homeScore: '', awayScore: '', isMajor: false, locked: false },
  { id: 3, date: '2026-06-13', time: '03:00', group: 'Group B', home: '加拿大', away: '波黑', venue: '多伦多体育场', city: '多伦多', country: '加拿大', homeScore: '', awayScore: '', isMajor: true, locked: false },
  { id: 4, date: '2026-06-13', time: '09:00', group: 'Group D', home: '美国', away: '巴拉圭', venue: 'SoFi体育场', city: '洛杉矶', country: '美国', homeScore: '', awayScore: '', isMajor: true, locked: false },
  { id: 5, date: '2026-06-14', time: '03:00', group: 'Group B', home: '卡塔尔', away: '瑞士', venue: '李维斯体育场', city: '旧金山湾区', country: '美国', homeScore: '', awayScore: '', isMajor: false, locked: false },
  { id: 6, date: '2026-06-14', time: '06:00', group: 'Group C', home: '巴西', away: '摩洛哥', venue: '大都会人寿体育场', city: '纽约/新泽西', country: '美国', homeScore: '', awayScore: '', isMajor: true, locked: false },
  { id: 7, date: '2026-06-14', time: '09:00', group: 'Group C', home: '海地', away: '苏格兰', venue: '吉列体育场', city: '波士顿', country: '美国', homeScore: '', awayScore: '', isMajor: false, locked: false },
  { id: 8, date: '2026-06-14', time: '12:00', group: 'Group D', home: '澳大利亚', away: '土耳其', venue: 'BC Place体育场', city: '温哥华', country: '加拿大', homeScore: '', awayScore: '', isMajor: false, locked: false },
  { id: 9, date: '2026-06-15', time: '01:00', group: 'Group E', home: '德国', away: '库拉索', venue: 'NRG体育场', city: '休斯敦', country: '美国', homeScore: '', awayScore: '', isMajor: false, locked: false },
  { id: 10, date: '2026-06-15', time: '03:00', group: 'Group F', home: '荷兰', away: '日本', venue: 'AT&T体育场', city: '达拉斯', country: '美国', homeScore: '', awayScore: '', isMajor: true, locked: false },
  { id: 11, date: '2026-06-15', time: '07:00', group: 'Group E', home: '科特迪瓦', away: '厄瓜多尔', venue: '林肯金融体育场', city: '费城', country: '美国', homeScore: '', awayScore: '', isMajor: false, locked: false },
  { id: 12, date: '2026-06-15', time: '08:00', group: 'Group F', home: '瑞典', away: '突尼斯', venue: 'BBVA体育场', city: '蒙特雷', country: '墨西哥', homeScore: '', awayScore: '', isMajor: false, locked: false },
  { id: 13, date: '2026-06-16', time: '00:00', group: 'Group H', home: '西班牙', away: '佛得角', venue: '奔驰体育场', city: '亚特兰大', country: '美国', homeScore: '', awayScore: '', isMajor: false, locked: false },
  { id: 14, date: '2026-06-16', time: '03:00', group: 'Group G', home: '比利时', away: '埃及', venue: '卢门球场', city: '西雅图', country: '美国', homeScore: '', awayScore: '', isMajor: true, locked: false },
  { id: 15, date: '2026-06-16', time: '06:00', group: 'Group H', home: '沙特阿拉伯', away: '乌拉圭', venue: '硬石体育场', city: '迈阿密', country: '美国', homeScore: '', awayScore: '', isMajor: false, locked: false },
  { id: 16, date: '2026-06-16', time: '09:00', group: 'Group G', home: '伊朗', away: '新西兰', venue: 'SoFi体育场', city: '洛杉矶', country: '美国', homeScore: '', awayScore: '', isMajor: false, locked: false },
  { id: 17, date: '2026-06-17', time: '03:00', group: 'Group I', home: '法国', away: '塞内加尔', venue: '大都会人寿体育场', city: '纽约/新泽西', country: '美国', homeScore: '', awayScore: '', isMajor: true, locked: false },
  { id: 18, date: '2026-06-17', time: '06:00', group: 'Group I', home: '伊拉克', away: '挪威', venue: '吉列体育场', city: '波士顿', country: '美国', homeScore: '', awayScore: '', isMajor: false, locked: false },
  { id: 19, date: '2026-06-17', time: '09:00', group: 'Group J', home: '阿根廷', away: '阿尔及利亚', venue: '箭头体育场', city: '堪萨斯城', country: '美国', homeScore: '', awayScore: '', isMajor: true, locked: false },
  { id: 20, date: '2026-06-17', time: '12:00', group: 'Group J', home: '奥地利', away: '约旦', venue: '李维斯体育场', city: '旧金山湾区', country: '美国', homeScore: '', awayScore: '', isMajor: false, locked: false },
  { id: 21, date: '2026-06-18', time: '01:00', group: 'Group K', home: '葡萄牙', away: '民主刚果', venue: 'NRG体育场', city: '休斯敦', country: '美国', homeScore: '', awayScore: '', isMajor: false, locked: false },
  { id: 22, date: '2026-06-18', time: '06:00', group: 'Group K', home: '乌兹别克斯坦', away: '哥伦比亚', venue: '阿兹特克体育场', city: '墨西哥城', country: '墨西哥', homeScore: '', awayScore: '', isMajor: false, locked: false },
  { id: 23, date: '2026-06-18', time: '07:00', group: 'Group L', home: '加纳', away: '巴拿马', venue: '多伦多体育场', city: '多伦多', country: '加拿大', homeScore: '', awayScore: '', isMajor: false, locked: false },
  { id: 24, date: '2026-06-18', time: '04:00', group: 'Group L', home: '英格兰', away: '克罗地亚', venue: 'AT&T体育场', city: '达拉斯', country: '美国', homeScore: '', awayScore: '', isMajor: true, locked: false },
  { id: 25, date: '2026-06-19', time: '08:00', group: 'Group A', home: '墨西哥', away: '韩国', venue: '阿克伦体育场', city: '瓜达拉哈拉', country: '墨西哥', homeScore: '', awayScore: '', isMajor: true, locked: false },
  { id: 26, date: '2026-06-19', time: '03:00', group: 'Group A', home: '捷克', away: '南非', venue: '奔驰体育场', city: '亚特兰大', country: '美国', homeScore: '', awayScore: '', isMajor: false, locked: false },
  { id: 27, date: '2026-06-19', time: '09:00', group: 'Group B', home: '加拿大', away: '卡塔尔', venue: 'BC Place体育场', city: '温哥华', country: '加拿大', homeScore: '', awayScore: '', isMajor: false, locked: false },
  { id: 28, date: '2026-06-19', time: '06:00', group: 'Group B', home: '瑞士', away: '波黑', venue: 'SoFi体育场', city: '洛杉矶', country: '美国', homeScore: '', awayScore: '', isMajor: false, locked: false },
  { id: 29, date: '2026-06-20', time: '03:00', group: 'Group D', home: '美国', away: '澳大利亚', venue: '卢门球场', city: '西雅图', country: '美国', homeScore: '', awayScore: '', isMajor: true, locked: false },
  { id: 30, date: '2026-06-20', time: '03:00', group: 'Group C', home: '巴西', away: '海地', venue: '吉列体育场', city: '波士顿', country: '美国', homeScore: '', awayScore: '', isMajor: false, locked: false },
  { id: 31, date: '2026-06-20', time: '06:00', group: 'Group D', home: '巴拉圭', away: '土耳其', venue: '箭头体育场', city: '堪萨斯城', country: '美国', homeScore: '', awayScore: '', isMajor: false, locked: false },
  { id: 32, date: '2026-06-20', time: '09:00', group: 'Group C', home: '摩洛哥', away: '苏格兰', venue: '硬石体育场', city: '迈阿密', country: '美国', homeScore: '', awayScore: '', isMajor: false, locked: false },
  { id: 33, date: '2026-06-21', time: '03:00', group: 'Group E', home: '德国', away: '科特迪瓦', venue: '卢门球场', city: '西雅图', country: '美国', homeScore: '', awayScore: '', isMajor: true, locked: false },
  { id: 34, date: '2026-06-21', time: '03:00', group: 'Group F', home: '荷兰', away: '瑞典', venue: '奔驰体育场', city: '亚特兰大', country: '美国', homeScore: '', awayScore: '', isMajor: true, locked: false },
  { id: 35, date: '2026-06-21', time: '07:00', group: 'Group E', home: '库拉索', away: '厄瓜多尔', venue: '阿克伦体育场', city: '瓜达拉哈拉', country: '墨西哥', homeScore: '', awayScore: '', isMajor: false, locked: false },
  { id: 36, date: '2026-06-21', time: '07:00', group: 'Group F', home: '日本', away: '突尼斯', venue: 'BBVA体育场', city: '蒙特雷', country: '墨西哥', homeScore: '', awayScore: '', isMajor: false, locked: false },
  { id: 37, date: '2026-06-21', time: '09:00', group: 'Group G', home: '比利时', away: '伊朗', venue: 'NRG体育场', city: '休斯敦', country: '美国', homeScore: '', awayScore: '', isMajor: true, locked: false },
  { id: 38, date: '2026-06-21', time: '09:00', group: 'Group H', home: '佛得角', away: '乌拉圭', venue: '林肯金融体育场', city: '费城', country: '美国', homeScore: '', awayScore: '', isMajor: false, locked: false },
  { id: 39, date: '2026-06-22', time: '03:00', group: 'Group G', home: '埃及', away: '新西兰', venue: '吉列体育场', city: '波士顿', country: '美国', homeScore: '', awayScore: '', isMajor: false, locked: false },
  { id: 40, date: '2026-06-22', time: '03:00', group: 'Group H', home: '西班牙', away: '沙特阿拉伯', venue: '硬石体育场', city: '迈阿密', country: '美国', homeScore: '', awayScore: '', isMajor: true, locked: false },
  { id: 41, date: '2026-06-22', time: '06:00', group: 'Group I', home: '法国', away: '挪威', venue: '大都会人寿体育场', city: '纽约/新泽西', country: '美国', homeScore: '', awayScore: '', isMajor: true, locked: false },
  { id: 42, date: '2026-06-22', time: '06:00', group: 'Group I', home: '塞内加尔', away: '伊拉克', venue: '李维斯体育场', city: '旧金山湾区', country: '美国', homeScore: '', awayScore: '', isMajor: false, locked: false },
  { id: 43, date: '2026-06-22', time: '09:00', group: 'Group J', home: '阿根廷', away: '奥地利', venue: '箭头体育场', city: '堪萨斯城', country: '美国', homeScore: '', awayScore: '', isMajor: true, locked: false },
  { id: 44, date: '2026-06-22', time: '09:00', group: 'Group J', home: '阿尔及利亚', away: '约旦', venue: 'BC Place体育场', city: '温哥华', country: '加拿大', homeScore: '', awayScore: '', isMajor: false, locked: false },
  { id: 45, date: '2026-06-23', time: '03:00', group: 'Group K', home: '葡萄牙', away: '乌兹别克斯坦', venue: '阿兹特克体育场', city: '墨西哥城', country: '墨西哥', homeScore: '', awayScore: '', isMajor: true, locked: false },
  { id: 46, date: '2026-06-23', time: '03:00', group: 'Group K', home: '民主刚果', away: '哥伦比亚', venue: 'SoFi体育场', city: '洛杉矶', country: '美国', homeScore: '', awayScore: '', isMajor: false, locked: false },
  { id: 47, date: '2026-06-23', time: '06:00', group: 'Group L', home: '英格兰', away: '加纳', venue: 'AT&T体育场', city: '达拉斯', country: '美国', homeScore: '', awayScore: '', isMajor: true, locked: false },
  { id: 48, date: '2026-06-23', time: '06:00', group: 'Group L', home: '克罗地亚', away: '巴拿马', venue: '多伦多体育场', city: '多伦多', country: '加拿大', homeScore: '', awayScore: '', isMajor: false, locked: false },
  { id: 49, date: '2026-06-24', time: '03:00', group: 'Group A', home: '墨西哥', away: '捷克', venue: '阿兹特克体育场', city: '墨西哥城', country: '墨西哥', homeScore: '', awayScore: '', isMajor: true, locked: false },
  { id: 50, date: '2026-06-24', time: '03:00', group: 'Group A', home: '南非', away: '韩国', venue: '阿克伦体育场', city: '瓜达拉哈拉', country: '墨西哥', homeScore: '', awayScore: '', isMajor: false, locked: false },
  { id: 51, date: '2026-06-24', time: '07:00', group: 'Group B', home: '加拿大', away: '瑞士', venue: '多伦多体育场', city: '多伦多', country: '加拿大', homeScore: '', awayScore: '', isMajor: true, locked: false },
  { id: 52, date: '2026-06-24', time: '07:00', group: 'Group B', home: '波黑', away: '卡塔尔', venue: 'BC Place体育场', city: '温哥华', country: '加拿大', homeScore: '', awayScore: '', isMajor: false, locked: false },
  { id: 53, date: '2026-06-24', time: '09:00', group: 'Group C', home: '巴西', away: '苏格兰', venue: '大都会人寿体育场', city: '纽约/新泽西', country: '美国', homeScore: '', awayScore: '', isMajor: true, locked: false },
  { id: 54, date: '2026-06-24', time: '09:00', group: 'Group C', home: '摩洛哥', away: '海地', venue: '吉列体育场', city: '波士顿', country: '美国', homeScore: '', awayScore: '', isMajor: false, locked: false },
  { id: 55, date: '2026-06-25', time: '03:00', group: 'Group D', home: '美国', away: '土耳其', venue: 'SoFi体育场', city: '洛杉矶', country: '美国', homeScore: '', awayScore: '', isMajor: true, locked: false },
  { id: 56, date: '2026-06-25', time: '03:00', group: 'Group D', home: '巴拉圭', away: '澳大利亚', venue: 'NRG体育场', city: '休斯敦', country: '美国', homeScore: '', awayScore: '', isMajor: false, locked: false },
  { id: 57, date: '2026-06-25', time: '06:00', group: 'Group E', home: '德国', away: '厄瓜多尔', venue: 'AT&T体育场', city: '达拉斯', country: '美国', homeScore: '', awayScore: '', isMajor: true, locked: false },
  { id: 58, date: '2026-06-25', time: '06:00', group: 'Group E', home: '库拉索', away: '科特迪瓦', venue: 'BBVA体育场', city: '蒙特雷', country: '墨西哥', homeScore: '', awayScore: '', isMajor: false, locked: false },
  { id: 59, date: '2026-06-25', time: '09:00', group: 'Group F', home: '荷兰', away: '突尼斯', venue: '奔驰体育场', city: '亚特兰大', country: '美国', homeScore: '', awayScore: '', isMajor: true, locked: false },
  { id: 60, date: '2026-06-25', time: '09:00', group: 'Group F', home: '日本', away: '瑞典', venue: '林肯金融体育场', city: '费城', country: '美国', homeScore: '', awayScore: '', isMajor: false, locked: false },
  { id: 61, date: '2026-06-26', time: '03:00', group: 'Group G', home: '比利时', away: '新西兰', venue: '箭头体育场', city: '堪萨斯城', country: '美国', homeScore: '', awayScore: '', isMajor: false, locked: false },
  { id: 62, date: '2026-06-26', time: '03:00', group: 'Group G', home: '埃及', away: '伊朗', venue: '李维斯体育场', city: '旧金山湾区', country: '美国', homeScore: '', awayScore: '', isMajor: false, locked: false },
  { id: 63, date: '2026-06-26', time: '06:00', group: 'Group H', home: '西班牙', away: '乌拉圭', venue: '硬石体育场', city: '迈阿密', country: '美国', homeScore: '', awayScore: '', isMajor: true, locked: false },
  { id: 64, date: '2026-06-26', time: '06:00', group: 'Group H', home: '佛得角', away: '沙特阿拉伯', venue: '卢门球场', city: '西雅图', country: '美国', homeScore: '', awayScore: '', isMajor: false, locked: false },
  { id: 65, date: '2026-06-26', time: '09:00', group: 'Group I', home: '法国', away: '伊拉克', venue: '大都会人寿体育场', city: '纽约/新泽西', country: '美国', homeScore: '', awayScore: '', isMajor: true, locked: false },
  { id: 66, date: '2026-06-26', time: '09:00', group: 'Group I', home: '塞内加尔', away: '挪威', venue: '吉列体育场', city: '波士顿', country: '美国', homeScore: '', awayScore: '', isMajor: false, locked: false },
  { id: 67, date: '2026-06-27', time: '03:00', group: 'Group J', home: '阿根廷', away: '约旦', venue: 'AT&T体育场', city: '达拉斯', country: '美国', homeScore: '', awayScore: '', isMajor: true, locked: false },
  { id: 68, date: '2026-06-27', time: '03:00', group: 'Group J', home: '阿尔及利亚', away: '奥地利', venue: 'NRG体育场', city: '休斯敦', country: '美国', homeScore: '', awayScore: '', isMajor: false, locked: false },
  { id: 69, date: '2026-06-27', time: '06:00', group: 'Group K', home: '葡萄牙', away: '哥伦比亚', venue: '奔驰体育场', city: '亚特兰大', country: '美国', homeScore: '', awayScore: '', isMajor: true, locked: false },
  { id: 70, date: '2026-06-27', time: '06:00', group: 'Group K', home: '民主刚果', away: '乌兹别克斯坦', venue: '阿兹特克体育场', city: '墨西哥城', country: '墨西哥', homeScore: '', awayScore: '', isMajor: false, locked: false },
  { id: 71, date: '2026-06-27', time: '09:00', group: 'Group L', home: '英格兰', away: '巴拿马', venue: 'SoFi体育场', city: '洛杉矶', country: '美国', homeScore: '', awayScore: '', isMajor: true, locked: false },
  { id: 72, date: '2026-06-27', time: '09:00', group: 'Group L', home: '克罗地亚', away: '加纳', venue: '多伦多体育场', city: '多伦多', country: '加拿大', homeScore: '', awayScore: '', isMajor: false, locked: false }
];
