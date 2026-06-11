import React, { useState, useMemo, useEffect } from 'react';

// ==================== 1. 真实基础数据 ====================

// 48支球队 FIFA 排名、大区及综合实力元数据
// formBoost: 基于近期状态、阵容质量、赛事表现的实力修正（正值=被FIFA排名低估）
const teamMetadata = {
  '墨西哥': { code: 'MEX', flag: '🇲🇽', rank: 15, region: '中北美', formBoost: 8 },   // 东道主+高原+金杯冠军
  '南非': { code: 'RSA', flag: '🇿🇦', rank: 61, region: '非洲', formBoost: 0 },
  '韩国': { code: 'KOR', flag: '🇰🇷', rank: 22, region: '亚洲', formBoost: 3 },
  '捷克': { code: 'CZE', flag: '🇨🇿', rank: 31, region: '欧洲', formBoost: 0 },

  '加拿大': { code: 'CAN', flag: '🇨🇦', rank: 27, region: '中北美', formBoost: 3 },   // 东道主
  '波黑': { code: 'BIH', flag: '🇧🇦', rank: 63, region: '欧洲', formBoost: 0 },
  '卡塔尔': { code: 'QAT', flag: '🇶🇦', rank: 51, region: '亚洲', formBoost: 0 },
  '瑞士': { code: 'SUI', flag: '🇨🇭', rank: 12, region: '欧洲', formBoost: 5 },   // 预选赛6场仅丢2球，2024欧洲杯八强

  '巴西': { code: 'BRA', flag: '🇧🇷', rank: 5, region: '南美洲', formBoost: 2 },
  '摩洛哥': { code: 'MAR', flag: '🇲🇦', rank: 13, region: '非洲', formBoost: 5 },   // 2022世界杯四强底蕴
  '海地': { code: 'HAI', flag: '🇭🇹', rank: 84, region: '中北美', formBoost: 0 },
  '苏格兰': { code: 'SCO', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', rank: 36, region: '欧洲', formBoost: 0 },

  '美国': { code: 'USA', flag: '🇺🇸', rank: 14, region: '中北美', formBoost: 4 },   // 东道主
  '巴拉圭': { code: 'PAR', flag: '🇵🇾', rank: 39, region: '南美洲', formBoost: 0 },
  '澳大利亚': { code: 'AUS', flag: '🇦🇺', rank: 26, region: '亚洲', formBoost: 0 },
  '土耳其': { code: 'TUR', flag: '🇹🇷', rank: 35, region: '欧洲', formBoost: 3 },

  '德国': { code: 'GER', flag: '🇩🇪', rank: 9, region: '欧洲', formBoost: 2 },
  '库拉索': { code: 'CUW', flag: '🇨🇼', rank: 82, region: '中北美', formBoost: 0 },
  '科特迪瓦': { code: 'CIV', flag: '🇨🇮', rank: 42, region: '非洲', formBoost: 0 },
  '厄瓜多尔': { code: 'ECU', flag: '🇪🇨', rank: 23, region: '南美洲', formBoost: 10 },  // 19场仅1负，南美预选赛仅次阿根廷

  '荷兰': { code: 'NED', flag: '🇳🇱', rank: 7, region: '欧洲', formBoost: 2 },
  '日本': { code: 'JPN', flag: '🇯🇵', rank: 18, region: '亚洲', formBoost: 10 },  // 16场预选赛仅1负丢3球，高位逼抢顶级，上田绮世荷甲金靴
  '瑞典': { code: 'SWE', flag: '🇸🇪', rank: 21, region: '欧洲', formBoost: 5 },   // 约克雷斯+伊萨克，波特执教
  '突尼斯': { code: 'TUN', flag: '🇹🇳', rank: 40, region: '非洲', formBoost: 0 },

  '比利时': { code: 'BEL', flag: '🇧🇪', rank: 8, region: '欧洲', formBoost: -2 },  // 黄金一代老化
  '埃及': { code: 'EGY', flag: '🇪🇬', rank: 34, region: '非洲', formBoost: 0 },
  '伊朗': { code: 'IRN', flag: '🇮🇷', rank: 20, region: '亚洲', formBoost: 2 },
  '新西兰': { code: 'NZL', flag: '🇳🇿', rank: 86, region: '大洋洲', formBoost: 0 },

  '西班牙': { code: 'ESP', flag: '🇪🇸', rank: 1, region: '欧洲', formBoost: 0 },
  '佛得角': { code: 'CPV', flag: '🇨🇻', rank: 68, region: '非洲', formBoost: 0 },
  '沙特阿拉伯': { code: 'KSA', flag: '🇸🇦', rank: 60, region: '亚洲', formBoost: 0 },
  '乌拉圭': { code: 'URU', flag: '🇺🇾', rank: 11, region: '南美洲', formBoost: 2 },

  '法国': { code: 'FRA', flag: '🇫🇷', rank: 3, region: '欧洲', formBoost: 2 },
  '塞内加尔': { code: 'SEN', flag: '🇸🇳', rank: 17, region: '非洲', formBoost: 8 },  // 非洲杯冠军，马内+杰克逊+恩迪亚耶
  '挪威': { code: 'NOR', flag: '🇳🇴', rank: 29, region: '欧洲', formBoost: 15 },  // 预选赛8战全胜37球，哈兰德+厄德高黄金一代
  '伊拉克': { code: 'IRQ', flag: '🇮🇶', rank: 55, region: '亚洲', formBoost: 0 },

  '阿根廷': { code: 'ARG', flag: '🇦🇷', rank: 2, region: '南美洲', formBoost: 2 },
  '阿尔及利亚': { code: 'ALG', flag: '🇩🇿', rank: 35, region: '非洲', formBoost: 0 },
  '奥地利': { code: 'AUT', flag: '🇦🇹', rank: 24, region: '欧洲', formBoost: 2 },
  '约旦': { code: 'JOR', flag: '🇯🇴', rank: 66, region: '亚洲', formBoost: 0 },

  '葡萄牙': { code: 'POR', flag: '🇵🇹', rank: 6, region: '欧洲', formBoost: 2 },
  '民主刚果': { code: 'COD', flag: '🇨🇩', rank: 62, region: '非洲', formBoost: 0 },
  '乌兹别克斯坦': { code: 'UZB', flag: '🇺🇿', rank: 50, region: '亚洲', formBoost: 0 },
  '哥伦比亚': { code: 'COL', flag: '🇨🇴', rank: 16, region: '南美洲', formBoost: 8 },  // 2024美洲杯亚军，迪亚斯+J罗

  '英格兰': { code: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rank: 4, region: '欧洲', formBoost: 2 },
  '克罗地亚': { code: 'CRO', flag: '🇭🇷', rank: 10, region: '欧洲', formBoost: -3 },  // 核心老化
  '加纳': { code: 'GHA', flag: '🇬🇭', rank: 72, region: '非洲', formBoost: 0 },
  '巴拿马': { code: 'PAN', flag: '🇵🇦', rank: 30, region: '中北美', formBoost: 2 }
};

const initialGroups = {
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
const initialMatches = [
  { id: 1, date: '2026-06-12', time: '03:00', group: 'Group A', home: '墨西哥', away: '南非', venue: '阿兹特克体育场', city: '墨西哥城', country: '墨西哥', homeScore: '', awayScore: '', isMajor: true },
  { id: 2, date: '2026-06-12', time: '07:00', group: 'Group A', home: '韩国', away: '捷克', venue: '阿克伦体育场', city: '瓜达拉哈拉', country: '墨西哥', homeScore: '', awayScore: '', isMajor: false },
  { id: 3, date: '2026-06-13', time: '03:00', group: 'Group B', home: '加拿大', away: '波黑', venue: '多伦多体育场', city: '多伦多', country: '加拿大', homeScore: '', awayScore: '', isMajor: true },
  { id: 4, date: '2026-06-13', time: '09:00', group: 'Group D', home: '美国', away: '巴拉圭', venue: 'SoFi体育场', city: '洛杉矶', country: '美国', homeScore: '', awayScore: '', isMajor: true },
  { id: 5, date: '2026-06-14', time: '03:00', group: 'Group B', home: '卡塔尔', away: '瑞士', venue: '李维斯体育场', city: '旧金山湾区', country: '美国', homeScore: '', awayScore: '', isMajor: false },
  { id: 6, date: '2026-06-14', time: '06:00', group: 'Group C', home: '巴西', away: '摩洛哥', venue: '大都会人寿体育场', city: '纽约/新泽西', country: '美国', homeScore: '', awayScore: '', isMajor: true },
  { id: 7, date: '2026-06-14', time: '09:00', group: 'Group C', home: '海地', away: '苏格兰', venue: '吉列体育场', city: '波士顿', country: '美国', homeScore: '', awayScore: '', isMajor: false },
  { id: 8, date: '2026-06-14', time: '12:00', group: 'Group D', home: '澳大利亚', away: '土耳其', venue: 'BC Place体育场', city: '温哥华', country: '加拿大', homeScore: '', awayScore: '', isMajor: false },
  { id: 9, date: '2026-06-15', time: '01:00', group: 'Group E', home: '德国', away: '库拉索', venue: 'NRG体育场', city: '休斯敦', country: '美国', homeScore: '', awayScore: '', isMajor: false },
  { id: 10, date: '2026-06-15', time: '03:00', group: 'Group F', home: '荷兰', away: '日本', venue: 'AT&T体育场', city: '达拉斯', country: '美国', homeScore: '', awayScore: '', isMajor: true },
  { id: 11, date: '2026-06-15', time: '07:00', group: 'Group E', home: '科特迪瓦', away: '厄瓜多尔', venue: '林肯金融体育场', city: '费城', country: '美国', homeScore: '', awayScore: '', isMajor: false },
  { id: 12, date: '2026-06-15', time: '08:00', group: 'Group F', home: '瑞典', away: '突尼斯', venue: 'BBVA体育场', city: '蒙特雷', country: '墨西哥', homeScore: '', awayScore: '', isMajor: false },
  { id: 13, date: '2026-06-16', time: '00:00', group: 'Group H', home: '西班牙', away: '佛得角', venue: '奔驰体育场', city: '亚特兰大', country: '美国', homeScore: '', awayScore: '', isMajor: false },
  { id: 14, date: '2026-06-16', time: '03:00', group: 'Group G', home: '比利时', away: '埃及', venue: '卢门球场', city: '西雅图', country: '美国', homeScore: '', awayScore: '', isMajor: true },
  { id: 15, date: '2026-06-16', time: '06:00', group: 'Group H', home: '沙特阿拉伯', away: '乌拉圭', venue: '硬石体育场', city: '迈阿密', country: '美国', homeScore: '', awayScore: '', isMajor: false },
  { id: 16, date: '2026-06-16', time: '09:00', group: 'Group G', home: '伊朗', away: '新西兰', venue: 'SoFi体育场', city: '洛杉矶', country: '美国', homeScore: '', awayScore: '', isMajor: false },
  { id: 17, date: '2026-06-17', time: '03:00', group: 'Group I', home: '法国', away: '塞内加尔', venue: '大都会人寿体育场', city: '纽约/新泽西', country: '美国', homeScore: '', awayScore: '', isMajor: true },
  { id: 18, date: '2026-06-17', time: '06:00', group: 'Group I', home: '伊拉克', away: '挪威', venue: '吉列体育场', city: '波士顿', country: '美国', homeScore: '', awayScore: '', isMajor: false },
  { id: 19, date: '2026-06-17', time: '09:00', group: 'Group J', home: '阿根廷', away: '阿尔及利亚', venue: '箭头体育场', city: '堪萨斯城', country: '美国', homeScore: '', awayScore: '', isMajor: true },
  { id: 20, date: '2026-06-17', time: '12:00', group: 'Group J', home: '奥地利', away: '约旦', venue: '李维斯体育场', city: '旧金山湾区', country: '美国', homeScore: '', awayScore: '', isMajor: false },
  { id: 21, date: '2026-06-18', time: '01:00', group: 'Group K', home: '葡萄牙', away: '民主刚果', venue: 'NRG体育场', city: '休斯敦', country: '美国', homeScore: '', awayScore: '', isMajor: false },
  { id: 22, date: '2026-06-18', time: '06:00', group: 'Group K', home: '乌兹别克斯坦', away: '哥伦比亚', venue: '阿兹特克体育场', city: '墨西哥城', country: '墨西哥', homeScore: '', awayScore: '', isMajor: false },
  { id: 23, date: '2026-06-18', time: '07:00', group: 'Group L', home: '加纳', away: '巴拿马', venue: '多伦多体育场', city: '多伦多', country: '加拿大', homeScore: '', awayScore: '', isMajor: false },
  { id: 24, date: '2026-06-18', time: '04:00', group: 'Group L', home: '英格兰', away: '克罗地亚', venue: 'AT&T体育场', city: '达拉斯', country: '美国', homeScore: '', awayScore: '', isMajor: true },
  { id: 25, date: '2026-06-19', time: '08:00', group: 'Group A', home: '墨西哥', away: '韩国', venue: '阿克伦体育场', city: '瓜达拉哈拉', country: '墨西哥', homeScore: '', awayScore: '', isMajor: true },
  { id: 26, date: '2026-06-19', time: '03:00', group: 'Group A', home: '捷克', away: '南非', venue: '奔驰体育场', city: '亚特兰大', country: '美国', homeScore: '', awayScore: '', isMajor: false },
  { id: 27, date: '2026-06-19', time: '09:00', group: 'Group B', home: '加拿大', away: '卡塔尔', venue: 'BC Place体育场', city: '温哥华', country: '加拿大', homeScore: '', awayScore: '', isMajor: false },
  { id: 28, date: '2026-06-19', time: '06:00', group: 'Group B', home: '瑞士', away: '波黑', venue: 'SoFi体育场', city: '洛杉矶', country: '美国', homeScore: '', awayScore: '', isMajor: false },
  { id: 29, date: '2026-06-20', time: '03:00', group: 'Group D', home: '美国', away: '澳大利亚', venue: '卢门球场', city: '西雅图', country: '美国', homeScore: '', awayScore: '', isMajor: true },
  { id: 30, date: '2026-06-20', time: '03:00', group: 'Group C', home: '巴西', away: '海地', venue: '吉列体育场', city: '波士顿', country: '美国', homeScore: '', awayScore: '', isMajor: false },
  // ===== MD2 剩余 (June 20-23) =====
  { id: 31, date: '2026-06-20', time: '06:00', group: 'Group D', home: '巴拉圭', away: '土耳其', venue: '箭头体育场', city: '堪萨斯城', country: '美国', homeScore: '', awayScore: '', isMajor: false },
  { id: 32, date: '2026-06-20', time: '09:00', group: 'Group C', home: '摩洛哥', away: '苏格兰', venue: '硬石体育场', city: '迈阿密', country: '美国', homeScore: '', awayScore: '', isMajor: false },

  { id: 33, date: '2026-06-21', time: '03:00', group: 'Group E', home: '德国', away: '科特迪瓦', venue: '卢门球场', city: '西雅图', country: '美国', homeScore: '', awayScore: '', isMajor: true },
  { id: 34, date: '2026-06-21', time: '03:00', group: 'Group F', home: '荷兰', away: '瑞典', venue: '奔驰体育场', city: '亚特兰大', country: '美国', homeScore: '', awayScore: '', isMajor: true },
  { id: 35, date: '2026-06-21', time: '07:00', group: 'Group E', home: '库拉索', away: '厄瓜多尔', venue: '阿克伦体育场', city: '瓜达拉哈拉', country: '墨西哥', homeScore: '', awayScore: '', isMajor: false },
  { id: 36, date: '2026-06-21', time: '07:00', group: 'Group F', home: '日本', away: '突尼斯', venue: 'BBVA体育场', city: '蒙特雷', country: '墨西哥', homeScore: '', awayScore: '', isMajor: false },
  { id: 37, date: '2026-06-21', time: '09:00', group: 'Group G', home: '比利时', away: '伊朗', venue: 'NRG体育场', city: '休斯敦', country: '美国', homeScore: '', awayScore: '', isMajor: true },
  { id: 38, date: '2026-06-21', time: '09:00', group: 'Group H', home: '佛得角', away: '乌拉圭', venue: '林肯金融体育场', city: '费城', country: '美国', homeScore: '', awayScore: '', isMajor: false },

  { id: 39, date: '2026-06-22', time: '03:00', group: 'Group G', home: '埃及', away: '新西兰', venue: '吉列体育场', city: '波士顿', country: '美国', homeScore: '', awayScore: '', isMajor: false },
  { id: 40, date: '2026-06-22', time: '03:00', group: 'Group H', home: '西班牙', away: '沙特阿拉伯', venue: '硬石体育场', city: '迈阿密', country: '美国', homeScore: '', awayScore: '', isMajor: true },
  { id: 41, date: '2026-06-22', time: '06:00', group: 'Group I', home: '法国', away: '挪威', venue: '大都会人寿体育场', city: '纽约/新泽西', country: '美国', homeScore: '', awayScore: '', isMajor: true },
  { id: 42, date: '2026-06-22', time: '06:00', group: 'Group I', home: '塞内加尔', away: '伊拉克', venue: '李维斯体育场', city: '旧金山湾区', country: '美国', homeScore: '', awayScore: '', isMajor: false },
  { id: 43, date: '2026-06-22', time: '09:00', group: 'Group J', home: '阿根廷', away: '奥地利', venue: '箭头体育场', city: '堪萨斯城', country: '美国', homeScore: '', awayScore: '', isMajor: true },
  { id: 44, date: '2026-06-22', time: '09:00', group: 'Group J', home: '阿尔及利亚', away: '约旦', venue: 'BC Place体育场', city: '温哥华', country: '加拿大', homeScore: '', awayScore: '', isMajor: false },

  { id: 45, date: '2026-06-23', time: '03:00', group: 'Group K', home: '葡萄牙', away: '乌兹别克斯坦', venue: '阿兹特克体育场', city: '墨西哥城', country: '墨西哥', homeScore: '', awayScore: '', isMajor: true },
  { id: 46, date: '2026-06-23', time: '03:00', group: 'Group K', home: '民主刚果', away: '哥伦比亚', venue: 'SoFi体育场', city: '洛杉矶', country: '美国', homeScore: '', awayScore: '', isMajor: false },
  { id: 47, date: '2026-06-23', time: '06:00', group: 'Group L', home: '英格兰', away: '加纳', venue: 'AT&T体育场', city: '达拉斯', country: '美国', homeScore: '', awayScore: '', isMajor: true },
  { id: 48, date: '2026-06-23', time: '06:00', group: 'Group L', home: '克罗地亚', away: '巴拿马', venue: '多伦多体育场', city: '多伦多', country: '加拿大', homeScore: '', awayScore: '', isMajor: false },

  // ===== MD3 第三轮 (June 24-27) =====
  { id: 49, date: '2026-06-24', time: '03:00', group: 'Group A', home: '墨西哥', away: '捷克', venue: '阿兹特克体育场', city: '墨西哥城', country: '墨西哥', homeScore: '', awayScore: '', isMajor: true },
  { id: 50, date: '2026-06-24', time: '03:00', group: 'Group A', home: '南非', away: '韩国', venue: '阿克伦体育场', city: '瓜达拉哈拉', country: '墨西哥', homeScore: '', awayScore: '', isMajor: false },
  { id: 51, date: '2026-06-24', time: '07:00', group: 'Group B', home: '加拿大', away: '瑞士', venue: '多伦多体育场', city: '多伦多', country: '加拿大', homeScore: '', awayScore: '', isMajor: true },
  { id: 52, date: '2026-06-24', time: '07:00', group: 'Group B', home: '波黑', away: '卡塔尔', venue: 'BC Place体育场', city: '温哥华', country: '加拿大', homeScore: '', awayScore: '', isMajor: false },
  { id: 53, date: '2026-06-24', time: '09:00', group: 'Group C', home: '巴西', away: '苏格兰', venue: '大都会人寿体育场', city: '纽约/新泽西', country: '美国', homeScore: '', awayScore: '', isMajor: true },
  { id: 54, date: '2026-06-24', time: '09:00', group: 'Group C', home: '摩洛哥', away: '海地', venue: '吉列体育场', city: '波士顿', country: '美国', homeScore: '', awayScore: '', isMajor: false },

  { id: 55, date: '2026-06-25', time: '03:00', group: 'Group D', home: '美国', away: '土耳其', venue: 'SoFi体育场', city: '洛杉矶', country: '美国', homeScore: '', awayScore: '', isMajor: true },
  { id: 56, date: '2026-06-25', time: '03:00', group: 'Group D', home: '巴拉圭', away: '澳大利亚', venue: 'NRG体育场', city: '休斯敦', country: '美国', homeScore: '', awayScore: '', isMajor: false },
  { id: 57, date: '2026-06-25', time: '06:00', group: 'Group E', home: '德国', away: '厄瓜多尔', venue: 'AT&T体育场', city: '达拉斯', country: '美国', homeScore: '', awayScore: '', isMajor: true },
  { id: 58, date: '2026-06-25', time: '06:00', group: 'Group E', home: '库拉索', away: '科特迪瓦', venue: 'BBVA体育场', city: '蒙特雷', country: '墨西哥', homeScore: '', awayScore: '', isMajor: false },
  { id: 59, date: '2026-06-25', time: '09:00', group: 'Group F', home: '荷兰', away: '突尼斯', venue: '奔驰体育场', city: '亚特兰大', country: '美国', homeScore: '', awayScore: '', isMajor: true },
  { id: 60, date: '2026-06-25', time: '09:00', group: 'Group F', home: '日本', away: '瑞典', venue: '林肯金融体育场', city: '费城', country: '美国', homeScore: '', awayScore: '', isMajor: false },

  { id: 61, date: '2026-06-26', time: '03:00', group: 'Group G', home: '比利时', away: '新西兰', venue: '箭头体育场', city: '堪萨斯城', country: '美国', homeScore: '', awayScore: '', isMajor: false },
  { id: 62, date: '2026-06-26', time: '03:00', group: 'Group G', home: '埃及', away: '伊朗', venue: '李维斯体育场', city: '旧金山湾区', country: '美国', homeScore: '', awayScore: '', isMajor: false },
  { id: 63, date: '2026-06-26', time: '06:00', group: 'Group H', home: '西班牙', away: '乌拉圭', venue: '硬石体育场', city: '迈阿密', country: '美国', homeScore: '', awayScore: '', isMajor: true },
  { id: 64, date: '2026-06-26', time: '06:00', group: 'Group H', home: '佛得角', away: '沙特阿拉伯', venue: '卢门球场', city: '西雅图', country: '美国', homeScore: '', awayScore: '', isMajor: false },
  { id: 65, date: '2026-06-26', time: '09:00', group: 'Group I', home: '法国', away: '伊拉克', venue: '大都会人寿体育场', city: '纽约/新泽西', country: '美国', homeScore: '', awayScore: '', isMajor: true },
  { id: 66, date: '2026-06-26', time: '09:00', group: 'Group I', home: '塞内加尔', away: '挪威', venue: '吉列体育场', city: '波士顿', country: '美国', homeScore: '', awayScore: '', isMajor: false },

  { id: 67, date: '2026-06-27', time: '03:00', group: 'Group J', home: '阿根廷', away: '约旦', venue: 'AT&T体育场', city: '达拉斯', country: '美国', homeScore: '', awayScore: '', isMajor: true },
  { id: 68, date: '2026-06-27', time: '03:00', group: 'Group J', home: '阿尔及利亚', away: '奥地利', venue: 'NRG体育场', city: '休斯敦', country: '美国', homeScore: '', awayScore: '', isMajor: false },
  { id: 69, date: '2026-06-27', time: '06:00', group: 'Group K', home: '葡萄牙', away: '哥伦比亚', venue: '奔驰体育场', city: '亚特兰大', country: '美国', homeScore: '', awayScore: '', isMajor: true },
  { id: 70, date: '2026-06-27', time: '06:00', group: 'Group K', home: '民主刚果', away: '乌兹别克斯坦', venue: '阿兹特克体育场', city: '墨西哥城', country: '墨西哥', homeScore: '', awayScore: '', isMajor: false },
  { id: 71, date: '2026-06-27', time: '09:00', group: 'Group L', home: '英格兰', away: '巴拿马', venue: 'SoFi体育场', city: '洛杉矶', country: '美国', homeScore: '', awayScore: '', isMajor: true },
  { id: 72, date: '2026-06-27', time: '09:00', group: 'Group L', home: '克罗地亚', away: '加纳', venue: '多伦多体育场', city: '多伦多', country: '加拿大', homeScore: '', awayScore: '', isMajor: false }
];

const venuesData = [
  { city: '纽约/新泽西', stadium: '大都会人寿体育场', capacity: '82,500', country: '美国', desc: '决赛举办地。全美顶级综合体育殿堂，纽约大都会标志性建筑。' },
  { city: '墨西哥城', stadium: '阿兹特克体育场', capacity: '87,523', country: '墨西哥', desc: '揭幕战举办地。世界足球殿堂，唯一两次承办世界杯决赛的传奇球场。' },
  { city: '达拉斯', stadium: 'AT&T体育场', capacity: '92,967', country: '美国', desc: '半决赛举办地。无柱悬顶巨型室内场馆，可容纳近10万名观众。' },
  { city: '洛杉矶', stadium: 'SoFi体育场', capacity: '70,000', country: '美国', desc: '造价高昂的顶级巨幕智能场馆，好莱坞级视听体验。' },
  { city: '迈阿密', stadium: '硬石体育场', capacity: '65,000', country: '美国', desc: '南美球迷主场氛围。热带风情与足球激情的完美融合。' },
  { city: '亚特兰大', stadium: '奔驰体育场', capacity: '71,000', country: '美国', desc: '可伸缩穹顶设计，先进的360度环形LED屏幕。' },
  { city: '西雅图', stadium: '卢门球场', capacity: '69,000', country: '美国', desc: '太平洋西北足球圣地，MLS球迷文化最浓厚的城市之一。' },
  { city: '波士顿', stadium: '吉列体育场', capacity: '65,000', country: '美国', desc: '新英格兰地区体育圣地，美国足球传统重镇。' },
  { city: '休斯敦', stadium: 'NRG体育场', capacity: '72,000', country: '美国', desc: '德州巨无霸，可伸缩穹顶适应各种气候条件。' },
  { city: '费城', stadium: '林肯金融体育场', capacity: '69,000', country: '美国', desc: '美国独立之城，历史与现代体育文化的交汇点。' },
  { city: '堪萨斯城', stadium: '箭头体育场', capacity: '76,000', country: '美国', desc: '全美最响亮的主场氛围，声浪震撼的足球圣殿。' },
  { city: '旧金山湾区', stadium: '李维斯体育场', capacity: '68,000', country: '美国', desc: '硅谷科技心脏地带，绿色环保建造标杆场馆。' },
  { city: '多伦多', stadium: '多伦多体育场', capacity: '45,000', country: '加拿大', desc: '加拿大足球大本营，多元文化城市的体育名片。' },
  { city: '温哥华', stadium: 'BC Place体育场', capacity: '54,000', country: '加拿大', desc: '太平洋明珠，可伸缩穹顶球场，北美最美城市天际线背景。' },
  { city: '瓜达拉哈拉', stadium: '阿克伦体育场', capacity: '49,000', country: '墨西哥', desc: '墨西哥足球重镇，拉丁足球热情的典型代表。' },
  { city: '蒙特雷', stadium: 'BBVA体育场', capacity: '53,000', country: '墨西哥', desc: '墨西哥北部工业重镇，现代化山地球场。' }
];

// ==================== 1.5 球队阵容数据 ====================
const teamSquads = {
  '墨西哥': { coach: '哈维尔·阿吉雷', players: [
    { name: 'Guillermo Ochoa', pos: 'GK', num: 13, club: '萨勒尼塔纳' },
    { name: 'Jorge Sanchez', pos: 'DF', num: 2, club: '阿贾克斯' },
    { name: 'Cesar Montes', pos: 'DF', num: 3, club: '莫斯科火车头' },
    { name: 'Edson Alvarez', pos: 'MF', num: 4, club: '西汉姆' },
    { name: 'Luis Romo', pos: 'MF', num: 6, club: '蓝十字' },
    { name: 'Hirving Lozano', pos: 'FW', num: 11, club: 'PSV' },
    { name: 'Santiago Gimenez', pos: 'FW', num: 9, club: '费耶诺德' },
    { name: 'Uriel Antuna', pos: 'FW', num: 7, club: '瓜达拉哈拉' },
    { name: 'Alexis Vega', pos: 'FW', num: 10, club: '蓝十字' },
    { name: 'Julian Quiñones', pos: 'FW', num: 19, club: '阿尔赖扬' },
    { name: 'Raul Jimenez', pos: 'FW', num: 20, club: '富勒姆' },
  ]},
  '南非': { coach: '雨果·布罗斯', players: [
    { name: 'Ronwen Williams', pos: 'GK', num: 1, club: '马梅洛迪日落' },
    { name: 'Siyanda Xulu', pos: 'DF', num: 2, club: 'HTT GALAXY' },
    { name: 'Mothobi Mvala', pos: 'DF', num: 4, club: '马梅洛迪日落' },
    { name: 'Teboho Mokoena', pos: 'MF', num: 6, club: '马梅洛迪日落' },
    { name: 'Percy Tau', pos: 'FW', num: 10, club: '阿尔阿赫利' },
    { name: 'Lyle Foster', pos: 'FW', num: 9, club: '伯恩利' },
    { name: 'Evidence Makgopa', pos: 'FW', num: 11, club: '奥兰多海盗' },
    { name: 'Themba Zwane', pos: 'MF', num: 7, club: '马梅洛迪日落' },
    { name: 'Relebohile Mofokeng', pos: 'FW', num: 18, club: '奥兰多海盗' },
  ]},
  '韩国': { coach: '洪明甫', players: [
    { name: 'Kim Seung-gyu', pos: 'GK', num: 1, club: '阿尔沙巴布' },
    { name: 'Kim Min-jae', pos: 'DF', num: 4, club: '拜仁慕尼黑' },
    { name: 'Kim Jin-su', pos: 'DF', num: 3, club: '全北现代' },
    { name: 'Lee Kang-in', pos: 'MF', num: 10, club: '巴黎圣日耳曼' },
    { name: 'Hwang Hee-chan', pos: 'FW', num: 11, club: '狼队' },
    { name: 'Son Heung-min', pos: 'FW', num: 7, club: '热刺' },
    { name: 'Hwang Ui-jo', pos: 'FW', num: 9, club: '阿拉尼亚体育' },
    { name: 'Paik Seung-ho', pos: 'MF', num: 8, club: '伯明翰' },
    { name: 'Cho Gue-sung', pos: 'FW', num: 19, club: '米特威尔兰' },
  ]},
  '捷克': { coach: '伊万·哈谢克', players: [
    { name: 'Jindrich Stanek', pos: 'GK', num: 1, club: '比尔森胜利' },
    { name: 'Vladimir Coufal', pos: 'DF', num: 2, club: '西汉姆' },
    { name: 'David Zima', pos: 'DF', num: 3, club: '布拉格斯拉维亚' },
    { name: 'Tomas Soucek', pos: 'MF', num: 4, club: '西汉姆' },
    { name: 'Antonin Barak', pos: 'MF', num: 8, club: '佛罗伦萨' },
    { name: 'Patrik Schick', pos: 'FW', num: 10, club: '勒沃库森' },
    { name: 'Adam Hlozek', pos: 'FW', num: 7, club: '勒沃库森' },
    { name: 'Vaclav Cerny', pos: 'FW', num: 11, club: '格拉斯哥流浪者' },
    { name: 'Lukas Provod', pos: 'MF', num: 14, club: '布拉格斯拉维亚' },
  ]},
  '加拿大': { coach: '杰西·马希', players: [
    { name: 'Alphonso Davies', pos: 'DF', num: 19, club: '拜仁慕尼黑' },
    { name: 'Jonathan David', pos: 'FW', num: 9, club: '尤文图斯' },
    { name: 'Stephen Eustaquio', pos: 'MF', num: 7, club: '波尔图' },
    { name: 'Tajon Buchanan', pos: 'FW', num: 17, club: '比利亚雷亚尔' },
    { name: 'Cyle Larin', pos: 'FW', num: 11, club: '马略卡' },
    { name: 'Ismael Kone', pos: 'MF', num: 14, club: '马赛' },
    { name: 'Dayne St. Clair', pos: 'GK', num: 1, club: '明尼苏达联' },
    { name: 'Alistair Johnston', pos: 'DF', num: 2, club: '凯尔特人' },
    { name: 'Liam Millar', pos: 'FW', num: 20, club: '普利茅斯' },
  ]},
  '波黑': { coach: '谢尔盖·巴尔巴雷兹', players: [
    { name: 'Asmir Begovic', pos: 'GK', num: 1, club: '莱斯特城' },
    { name: 'Sead Kolasinac', pos: 'DF', num: 3, club: '亚特兰大' },
    { name: 'Anel Ahmedhodzic', pos: 'DF', num: 4, club: '谢菲尔德联' },
    { name: 'Miralem Pjanic', pos: 'MF', num: 10, club: '中央陆军' },
    { name: 'Edin Visca', pos: 'FW', num: 7, club: '巴萨克赛尔' },
    { name: 'Rade Krunic', pos: 'MF', num: 8, club: '费内巴切' },
    { name: 'Benjamin Tahirovic', pos: 'MF', num: 14, club: '阿贾克斯' },
    { name: 'Said Hamulic', pos: 'FW', num: 9, club: '图卢兹' },
  ]},
  '卡塔尔': { coach: '廷廷·马克斯', players: [
    { name: 'Saad Al-Sheeb', pos: 'GK', num: 1, club: '萨德' },
    { name: 'Pedro Miguel', pos: 'DF', num: 2, club: '萨德' },
    { name: 'Boualem Khoukhi', pos: 'DF', num: 3, club: '萨德' },
    { name: 'Karim Boudiaf', pos: 'MF', num: 6, club: '杜海勒' },
    { name: 'Akram Afif', pos: 'FW', num: 10, club: '萨德' },
    { name: 'Almoez Ali', pos: 'FW', num: 9, club: '杜海勒' },
    { name: 'Hassan Al-Haydos', pos: 'FW', num: 7, club: '萨德' },
    { name: 'Ahmed Alaaeldin', pos: 'FW', num: 11, club: '加拉法' },
  ]},
  '瑞士': { coach: '穆拉特·雅金', players: [
    { name: 'Yann Sommer', pos: 'GK', num: 1, club: '拜仁慕尼黑' },
    { name: 'Manuel Akanji', pos: 'DF', num: 5, club: '曼城' },
    { name: 'Ricardo Rodriguez', pos: 'DF', num: 13, club: '贝蒂斯' },
    { name: 'Granit Xhaka', pos: 'MF', num: 10, club: '勒沃库森' },
    { name: 'Xherdan Shaqiri', pos: 'MF', num: 7, club: '芝加哥火焰' },
    { name: 'Ruben Vargas', pos: 'FW', num: 11, club: '柏林联合' },
    { name: 'Breel Embolo', pos: 'FW', num: 9, club: '摩纳哥' },
    { name: 'Dan Ndoye', pos: 'FW', num: 17, club: '博洛尼亚' },
    { name: 'Denis Zakaria', pos: 'MF', num: 8, club: '摩纳哥' },
    { name: 'Silvan Widmer', pos: 'DF', num: 2, club: '美因茨' },
  ]},
  '巴西': { coach: '卡洛·安切洛蒂', players: [
    { name: 'Alisson', pos: 'GK', num: 1, club: '利物浦' },
    { name: 'Marquinhos', pos: 'DF', num: 3, club: '巴黎圣日耳曼' },
    { name: 'Gabriel Magalhaes', pos: 'DF', num: 4, club: '阿森纳' },
    { name: 'Danilo', pos: 'DF', num: 2, club: '弗拉门戈' },
    { name: 'Bruno Guimaraes', pos: 'MF', num: 8, club: '纽卡斯尔' },
    { name: 'Casemiro', pos: 'MF', num: 5, club: '曼联' },
    { name: 'Raphinha', pos: 'FW', num: 11, club: '巴塞罗那' },
    { name: 'Rodrygo', pos: 'FW', num: 7, club: '皇家马德里' },
    { name: 'Endrick', pos: 'FW', num: 9, club: '皇家马德里' },
    { name: 'Vinicius Jr', pos: 'FW', num: 10, club: '皇家马德里' },
    { name: 'Estevao Willian', pos: 'FW', num: 17, club: '切尔西' },
  ]},
  '摩洛哥': { coach: '穆罕默德·瓦赫比', players: [
    { name: 'Yassine Bounou', pos: 'GK', num: 1, club: '利雅得新月' },
    { name: 'Achraf Hakimi', pos: 'DF', num: 2, club: '巴黎圣日耳曼' },
    { name: 'Noussair Mazraoui', pos: 'DF', num: 3, club: '曼联' },
    { name: 'Romain Saiss', pos: 'DF', num: 6, club: '贝西克塔斯' },
    { name: 'Brahim Diaz', pos: 'FW', num: 10, club: '皇家马德里' },
    { name: 'Azzedine Ounahi', pos: 'MF', num: 8, club: '马赛' },
    { name: 'Sofyan Amrabat', pos: 'MF', num: 4, club: '费内巴切' },
    { name: 'Youssef En-Nesyri', pos: 'FW', num: 19, club: '费内巴切' },
    { name: 'Hakim Ziyech', pos: 'MF', num: 7, club: '加拉塔萨雷' },
    { name: 'Nayef Aguerd', pos: 'DF', num: 5, club: '皇家社会' },
  ]},
  '海地': { coach: '塞巴斯蒂安·米涅', players: [
    { name: 'Johny Placide', pos: 'GK', num: 1, club: '巴斯蒂亚' },
    { name: 'Carlens Arcus', pos: 'DF', num: 2, club: '昂热' },
    { name: 'Hannes Delcroix', pos: 'DF', num: 5, club: '伯恩利' },
    { name: 'Duckens Nazon', pos: 'FW', num: 9, club: '查韦斯' },
    { name: 'Frantzdy Pierrot', pos: 'FW', num: 11, club: '根特' },
    { name: 'Jean-Kevin Duverne', pos: 'DF', num: 22, club: '波鸿' },
    { name: 'Bryan Labissiere', pos: 'MF', num: 8, club: '色当' },
    { name: 'Wilde-Donald Guerrier', pos: 'MF', num: 10, club: '卡拉巴赫' },
  ]},
  '苏格兰': { coach: '史蒂夫·克拉克', players: [
    { name: 'Craig Gordon', pos: 'GK', num: 1, club: '哈茨' },
    { name: 'Andy Robertson', pos: 'DF', num: 2, club: '利物浦' },
    { name: 'Kieran Tierney', pos: 'DF', num: 3, club: '阿森纳' },
    { name: 'Scott McTominay', pos: 'MF', num: 4, club: '那不勒斯' },
    { name: 'John McGinn', pos: 'MF', num: 6, club: '阿斯顿维拉' },
    { name: 'Billy Gilmour', pos: 'MF', num: 8, club: '那不勒斯' },
    { name: 'Lewis Ferguson', pos: 'MF', num: 10, club: '博洛尼亚' },
    { name: 'Lyndon Dykes', pos: 'FW', num: 9, club: '女王公园巡游者' },
    { name: 'Ben Doak', pos: 'FW', num: 11, club: '利物浦' },
    { name: 'Lawrence Shankland', pos: 'FW', num: 7, club: '哈茨' },
  ]},
  '美国': { coach: '毛里西奥·波切蒂诺', players: [
    { name: 'Matt Turner', pos: 'GK', num: 1, club: '水晶宫' },
    { name: 'Antonee Robinson', pos: 'DF', num: 2, club: '富勒姆' },
    { name: 'Tim Ream', pos: 'DF', num: 4, club: '夏洛特FC' },
    { name: 'Weston McKennie', pos: 'MF', num: 8, club: '尤文图斯' },
    { name: 'Tyler Adams', pos: 'MF', num: 6, club: '伯恩茅斯' },
    { name: 'Christian Pulisic', pos: 'FW', num: 10, club: 'AC米兰' },
    { name: 'Giovanni Reyna', pos: 'MF', num: 7, club: '多特蒙德' },
    { name: 'Folarin Balogun', pos: 'FW', num: 9, club: '摩纳哥' },
    { name: 'Timothy Weah', pos: 'FW', num: 11, club: '尤文图斯' },
    { name: 'Yunus Musah', pos: 'MF', num: 14, club: 'AC米兰' },
  ]},
  '巴拉圭': { coach: '古斯塔沃·阿尔法罗', players: [
    { name: 'Anthony Silva', pos: 'GK', num: 1, club: '波特诺山丘' },
    { name: 'Gustavo Gomez', pos: 'DF', num: 3, club: '帕尔梅拉斯' },
    { name: 'Fabian Balbuena', pos: 'DF', num: 4, club: '迪拜青年' },
    { name: 'Miguel Almiron', pos: 'MF', num: 10, club: '纽卡斯尔' },
    { name: 'Mathias Villasanti', pos: 'MF', num: 8, club: '格雷米奥' },
    { name: 'Omar Alderete', pos: 'DF', num: 5, club: '赫塔菲' },
    { name: 'Antonio Sanabria', pos: 'FW', num: 9, club: '都灵' },
    { name: 'Julio Enciso', pos: 'FW', num: 11, club: '布莱顿' },
    { name: 'Adam Bareiro', pos: 'FW', num: 7, club: '蒙特雷' },
  ]},
  '澳大利亚': { coach: '托尼·波波维奇', players: [
    { name: 'Mat Ryan', pos: 'GK', num: 1, club: '罗马' },
    { name: 'Harry Souttar', pos: 'DF', num: 4, club: '谢菲尔德联' },
    { name: 'Aziz Behich', pos: 'DF', num: 3, club: '墨尔本城' },
    { name: 'Jackson Irvine', pos: 'MF', num: 8, club: '圣保利' },
    { name: 'Aiden O\'Neill', pos: 'MF', num: 6, club: '标准列日' },
    { name: 'Mathew Leckie', pos: 'FW', num: 7, club: '墨尔本城' },
    { name: 'Mitchell Duke', pos: 'FW', num: 9, club: '町田泽维亚' },
    { name: 'Craig Goodwin', pos: 'FW', num: 11, club: '阿尔韦达' },
    { name: 'Kusini Yengi', pos: 'FW', num: 15, club: '朴茨茅斯' },
  ]},
  '土耳其': { coach: '温琴佐·蒙特拉', players: [
    { name: 'Altay Bayindir', pos: 'GK', num: 12, club: '曼联' },
    { name: 'Mert Gunok', pos: 'GK', num: 1, club: '费内巴切' },
    { name: 'Zeki Celik', pos: 'DF', num: 2, club: '罗马' },
    { name: 'Merih Demiral', pos: 'DF', num: 4, club: '吉达联合' },
    { name: 'Hakan Calhanoglu', pos: 'MF', num: 10, club: '国际米兰' },
    { name: 'Arda Guler', pos: 'MF', num: 8, club: '皇家马德里' },
    { name: 'Kenan Yildiz', pos: 'FW', num: 7, club: '尤文图斯' },
    { name: 'Irfan Can Kahveci', pos: 'MF', num: 14, club: '费内巴切' },
    { name: 'Baris Alper Yilmaz', pos: 'FW', num: 11, club: '加拉塔萨雷' },
    { name: 'Cengiz Under', pos: 'FW', num: 9, club: '洛杉矶FC' },
  ]},
  '德国': { coach: '尤利安·纳格尔斯曼', players: [
    { name: 'Manuel Neuer', pos: 'GK', num: 1, club: '拜仁慕尼黑' },
    { name: 'Antonio Rudiger', pos: 'DF', num: 2, club: '皇家马德里' },
    { name: 'Joshua Kimmich', pos: 'MF', num: 6, club: '拜仁慕尼黑' },
    { name: 'Jamal Musiala', pos: 'MF', num: 10, club: '拜仁慕尼黑' },
    { name: 'Florian Wirtz', pos: 'MF', num: 17, club: '勒沃库森' },
    { name: 'Kai Havertz', pos: 'FW', num: 7, club: '阿森纳' },
    { name: 'Nico Schlotterbeck', pos: 'DF', num: 15, club: '多特蒙德' },
    { name: 'Ilkay Gundogan', pos: 'MF', num: 8, club: '曼城' },
    { name: 'Leroy Sane', pos: 'FW', num: 11, club: '拜仁慕尼黑' },
    { name: 'Niclas Fullkrug', pos: 'FW', num: 9, club: '西汉姆' },
    { name: 'Waldemar Anton', pos: 'DF', num: 3, club: '多特蒙德' },
  ]},
  '库拉索': { coach: '迪克·艾德沃卡特', players: [
    { name: 'Eloy Room', pos: 'GK', num: 1, club: '费耶诺德' },
    { name: 'Leandro Bacuna', pos: 'MF', num: 10, club: '格拉斯哥流浪者' },
    { name: 'Cuco Martina', pos: 'DF', num: 2, club: '布雷达' },
    { name: 'Jurgen Locadia', pos: 'FW', num: 9, club: '阿马萨斯' },
    { name: 'Gastón Guridi', pos: 'FW', num: 7, club: '班菲尔德' },
    { name: 'Rangelo Janga', pos: 'FW', num: 11, club: '沃鲁斯拉' },
    { name: 'Kenith Guiton', pos: 'MF', num: 8, club: '埃蒙' },
  ]},
  '科特迪瓦': { coach: '埃默斯·法埃', players: [
    { name: 'Yahia Fofana', pos: 'GK', num: 1, club: '里泽斯堡' },
    { name: 'Evan Ndicka', pos: 'DF', num: 21, club: '罗马' },
    { name: 'Wilfried Singo', pos: 'DF', num: 2, club: '摩纳哥' },
    { name: 'Ousmane Diomande', pos: 'DF', num: 4, club: '里斯本竞技' },
    { name: 'Franck Kessie', pos: 'MF', num: 8, club: '吉达联合' },
    { name: 'Seko Fofana', pos: 'MF', num: 10, club: '雷恩' },
    { name: 'Simon Adingra', pos: 'FW', num: 11, club: '摩纳哥' },
    { name: 'Sebastien Haller', pos: 'FW', num: 9, club: '多特蒙德' },
    { name: 'Guela Doue', pos: 'DF', num: 17, club: '雷恩' },
    { name: 'Jean-Philippe Mateta', pos: 'FW', num: 14, club: '水晶宫' },
  ]},
  '厄瓜多尔': { coach: '塞巴斯蒂安·贝卡塞切', players: [
    { name: 'Hernan Galindez', pos: 'GK', num: 1, club: '飓风' },
    { name: 'Piero Hincapie', pos: 'DF', num: 3, club: '勒沃库森' },
    { name: 'Willian Pacho', pos: 'DF', num: 6, club: '法兰克福' },
    { name: 'Moises Caicedo', pos: 'MF', num: 23, club: '切尔西' },
    { name: 'Kendry Paez', pos: 'MF', num: 10, club: '切尔西' },
    { name: 'Enner Valencia', pos: 'FW', num: 9, club: '国际米兰' },
    { name: 'Gonzalo Plata', pos: 'FW', num: 7, club: '阿尔萨德' },
    { name: 'Angel Mena', pos: 'FW', num: 11, club: '莱昂' },
    { name: 'Alan Franco', pos: 'MF', num: 21, club: '巴伊亚' },
  ]},
  '荷兰': { coach: '罗纳德·科曼', players: [
    { name: 'Bart Verbruggen', pos: 'GK', num: 1, club: '布莱顿' },
    { name: 'Virgil van Dijk', pos: 'DF', num: 4, club: '利物浦' },
    { name: 'Jurrien Timber', pos: 'DF', num: 2, club: '阿森纳' },
    { name: 'Nathan Ake', pos: 'DF', num: 5, club: '曼城' },
    { name: 'Frenkie de Jong', pos: 'MF', num: 8, club: '巴塞罗那' },
    { name: 'Xavi Simons', pos: 'MF', num: 10, club: '莱比锡' },
    { name: 'Cody Gakpo', pos: 'FW', num: 7, club: '利物浦' },
    { name: 'Memphis Depay', pos: 'FW', num: 9, club: '科林蒂安' },
    { name: 'Donyell Malen', pos: 'FW', num: 11, club: '多特蒙德' },
    { name: 'Marten de Roon', pos: 'MF', num: 3, club: '亚特兰大' },
  ]},
  '日本': { coach: '森保一', players: [
    { name: 'Zion Suzuki', pos: 'GK', num: 12, club: '帕尔马' },
    { name: 'Ko Itakura', pos: 'DF', num: 3, club: '门兴' },
    { name: 'Yuto Nagatomo', pos: 'DF', num: 2, club: 'FC东京' },
    { name: 'Wataru Endo', pos: 'MF', num: 6, club: '利物浦' },
    { name: 'Takefusa Kubo', pos: 'MF', num: 10, club: '皇家社会' },
    { name: 'Kaoru Mitoma', pos: 'FW', num: 7, club: '布莱顿' },
    { name: 'Ritsu Doan', pos: 'FW', num: 11, club: '弗赖堡' },
    { name: 'Daizen Maeda', pos: 'FW', num: 9, club: '凯尔特人' },
    { name: 'Ayase Ueda', pos: 'FW', num: 20, club: '费耶诺德' },
    { name: 'Hidemasa Morita', pos: 'MF', num: 8, club: '里斯本竞技' },
  ]},
  '瑞典': { coach: '容·达尔·托马森', players: [
    { name: 'Robin Olsen', pos: 'GK', num: 1, club: '阿斯顿维拉' },
    { name: 'Victor Lindelof', pos: 'DF', num: 3, club: '曼联' },
    { name: 'Isak Hien', pos: 'DF', num: 4, club: '亚特兰大' },
    { name: 'Emil Forsberg', pos: 'MF', num: 10, club: '纽约红牛' },
    { name: 'Dejan Kulusevski', pos: 'MF', num: 7, club: '热刺' },
    { name: 'Alexander Isak', pos: 'FW', num: 9, club: '纽卡斯尔' },
    { name: 'Viktor Gyokeres', pos: 'FW', num: 11, club: '里斯本竞技' },
    { name: 'Lucas Walhstrom', pos: 'MF', num: 8, club: '哈马比' },
    { name: 'Ludvig Augustinsson', pos: 'DF', num: 2, club: '塞维利亚' },
  ]},
  '突尼斯': { coach: '萨阿德·布萨迪', players: [
    { name: 'Aymen Dahmen', pos: 'GK', num: 1, club: '斯法克西恩' },
    { name: 'Ali Maaloul', pos: 'DF', num: 2, club: '阿尔阿赫利' },
    { name: 'Montassar Talbi', pos: 'DF', num: 4, club: '洛里昂' },
    { name: 'Ellyes Skhiri', pos: 'MF', num: 6, club: '法兰克福' },
    { name: 'Ferjani Sassi', pos: 'MF', num: 8, club: '杜海勒' },
    { name: 'Youssef Msakni', pos: 'FW', num: 7, club: '阿尔阿拉比' },
    { name: 'Wahbi Khazri', pos: 'FW', num: 10, club: '蒙彼利埃' },
    { name: 'Issam Jebali', pos: 'FW', num: 9, club: '沃鲁斯拉' },
    { name: 'Hannibal Mejbri', pos: 'MF', num: 11, club: '伯恩利' },
  ]},
  '比利时': { coach: '多梅尼科·特德斯科', players: [
    { name: 'Thibaut Courtois', pos: 'GK', num: 1, club: '皇家马德里' },
    { name: 'Jan Vertonghen', pos: 'DF', num: 5, club: '梅赫伦' },
    { name: 'Arthur Theate', pos: 'DF', num: 3, club: '法兰克福' },
    { name: 'Kevin De Bruyne', pos: 'MF', num: 10, club: '曼城' },
    { name: 'Youri Tielemans', pos: 'MF', num: 8, club: '阿斯顿维拉' },
    { name: 'Amadou Onana', pos: 'MF', num: 6, club: '阿斯顿维拉' },
    { name: 'Romelu Lukaku', pos: 'FW', num: 9, club: '切尔西' },
    { name: 'Leandro Trossard', pos: 'FW', num: 11, club: '阿森纳' },
    { name: 'Jeremy Doku', pos: 'FW', num: 7, club: '曼城' },
    { name: 'Charles De Ketelaere', pos: 'FW', num: 17, club: '亚特兰大' },
  ]},
  '埃及': { coach: '鲁伊·维多利亚', players: [
    { name: 'Mohamed El Shenawy', pos: 'GK', num: 1, club: '阿尔阿赫利' },
    { name: 'Ahmed Hegazi', pos: 'DF', num: 4, club: '伊蒂哈德' },
    { name: 'Omar Marmoush', pos: 'FW', num: 7, club: '曼城' },
    { name: 'Mohamed Salah', pos: 'FW', num: 10, club: '利物浦' },
    { name: 'Trezequet', pos: 'MF', num: 8, club: '特拉布宗体育' },
    { name: 'Mostafa Mohamed', pos: 'FW', num: 9, club: '南特' },
    { name: 'Hussien El Shahat', pos: 'FW', num: 11, club: '阿尔阿赫利' },
    { name: 'Ahmed Fathi', pos: 'DF', num: 2, club: '金字塔' },
  ]},
  '伊朗': { coach: '阿米尔·加莱诺伊', players: [
    { name: 'Alireza Beiranvand', pos: 'GK', num: 1, club: '波斯波利斯' },
    { name: 'Milad Mohammadi', pos: 'DF', num: 2, club: 'AEK雅典' },
    { name: 'Shoja Khalilzadeh', pos: 'DF', num: 4, club: '波斯波利斯' },
    { name: 'Saman Ghoddos', pos: 'MF', num: 8, club: '布伦特福德' },
    { name: 'Sardar Azmoun', pos: 'FW', num: 9, club: '迪拜祈祷' },
    { name: 'Mehdi Taremi', pos: 'FW', num: 10, club: '国际米兰' },
    { name: 'Alireza Jahanbakhsh', pos: 'FW', num: 7, club: '费耶诺德' },
    { name: 'Ramin Rezaeian', pos: 'MF', num: 11, club: '塞帕罕' },
  ]},
  '新西兰': { coach: '达伦·巴兹利', players: [
    { name: 'Stefan Marinovic', pos: 'GK', num: 1, club: '惠灵顿凤凰' },
    { name: 'Winston Reid', pos: 'DF', num: 4, club: '惠灵顿凤凰' },
    { name: 'Liberato Cacace', pos: 'DF', num: 3, club: '恩波利' },
    { name: 'Chris Wood', pos: 'FW', num: 9, club: '诺丁汉森林' },
    { name: 'Marco Rojas', pos: 'FW', num: 7, club: '科洛科洛' },
    { name: 'Sarpreet Singh', pos: 'MF', num: 10, club: '不来梅' },
    { name: 'Joe Champness', pos: 'FW', num: 11, club: '阿德莱德联' },
  ]},
  '西班牙': { coach: '路易斯·德拉富恩特', players: [
    { name: 'David Raya', pos: 'GK', num: 1, club: '阿森纳' },
    { name: 'Marc Cucurella', pos: 'DF', num: 2, club: '切尔西' },
    { name: 'Aymeric Laporte', pos: 'DF', num: 14, club: '利雅得胜利' },
    { name: 'Pau Cubarsi', pos: 'DF', num: 4, club: '巴塞罗那' },
    { name: 'Rodri', pos: 'MF', num: 16, club: '曼城' },
    { name: 'Pedri', pos: 'MF', num: 8, club: '巴塞罗那' },
    { name: 'Fabian Ruiz', pos: 'MF', num: 6, club: '巴黎圣日耳曼' },
    { name: 'Lamine Yamal', pos: 'FW', num: 19, club: '巴塞罗那' },
    { name: 'Nico Williams', pos: 'FW', num: 11, club: '毕尔巴鄂竞技' },
    { name: 'Alvaro Morata', pos: 'FW', num: 7, club: '科莫' },
    { name: 'Mikel Oyarzabal', pos: 'FW', num: 9, club: '皇家社会' },
  ]},
  '佛得角': { coach: '布卜卡·科布', players: [
    { name: 'Vozinha', pos: 'GK', num: 1, club: '阿马多拉' },
    { name: 'Steven Fortes', pos: 'DF', num: 4, club: '考纳斯' },
    { name: 'Kenny Rocha Santos', pos: 'DF', num: 2, club: '南锡' },
    { name: 'Lisandro Semedo', pos: 'FW', num: 7, club: '布加勒斯特快速' },
    { name: 'Garry Rodrigues', pos: 'FW', num: 10, club: '费内巴切' },
    { name: 'Ryan Mendes', pos: 'FW', num: 9, club: '阿兰亚斯堡' },
    { name: 'Jamiro Monteiro', pos: 'MF', num: 8, club: '加拉塔萨雷' },
    { name: 'Diney Borges', pos: 'DF', num: 3, club: 'AZ阿尔克马尔' },
  ]},
  '沙特阿拉伯': { coach: '埃尔韦·勒纳尔', players: [
    { name: 'Mohammed Al-Owais', pos: 'GK', num: 1, club: '利雅得新月' },
    { name: 'Sultan Al-Ghanam', pos: 'DF', num: 2, club: '利雅得胜利' },
    { name: 'Ali Al-Bulayhi', pos: 'DF', num: 5, club: '利雅得新月' },
    { name: 'Salman Al-Faraj', pos: 'MF', num: 7, club: '利雅得新月' },
    { name: 'Salem Al-Dawsari', pos: 'FW', num: 10, club: '利雅得新月' },
    { name: 'Firas Al-Buraikan', pos: 'FW', num: 9, club: '利雅得胜利' },
    { name: 'Abdulrahman Al-Aboud', pos: 'FW', num: 11, club: '吉达伊蒂哈德' },
    { name: 'Mohamed Kanno', pos: 'MF', num: 8, club: '利雅得新月' },
  ]},
  '乌拉圭': { coach: '马塞洛·贝尔萨', players: [
    { name: 'Sergio Rochet', pos: 'GK', num: 1, club: '国际米兰' },
    { name: 'Jose Maria Gimenez', pos: 'DF', num: 2, club: '马德里竞技' },
    { name: 'Ronald Araujo', pos: 'DF', num: 4, club: '巴塞罗那' },
    { name: 'Mathias Olivera', pos: 'DF', num: 16, club: '那不勒斯' },
    { name: 'Federico Valverde', pos: 'MF', num: 10, club: '皇家马德里' },
    { name: 'Rodrigo Bentancur', pos: 'MF', num: 8, club: '热刺' },
    { name: 'Nicolas De La Cruz', pos: 'MF', num: 6, club: '河床' },
    { name: 'Darwin Nunez', pos: 'FW', num: 9, club: '利物浦' },
    { name: 'Maxi Gomez', pos: 'FW', num: 11, club: '特拉布宗体育' },
    { name: 'Giorgian De Arrascaeta', pos: 'FW', num: 7, club: '弗拉门戈' },
  ]},
  '法国': { coach: '迪迪埃·德尚', players: [
    { name: 'Mike Maignan', pos: 'GK', num: 16, club: 'AC米兰' },
    { name: 'William Saliba', pos: 'DF', num: 17, club: '阿森纳' },
    { name: 'Dayot Upamecano', pos: 'DF', num: 4, club: '拜仁慕尼黑' },
    { name: 'Jules Kounde', pos: 'DF', num: 5, club: '巴塞罗那' },
    { name: 'Theo Hernandez', pos: 'DF', num: 19, club: '利雅得新月' },
    { name: 'Aurelien Tchouameni', pos: 'MF', num: 8, club: '皇家马德里' },
    { name: 'N\'Golo Kante', pos: 'MF', num: 13, club: '费内巴切' },
    { name: 'Kylian Mbappe', pos: 'FW', num: 10, club: '皇家马德里' },
    { name: 'Ousmane Dembele', pos: 'FW', num: 7, club: '巴黎圣日耳曼' },
    { name: 'Michael Olise', pos: 'FW', num: 11, club: '拜仁慕尼黑' },
    { name: 'Marcus Thuram', pos: 'FW', num: 9, club: '国际米兰' },
    { name: 'Desire Doue', pos: 'FW', num: 20, club: '巴黎圣日耳曼' },
  ]},
  '塞内加尔': { coach: '帕普·蒂亚', players: [
    { name: 'Edouard Mendy', pos: 'GK', num: 16, club: '吉达国民' },
    { name: 'Kalidou Koulibaly', pos: 'DF', num: 3, club: '利雅得新月' },
    { name: 'Moussa Niakhate', pos: 'DF', num: 19, club: '里昂' },
    { name: 'Idrissa Gueye', pos: 'MF', num: 5, club: '埃弗顿' },
    { name: 'Lamine Camara', pos: 'MF', num: 8, club: '摩纳哥' },
    { name: 'Pape Matar Sarr', pos: 'MF', num: 17, club: '热刺' },
    { name: 'Sadio Mane', pos: 'FW', num: 10, club: '利雅得胜利' },
    { name: 'Nicolas Jackson', pos: 'FW', num: 11, club: '切尔西' },
    { name: 'Ismaila Sarr', pos: 'FW', num: 18, club: '水晶宫' },
    { name: 'Habib Diarra', pos: 'MF', num: 21, club: '桑德兰' },
  ]},
  '挪威': { coach: '斯塔勒·索尔巴肯', players: [
    { name: 'Orjan Nyland', pos: 'GK', num: 1, club: '塞维利亚' },
    { name: 'Kristoffer Ajer', pos: 'DF', num: 3, club: '布伦特福德' },
    { name: 'Julian Ryerson', pos: 'DF', num: 26, club: '多特蒙德' },
    { name: 'Martin Odegaard', pos: 'MF', num: 10, club: '阿森纳' },
    { name: 'Sander Berge', pos: 'MF', num: 8, club: '富勒姆' },
    { name: 'Erling Haaland', pos: 'FW', num: 9, club: '曼城' },
    { name: 'Alexander Sorloth', pos: 'FW', num: 7, club: '马德里竞技' },
    { name: 'Antonio Nusa', pos: 'FW', num: 20, club: '莱比锡' },
    { name: 'Jorgen Strand Larsen', pos: 'FW', num: 11, club: '水晶宫' },
    { name: 'Oscar Bobb', pos: 'MF', num: 22, club: '曼城' },
  ]},
  '伊拉克': { coach: '格雷厄姆·阿诺德', players: [
    { name: 'Jalal Hassan', pos: 'GK', num: 12, club: '祖拉' },
    { name: 'Rebin Sulaka', pos: 'DF', num: 2, club: '波尔蒂芒人' },
    { name: 'Merchas Doski', pos: 'DF', num: 23, club: '比尔森胜利' },
    { name: 'Zidane Iqbal', pos: 'MF', num: 14, club: '乌得勒支' },
    { name: 'Ibrahim Bayesh', pos: 'MF', num: 8, club: '豪尔' },
    { name: 'Aymen Hussein', pos: 'FW', num: 18, club: '卡尔马' },
    { name: 'Mohanad Ali', pos: 'FW', num: 10, club: '迪巴' },
    { name: 'Ali Jasim', pos: 'FW', num: 17, club: '纳吉马' },
  ]},
  '阿根廷': { coach: '利昂内尔·斯卡洛尼', players: [
    { name: 'Emiliano Martinez', pos: 'GK', num: 23, club: '阿斯顿维拉' },
    { name: 'Cristian Romero', pos: 'DF', num: 13, club: '热刺' },
    { name: 'Lisandro Martinez', pos: 'DF', num: 6, club: '曼联' },
    { name: 'Nahuel Molina', pos: 'DF', num: 26, club: '马德里竞技' },
    { name: 'Rodrigo De Paul', pos: 'MF', num: 7, club: '迈阿密国际' },
    { name: 'Enzo Fernandez', pos: 'MF', num: 24, club: '切尔西' },
    { name: 'Alexis Mac Allister', pos: 'MF', num: 20, club: '利物浦' },
    { name: 'Lionel Messi', pos: 'FW', num: 10, club: '迈阿密国际' },
    { name: 'Julian Alvarez', pos: 'FW', num: 9, club: '马德里竞技' },
    { name: 'Lautaro Martinez', pos: 'FW', num: 22, club: '国际米兰' },
    { name: 'Thiago Almada', pos: 'FW', num: 16, club: '马德里竞技' },
  ]},
  '阿尔及利亚': { coach: '弗拉基米尔·佩特科维奇', players: [
    { name: 'Luca Zidane', pos: 'GK', num: 23, club: '格拉纳达' },
    { name: 'Rayan Ait-Nouri', pos: 'DF', num: 15, club: '曼城' },
    { name: 'Ramy Bensebaini', pos: 'DF', num: 21, club: '多特蒙德' },
    { name: 'Aissa Mandi', pos: 'DF', num: 2, club: '里尔' },
    { name: 'Houssem Aouar', pos: 'MF', num: 8, club: '吉达联合' },
    { name: 'Fares Chaibi', pos: 'MF', num: 10, club: '法兰克福' },
    { name: 'Riyad Mahrez', pos: 'FW', num: 7, club: '吉达国民' },
    { name: 'Mohamed Amoura', pos: 'FW', num: 18, club: '沃尔夫斯堡' },
    { name: 'Amine Gouiri', pos: 'FW', num: 9, club: '马赛' },
    { name: 'Ibrahim Maza', pos: 'MF', num: 22, club: '勒沃库森' },
  ]},
  '奥地利': { coach: '拉尔夫·朗尼克', players: [
    { name: 'Alexander Schlager', pos: 'GK', num: 1, club: '萨尔茨堡' },
    { name: 'David Alaba', pos: 'DF', num: 8, club: '皇家马德里' },
    { name: 'Kevin Danso', pos: 'DF', num: 3, club: '热刺' },
    { name: 'Marcel Sabitzer', pos: 'MF', num: 9, club: '多特蒙德' },
    { name: 'Konrad Laimer', pos: 'MF', num: 20, club: '拜仁慕尼黑' },
    { name: 'Xaver Schlager', pos: 'MF', num: 4, club: '莱比锡' },
    { name: 'Marko Arnautovic', pos: 'FW', num: 7, club: '贝尔格莱德红星' },
    { name: 'Michael Gregoritsch', pos: 'FW', num: 11, club: '奥格斯堡' },
    { name: 'Paul Wanner', pos: 'MF', num: 24, club: '埃因霍温' },
    { name: 'Philipp Lienhart', pos: 'DF', num: 15, club: '弗赖堡' },
  ]},
  '约旦': { coach: '贾马尔·塞拉米', players: [
    { name: 'Yazeed Abulaila', pos: 'GK', num: 1, club: '侯赛因' },
    { name: 'Ihsan Haddad', pos: 'DF', num: 23, club: '侯赛因' },
    { name: 'Yazan Al-Arab', pos: 'DF', num: 5, club: 'FC首尔' },
    { name: 'Noor Al-Rawabdeh', pos: 'MF', num: 8, club: '雪兰莪' },
    { name: 'Musa Al-Taamari', pos: 'FW', num: 10, club: '雷恩' },
    { name: 'Yazan Al-Naimat', pos: 'FW', num: 18, club: '阿尔阿拉比' },
    { name: 'Ali Olwan', pos: 'FW', num: 9, club: '赛利亚' },
    { name: 'Nizar Al-Rashdan', pos: 'MF', num: 21, club: '卡塔尔SC' },
  ]},
  '葡萄牙': { coach: '罗伯托·马丁内斯', players: [
    { name: 'Diogo Costa', pos: 'GK', num: 1, club: '波尔图' },
    { name: 'Ruben Dias', pos: 'DF', num: 3, club: '曼城' },
    { name: 'Diogo Dalot', pos: 'DF', num: 5, club: '曼联' },
    { name: 'Nuno Mendes', pos: 'DF', num: 25, club: '巴黎圣日耳曼' },
    { name: 'Bruno Fernandes', pos: 'MF', num: 8, club: '曼联' },
    { name: 'Bernardo Silva', pos: 'MF', num: 10, club: '曼城' },
    { name: 'Vitinha', pos: 'MF', num: 23, club: '巴黎圣日耳曼' },
    { name: 'Joao Neves', pos: 'MF', num: 15, club: '巴黎圣日耳曼' },
    { name: 'Cristiano Ronaldo', pos: 'FW', num: 7, club: '利雅得胜利' },
    { name: 'Rafael Leao', pos: 'FW', num: 17, club: 'AC米兰' },
    { name: 'Goncalo Ramos', pos: 'FW', num: 9, club: '巴黎圣日耳曼' },
    { name: 'Francisco Conceicao', pos: 'FW', num: 26, club: '尤文图斯' },
  ]},
  '民主刚果': { coach: '塞巴斯蒂安·德萨布尔', players: [
    { name: 'Lionel Mpasi', pos: 'GK', num: 1, club: '勒阿弗尔' },
    { name: 'Chancel Mbemba', pos: 'DF', num: 22, club: '里尔' },
    { name: 'Aaron Wan-Bissaka', pos: 'DF', num: 2, club: '西汉姆' },
    { name: 'Theo Bongonda', pos: 'MF', num: 10, club: '莫斯科斯巴达' },
    { name: 'Cedric Bakambu', pos: 'FW', num: 17, club: '皇家贝蒂斯' },
    { name: 'Fiston Mayele', pos: 'FW', num: 19, club: '金字塔' },
    { name: 'Yoane Wissa', pos: 'FW', num: 20, club: '纽卡斯尔' },
    { name: 'Meschak Elia', pos: 'FW', num: 13, club: '阿兰亚斯堡' },
  ]},
  '乌兹别克斯坦': { coach: '法比奥·卡纳瓦罗', players: [
    { name: 'Utkir Yusupov', pos: 'GK', num: 1, club: '纳巴霍尔' },
    { name: 'Abdukodir Khusanov', pos: 'DF', num: 2, club: '曼城' },
    { name: 'Rustam Ashurmatov', pos: 'DF', num: 5, club: '独立' },
    { name: 'Jaloliddin Masharipov', pos: 'MF', num: 10, club: '独立' },
    { name: 'Abbosbek Fayzullaev', pos: 'MF', num: 22, club: '伊斯坦布尔' },
    { name: 'Eldor Shomurodov', pos: 'FW', num: 14, club: '伊斯坦布尔' },
    { name: 'Igor Sergeev', pos: 'FW', num: 21, club: '波斯波利斯' },
    { name: 'Oston Urunov', pos: 'MF', num: 11, club: '波斯波利斯' },
  ]},
  '哥伦比亚': { coach: '内斯托尔·洛伦佐', players: [
    { name: 'David Ospina', pos: 'GK', num: 1, club: '麦德林国民竞技' },
    { name: 'Davinson Sanchez', pos: 'DF', num: 23, club: '加拉塔萨雷' },
    { name: 'Daniel Munoz', pos: 'DF', num: 2, club: '水晶宫' },
    { name: 'Jefferson Lerma', pos: 'MF', num: 16, club: '水晶宫' },
    { name: 'James Rodriguez', pos: 'MF', num: 10, club: '明尼苏达联' },
    { name: 'Richard Rios', pos: 'MF', num: 6, club: '本菲卡' },
    { name: 'Luis Diaz', pos: 'FW', num: 7, club: '拜仁慕尼黑' },
    { name: 'Jhon Arias', pos: 'MF', num: 11, club: '帕尔梅拉斯' },
    { name: 'Jhon Cordoba', pos: 'FW', num: 9, club: '克拉斯诺达尔' },
  ]},
  '英格兰': { coach: '托马斯·图赫尔', players: [
    { name: 'Jordan Pickford', pos: 'GK', num: 1, club: '埃弗顿' },
    { name: 'John Stones', pos: 'DF', num: 5, club: '曼城' },
    { name: 'Marc Guehi', pos: 'DF', num: 6, club: '曼城' },
    { name: 'Declan Rice', pos: 'MF', num: 4, club: '阿森纳' },
    { name: 'Jude Bellingham', pos: 'MF', num: 10, club: '皇家马德里' },
    { name: 'Elliot Anderson', pos: 'MF', num: 8, club: '诺丁汉森林' },
    { name: 'Harry Kane', pos: 'FW', num: 9, club: '拜仁慕尼黑' },
    { name: 'Bukayo Saka', pos: 'FW', num: 7, club: '阿森纳' },
    { name: 'Marcus Rashford', pos: 'FW', num: 11, club: '巴塞罗那' },
    { name: 'Morgan Rogers', pos: 'MF', num: 17, club: '阿斯顿维拉' },
    { name: 'Eberechi Eze', pos: 'MF', num: 21, club: '阿森纳' },
  ]},
  '克罗地亚': { coach: '兹拉特科·达利奇', players: [
    { name: 'Dominik Livakovic', pos: 'GK', num: 1, club: '萨格勒布迪纳摩' },
    { name: 'Josko Gvardiol', pos: 'DF', num: 4, club: '曼城' },
    { name: 'Josip Sutalo', pos: 'DF', num: 6, club: '阿贾克斯' },
    { name: 'Luka Modric', pos: 'MF', num: 10, club: 'AC米兰' },
    { name: 'Mateo Kovacic', pos: 'MF', num: 8, club: '曼城' },
    { name: 'Mario Pasalic', pos: 'MF', num: 15, club: '亚特兰大' },
    { name: 'Andrej Kramaric', pos: 'FW', num: 9, club: '霍芬海姆' },
    { name: 'Ante Budimir', pos: 'FW', num: 11, club: '奥萨苏纳' },
    { name: 'Ivan Perisic', pos: 'FW', num: 14, club: '埃因霍温' },
    { name: 'Josip Stanisic', pos: 'DF', num: 2, club: '拜仁慕尼黑' },
  ]},
  '加纳': { coach: '卡洛斯·奎罗兹', players: [
    { name: 'Lawrence Ati-Zigi', pos: 'GK', num: 1, club: '圣加仑' },
    { name: 'Alidu Seidu', pos: 'DF', num: 2, club: '雷恩' },
    { name: 'Abdul Mumin', pos: 'DF', num: 6, club: '巴列卡诺' },
    { name: 'Thomas Partey', pos: 'MF', num: 5, club: '比利亚雷亚尔' },
    { name: 'Antoine Semenyo', pos: 'MF', num: 11, club: '曼城' },
    { name: 'Inaki Williams', pos: 'FW', num: 19, club: '毕尔巴鄂竞技' },
    { name: 'Jordan Ayew', pos: 'FW', num: 9, club: '莱斯特城' },
    { name: 'Abdul Fatawu', pos: 'FW', num: 7, club: '莱斯特城' },
    { name: 'Kamaldeen Sulemana', pos: 'FW', num: 22, club: '亚特兰大' },
  ]},
  '巴拿马': { coach: '托马斯·克里斯蒂安森', players: [
    { name: 'Luis Mejia', pos: 'GK', num: 1, club: '国民' },
    { name: 'Michael Amir Murillo', pos: 'DF', num: 23, club: '贝西克塔斯' },
    { name: 'Eric Davis', pos: 'DF', num: 15, club: '广场阿马多尔' },
    { name: 'Adalberto Carrasquilla', pos: 'MF', num: 8, club: 'UNAM' },
    { name: 'Anibal Godoy', pos: 'MF', num: 20, club: '圣迭戈FC' },
    { name: 'Ismael Diaz', pos: 'FW', num: 10, club: '莱昂' },
    { name: 'Jose Fajardo', pos: 'FW', num: 17, club: '天主教大学' },
    { name: 'Cecilio Waterman', pos: 'FW', num: 18, club: '康塞普西翁' },
    { name: 'Yoel Barcenas', pos: 'MF', num: 11, club: '马萨特兰' },
  ]},
};

// ==================== 2. 经典足球数学模型（泊松分布） ====================
// 使用 Knuth 算法生成泊松分布的随机目标数
function getPoissonGoal(lambda) {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= Math.random();
  } while (p > L && k < 10);
  return k - 1;
}

// 模拟单场比赛的核心科学引擎
function simulateMatchRealistic(homeName, awayName, isNeutral = false, hostCountry = '') {
  const homeMeta = teamMetadata[homeName] || { rank: 50, region: '欧洲', formBoost: 0 };
  const awayMeta = teamMetadata[awayName] || { rank: 50, region: '欧洲', formBoost: 0 };

  // 基础实力转换 (100 - 排名 + 状态修正) 作为攻击力系数
  // formBoost: 基于近期赛事表现、阵容质量、东道主等因素的实力修正
  const homeBoost = homeMeta.formBoost || 0;
  const awayBoost = awayMeta.formBoost || 0;
  const homePower = 100 - homeMeta.rank + homeBoost;
  const awayPower = 100 - awayMeta.rank + awayBoost;
  const powerDiff = homePower - awayPower; // 正数表示主队实力更强

  // 科学期望进球基准 (xG)
  let homeExp = 1.25 + (powerDiff * 0.012);
  let awayExp = 1.25 - (powerDiff * 0.012);

  // 地利因素：如果是东道主加成（美国、加拿大、墨西哥在美加墨境内算主场优势）
  if (!isNeutral) {
    if (homeMeta.code === 'USA' || homeMeta.code === 'MEX' || homeMeta.code === 'CAN') {
      homeExp += 0.25; // 主场之利进球增幅
    }
    if (awayMeta.code === 'USA' || awayMeta.code === 'MEX' || awayMeta.code === 'CAN') {
      awayExp += 0.10; // 虽然是客队，但在合办国亦有半主场声浪
    }
  }

  // 大区加权校正 (例如南美/欧洲球队在非本土气候和传统战绩调整)
  if (homeMeta.region === '南美洲' || homeMeta.region === '欧洲') homeExp += 0.1;
  if (awayMeta.region === '南美洲' || awayMeta.region === '欧洲') awayExp += 0.1;

  // 边界约束，确保 xG 指数处于合理范围 (0.5 ~ 3.5)
  homeExp = Math.max(0.5, Math.min(3.5, homeExp));
  awayExp = Math.max(0.5, Math.min(3.5, awayExp));

  // 运用泊松分布输出拟真进球数
  return {
    homeScore: getPoissonGoal(homeExp),
    awayScore: getPoissonGoal(awayExp)
  };
}

// ==================== 3. 主程序 ====================

export default function App() {
  const [matches, setMatches] = useState(initialMatches);
  const [activeTab, setActiveTab] = useState('schedule'); // schedule | groups | bracket | stats | venues | format
  const [filterCountry, setFilterCountry] = useState('All');
  const [filterGroup, setFilterGroup] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // 淘汰赛树状图状态
  const [knockoutScores, setKnockoutScores] = useState({});
  const [knockoutWinners, setKnockoutWinners] = useState({});
  const [bracketRoundTab, setBracketRoundTab] = useState('r32');

  // 批量模拟运行状态
  const [simCount, setSimCount] = useState(100);
  const [isSimulating, setIsSimulating] = useState(false);
  const [statsResults, setStatsResults] = useState(null);
  const [filterRegion, setFilterRegion] = useState('All');

  // 关注收藏 & 只看关注筛选
  const [followedMatches, setFollowedMatches] = useState(() => {
    try { const saved = localStorage.getItem('fifa2026_followed'); return saved ? new Set(JSON.parse(saved)) : new Set(); }
    catch { return new Set(); }
  });
  const [showFollowedOnly, setShowFollowedOnly] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  const toggleFollow = (matchId) => {
    setFollowedMatches(prev => {
      const next = new Set(prev);
      if (next.has(matchId)) next.delete(matchId); else next.add(matchId);
      try { localStorage.setItem('fifa2026_followed', JSON.stringify([...next])); } catch {}
      return next;
    });
  };

  // ==================== 同步真实赛果 ====================
  const handleSyncResults = async () => {
    setIsSyncing(true);
    setSyncMessage('🔄 正在从数据源获取赛果...');

    try {
      // 使用 thesportsdb.com 免费 CORS 友好 API
      // World Cup 2026 league id: 4495 (FIFA World Cup)
      const response = await fetch('https://www.thesportsdb.com/api/v1/json/3/eventsseason.php?id=4495&s=2026');
      if (!response.ok) throw new Error(`API 返回 ${response.status}`);

      const data = await response.json();
      const events = data.events || [];

      if (events.length === 0) {
        setSyncMessage('ℹ️ 暂无已完成的比赛——赛事尚未开始或数据尚未更新');
        setIsSyncing(false);
        return;
      }

      // 构建 thesportsdb 队名 → 我们队名的映射（模糊匹配）
      const nameMap = {};
      Object.keys(teamMetadata).forEach(name => {
        // 去掉空格、转小写，方便匹配
        const key = name.toLowerCase().replace(/\s/g, '');
        nameMap[key] = name;
        // 也加入英文映射
        const code = teamMetadata[name].code?.toLowerCase() || '';
        if (code) nameMap[code] = name;
      });
      // 额外的英文→中文映射
      const extraNames = {
        'mexico': '墨西哥', 'southafrica': '南非', 'southkorea': '韩国', 'czechrepublic': '捷克',
        'canada': '加拿大', 'bosniaandherzegovina': '波黑', 'qatar': '卡塔尔', 'switzerland': '瑞士',
        'brazil': '巴西', 'morocco': '摩洛哥', 'haiti': '海地', 'scotland': '苏格兰',
        'usa': '美国', 'unitedstates': '美国', 'paraguay': '巴拉圭', 'australia': '澳大利亚', 'turkey': '土耳其',
        'germany': '德国', 'curacao': '库拉索', 'ivorycoast': '科特迪瓦', 'ecuador': '厄瓜多尔',
        'netherlands': '荷兰', 'japan': '日本', 'sweden': '瑞典', 'tunisia': '突尼斯',
        'belgium': '比利时', 'egypt': '埃及', 'iran': '伊朗', 'newzealand': '新西兰',
        'spain': '西班牙', 'capeverde': '佛得角', 'saudiarabia': '沙特阿拉伯', 'uruguay': '乌拉圭',
        'france': '法国', 'senegal': '塞内加尔', 'norway': '挪威', 'iraq': '伊拉克',
        'argentina': '阿根廷', 'algeria': '阿尔及利亚', 'austria': '奥地利', 'jordan': '约旦',
        'portugal': '葡萄牙', 'drcongo': '民主刚果', 'uzbekistan': '乌兹别克斯坦', 'colombia': '哥伦比亚',
        'england': '英格兰', 'croatia': '克罗地亚', 'ghana': '加纳', 'panama': '巴拿马',
      };
      Object.keys(extraNames).forEach(k => { nameMap[k] = extraNames[k]; });

      // 解析赛果并匹配到我们的比赛
      let updatedCount = 0;
      const matchMap = {};
      matches.forEach(m => { matchMap[m.id] = m; });

      events.forEach(evt => {
        if (!evt.intHomeScore || !evt.intAwayScore) return; // 未完成的比赛
        const homeKey = (evt.strHomeTeam || '').toLowerCase().replace(/\s/g, '');
        const awayKey = (evt.strAwayTeam || '').toLowerCase().replace(/\s/g, '');
        const homeName = nameMap[homeKey];
        const awayName = nameMap[awayKey];
        if (!homeName || !awayName) return;

        // 在我们的比赛列表中找到匹配
        const found = matches.find(m =>
          (m.home === homeName && m.away === awayName) ||
          (m.away === homeName && m.home === awayName)
        );
        if (found) {
          const homeScore = found.home === homeName ? evt.intHomeScore : evt.intAwayScore;
          const awayScore = found.away === awayName ? evt.intAwayScore : evt.intHomeScore;
          if (found.homeScore !== String(homeScore) || found.awayScore !== String(awayScore)) {
            setMatches(prev => prev.map(m => {
              if (m.id === found.id) {
                return { ...m, homeScore: String(homeScore), awayScore: String(awayScore) };
              }
              return m;
            }));
            updatedCount++;
          }
        }
      });

      if (updatedCount > 0) {
        setSyncMessage(`✅ 同步成功！已更新 ${updatedCount} 场比赛的真实赛果`);
      } else {
        // 检查是否有已完成的比赛但分数已经是最新的
        const finishedEvents = events.filter(e => e.intHomeScore && e.intAwayScore);
        if (finishedEvents.length > 0) {
          setSyncMessage(`✅ 数据已是最新（${finishedEvents.length} 场已完赛）`);
        } else {
          setSyncMessage('ℹ️ 暂无已完成的比赛——赛事尚未开始');
        }
      }
    } catch (err) {
      console.error('Sync error:', err);
      setSyncMessage(`❌ 同步失败：${err.message}。请检查网络连接后重试`);
    }

    setIsSyncing(false);
  };

  // 球队之旅模拟
  const [journeyTeam, setJourneyTeam] = useState('');
  const [journeyResult, setJourneyResult] = useState(null);
  const [isJourneyRunning, setIsJourneyRunning] = useState(false);

  // 倒计时
  useEffect(() => {
    const targetDate = new Date('2026-06-12T03:00:00+08:00');
    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 核心计算：小组积分榜逻辑 (用于前台直接展示和单场微调)
  const groupStandings = useMemo(() => {
    const standings = {};
    Object.keys(initialGroups).forEach(groupId => {
      standings[groupId] = initialGroups[groupId].teams.map(teamName => ({
        name: teamName, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, pts: 0,
        rank: teamMetadata[teamName]?.rank || 50,
        flag: teamMetadata[teamName]?.flag || '🏳️',
        code: teamMetadata[teamName]?.code || 'N/A'
      }));
    });

    matches.forEach(match => {
      const score1 = parseInt(match.homeScore, 10);
      const score2 = parseInt(match.awayScore, 10);

      if (!isNaN(score1) && !isNaN(score2)) {
        const groupList = standings[match.group];
        if (!groupList) return;
        const homeTeam = groupList.find(t => t.name === match.home);
        const awayTeam = groupList.find(t => t.name === match.away);

        if (homeTeam && awayTeam) {
          homeTeam.played += 1; awayTeam.played += 1;
          homeTeam.gf += score1; homeTeam.ga += score2;
          awayTeam.gf += score2; awayTeam.ga += score1;
          homeTeam.gd = homeTeam.gf - homeTeam.ga;
          awayTeam.gd = awayTeam.gf - awayTeam.ga;

          if (score1 > score2) { homeTeam.won += 1; homeTeam.pts += 3; awayTeam.lost += 1; }
          else if (score1 < score2) { awayTeam.won += 1; awayTeam.pts += 3; homeTeam.lost += 1; }
          else { homeTeam.drawn += 1; awayTeam.drawn += 1; homeTeam.pts += 1; awayTeam.pts += 1; }
        }
      }
    });

    Object.keys(standings).forEach(groupId => {
      standings[groupId].sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts;
        if (b.gd !== a.gd) return b.gd - a.gd;
        if (b.gf !== a.gf) return b.gf - a.gf;
        if (b.won !== a.won) return b.won - a.won;
        return a.rank - b.rank;
      });
    });

    return standings;
  }, [matches]);

  // 计算最好的 8 个第三名
  const thirdPlaceRankings = useMemo(() => {
    const thirds = [];
    Object.keys(groupStandings).forEach(groupId => {
      const thirdTeam = groupStandings[groupId][2];
      if (thirdTeam) {
        thirds.push({ ...thirdTeam, groupId, groupName: initialGroups[groupId].name });
      }
    });

    thirds.sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.gd !== a.gd) return b.gd - a.gd;
      if (b.gf !== a.gf) return b.gf - a.gf;
      if (b.won !== a.won) return b.won - a.won;
      return a.rank - b.rank;
    });

    return thirds;
  }, [groupStandings]);

  const top8ThirdTeams = useMemo(() => {
    return new Set(thirdPlaceRankings.slice(0, 8).map(t => t.name));
  }, [thirdPlaceRankings]);

  // 用于前台淘汰赛对阵树的自动取词
  const qualifiedTeams = useMemo(() => {
    const list = { winners: {}, runnersUp: {}, thirds: [] };
    Object.keys(groupStandings).forEach(groupId => {
      const key = groupId.split(' ')[1];
      if (groupStandings[groupId][0]) list.winners[key] = groupStandings[groupId][0].name;
      if (groupStandings[groupId][1]) list.runnersUp[key] = groupStandings[groupId][1].name;
    });
    list.thirds = thirdPlaceRankings.slice(0, 8).map(t => t.name);
    return list;
  }, [groupStandings, thirdPlaceRankings]);

  // R32 球队静态推导
  const r32Matches = useMemo(() => {
    const w = qualifiedTeams.winners;
    const r = qualifiedTeams.runnersUp;
    const t = qualifiedTeams.thirds;
    return [
      { id: 'r32_1', name: '1/16决赛 A', home: w['A'] || 'A组第一', away: t[0] || '优胜第三#1' },
      { id: 'r32_2', name: '1/16决赛 B', home: r['B'] || 'B组第二', away: r['F'] || 'F组第二' },
      { id: 'r32_3', name: '1/16决赛 C', home: w['C'] || 'C组第一', away: t[4] || '优胜第三#5' },
      { id: 'r32_4', name: '1/16决赛 D', home: w['D'] || 'D组第一', away: t[5] || '优胜第三#6' },
      { id: 'r32_5', name: '1/16决赛 E', home: w['E'] || 'E组第一', away: r['A'] || 'A组第二' },
      { id: 'r32_6', name: '1/16决赛 F', home: w['F'] || 'F组第一', away: r['C'] || 'C组第二' },
      { id: 'r32_7', name: '1/16决赛 G', home: w['G'] || 'G组第一', away: t[1] || '优胜第三#2' },
      { id: 'r32_8', name: '1/16决赛 H', home: w['H'] || 'H组第一', away: t[2] || '优胜第三#3' },
      { id: 'r32_9', name: '1/16决赛 I', home: w['I'] || 'I组第一', away: r['E'] || 'E组第二' },
      { id: 'r32_10', name: '1/16决赛 J', home: w['J'] || 'J组第一', away: r['D'] || 'D组第二' },
      { id: 'r32_11', name: '1/16决赛 K', home: w['K'] || 'K组第一', away: r['G'] || 'G组第二' },
      { id: 'r32_12', name: '1/16决赛 L', home: w['L'] || 'L组第一', away: r['H'] || 'H组第二' },
      { id: 'r32_13', name: '1/16决赛 M', home: r['I'] || 'I组第二', away: r['J'] || 'J组第二' },
      { id: 'r32_14', name: '1/16决赛 N', home: r['K'] || 'K组第二', away: r['L'] || 'L组第二' },
      { id: 'r32_15', name: '1/16决赛 O', home: t[3] || '优胜第三#4', away: t[6] || '优胜第三#7' },
      { id: 'r32_16', name: '1/16决赛 P', home: t[7] || '优胜第三#8', away: w['B'] || 'B组第一' },
    ];
  }, [qualifiedTeams]);

  // 后续淘汰轮次推导
  const r16Matches = useMemo(() => {
    const getWinner = (id, def) => knockoutWinners[id] || def;
    return [
      { id: 'r16_1', name: '1/8决赛 A', home: getWinner('r32_1', '1/16决赛A胜者'), away: getWinner('r32_2', '1/16决赛B胜者') },
      { id: 'r16_2', name: '1/8决赛 B', home: getWinner('r32_3', '1/16决赛C胜者'), away: getWinner('r32_4', '1/16决赛D胜者') },
      { id: 'r16_3', name: '1/8决赛 C', home: getWinner('r32_5', '1/16决赛E胜者'), away: getWinner('r32_6', '1/16决赛F胜者') },
      { id: 'r16_4', name: '1/8决赛 D', home: getWinner('r32_7', '1/16决赛G胜者'), away: getWinner('r32_8', '1/16决赛H胜者') },
      { id: 'r16_5', name: '1/8决赛 E', home: getWinner('r32_9', '1/16决赛I胜者'), away: getWinner('r32_10', '1/16决赛J胜者') },
      { id: 'r16_6', name: '1/8决赛 F', home: getWinner('r32_11', '1/16决赛K胜者'), away: getWinner('r32_12', '1/16决赛L胜者') },
      { id: 'r16_7', name: '1/8决赛 G', home: getWinner('r32_13', '1/16决赛M胜者'), away: getWinner('r32_14', '1/16决赛N胜者') },
      { id: 'r16_8', name: '1/8决赛 H', home: getWinner('r32_15', '1/16决赛O胜者'), away: getWinner('r32_16', '1/16决赛P胜者') },
    ];
  }, [knockoutWinners]);

  const qfMatches = useMemo(() => {
    const getWinner = (id, def) => knockoutWinners[id] || def;
    return [
      { id: 'qf_1', name: '1/4决赛 A', home: getWinner('r16_1', '1/8决赛A胜者'), away: getWinner('r16_2', '1/8决赛B胜者') },
      { id: 'qf_2', name: '1/4决赛 B', home: getWinner('r16_3', '1/8决赛C胜者'), away: getWinner('r16_4', '1/8决赛D胜者') },
      { id: 'qf_3', name: '1/4决赛 C', home: getWinner('r16_5', '1/8决赛E胜者'), away: getWinner('r16_6', '1/8决赛F胜者') },
      { id: 'qf_4', name: '1/4决赛 D', home: getWinner('r16_7', '1/8决赛G胜者'), away: getWinner('r16_8', '1/8决赛H胜者') },
    ];
  }, [knockoutWinners]);

  const sfMatches = useMemo(() => {
    const getWinner = (id, def) => knockoutWinners[id] || def;
    return [
      { id: 'sf_1', name: '半决赛 A', home: getWinner('qf_1', '1/4决赛A胜者'), away: getWinner('qf_2', '1/4决赛B胜者') },
      { id: 'sf_2', name: '半决赛 B', home: getWinner('qf_3', '1/4决赛C胜者'), away: getWinner('qf_4', '1/4决赛D胜者') },
    ];
  }, [knockoutWinners]);

  const finalMatch = useMemo(() => {
    const getWinner = (id, def) => knockoutWinners[id] || def;
    return { id: 'final', name: '巅峰总决赛', home: getWinner('sf_1', '半决赛A胜者'), away: getWinner('sf_2', '半决赛B胜者') };
  }, [knockoutWinners]);

  const handleSelectWinner = (matchId, teamName) => {
    if (!teamName || teamName.includes('胜者') || teamName.includes('组') || teamName.includes('第三')) return;
    setKnockoutWinners(prev => ({ ...prev, [matchId]: teamName }));
  };

  // 4. 一键深度泊松模拟（前台单次）
  const handleAutoSimulateOnce = () => {
    const simulatedGroup = matches.map(match => {
      const res = simulateMatchRealistic(match.home, match.away);
      return {
        ...match,
        homeScore: res.homeScore.toString(),
        awayScore: res.awayScore.toString()
      };
    });
    setMatches(simulatedGroup);

    // 同步模拟淘汰赛阶段
    const newWinners = {};
    const newScores = {};

    const resolveKo = (home, away, matchId) => {
      if (!home || !away || home.includes('胜者') || away.includes('胜者')) return;
      const res = simulateMatchRealistic(home, away, true); // 淘汰赛判定为中立场
      let hs = res.homeScore;
      let as = res.awayScore;
      
      // 避免决出平局
      if (hs === as) {
        const homeRank = teamMetadata[home]?.rank || 50;
        const awayRank = teamMetadata[away]?.rank || 50;
        // 实力高者点球胜出概率略高
        const threshold = 0.5 + (awayRank - homeRank) * 0.003;
        if (Math.random() < threshold) {
          hs += 1; // 模拟点球大战
        } else {
          as += 1;
        }
      }

      newScores[matchId] = { home: hs, away: as };
      newWinners[matchId] = hs > as ? home : away;
    };

    // 独立计算并填注淘汰链条 (避免依赖状态更新延迟)
    const tempStandings = {};
    Object.keys(initialGroups).forEach(groupId => {
      tempStandings[groupId] = initialGroups[groupId].teams.map(t => ({
        name: t, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, pts: 0, rank: teamMetadata[t]?.rank || 50
      }));
    });

    simulatedGroup.forEach(m => {
      const hs = parseInt(m.homeScore, 10);
      const as = parseInt(m.awayScore, 10);
      const list = tempStandings[m.group];
      const hTeam = list.find(t => t.name === m.home);
      const aTeam = list.find(t => t.name === m.away);
      if (hTeam && aTeam) {
        hTeam.played += 1; aTeam.played += 1;
        hTeam.gf += hs; hTeam.ga += as;
        aTeam.gf += as; aTeam.ga += hs;
        hTeam.gd = hTeam.gf - hTeam.ga;
        aTeam.gd = aTeam.gf - aTeam.ga;
        if (hs > as) { hTeam.won += 1; hTeam.pts += 3; }
        else if (hs < as) { aTeam.won += 1; aTeam.pts += 3; }
        else { hTeam.drawn += 1; hTeam.pts += 1; aTeam.drawn += 1; aTeam.pts += 1; }
      }
    });

    Object.keys(tempStandings).forEach(gid => {
      tempStandings[gid].sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || b.won - a.won || a.rank - b.rank);
    });

    const tempThirds = [];
    Object.keys(tempStandings).forEach(gid => {
      tempThirds.push({ ...tempStandings[gid][2], groupId: gid });
    });
    tempThirds.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || b.won - a.won || a.rank - b.rank);
    const top8T = tempThirds.slice(0, 8).map(t => t.name);

    const w = {}; const r = {};
    Object.keys(tempStandings).forEach(gid => {
      const key = gid.split(' ')[1];
      w[key] = tempStandings[gid][0].name;
      r[key] = tempStandings[gid][1].name;
    });

    const tempR32 = [
      { id: 'r32_1', home: w['A'], away: top8T[0] }, { id: 'r32_2', home: r['B'], away: r['F'] },
      { id: 'r32_3', home: w['C'], away: top8T[4] }, { id: 'r32_4', home: w['D'], away: top8T[5] },
      { id: 'r32_5', home: w['E'], away: r['A'] },   { id: 'r32_6', home: w['F'], away: r['C'] },
      { id: 'r32_7', home: w['G'], away: top8T[1] }, { id: 'r32_8', home: w['H'], away: top8T[2] },
      { id: 'r32_9', home: w['I'], away: r['E'] },   { id: 'r32_10', home: w['J'], away: r['D'] },
      { id: 'r32_11', home: w['K'], away: r['G'] },  { id: 'r32_12', home: w['L'], away: r['H'] },
      { id: 'r32_13', home: r['I'], away: r['J'] },  { id: 'r32_14', home: r['K'], away: r['L'] },
      { id: 'r32_15', home: top8T[3], away: top8T[6] }, { id: 'r32_16', home: top8T[7], away: w['B'] }
    ];

    tempR32.forEach(m => resolveKo(m.home, m.away, m.id));

    // R16
    const r16Map = [
      { id: 'r16_1', h: newWinners['r32_1'], a: newWinners['r32_2'] },
      { id: 'r16_2', h: newWinners['r32_3'], a: newWinners['r32_4'] },
      { id: 'r16_3', h: newWinners['r32_5'], a: newWinners['r32_6'] },
      { id: 'r16_4', h: newWinners['r32_7'], a: newWinners['r32_8'] },
      { id: 'r16_5', h: newWinners['r32_9'], a: newWinners['r32_10'] },
      { id: 'r16_6', h: newWinners['r32_11'], a: newWinners['r32_12'] },
      { id: 'r16_7', h: newWinners['r32_13'], a: newWinners['r32_14'] },
      { id: 'r16_8', h: newWinners['r32_15'], a: newWinners['r32_16'] }
    ];
    r16Map.forEach(m => resolveKo(m.h, m.a, m.id));

    // QF
    const qfMap = [
      { id: 'qf_1', h: newWinners['r16_1'], a: newWinners['r16_2'] },
      { id: 'qf_2', h: newWinners['r16_3'], a: newWinners['r16_4'] },
      { id: 'qf_3', h: newWinners['r16_5'], a: newWinners['r16_6'] },
      { id: 'qf_4', h: newWinners['r16_7'], a: newWinners['r16_8'] }
    ];
    qfMap.forEach(m => resolveKo(m.h, m.a, m.id));

    // SF
    const sfMap = [
      { id: 'sf_1', h: newWinners['qf_1'], a: newWinners['qf_2'] },
      { id: 'sf_2', h: newWinners['qf_3'], a: newWinners['qf_4'] }
    ];
    sfMap.forEach(m => resolveKo(m.h, m.a, m.id));

    // Final
    resolveKo(newWinners['sf_1'], newWinners['sf_2'], 'final');

    setKnockoutWinners(newWinners);
    setKnockoutScores(newScores);
  };

  // ==================== 5. 多重批量模拟科学统计引擎 ====================
  const handleBatchSimulation = () => {
    setIsSimulating(true);

    // 利用 setTimeout 释放主线程避免卡死
    setTimeout(() => {
      // 初始化全48队的大盘数据统计桶
      const tracker = {};
      Object.keys(teamMetadata).forEach(name => {
        tracker[name] = {
          name,
          qualifiedCount: 0,
          r16Count: 0,
          qfCount: 0,
          sfCount: 0,
          runnerUpCount: 0,
          champCount: 0,
          groupMatchesGoals: 0,
          // 黑马追踪：FIFA排名20开外的球队走得更远
          darkHorseRuns: 0
        };
      });

      let totalGoalsSimmed = 0;
      let upsetsRecorded = []; // 记录冷门战局：FIFA 排名相差 30 以上低位战胜高位

      // 快速运行 N 次完整周期
      for (let run = 0; run < simCount; run++) {
        
        // A. 模拟小组赛
        const groupPoints = {};
        Object.keys(initialGroups).forEach(gid => {
          groupPoints[gid] = initialGroups[gid].teams.map(t => ({
            name: t, pts: 0, gd: 0, gf: 0, ga: 0, won: 0, rank: teamMetadata[t]?.rank || 50
          }));
        });

        initialMatches.forEach(m => {
          const res = simulateMatchRealistic(m.home, m.away);
          totalGoalsSimmed += (res.homeScore + res.awayScore);

          // 记录冷门
          const rankHome = teamMetadata[m.home]?.rank || 50;
          const rankAway = teamMetadata[m.away]?.rank || 50;
          if (Math.abs(rankHome - rankAway) >= 30) {
            if ((res.homeScore > res.awayScore && rankHome > rankAway) || (res.awayScore > res.homeScore && rankAway > rankHome)) {
              upsetsRecorded.push({
                winner: res.homeScore > res.awayScore ? m.home : m.away,
                loser: res.homeScore > res.awayScore ? m.away : m.home,
                score: `${Math.max(res.homeScore, res.awayScore)}-${Math.min(res.homeScore, res.awayScore)}`
              });
            }
          }

          const pool = groupPoints[m.group];
          const hTeam = pool.find(t => t.name === m.home);
          const aTeam = pool.find(t => t.name === m.away);
          if (hTeam && aTeam) {
            hTeam.gf += res.homeScore; hTeam.ga += res.awayScore; hTeam.gd += (res.homeScore - res.awayScore);
            aTeam.gf += res.awayScore; aTeam.ga += res.homeScore; aTeam.gd += (res.awayScore - res.homeScore);
            if (res.homeScore > res.awayScore) { hTeam.pts += 3; hTeam.won += 1; }
            else if (res.homeScore < res.awayScore) { aTeam.pts += 3; aTeam.won += 1; }
            else { hTeam.pts += 1; aTeam.pts += 1; }
          }
        });

        // 排序小组
        Object.keys(groupPoints).forEach(gid => {
          groupPoints[gid].sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || b.won - a.won || a.rank - b.rank);
        });

        // 挑选小组第三
        const thirds = [];
        Object.keys(groupPoints).forEach(gid => {
          thirds.push({ ...groupPoints[gid][2], groupId: gid });
        });
        thirds.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || b.won - a.won || a.rank - b.rank);
        const top8ThirdNames = thirds.slice(0, 8).map(t => t.name);

        // 输送至 32 强出线纪录
        const w = {}; const r = {};
        Object.keys(groupPoints).forEach(gid => {
          const key = gid.split(' ')[1];
          w[key] = groupPoints[gid][0].name;
          r[key] = groupPoints[gid][1].name;
          
          // 前两名和出线第三名计数
          tracker[groupPoints[gid][0].name].qualifiedCount++;
          tracker[groupPoints[gid][1].name].qualifiedCount++;
        });
        top8ThirdNames.forEach(name => {
          tracker[name].qualifiedCount++;
        });

        // B. 模拟淘汰赛阶段
        const koResolve = (t1, t2) => {
          const res = simulateMatchRealistic(t1, t2, true);
          let hs = res.homeScore;
          let as = res.awayScore;
          if (hs === as) {
            // 点球
            const rank1 = teamMetadata[t1]?.rank || 50;
            const rank2 = teamMetadata[t2]?.rank || 50;
            return Math.random() < (0.5 + (rank2 - rank1) * 0.003) ? t1 : t2;
          }
          return hs > as ? t1 : t2;
        };

        // R32 战局
        const r32WinnerList = [
          koResolve(w['A'], top8ThirdNames[0]), koResolve(r['B'], r['F']),
          koResolve(w['C'], top8ThirdNames[4]), koResolve(w['D'], top8ThirdNames[5]),
          koResolve(w['E'], r['A']),           koResolve(w['F'], r['C']),
          koResolve(w['G'], top8ThirdNames[1]), koResolve(w['H'], top8ThirdNames[2]),
          koResolve(w['I'], r['E']),           koResolve(w['J'], r['D']),
          koResolve(w['K'], r['G']),           koResolve(w['L'], r['H']),
          koResolve(r['I'], r['J']),           koResolve(r['K'], r['L']),
          koResolve(top8ThirdNames[3], top8ThirdNames[6]), koResolve(top8ThirdNames[7], w['B'])
        ];

        // R16
        const r16WinnerList = [];
        for (let i = 0; i < 16; i += 2) {
          const winner = koResolve(r32WinnerList[i], r32WinnerList[i + 1]);
          r16WinnerList.push(winner);
          tracker[winner].r16Count++;
        }

        // QF
        const qfWinnerList = [];
        for (let i = 0; i < 8; i += 2) {
          const winner = koResolve(r16WinnerList[i], r16WinnerList[i + 1]);
          qfWinnerList.push(winner);
          tracker[winner].qfCount++;
        }

        // SF
        const sfWinnerList = [];
        for (let i = 0; i < 4; i += 2) {
          const winner = koResolve(qfWinnerList[i], qfWinnerList[i + 1]);
          sfWinnerList.push(winner);
          tracker[winner].sfCount++;
        }

        // Final
        const champ = koResolve(sfWinnerList[0], sfWinnerList[1]);
        const runnerUp = champ === sfWinnerList[0] ? sfWinnerList[1] : sfWinnerList[0];

        tracker[champ].champCount++;
        tracker[runnerUp].runnerUpCount++;

        // 黑马追踪：FIFA排名20以外 进入八强及以上 = 黑马表现
        const deepRunners = [...qfWinnerList];
        deepRunners.forEach(team => {
          const teamRank = teamMetadata[team]?.rank || 50;
          if (teamRank > 20) {
            tracker[team].darkHorseRuns++;
          }
        });
      }

      // 计算平均值和归一化比率
      const normalized = Object.keys(tracker).map(name => {
        const t = tracker[name];
        return {
          name,
          flag: teamMetadata[name]?.flag || '🏳️',
          rank: teamMetadata[name]?.rank || 50,
          region: teamMetadata[name]?.region || '欧洲',
          formBoost: teamMetadata[name]?.formBoost || 0,
          qualifiedPct: ((t.qualifiedCount / simCount) * 100).toFixed(1),
          r16Pct: ((t.r16Count / simCount) * 100).toFixed(1),
          qfPct: ((t.qfCount / simCount) * 100).toFixed(1),
          sfPct: ((t.sfCount / simCount) * 100).toFixed(1),
          finalPct: (((t.champCount + t.runnerUpCount) / simCount) * 100).toFixed(1),
          champPct: ((t.champCount / simCount) * 100).toFixed(1),
          darkHorsePct: ((t.darkHorseRuns / simCount) * 100).toFixed(1),
          darkHorseRuns: t.darkHorseRuns
        };
      });

      // 按夺冠率降序排序，确保夺冠前5动态变化
      normalized.sort((a, b) => parseFloat(b.champPct) - parseFloat(a.champPct) || a.rank - b.rank);

      // 提取冷门之最
      const upsetSummary = upsetsRecorded.reduce((acc, current) => {
        const key = `${current.winner} 胜 ${current.loser}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      const sortedUpsets = Object.keys(upsetSummary)
        .map(k => ({ match: k, count: upsetSummary[k] }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      setStatsResults({
        teams: normalized,
        avgGoals: (totalGoalsSimmed / (simCount * 72)).toFixed(2), // 72场小组赛平均
        totalSims: simCount,
        topUpsets: sortedUpsets
      });

      setIsSimulating(false);
    }, 150);
  };

  // ==================== 6. 球队之旅模拟引擎 ====================
  const handleJourneySimulation = () => {
    if (!journeyTeam) return;
    setIsJourneyRunning(true);

    setTimeout(() => {
      const team = journeyTeam;
      const N = simCount;

      // 找到球队所在组
      let teamGroupKey = '';
      let teamGroupIndex = -1;
      Object.keys(initialGroups).forEach(gid => {
        const idx = initialGroups[gid].teams.indexOf(team);
        if (idx >= 0) { teamGroupKey = gid; teamGroupIndex = idx; }
      });
      const groupOpponents = initialGroups[teamGroupKey].teams.filter(t => t !== team);

      // 该队在小组赛的3场比赛
      const teamGroupMatches = initialMatches.filter(m => m.group === teamGroupKey && (m.home === team || m.away === team));

      // 追踪数据
      let totalPoints = 0, totalGD = 0;
      let posCounts = [0, 0, 0, 0]; // 1st, 2nd, 3rd, 4th
      const qualVia = { first: 0, second: 0, third: 0, failed: 0 };
      const elimReasons = { points: 0, gd: 0, gf: 0, rank: 0 };

      // 每个对手的胜/平/负/进球/失球
      const oppStats = {};
      groupOpponents.forEach(o => {
        oppStats[o] = { wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, totalScored: 0, totalConceded: 0 };
      });

      // 淘汰赛追踪
      const koStages = ['r32', 'r16', 'qf', 'sf', 'final'];
      const koData = {
        r32: { reached: 0, won: 0, opponents: {}, scores: [], penalties: 0 },
        r16: { reached: 0, won: 0, opponents: {}, scores: [], penalties: 0 },
        qf: { reached: 0, won: 0, opponents: {}, scores: [], penalties: 0 },
        sf: { reached: 0, won: 0, opponents: {}, scores: [], penalties: 0 },
        final: { reached: 0, won: 0, opponents: {}, scores: [], penalties: 0 },
      };

      // 最高成就
      let bestFinishIdx = -1; // 0=r32, 1=r16, 2=qf, 3=sf, 4=final, 5=champ

      for (let run = 0; run < N; run++) {
        // A. 模拟小组赛
        const gp = {};
        Object.keys(initialGroups).forEach(gid => {
          gp[gid] = initialGroups[gid].teams.map(t => ({
            name: t, pts: 0, gd: 0, gf: 0, ga: 0, won: 0, rank: teamMetadata[t]?.rank || 50
          }));
        });

        initialMatches.forEach(m => {
          const res = simulateMatchRealistic(m.home, m.away);
          const pool = gp[m.group];
          const h = pool.find(t => t.name === m.home);
          const a = pool.find(t => t.name === m.away);
          if (h && a) {
            h.gf += res.homeScore; h.ga += res.awayScore; h.gd += (res.homeScore - res.awayScore);
            a.gf += res.awayScore; a.ga += res.homeScore; a.gd += (res.awayScore - res.homeScore);
            if (res.homeScore > res.awayScore) { h.pts += 3; h.won += 1; }
            else if (res.homeScore < res.awayScore) { a.pts += 3; a.won += 1; }
            else { h.pts += 1; a.pts += 1; }

            // 追踪目标球队的对手统计
            if (m.home === team) {
              const opp = oppStats[m.away];
              if (opp) {
                opp.totalScored += res.homeScore; opp.totalConceded += res.awayScore;
                if (res.homeScore > res.awayScore) opp.wins++;
                else if (res.homeScore < res.awayScore) opp.losses++;
                else opp.draws++;
              }
            } else if (m.away === team) {
              const opp = oppStats[m.home];
              if (opp) {
                opp.totalScored += res.awayScore; opp.totalConceded += res.homeScore;
                if (res.awayScore > res.homeScore) opp.wins++;
                else if (res.awayScore < res.homeScore) opp.losses++;
                else opp.draws++;
              }
            }
          }
        });

        // 排序小组
        Object.keys(gp).forEach(gid => {
          gp[gid].sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || b.won - a.won || a.rank - b.rank);
        });

        // 目标球队小组排名
        const teamGroup = gp[teamGroupKey];
        const teamPos = teamGroup.findIndex(t => t.name === team);
        const teamData = teamGroup[teamPos];
        posCounts[teamPos]++;
        totalPoints += teamData.pts;
        totalGD += teamData.gd;

        // 第三名排名
        const thirds = [];
        Object.keys(gp).forEach(gid => {
          thirds.push({ ...gp[gid][2], groupId: gid });
        });
        thirds.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || b.won - a.won || a.rank - b.rank);
        const top8ThirdNames = thirds.slice(0, 8).map(t => t.name);

        // 是否出线
        let qualified = false;
        let via = '';
        if (teamPos === 0) { qualified = true; via = 'first'; }
        else if (teamPos === 1) { qualified = true; via = 'second'; }
        else if (teamPos === 2 && top8ThirdNames.includes(team)) { qualified = true; via = 'third'; }

        if (qualified) {
          qualVia[via]++;
        } else {
          qualVia.failed++;
          // 淘汰原因分析
          const fourthThresh = teamPos === 2 ? thirds[7] : null; // 第三名比较的阈值
          if (teamPos === 3) {
            // 第四名，看和第三名的差距
            const third = teamGroup[2];
            const diff = third.pts - teamData.pts;
            if (diff >= 3) elimReasons.points++;
            else if (diff >= 1) elimReasons.points++;
            else if (third.gd > teamData.gd) elimReasons.gd++;
            else if (third.gf > teamData.gf) elimReasons.gf++;
            else elimReasons.rank++;
          } else if (teamPos === 2) {
            // 第三名但未进前8
            const threshold = thirds[7];
            if (threshold.pts > teamData.pts) elimReasons.points++;
            else if (threshold.gd > teamData.gd) elimReasons.gd++;
            else if (threshold.gf > teamData.gf) elimReasons.gf++;
            else elimReasons.rank++;
          }
        }

        if (!qualified) continue; // 未出线，跳过淘汰赛

        // B. 模拟淘汰赛
        const w = {}; const r2nd = {};
        Object.keys(gp).forEach(gid => {
          const key = gid.split(' ')[1];
          w[key] = gp[gid][0].name;
          r2nd[key] = gp[gid][1].name;
        });

        const koResolve = (t1, t2) => {
          const res = simulateMatchRealistic(t1, t2, true);
          let hs = res.homeScore;
          let as = res.awayScore;
          let viaPenalty = false;
          if (hs === as) {
            viaPenalty = true;
            const rank1 = teamMetadata[t1]?.rank || 50;
            const rank2 = teamMetadata[t2]?.rank || 50;
            return { winner: Math.random() < (0.5 + (rank2 - rank1) * 0.003) ? t1 : t2, score: `${hs}-${as}`, penalty: true };
          }
          return { winner: hs > as ? t1 : t2, score: `${hs}-${as}`, penalty: false };
        };

        // R32
        const r32Matches = [
          { home: w['A'], away: top8ThirdNames[0], label: 'R32-1' },
          { home: r2nd['B'], away: r2nd['F'], label: 'R32-2' },
          { home: w['C'], away: top8ThirdNames[4], label: 'R32-3' },
          { home: w['D'], away: top8ThirdNames[5], label: 'R32-4' },
          { home: w['E'], away: r2nd['A'], label: 'R32-5' },
          { home: w['F'], away: r2nd['C'], label: 'R32-6' },
          { home: w['G'], away: top8ThirdNames[1], label: 'R32-7' },
          { home: w['H'], away: top8ThirdNames[2], label: 'R32-8' },
          { home: w['I'], away: r2nd['E'], label: 'R32-9' },
          { home: w['J'], away: r2nd['D'], label: 'R32-10' },
          { home: w['K'], away: r2nd['G'], label: 'R32-11' },
          { home: w['L'], away: r2nd['H'], label: 'R32-12' },
          { home: r2nd['I'], away: r2nd['J'], label: 'R32-13' },
          { home: r2nd['K'], away: r2nd['L'], label: 'R32-14' },
          { home: top8ThirdNames[3], away: top8ThirdNames[6], label: 'R32-15' },
          { home: top8ThirdNames[7], away: w['B'], label: 'R32-16' }
        ];

        const r32Winners = r32Matches.map(m => {
          const res = koResolve(m.home, m.away);
          if (m.home === team || m.away === team) {
            koData.r32.reached++;
            const opponent = m.home === team ? m.away : m.home;
            koData.r32.opponents[opponent] = (koData.r32.opponents[opponent] || 0) + 1;
            koData.r32.scores.push(res.score);
            if (res.penalty) koData.r32.penalties++;
            if (res.winner === team) koData.r32.won++;
          }
          return res.winner;
        });

        if (!r32Winners.includes(team)) {
          if (bestFinishIdx < 0) bestFinishIdx = 0;
          continue;
        }

        // R16
        const r16Winners = [];
        for (let i = 0; i < 16; i += 2) {
          const t1 = r32Winners[i], t2 = r32Winners[i + 1];
          const res = koResolve(t1, t2);
          if (t1 === team || t2 === team) {
            koData.r16.reached++;
            const opponent = t1 === team ? t2 : t1;
            koData.r16.opponents[opponent] = (koData.r16.opponents[opponent] || 0) + 1;
            koData.r16.scores.push(res.score);
            if (res.penalty) koData.r16.penalties++;
            if (res.winner === team) koData.r16.won++;
          }
          r16Winners.push(res.winner);
        }

        if (!r16Winners.includes(team)) {
          if (bestFinishIdx < 1) bestFinishIdx = 1;
          continue;
        }

        // QF
        const qfWinners = [];
        for (let i = 0; i < 8; i += 2) {
          const t1 = r16Winners[i], t2 = r16Winners[i + 1];
          const res = koResolve(t1, t2);
          if (t1 === team || t2 === team) {
            koData.qf.reached++;
            const opponent = t1 === team ? t2 : t1;
            koData.qf.opponents[opponent] = (koData.qf.opponents[opponent] || 0) + 1;
            koData.qf.scores.push(res.score);
            if (res.penalty) koData.qf.penalties++;
            if (res.winner === team) koData.qf.won++;
          }
          qfWinners.push(res.winner);
        }

        if (!qfWinners.includes(team)) {
          if (bestFinishIdx < 2) bestFinishIdx = 2;
          continue;
        }

        // SF
        const sfWinners = [];
        for (let i = 0; i < 4; i += 2) {
          const t1 = qfWinners[i], t2 = qfWinners[i + 1];
          const res = koResolve(t1, t2);
          if (t1 === team || t2 === team) {
            koData.sf.reached++;
            const opponent = t1 === team ? t2 : t1;
            koData.sf.opponents[opponent] = (koData.sf.opponents[opponent] || 0) + 1;
            koData.sf.scores.push(res.score);
            if (res.penalty) koData.sf.penalties++;
            if (res.winner === team) koData.sf.won++;
          }
          sfWinners.push(res.winner);
        }

        if (!sfWinners.includes(team)) {
          if (bestFinishIdx < 3) bestFinishIdx = 3;
          continue;
        }

        // Final
        {
          const t1 = sfWinners[0], t2 = sfWinners[1];
          const res = koResolve(t1, t2);
          koData.final.reached++;
          const opponent = t1 === team ? t2 : t1;
          koData.final.opponents[opponent] = (koData.final.opponents[opponent] || 0) + 1;
          koData.final.scores.push(res.score);
          if (res.penalty) koData.final.penalties++;
          if (res.winner === team) {
            koData.final.won++;
            bestFinishIdx = 5;
          } else {
            if (bestFinishIdx < 4) bestFinishIdx = 4;
          }
        }
      }

      // ===== 汇总分析 =====
      const teamRank = teamMetadata[team]?.rank || 50;
      const teamFlag = teamMetadata[team]?.flag || '🏳️';
      const teamRegion = teamMetadata[team]?.region || '';
      const teamBoost = teamMetadata[team]?.formBoost || 0;
      const groupName = initialGroups[teamGroupKey]?.name || '';

      // 定位标签
      let positioning = '小组赛挑战者';
      if (teamRank <= 5) positioning = '夺冠大热门';
      else if (teamRank <= 10) positioning = '争冠有力竞争者';
      else if (teamRank <= 20) positioning = '淘汰赛常客';
      else if (teamRank <= 30) positioning = '黑马潜力股';

      // 小组赛汇总
      const qualRate = ((N - qualVia.failed) / N * 100).toFixed(1);
      const avgPts = (totalPoints / N).toFixed(1);
      const avgGD = (totalGD / N).toFixed(1);

      // 对手分析
      const groupOpponentAnalysis = groupOpponents.map(opp => {
        const s = oppStats[opp];
        const total = s.wins + s.draws + s.losses;
        const winRate = total > 0 ? (s.wins / total * 100).toFixed(0) : 0;
        const avgScored = total > 0 ? (s.totalScored / total).toFixed(1) : '0';
        const avgConceded = total > 0 ? (s.totalConceded / total).toFixed(1) : '0';
        const oppRank = teamMetadata[opp]?.rank || 50;
        let analysis = '';
        if (oppRank > teamRank + 15) analysis = '实力明显占优，预计稳拿3分';
        else if (oppRank > teamRank + 5) analysis = '实力占优，胜率较高';
        else if (oppRank > teamRank - 5) analysis = '势均力敌，胜负难料';
        else if (oppRank > teamRank - 15) analysis = '对手略强，需要发挥出色';
        else analysis = '强敌当前，需全力防守反击';
        return { name: opp, flag: teamMetadata[opp]?.flag || '🏳️', rank: oppRank, winRate, avgScore: `${avgScored}-${avgConceded}`, analysis };
      });

      // 淘汰赛逐轮汇总
      const roundLabels = { r32: '32强', r16: '16强', qf: '八强', sf: '四强', final: '决赛' };
      const knockoutStages = koStages.map(stage => {
        const d = koData[stage];
        const reachRate = (d.reached / N * 100).toFixed(1);
        const winRate = d.reached > 0 ? (d.won / d.reached * 100).toFixed(1) : '0.0';
        const penaltyRate = d.reached > 0 ? (d.penalties / d.reached * 100).toFixed(1) : '0.0';

        // 前三可能对手
        const topOpps = Object.entries(d.opponents)
          .sort((a, b) => Number(b[1]) - Number(a[1]))
          .slice(0, 3)
          .map(([name, count]) => ({
            name, flag: teamMetadata[name]?.flag || '🏳️', rank: teamMetadata[name]?.rank || 50,
            freq: (Number(count) / Math.max(d.reached, 1) * 100).toFixed(0)
          }));

        // 最常见比分
        const scoreCounts = {};
        d.scores.forEach(s => { scoreCounts[s] = (scoreCounts[s] || 0) + 1; });
        const typicalScore = Object.entries(scoreCounts).sort((a, b) => Number(b[1]) - Number(a[1]))[0]?.[0] || '-';

        return { round: roundLabels[stage], stageKey: stage, reachRate, winRate, penaltyRate, topOpponents: topOpps, typicalScore };
      });

      // 最高成就
      const finishLabels = ['止步32强', '止步16强', '止步八强', '止步四强', '亚军', '冠军'];
      const bestFinish = bestFinishIdx >= 0 ? finishLabels[bestFinishIdx] : '小组未出线';

      // 洞察生成
      const insights = [];

      // 1. 小组赛洞察
      const strongestOpp = groupOpponents.reduce((best, o) => {
        const r = teamMetadata[o]?.rank || 50;
        return r < (teamMetadata[best]?.rank || 50) ? o : best;
      }, groupOpponents[0]);
      if (parseFloat(qualRate) >= 80) {
        insights.push({ type: 'good', text: `小组出线概率高达${qualRate}%，小组赛压力不大，可为淘汰赛蓄力` });
      } else if (parseFloat(qualRate) >= 50) {
        insights.push({ type: 'warn', text: `小组出线概率${qualRate}%，${strongestOpp}（FIFA #${teamMetadata[strongestOpp]?.rank}）是主要威胁，需在对阵中抢分` });
      } else {
        insights.push({ type: 'risk', text: `小组出线概率仅${qualRate}%，形势严峻。同组${strongestOpp}（FIFA #${teamMetadata[strongestOpp]?.rank}）实力强劲，必须在对阵弱旅时全取9分` });
      }

      // 2. 出线方式分析
      const firstPct = (qualVia.first / N * 100).toFixed(0);
      const secondPct = (qualVia.second / N * 100).toFixed(0);
      const thirdPct = (qualVia.third / N * 100).toFixed(0);
      if (parseFloat(firstPct) > 50) {
        insights.push({ type: 'good', text: `${firstPct}%概率以小组第一出线，将在32强对阵第三名球队，赛程有利` });
      } else if (parseFloat(secondPct) > parseFloat(firstPct)) {
        insights.push({ type: 'warn', text: `更可能以小组第二出线（${secondPct}%），32强对手将更强劲，需做好硬仗准备` });
      }

      // 3. 瓶颈轮次
      let maxDrop = 0, bottleneck = '';
      for (let i = 0; i < knockoutStages.length - 1; i++) {
        const curr = parseFloat(knockoutStages[i].reachRate);
        const next = parseFloat(knockoutStages[i + 1].reachRate);
        if (curr > 0) {
          const drop = (curr - next) / curr * 100;
          if (drop > maxDrop) {
            maxDrop = drop;
            bottleneck = knockoutStages[i + 1].round;
          }
        }
      }
      if (bottleneck) {
        const bottleneckData = knockoutStages.find(s => s.round === bottleneck);
        const topOpp = bottleneckData?.topOpponents[0];
        if (topOpp) {
          insights.push({ type: 'risk', text: `${bottleneck}是最大瓶颈，淘汰概率最高。最可能遇到${topOpp.name}（FIFA #${topOpp.rank}），出现频率${topOpp.freq}%` });
        } else {
          insights.push({ type: 'warn', text: `${bottleneck}是最大瓶颈轮次，需要超常发挥才能突破` });
        }
      }

      // 4. 黑马潜质
      const qfStage = knockoutStages.find(s => s.stageKey === 'qf');
      if (teamRank > 15 && parseFloat(qfStage?.reachRate || '0') > 15) {
        insights.push({ type: 'good', text: `黑马潜质突出！FIFA排名${teamRank}但八强率达${qfStage?.reachRate}%，有望创造惊喜${teamBoost > 0 ? `（状态加成+${teamBoost}）` : ''}` });
      }

      // 5. 夺冠前景
      const finalStage = knockoutStages.find(s => s.stageKey === 'final');
      const champRate = koData.final.won / N * 100;
      if (champRate >= 5) {
        insights.push({ type: 'good', text: `夺冠概率${champRate.toFixed(1)}%，是本届世界杯的有力竞争者` });
      } else if (champRate >= 1) {
        insights.push({ type: 'warn', text: `夺冠概率${champRate.toFixed(1)}%，需要天时地利人和才能圆梦` });
      } else if (parseFloat(qualRate) > 0) {
        insights.push({ type: 'risk', text: `夺冠概率不足1%，但足球的魅力在于不确定性——2016年莱斯特城的奇迹并非不可能` });
      }

      setJourneyResult({
        team, flag: teamFlag, rank: teamRank, region: teamRegion, formBoost: teamBoost,
        groupName, positioning, simCount: N,
        groupStage: {
          avgPoints: avgPts, avgGD,
          posCounts,
          qualificationRate: qualRate,
          qualificationVia: { first: firstPct, second: secondPct, third: thirdPct },
          eliminationRate: (qualVia.failed / N * 100).toFixed(1),
          eliminationReasons: elimReasons,
          opponents: groupOpponentAnalysis,
        },
        knockoutStages,
        achievements: {
          bestFinish,
          championRate: champRate.toFixed(1),
          finalRate: (koData.final.reached > 0 ? (koData.final.reached / N * 100).toFixed(1) : '0.0'),
          sfRate: (koData.sf.reached / N * 100).toFixed(1),
          qfRate: (koData.qf.reached / N * 100).toFixed(1),
        },
        insights,
      });

      setIsJourneyRunning(false);
    }, 150);
  };

  // 批量模拟过滤器过滤
  const sortedStatsTeams = useMemo(() => {
    if (!statsResults) return [];
    return statsResults.teams
      .filter(t => filterRegion === 'All' || t.region === filterRegion)
      .sort((a, b) => parseFloat(b.champPct) - parseFloat(a.champPct) || a.rank - b.rank);
  }, [statsResults, filterRegion]);

  // 修改单场比分
  const handleScoreChange = (matchId, side, value) => {
    if (value !== '' && !/^\d+$/.test(value)) return;
    setMatches(prev => prev.map(m => {
      if (m.id === matchId) {
        return { ...m, [side === 'home' ? 'homeScore' : 'awayScore']: value };
      }
      return m;
    }));
  };

  const handleKoScoreChange = (matchId, side, val) => {
    if (val !== '' && !/^\d+$/.test(val)) return;
    setKnockoutScores(prev => {
      const current = prev[matchId] || { home: '', away: '' };
      const updated = { ...current, [side]: val };
      const hScore = parseInt(updated.home, 10);
      const aScore = parseInt(updated.away, 10);
      
      if (!isNaN(hScore) && !isNaN(aScore)) {
        let matchObj = r32Matches.find(m => m.id === matchId) || 
                       r16Matches.find(m => m.id === matchId) || 
                       qfMatches.find(m => m.id === matchId) || 
                       sfMatches.find(m => m.id === matchId) || 
                       (finalMatch.id === matchId ? finalMatch : null);
        
        if (matchObj) {
          if (hScore > aScore) setKnockoutWinners(w => ({ ...w, [matchId]: matchObj.home }));
          else if (hScore < aScore) setKnockoutWinners(w => ({ ...w, [matchId]: matchObj.away }));
        }
      }
      return { ...prev, [matchId]: updated };
    });
  };

  const handleResetScores = () => {
    const reset = matches.map(m => ({ ...m, homeScore: '', awayScore: '' }));
    setMatches(reset);
    setKnockoutScores({});
    setKnockoutWinners({});
  };

  const filteredMatches = useMemo(() => {
    return matches.filter(match => {
      const matchesCountry = filterCountry === 'All' || match.country === filterCountry;
      const matchesGroup = filterGroup === 'All' || match.group === filterGroup;
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = searchQuery === '' ||
        match.home.toLowerCase().includes(searchLower) ||
        match.away.toLowerCase().includes(searchLower) ||
        match.city.toLowerCase().includes(searchLower);
      const matchesFollow = !showFollowedOnly || followedMatches.has(match.id);
      return matchesCountry && matchesGroup && matchesSearch && matchesFollow;
    });
  }, [matches, filterCountry, filterGroup, searchQuery, showFollowedOnly, followedMatches]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-teal-500 selection:text-white">
      
      {/* 顶部主视觉标语区 */}
      <div className="relative overflow-hidden border-b border-slate-900 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-red-950/30">
        <div className="absolute top-0 left-1/4 w-96 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent blur-sm"></div>
        <div className="absolute top-0 right-1/4 w-96 h-1 bg-gradient-to-l from-red-500 via-rose-400 to-transparent blur-sm"></div>

        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-amber-400 font-medium mb-3">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                泊松概率期望(xG)拟真模型 · 批量推演大数据中心
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400">
                2026 美加墨世界杯
              </h1>
              <p className="mt-2 text-slate-400 max-w-xl text-sm leading-relaxed">
                FIFA World Cup 2026 — 赛程日程、分组积分以及 **AI 科学多次推演统计系统**，完美掌握出线胜率大势。
              </p>
            </div>

            {/* 北京时间倒计时 */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl min-w-[280px] sm:min-w-[340px] relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-[10px] font-bold text-slate-950 tracking-wider">
                CST 北京时间倒计时
              </div>
              <div className="text-center text-xs text-slate-400 mb-2 mt-1">距离首个开哨战（北京时间）还有</div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-slate-950/80 rounded-xl p-2 border border-slate-800">
                  <div className="text-2xl font-black text-emerald-400">{timeLeft.days}</div>
                  <div className="text-[10px] text-slate-500">天</div>
                </div>
                <div className="bg-slate-950/80 rounded-xl p-2 border border-slate-800">
                  <div className="text-2xl font-black text-teal-400">{timeLeft.hours}</div>
                  <div className="text-[10px] text-slate-500">时</div>
                </div>
                <div className="bg-slate-950/80 rounded-xl p-2 border border-slate-800">
                  <div className="text-2xl font-black text-amber-400">{timeLeft.minutes}</div>
                  <div className="text-[10px] text-slate-500">分</div>
                </div>
                <div className="bg-slate-950/80 rounded-xl p-2 border border-slate-800">
                  <div className="text-2xl font-black text-rose-500">{timeLeft.seconds}</div>
                  <div className="text-[10px] text-slate-500">秒</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 导航栏 */}
      <div className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between items-center py-2 gap-4">
            
            <nav className="flex space-x-1 sm:space-x-2" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('schedule')}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  activeTab === 'schedule' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                📅 北京时间日程表
              </button>
              <button
                onClick={() => setActiveTab('groups')}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  activeTab === 'groups' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                🏆 12组积分模拟
              </button>
              <button
                onClick={() => setActiveTab('bracket')}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  activeTab === 'bracket' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                🌿 32强树状模拟
              </button>
              <button
                onClick={() => {
                  setActiveTab('stats');
                  if (!statsResults) handleBatchSimulation(); // 自动模拟初次加载
                }}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  activeTab === 'stats' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-teal-400 hover:bg-slate-900'
                }`}
              >
                📊 AI 大数据统计预测
              </button>
              <button
                onClick={() => setActiveTab('journey')}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  activeTab === 'journey' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-amber-400 hover:bg-slate-900'
                }`}
              >
                🔮 球队之旅
              </button>
              <button
                onClick={() => setActiveTab('squads')}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  activeTab === 'squads' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-blue-400 hover:bg-slate-900'
                }`}
              >
                📋 球队阵容
              </button>
              <button
                onClick={() => setActiveTab('venues')}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  activeTab === 'venues' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                🏟️ 场馆指南
              </button>
              <button
                onClick={() => setActiveTab('format')}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  activeTab === 'format' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                ℹ️ 赛制规则
              </button>
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAutoSimulateOnce}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-teal-500/10 border border-teal-500/30 text-teal-400 hover:bg-teal-500 hover:text-slate-950 transition-all"
                title="根据球队实力期望值智能模拟小组和淘汰赛"
              >
                ⚡ 智能模拟单次
              </button>
              <button
                onClick={handleResetScores}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-all"
              >
                🔄 重置
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* 主面板内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB: AI 大数据统计预测 */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            
            {/* 顶栏多次模拟触发工具 */}
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl">
              <div>
                <h2 className="text-lg font-bold text-teal-400 flex items-center gap-2">
                  📊 世界杯多样本 AI 蒙特卡洛仿真推演
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  选择样本数量，系统将在毫秒内使用科学的泊松期望进球模型，在后台多次模拟 48 队整届杯赛并统计概率。
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400">运行次数:</span>
                  <select 
                    value={simCount} 
                    onChange={(e) => setSimCount(parseInt(e.target.value))}
                    className="bg-slate-900 text-xs border border-slate-700 rounded p-1 text-slate-200 focus:outline-none"
                  >
                    <option value={50}>50次 快速模拟</option>
                    <option value={100}>100次 深度研究</option>
                    <option value={500}>500次 大样本推演</option>
                    <option value={1000}>1000次 顶尖分析(较耗时)</option>
                  </select>
                </div>

                <button
                  onClick={handleBatchSimulation}
                  disabled={isSimulating}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isSimulating 
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black shadow-lg shadow-teal-500/20'
                  }`}
                >
                  {isSimulating ? '🔄 矩阵运算中...' : '🏁 启动批量预测推演'}
                </button>
              </div>
            </div>

            {statsResults && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* 左侧夺冠大热门展示 (占4格) */}
                <div className="lg:col-span-4 space-y-6">
                  
                  <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl"></div>
                    
                    <h3 className="text-sm font-bold text-amber-400 flex items-center gap-1.5 mb-4">
                      👑 预测夺冠前 5 大超级热门
                    </h3>

                    <div className="space-y-4">
                      {statsResults.teams.slice(0, 5).map((team, idx) => {
                        const rankMedals = ['🥇', '🥈', '🥉', '4th', '5th'];
                        return (
                          <div key={team.name} className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-slate-200 flex items-center gap-2">
                                <span className="text-base w-6 text-center">{rankMedals[idx]}</span>
                                <span>{team.flag} {team.name}</span>
                              </span>
                              <span className="font-extrabold text-amber-400 text-sm">
                                {team.champPct}%
                              </span>
                            </div>
                            
                            {/* 质感横向进度条 */}
                            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                              <div 
                                className="bg-gradient-to-r from-amber-500 to-yellow-300 h-full rounded-full transition-all duration-500"
                                style={{ width: `${Math.max(1.5, team.champPct)}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 数据大盘总结摘要 */}
                  <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      📋 批量推演赛事概要
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                        <div className="text-[10px] text-slate-500">模拟推演总场次</div>
                        <div className="text-lg font-black text-slate-200">{statsResults.totalSims * 104} 场</div>
                      </div>
                      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                        <div className="text-[10px] text-slate-500">预计杯赛场均进球</div>
                        <div className="text-lg font-black text-teal-400">{statsResults.avgGoals} 个</div>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2 text-xs">
                      <span className="font-bold text-rose-400 text-[11px] block">🌋 频次最高的大冷门战局 (高Rank队伍落败)</span>
                      {statsResults.topUpsets.length > 0 ? (
                        statsResults.topUpsets.map((u, i) => (
                          <div key={i} className="flex justify-between text-[11px] text-slate-300">
                            <span>{u.match}</span>
                            <span className="text-rose-500 font-bold">模拟中出现 {u.count} 次</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-slate-600 text-[10px]">没有录得排名差在30以上的逆袭。</span>
                      )}
                    </div>
                  </div>

                  {/* 🐴 黑马榜 — FIFA排名20开外、模拟中走得最远的球队 */}
                  <div className="bg-gradient-to-b from-purple-950/30 to-slate-900 border border-purple-500/20 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl"></div>

                    <h3 className="text-sm font-bold text-purple-400 flex items-center gap-1.5 mb-3">
                      🐴 黑马冲击榜 — 低排名球队的逆袭概率
                    </h3>
                    <p className="text-[10px] text-slate-500 mb-3">
                      FIFA 排名 20 以外的球队进入八强的概率，数据源于 {simCount} 次蒙特卡洛仿真
                    </p>

                    <div className="space-y-3">
                      {statsResults.teams
                        .filter(t => t.rank > 20 && parseFloat(t.darkHorsePct) > 0)
                        .sort((a, b) => parseFloat(b.darkHorsePct) - parseFloat(a.darkHorsePct))
                        .slice(0, 6)
                        .map((team, idx) => (
                          <div key={team.name} className="space-y-1">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                                <span className="text-purple-400 font-mono text-[10px] w-5">#{idx + 1}</span>
                                <span className="text-base">{team.flag}</span>
                                <span>{team.name}</span>
                                <span className="text-[9px] text-slate-500 ml-1">FIFA #{team.rank}</span>
                                {team.formBoost > 0 && (
                                  <span className="text-[8px] px-1 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">状态+{team.formBoost}</span>
                                )}
                              </span>
                              <span className="font-extrabold text-purple-300 text-sm">
                                {team.darkHorsePct}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                              <div
                                className="bg-gradient-to-r from-purple-500 to-fuchsia-400 h-full rounded-full transition-all duration-500"
                                style={{ width: `${Math.max(2, parseFloat(team.darkHorsePct))}%` }}
                              ></div>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>

                </div>

                {/* 48强完整胜率天梯榜 (占8格) */}
                <div className="lg:col-span-8 space-y-4">
                  
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                    
                    {/* 分大区筛选 */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-3 border-b border-slate-800">
                      <h3 className="text-sm font-bold text-slate-200">
                        📊 48强世界杯多维度胜率预测榜
                      </h3>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-500">大区筛选:</span>
                        <select
                          value={filterRegion}
                          onChange={(e) => setFilterRegion(e.target.value)}
                          className="bg-slate-950 border border-slate-800 text-slate-300 text-xs py-1 px-2.5 rounded-lg focus:outline-none focus:border-teal-500"
                        >
                          <option value="All">全部大区</option>
                          <option value="欧洲">欧洲区 ({statsResults.teams.filter(t=>t.region==='欧洲').length})</option>
                          <option value="南美洲">南美洲 ({statsResults.teams.filter(t=>t.region==='南美洲').length})</option>
                          <option value="中北美">中北美 ({statsResults.teams.filter(t=>t.region==='中北美').length})</option>
                          <option value="亚洲">亚洲区 ({statsResults.teams.filter(t=>t.region==='亚洲').length})</option>
                          <option value="非洲">非洲区 ({statsResults.teams.filter(t=>t.region==='非洲').length})</option>
                          <option value="大洋洲">大洋洲 ({statsResults.teams.filter(t=>t.region==='大洋洲').length})</option>
                        </select>
                      </div>
                    </div>

                    {/* 天梯榜表格 */}
                    <div className="overflow-x-auto max-h-[480px] overflow-y-auto pr-1">
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead className="sticky top-0 bg-slate-900 z-10 text-slate-500 border-b border-slate-800">
                          <tr>
                            <th className="py-2 font-medium w-12">Rank</th>
                            <th className="py-2 font-medium">球队</th>
                            <th className="py-2 font-medium text-center w-20">小组出线 %</th>
                            <th className="py-2 font-medium text-center w-16">16强 %</th>
                            <th className="py-2 font-medium text-center w-16">4强 %</th>
                            <th className="py-2 font-medium text-center w-16">决赛 %</th>
                            <th className="py-2 font-semibold text-center w-20 text-amber-400">夺冠率 %</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedStatsTeams.map((team, idx) => (
                            <tr key={team.name} className="border-b border-slate-800/40 last:border-0 hover:bg-slate-800/30">
                              <td className="py-2.5 text-slate-500 font-mono">#{team.rank}</td>
                              <td className="py-2.5 font-bold text-slate-100">
                                <span className="mr-1.5 text-base">{team.flag}</span>
                                <span>{team.name}</span>
                              </td>
                              <td className="py-2.5 text-center font-semibold text-emerald-400">{team.qualifiedPct}%</td>
                              <td className="py-2.5 text-center text-teal-400">{team.r16Pct}%</td>
                              <td className="py-2.5 text-center text-slate-300">{team.sfPct}%</td>
                              <td className="py-2.5 text-center text-slate-300">{team.finalPct}%</td>
                              <td className="py-2.5 text-center font-black text-amber-400 bg-amber-500/5">{team.champPct}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                  </div>

                </div>

              </div>
            )}

          </div>
        )}

        {/* TAB 1: 北京时间日程表 */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between gap-4 items-center shadow-lg">
              
              <div className="relative w-full md:w-80">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 font-bold">🔍</span>
                <input
                  type="text"
                  placeholder="搜索国家、城市、场馆..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
                  <button onClick={() => setFilterCountry('All')} className={`px-2.5 py-1.5 rounded-md transition-all ${filterCountry === 'All' ? 'bg-slate-800 text-teal-400 font-bold' : 'text-slate-400'}`}>全部国家</button>
                  <button onClick={() => setFilterCountry('美国')} className={`px-2.5 py-1.5 rounded-md transition-all ${filterCountry === '美国' ? 'bg-slate-800 text-teal-400 font-bold' : 'text-slate-400'}`}>🇺🇸 美国</button>
                  <button onClick={() => setFilterCountry('加拿大')} className={`px-2.5 py-1.5 rounded-md transition-all ${filterCountry === '加拿大' ? 'bg-slate-800 text-teal-400 font-bold' : 'text-slate-400'}`}>🇨🇦 加拿大</button>
                  <button onClick={() => setFilterCountry('墨西哥')} className={`px-2.5 py-1.5 rounded-md transition-all ${filterCountry === '墨西哥' ? 'bg-slate-800 text-teal-400 font-bold' : 'text-slate-400'}`}>🇲🇽 墨西哥</button>
                </div>

                <select
                  value={filterGroup}
                  onChange={(e) => setFilterGroup(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg text-xs py-1.5 px-3 text-slate-300 focus:outline-none"
                >
                  <option value="All">全部小组 (A-L)</option>
                  {Object.keys(initialGroups).map(gid => (
                    <option key={gid} value={gid}>{initialGroups[gid].name}</option>
                  ))}
                </select>

                <span className="text-xs text-amber-400 font-medium bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
                  ⏰ 已转换北京时间 (CST)
                </span>

                <button
                  onClick={() => setShowFollowedOnly(!showFollowedOnly)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                    showFollowedOnly
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-amber-400'
                  }`}
                >
                  {showFollowedOnly ? '⭐ 只看关注' : '☆ 只看关注'} <span className="text-[10px]">({followedMatches.size})</span>
                </button>

                <button
                  onClick={handleSyncResults}
                  disabled={isSyncing}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                    isSyncing
                      ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500 hover:text-slate-950'
                  }`}
                  title="从 thesportsdb.com 获取真实比赛结果"
                >
                  {isSyncing ? '🔄 同步中...' : '📡 同步真实赛果'}
                </button>
              </div>

            </div>

            {/* 同步状态消息 */}
            {syncMessage && (
              <div className={`px-4 py-2.5 rounded-xl text-xs font-medium border ${
                syncMessage.startsWith('✅') ? 'bg-emerald-950/30 border-emerald-500/20 text-emerald-300' :
                syncMessage.startsWith('❌') ? 'bg-rose-950/30 border-rose-500/20 text-rose-300' :
                'bg-slate-900 border-slate-800 text-slate-400'
              }`}>
                {syncMessage}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMatches.map(match => {
                const isFinished = match.homeScore !== '' && match.awayScore !== '';
                const homeMeta = teamMetadata[match.home] || {};
                const awayMeta = teamMetadata[match.away] || {};
                
                return (
                  <div 
                    key={match.id}
                    className={`relative bg-slate-900 border rounded-2xl p-4 transition-all duration-300 hover:translate-y-[-2px] ${
                      isFinished ? 'border-slate-800 bg-slate-900/40' : match.isMajor ? 'border-emerald-500/40 shadow-emerald-950/20' : 'border-slate-800'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[11px] font-semibold text-teal-400 uppercase tracking-wider">
                        📅 北京时间 {match.date} {(() => { const d = new Date(match.date + 'T00:00:00+08:00'); return ['周日','周一','周二','周三','周四','周五','周六'][d.getDay()]; })()}
                      </span>
                      <div className="flex gap-1 items-center">
                        <button
                          onClick={() => toggleFollow(match.id)}
                          className={`px-1.5 py-0.5 rounded text-xs transition-all ${
                            followedMatches.has(match.id) ? 'text-amber-400 hover:text-amber-300' : 'text-slate-600 hover:text-amber-400'
                          }`}
                          title={followedMatches.has(match.id) ? '取消关注' : '关注比赛'}
                        >
                          {followedMatches.has(match.id) ? '⭐' : '☆'}
                        </button>
                        {match.isMajor && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20">焦点战</span>
                        )}
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-slate-800 text-slate-300 border border-slate-700">
                          {initialGroups[match.group]?.name || match.group}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-12 items-center gap-1 py-1">
                      <div className="col-span-4 text-center">
                        <div className="text-3xl mb-1">{homeMeta.flag}</div>
                        <div className="text-xs font-bold truncate">{match.home}</div>
                        <div className="text-[10px] text-slate-500">FIFA #{homeMeta.rank}</div>
                      </div>

                      <div className="col-span-4 flex items-center justify-center gap-1">
                        <input
                          type="text"
                          maxLength={2}
                          value={match.homeScore}
                          onChange={(e) => handleScoreChange(match.id, 'home', e.target.value)}
                          placeholder="-"
                          className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 text-center font-black text-lg text-emerald-400 focus:outline-none focus:border-emerald-500"
                        />
                        <span className="text-slate-600 font-bold">:</span>
                        <input
                          type="text"
                          maxLength={2}
                          value={match.awayScore}
                          onChange={(e) => handleScoreChange(match.id, 'away', e.target.value)}
                          placeholder="-"
                          className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 text-center font-black text-lg text-emerald-400 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="col-span-4 text-center">
                        <div className="text-3xl mb-1">{awayMeta.flag}</div>
                        <div className="text-xs font-bold truncate">{match.away}</div>
                        <div className="text-[10px] text-slate-500">FIFA #{awayMeta.rank}</div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/60 flex justify-between items-center text-[10px] text-slate-500">
                      <span>🕒 北京开球: {match.time}</span>
                      <span className="truncate max-w-[130px]">📍 {match.city}</span>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* TAB 2: 12组积分模拟 */}
        {activeTab === 'groups' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-slate-900 to-emerald-950/20 p-5 rounded-2xl border border-emerald-500/20 shadow-xl">
              <h2 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
                🌟 2026 最好成绩的小组第三名实时积分排布
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                官方出线细则：12个小组积分完毕后，<strong>前 8 个成绩最好的小组第三名</strong>将成功会师淘汰赛。
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 mt-4">
                {thirdPlaceRankings.map((third, idx) => {
                  const isQualified = idx < 8;
                  return (
                    <div 
                      key={third.name}
                      className={`p-2.5 rounded-xl text-center border transition-all ${
                        isQualified ? 'border-emerald-500/50 bg-emerald-950/10' : 'border-slate-800 bg-slate-900/60'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${isQualified ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                          #{idx + 1} {isQualified ? '出线' : '淘汰'}
                        </span>
                        <span className="text-[9px] text-slate-500 font-medium">{third.groupName}</span>
                      </div>
                      <div className="text-xl my-1">{third.flag}</div>
                      <div className="text-xs font-bold truncate">{third.name}</div>
                      <div className="grid grid-cols-4 gap-0.5 mt-2 text-[8px] text-slate-400 bg-slate-950/60 py-1 rounded">
                        <div>
                          <div className="text-[7px] text-slate-600">场</div>
                          <div>{third.played}</div>
                        </div>
                        <div>
                          <div className="text-[7px] text-slate-600">胜</div>
                          <div>{third.won}</div>
                        </div>
                        <div>
                          <div className="text-[7px] text-slate-600">净</div>
                          <div className={third.gd > 0 ? 'text-emerald-400' : third.gd < 0 ? 'text-rose-400' : ''}>{third.gd > 0 ? `+${third.gd}` : third.gd}</div>
                        </div>
                        <div>
                          <div className="text-[7px] text-slate-600">分</div>
                          <div className="font-bold text-slate-200">{third.pts}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {Object.keys(initialGroups).map(groupId => {
                const group = initialGroups[groupId];
                const teamsWithStats = groupStandings[groupId];

                return (
                  <div key={groupId} className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-md">
                    <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500"></span>
                        <h3 className="font-extrabold text-sm text-slate-200">{group.name}</h3>
                      </div>
                      <span className="text-[10px] text-slate-500">前两名及最优第三出线</span>
                    </div>

                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-slate-500 border-b border-slate-800">
                          <th className="pb-1.5 font-medium w-6">Pos</th>
                          <th className="pb-1.5 font-medium">球队</th>
                          <th className="pb-1.5 font-medium text-center w-8">赛</th>
                          <th className="pb-1.5 font-medium text-center w-8">净</th>
                          <th className="pb-1.5 font-semibold text-center w-8 text-slate-200">积</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teamsWithStats.map((team, idx) => {
                          const isDirect = idx < 2;
                          const isBestThird = idx === 2 && top8ThirdTeams.has(team.name);
                          let posBg = isDirect 
                            ? 'text-emerald-400 bg-emerald-500/10 font-bold rounded-md' 
                            : isBestThird 
                            ? 'text-teal-400 bg-teal-500/10 font-bold rounded-md' 
                            : 'text-slate-500';

                          return (
                            <tr key={team.name} className="border-b border-slate-800/50 last:border-0 hover:bg-slate-800/20">
                              <td className="py-2">
                                <div className="w-5 h-5 flex items-center justify-center text-[10px]">
                                  <span className={`w-full text-center py-0.5 ${posBg}`}>{idx + 1}</span>
                                </div>
                              </td>
                              <td className="py-2 font-bold text-slate-200">
                                <span className="mr-1">{team.flag}</span>
                                <span className="truncate max-w-[90px] inline-block align-middle">{team.name}</span>
                              </td>
                              <td className="py-2 text-center text-slate-400">{team.played}</td>
                              <td className={`py-2 text-center font-semibold ${team.gd > 0 ? 'text-emerald-400' : team.gd < 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                                {team.gd > 0 ? `+${team.gd}` : team.gd}
                              </td>
                              <td className="py-2 text-center font-extrabold text-slate-100">{team.pts}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: 32强树状模拟 */}
        {activeTab === 'bracket' && (
          <div className="space-y-6 overflow-hidden">
            
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg">
              <div>
                <h2 className="text-lg font-bold text-teal-400 flex items-center gap-1.5">
                  🌿 2026 美加墨世界杯 32强对阵树模拟器
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  支持双侧智能联动。您可在树中**输入比分**或**轻点战队名**直接手动判定晋级。
                </p>
              </div>

              {/* 移动端轮次切换 */}
              <div className="flex md:hidden rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs w-full justify-around">
                <button onClick={() => setBracketRoundTab('r32')} className={`px-2 py-1 rounded-md ${bracketRoundTab === 'r32' ? 'bg-slate-800 text-teal-400 font-bold' : 'text-slate-400'}`}>32强</button>
                <button onClick={() => setBracketRoundTab('r16')} className={`px-2 py-1 rounded-md ${bracketRoundTab === 'r16' ? 'bg-slate-800 text-teal-400 font-bold' : 'text-slate-400'}`}>16强</button>
                <button onClick={() => setBracketRoundTab('qf')} className={`px-2 py-1 rounded-md ${bracketRoundTab === 'qf' ? 'bg-slate-800 text-teal-400 font-bold' : 'text-slate-400'}`}>8强</button>
                <button onClick={() => setBracketRoundTab('sff')} className={`px-2 py-1 rounded-md ${bracketRoundTab === 'sff' ? 'bg-slate-800 text-teal-400 font-bold' : 'text-slate-400'}`}>半/决赛</button>
              </div>
            </div>

            <div className="overflow-x-auto pb-4">
              {/* 9列经典对阵树：左半区4列 | 决赛居中 | 右半区4列 */}
              <div className="min-w-[1400px] md:min-w-0 grid grid-cols-9 gap-3 items-center relative py-6">

                {/* === 左半区 === */}

                {/* Col 1: R32 左半区 (r32_1 ~ r32_8) */}
                <div className={`space-y-3 ${bracketRoundTab === 'r32' ? 'block' : 'hidden md:block'}`}>
                  <div className="text-[10px] text-slate-500 font-bold tracking-wider uppercase mb-2 border-b border-slate-800 pb-1 text-center">1/16 决赛</div>
                  {r32Matches.slice(0, 8).map(match => (
                    <KnockoutMatchCard
                      key={match.id}
                      match={match}
                      scores={knockoutScores[match.id]}
                      winner={knockoutWinners[match.id]}
                      onScoreChange={handleKoScoreChange}
                      onSelectWinner={handleSelectWinner}
                    />
                  ))}
                </div>

                {/* Col 2: R16 左半区 (r16_1 ~ r16_4) */}
                <div className={`space-y-8 ${bracketRoundTab === 'r16' ? 'block' : 'hidden md:block'}`}>
                  <div className="text-[10px] text-slate-500 font-bold tracking-wider uppercase mb-2 border-b border-slate-800 pb-1 text-center">1/8 决赛</div>
                  {r16Matches.slice(0, 4).map(match => (
                    <KnockoutMatchCard
                      key={match.id}
                      match={match}
                      scores={knockoutScores[match.id]}
                      winner={knockoutWinners[match.id]}
                      onScoreChange={handleKoScoreChange}
                      onSelectWinner={handleSelectWinner}
                    />
                  ))}
                </div>

                {/* Col 3: QF 左半区 (qf_1, qf_2) */}
                <div className={`space-y-20 ${bracketRoundTab === 'qf' ? 'block' : 'hidden md:block'}`}>
                  <div className="text-[10px] text-slate-500 font-bold tracking-wider uppercase mb-2 border-b border-slate-800 pb-1 text-center">1/4 决赛</div>
                  {qfMatches.slice(0, 2).map(match => (
                    <KnockoutMatchCard
                      key={match.id}
                      match={match}
                      scores={knockoutScores[match.id]}
                      winner={knockoutWinners[match.id]}
                      onScoreChange={handleKoScoreChange}
                      onSelectWinner={handleSelectWinner}
                    />
                  ))}
                </div>

                {/* Col 4: SF 左 (sf_1) */}
                <div className={`flex flex-col justify-center ${bracketRoundTab === 'sff' ? 'flex' : 'hidden md:flex'}`}>
                  <div className="text-[10px] text-slate-500 font-bold tracking-wider uppercase mb-2 border-b border-slate-800 pb-1 text-center">半决赛</div>
                  {sfMatches[0] && (
                    <KnockoutMatchCard
                      match={sfMatches[0]}
                      scores={knockoutScores[sfMatches[0].id]}
                      winner={knockoutWinners[sfMatches[0].id]}
                      onScoreChange={handleKoScoreChange}
                      onSelectWinner={handleSelectWinner}
                    />
                  )}
                </div>

                {/* === Col 5: 决赛 + 冠军 (居中) === */}
                <div className={`flex flex-col justify-center items-center space-y-6 ${bracketRoundTab === 'sff' ? 'flex' : 'hidden md:flex'}`}>
                  <div className="w-full">
                    <div className="text-[10px] text-slate-500 font-bold tracking-wider uppercase mb-2 border-b border-slate-800 pb-1 text-center">总决赛</div>
                    <KnockoutMatchCard
                      match={finalMatch}
                      scores={knockoutScores[finalMatch.id]}
                      winner={knockoutWinners[finalMatch.id]}
                      onScoreChange={handleKoScoreChange}
                      onSelectWinner={handleSelectWinner}
                    />
                  </div>

                  <div className="relative bg-gradient-to-br from-amber-500/10 to-yellow-500/5 border border-amber-500/30 rounded-2xl p-6 text-center w-full shadow-2xl">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-slate-950 font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-widest">
                      CHAMPION 冠军
                    </div>
                    <div className="text-4xl my-3">🏆</div>
                    <div className="text-xs text-slate-400">2026 世界杯模拟冠军得主</div>
                    <div className="text-xl font-black text-amber-300 mt-1 filter drop-shadow">
                      {knockoutWinners['final'] ? (
                        <span className="flex items-center justify-center gap-1.5">
                          {teamMetadata[knockoutWinners['final']]?.flag} {knockoutWinners['final']}
                        </span>
                      ) : (
                        '🏆 虚位以待'
                      )}
                    </div>
                  </div>
                </div>

                {/* === 右半区 === */}

                {/* Col 6: SF 右 (sf_2) */}
                <div className={`flex flex-col justify-center ${bracketRoundTab === 'sff' ? 'flex' : 'hidden md:flex'}`}>
                  <div className="text-[10px] text-slate-500 font-bold tracking-wider uppercase mb-2 border-b border-slate-800 pb-1 text-center">半决赛</div>
                  {sfMatches[1] && (
                    <KnockoutMatchCard
                      match={sfMatches[1]}
                      scores={knockoutScores[sfMatches[1].id]}
                      winner={knockoutWinners[sfMatches[1].id]}
                      onScoreChange={handleKoScoreChange}
                      onSelectWinner={handleSelectWinner}
                    />
                  )}
                </div>

                {/* Col 7: QF 右半区 (qf_3, qf_4) */}
                <div className={`space-y-20 ${bracketRoundTab === 'qf' ? 'block' : 'hidden md:block'}`}>
                  <div className="text-[10px] text-slate-500 font-bold tracking-wider uppercase mb-2 border-b border-slate-800 pb-1 text-center">1/4 决赛</div>
                  {qfMatches.slice(2, 4).map(match => (
                    <KnockoutMatchCard
                      key={match.id}
                      match={match}
                      scores={knockoutScores[match.id]}
                      winner={knockoutWinners[match.id]}
                      onScoreChange={handleKoScoreChange}
                      onSelectWinner={handleSelectWinner}
                    />
                  ))}
                </div>

                {/* Col 8: R16 右半区 (r16_5 ~ r16_8) */}
                <div className={`space-y-8 ${bracketRoundTab === 'r16' ? 'block' : 'hidden md:block'}`}>
                  <div className="text-[10px] text-slate-500 font-bold tracking-wider uppercase mb-2 border-b border-slate-800 pb-1 text-center">1/8 决赛</div>
                  {r16Matches.slice(4, 8).map(match => (
                    <KnockoutMatchCard
                      key={match.id}
                      match={match}
                      scores={knockoutScores[match.id]}
                      winner={knockoutWinners[match.id]}
                      onScoreChange={handleKoScoreChange}
                      onSelectWinner={handleSelectWinner}
                    />
                  ))}
                </div>

                {/* Col 9: R32 右半区 (r32_9 ~ r32_16) */}
                <div className={`space-y-3 ${bracketRoundTab === 'r32' ? 'block' : 'hidden md:block'}`}>
                  <div className="text-[10px] text-slate-500 font-bold tracking-wider uppercase mb-2 border-b border-slate-800 pb-1 text-center">1/16 决赛</div>
                  {r32Matches.slice(8, 16).map(match => (
                    <KnockoutMatchCard
                      key={match.id}
                      match={match}
                      scores={knockoutScores[match.id]}
                      winner={knockoutWinners[match.id]}
                      onScoreChange={handleKoScoreChange}
                      onSelectWinner={handleSelectWinner}
                    />
                  ))}
                </div>

              </div>
            </div>

          </div>
        )}

        {/* TAB: 📋 球队阵容 */}
        {activeTab === 'squads' && (() => {
          const [squadTeam, setSquadTeam] = useState('');
          const squad = squadTeam ? teamSquads[squadTeam] : null;
          const posLabels = { GK: '门将', DF: '后卫', MF: '中场', FW: '前锋' };
          const posColors = { GK: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', DF: 'bg-blue-500/20 text-blue-300 border-blue-500/30', MF: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', FW: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };

          return (
          <div className="space-y-6">
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl">
              <div>
                <h2 className="text-lg font-bold text-blue-400 flex items-center gap-2">
                  📋 48强球队阵容一览
                </h2>
                <p className="text-xs text-slate-400 mt-1">选择球队查看核心球员名单、位置及所属俱乐部</p>
              </div>
              <select
                value={squadTeam}
                onChange={(e) => setSquadTeam(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs py-2 px-3 rounded-xl focus:outline-none focus:border-blue-500 w-64"
              >
                <option value="">— 选择球队 —</option>
                {Object.entries(teamMetadata)
                  .sort((a, b) => a[1].rank - b[1].rank)
                  .map(([name, meta]) => (
                    <option key={name} value={name}>{meta.flag} {name}（FIFA #{meta.rank}）</option>
                  ))
                }
              </select>
            </div>

            {!squadTeam && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📋</div>
                <div className="text-slate-400 text-sm">请选择一支球队查看阵容信息</div>
              </div>
            )}

            {squad && (
              <div className="space-y-6">
                {/* 球队名片 */}
                <div className="bg-gradient-to-r from-blue-950/30 via-slate-900 to-indigo-950/30 border border-blue-500/20 rounded-2xl p-6 shadow-lg">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="text-7xl">{teamMetadata[squadTeam]?.flag}</div>
                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex items-center gap-3 justify-center sm:justify-start">
                        <h2 className="text-2xl font-black text-slate-100">{squadTeam}</h2>
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">FIFA #{teamMetadata[squadTeam]?.rank}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-400 justify-center sm:justify-start">
                        <span>📍 {teamMetadata[squadTeam]?.region}</span>
                        <span>🏟️ {squad.coach ? `主教练: ${squad.coach}` : ''}</span>
                        <span>👥 {squad.players.length}名核心球员</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 按位置分组展示 */}
                {['GK', 'DF', 'MF', 'FW'].map(pos => {
                  const players = squad.players.filter(p => p.pos === pos);
                  if (players.length === 0) return null;
                  return (
                    <div key={pos} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                      <div className="flex items-center gap-2 mb-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${posColors[pos]}`}>
                          {posLabels[pos]} ({players.length})
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {players.map((p, idx) => (
                          <div key={idx} className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-sm font-black text-slate-300">
                                {p.num}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold text-slate-200 truncate">{p.name}</div>
                                <div className="text-[10px] text-slate-500 truncate">{p.club}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!squad && squadTeam && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">{teamMetadata[squadTeam]?.flag}</div>
                <div className="text-slate-300 text-lg font-bold">{squadTeam}</div>
                <div className="text-slate-500 text-xs mt-2">暂无该队阵容数据</div>
              </div>
            )}
          </div>
          );
        })()}

        {/* TAB 4: 16大球场指南 */}
        {activeTab === 'venues' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {venuesData.map((venue, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-extrabold text-slate-100">📍 {venue.city}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">{venue.country}</span>
                    </div>
                    <h3 className="text-sm font-extrabold text-teal-400 my-1.5">{venue.stadium}</h3>
                    <div className="text-[11px] text-amber-500 font-semibold mb-3">👥 预计容量：{venue.capacity}人</div>
                    <p className="text-xs text-slate-400 leading-relaxed">{venue.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: 全新赛制规则说明 */}
        {activeTab === 'format' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
              <h2 className="text-xl font-bold text-teal-400 mb-4">📢 2026 美加墨世界杯全新出线与扩军机制</h2>
              
              <div className="space-y-4 text-xs text-slate-300">
                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                  <div className="font-bold text-slate-100 text-sm">⚽ 48支球队 12个小组规制</div>
                  <p className="text-slate-400 mt-1">
                    参赛球队总数由32支历史性扩军至 <strong>48支</strong>，分成12个小组。每个小组的前两名直接出线（24支球队）。
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-r from-emerald-950/20 to-slate-900 rounded-xl border border-emerald-500/20">
                  <div className="font-bold text-emerald-400 text-sm">🏆 12个小组第三名横向排名晋级细则 (FIFA官方新规)</div>
                  <div className="mt-2 space-y-2 text-slate-400 leading-relaxed">
                    比较 12 个小组第三名在小组赛的数据，前 <strong>8个成绩最好</strong> 的队伍递补进淘汰赛。判定顺序严格递进如下：
                    <ol className="list-decimal pl-5 mt-1 space-y-1">
                      <li><strong>小组赛总积分</strong>：积分最高的队伍优先晋级。</li>
                      <li><strong>小组赛净胜球</strong>：总进球数减去总失球数。</li>
                      <li><strong>小组赛总进球数</strong>：总进球数多的队伍优先。</li>
                      <li><strong>总胜场数 (Number of Wins) ★2026新规</strong>：胜场多的队伍在横向对比中优先于全平局队伍出线。</li>
                      <li><strong>公平竞赛积分</strong>：红黄牌最少者优先。</li>
                      <li>最终<strong>最新世界 FIFA 排名</strong>决定。</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: 🔮 球队之旅 */}
        {activeTab === 'journey' && (
          <div className="space-y-6">

            {/* 球队选择器 */}
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl">
              <div>
                <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                  🔮 球队世界杯之旅 — 深度模拟推演
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  选择一支球队，系统将模拟其完整世界杯征程，分析每一步的晋级概率与瓶颈
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <select
                  value={journeyTeam}
                  onChange={(e) => { setJourneyTeam(e.target.value); setJourneyResult(null); }}
                  className="bg-slate-950 border border-slate-800 text-slate-200 text-xs py-2 px-3 rounded-xl focus:outline-none focus:border-amber-500 w-52"
                >
                  <option value="">— 选择球队 —</option>
                  {Object.entries(teamMetadata)
                    .sort((a, b) => (a[1].rank) - (b[1].rank))
                    .map(([name, meta]) => (
                      <option key={name} value={name}>{meta.flag} {name}（FIFA #{meta.rank}）</option>
                    ))
                  }
                </select>

                <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400">模拟次数:</span>
                  <select
                    value={simCount}
                    onChange={(e) => setSimCount(parseInt(e.target.value))}
                    className="bg-slate-900 text-xs border border-slate-700 rounded p-1 text-slate-200 focus:outline-none"
                  >
                    <option value={100}>100次</option>
                    <option value={500}>500次</option>
                    <option value={1000}>1000次(推荐)</option>
                  </select>
                </div>

                <button
                  onClick={handleJourneySimulation}
                  disabled={!journeyTeam || isJourneyRunning}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    !journeyTeam || isJourneyRunning
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                  }`}
                >
                  {isJourneyRunning ? '🔄 推演中...' : '🔮 启动旅程推演'}
                </button>
              </div>
            </div>

            {/* 未选择球队时的提示 */}
            {!journeyTeam && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔮</div>
                <div className="text-slate-400 text-sm">请选择一支球队，开始探索它的世界杯命运</div>
              </div>
            )}

            {/* 选择球队但未模拟 */}
            {journeyTeam && !journeyResult && !isJourneyRunning && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">{teamMetadata[journeyTeam]?.flag}</div>
                <div className="text-slate-300 text-lg font-bold">{journeyTeam}</div>
                <div className="text-slate-500 text-xs mt-2">点击「启动旅程推演」分析这支球队的世界杯之路</div>
              </div>
            )}

            {/* 模拟中 */}
            {isJourneyRunning && (
              <div className="text-center py-20">
                <div className="text-5xl mb-4 animate-bounce">⚽</div>
                <div className="text-amber-400 text-sm font-bold">正在模拟 {journeyTeam} 的世界杯之旅...</div>
                <div className="text-slate-500 text-xs mt-1">{simCount}次蒙特卡洛仿真运行中</div>
              </div>
            )}

            {/* 模拟结果 */}
            {journeyResult && !isJourneyRunning && (() => {
              const jr = journeyResult;
              return (

            <div className="space-y-6">

              {/* 球队名片卡 */}
              <div className="bg-gradient-to-r from-amber-950/30 via-slate-900 to-orange-950/30 border border-amber-500/20 rounded-2xl p-6 shadow-lg">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="text-7xl">{jr.flag}</div>
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex items-center gap-3 justify-center sm:justify-start">
                      <h2 className="text-2xl font-black text-slate-100">{jr.team}</h2>
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">{jr.positioning}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400 justify-center sm:justify-start">
                      <span>FIFA 排名 <strong className="text-slate-200">#{jr.rank}</strong></span>
                      <span>{jr.region}</span>
                      <span>{jr.groupName}</span>
                      {jr.formBoost > 0 && <span className="text-emerald-400">状态加成 +{jr.formBoost}</span>}
                      {jr.formBoost < 0 && <span className="text-rose-400">状态调整 {jr.formBoost}</span>}
                    </div>
                  </div>
                  <div className="flex gap-4 text-center">
                    <div className="bg-slate-950/80 px-4 py-3 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-500">最高成就</div>
                      <div className="text-sm font-black text-amber-400 mt-0.5">{jr.achievements.bestFinish}</div>
                    </div>
                    <div className="bg-slate-950/80 px-4 py-3 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-500">夺冠概率</div>
                      <div className="text-sm font-black text-amber-400 mt-0.5">{jr.achievements.championRate}%</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* 左侧：小组赛分析 (5格) */}
                <div className="lg:col-span-5 space-y-5">

                  {/* 小组赛总览 */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                    <h3 className="text-sm font-bold text-teal-400 flex items-center gap-1.5 mb-4">
                      📋 {jr.groupName} 小组赛分析
                    </h3>

                    {/* 出线概率横条 */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                        <span>小组出线概率</span>
                        <span className="font-bold text-emerald-400">{jr.groupStage.qualificationRate}%</span>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800 flex">
                        <div className="bg-emerald-500 h-full transition-all" style={{ width: `${jr.groupStage.qualificationVia.first}%` }} title="小组第一"></div>
                        <div className="bg-teal-500 h-full transition-all" style={{ width: `${jr.groupStage.qualificationVia.second}%` }} title="小组第二"></div>
                        <div className="bg-cyan-600 h-full transition-all" style={{ width: `${jr.groupStage.qualificationVia.third}%` }} title="小组第三"></div>
                        <div className="bg-slate-800 h-full flex-1" title="淘汰"></div>
                      </div>
                      <div className="flex gap-3 mt-2 text-[10px] text-slate-500 flex-wrap">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>第一 {jr.groupStage.qualificationVia.first}%</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-500"></span>第二 {jr.groupStage.qualificationVia.second}%</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-600"></span>第三 {jr.groupStage.qualificationVia.third}%</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-800"></span>淘汰 {jr.groupStage.eliminationRate}%</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-center mb-4">
                      <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                        <div className="text-[10px] text-slate-500">平均积分</div>
                        <div className="text-lg font-black text-slate-200">{jr.groupStage.avgPoints}</div>
                      </div>
                      <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                        <div className="text-[10px] text-slate-500">平均净胜球</div>
                        <div className="text-lg font-black text-slate-200">{jr.groupStage.avgGD}</div>
                      </div>
                    </div>

                    {/* 三个对手分析 */}
                    <div className="space-y-3">
                      {jr.groupStage.opponents.map(opp => (
                        <div key={opp.name} className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                              <span className="text-base">{opp.flag}</span> {opp.name}
                              <span className="text-[9px] text-slate-500">FIFA #{opp.rank}</span>
                            </span>
                            <span className={`text-xs font-bold ${parseInt(opp.winRate) >= 60 ? 'text-emerald-400' : parseInt(opp.winRate) >= 40 ? 'text-amber-400' : 'text-rose-400'}`}>
                              胜率 {opp.winRate}%
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 mb-1">平均比分 {opp.avgScore}</div>
                          <div className="text-[10px] text-slate-400">{opp.analysis}</div>
                        </div>
                      ))}
                    </div>

                    {/* 淘汰原因（如果淘汰率 > 0） */}
                    {parseFloat(jr.groupStage.eliminationRate) > 5 && (
                      <div className="mt-4 p-3 bg-rose-950/20 rounded-xl border border-rose-500/10">
                        <div className="text-[10px] font-bold text-rose-400 mb-2">⚠️ 小组淘汰原因分析</div>
                        <div className="space-y-1 text-[10px] text-slate-400">
                          {jr.groupStage.eliminationReasons.points > 0 && <div>• 积分不足: {jr.groupStage.eliminationReasons.points}次</div>}
                          {jr.groupStage.eliminationReasons.gd > 0 && <div>• 净胜球劣势: {jr.groupStage.eliminationReasons.gd}次</div>}
                          {jr.groupStage.eliminationReasons.gf > 0 && <div>• 进球数劣势: {jr.groupStage.eliminationReasons.gf}次</div>}
                          {jr.groupStage.eliminationReasons.rank > 0 && <div>• 排名劣势(同分同净胜球): {jr.groupStage.eliminationReasons.rank}次</div>}
                        </div>
                      </div>
                    )}
                  </div>

                </div>

                {/* 右侧：淘汰赛路径 + 洞察 (7格) */}
                <div className="lg:col-span-7 space-y-5">

                  {/* 逐轮淘汰赛路径时间轴 */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                    <h3 className="text-sm font-bold text-amber-400 flex items-center gap-1.5 mb-4">
                      🛤️ 淘汰赛逐轮通关路径
                    </h3>

                    <div className="space-y-3">
                      {jr.knockoutStages.map((stage, idx) => {
                        const reachPct = parseFloat(stage.reachRate);
                        const winPct = parseFloat(stage.winRate);
                        const isReached = reachPct > 0;
                        const barColor = !isReached ? 'bg-slate-800' : winPct >= 60 ? 'bg-emerald-500' : winPct >= 40 ? 'bg-amber-500' : 'bg-rose-500';

                        return (
                          <div key={stage.stageKey} className={`relative pl-6 ${idx < jr.knockoutStages.length - 1 ? 'pb-1' : ''}`}>
                            {/* 时间轴竖线 */}
                            {idx < jr.knockoutStages.length - 1 && <div className="absolute left-2.5 top-6 bottom-0 w-px bg-slate-800"></div>}
                            {/* 时间轴圆点 */}
                            <div className={`absolute left-1 top-2.5 w-3 h-3 rounded-full border-2 ${isReached ? 'bg-amber-500 border-amber-400' : 'bg-slate-800 border-slate-700'}`}></div>

                            <div className={`p-3.5 rounded-xl border ${isReached ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-950/30 border-slate-800/40 opacity-60'}`}>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-slate-200">{stage.round}</span>
                                <div className="flex items-center gap-3 text-xs">
                                  {isReached ? (
                                    <>
                                      <span className="text-slate-400">到达 <strong className="text-slate-200">{stage.reachRate}%</strong></span>
                                      <span className="text-slate-400">过关 <strong className={winPct >= 50 ? 'text-emerald-400' : 'text-rose-400'}>{stage.winRate}%</strong></span>
                                      {parseFloat(stage.penaltyRate) > 0 && <span className="text-slate-500">点球 {stage.penaltyRate}%</span>}
                                    </>
                                  ) : (
                                    <span className="text-slate-600 text-[10px]">未到达</span>
                                  )}
                                </div>
                              </div>

                              {isReached && (
                                <>
                                  {/* 胜率进度条 */}
                                  <div className="w-full bg-slate-950 rounded-full h-1.5 mb-2 overflow-hidden">
                                    <div className={`${barColor} h-full rounded-full transition-all`} style={{ width: `${Math.max(2, winPct)}%` }}></div>
                                  </div>

                                  {/* 前三可能对手 */}
                                  {stage.topOpponents.length > 0 && (
                                    <div className="flex flex-wrap gap-2 text-[10px]">
                                      <span className="text-slate-500">可能对手:</span>
                                      {stage.topOpponents.map(o => (
                                        <span key={o.name} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                          {o.flag} {o.name} <span className="text-amber-400">{o.freq}%</span>
                                        </span>
                                      ))}
                                    </div>
                                  )}

                                  {/* 最常见比分 */}
                                  <div className="text-[10px] text-slate-500 mt-1.5">
                                    典型比分: <span className="text-slate-300 font-mono">{stage.typicalScore}</span>
                                    {parseFloat(stage.penaltyRate) > 15 && <span className="text-amber-400 ml-2">⚠️ 点球大战高频</span>}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 成就里程碑 */}
                  <div className="bg-gradient-to-r from-amber-950/20 to-slate-900 border border-amber-500/10 rounded-2xl p-5 shadow-lg">
                    <h3 className="text-sm font-bold text-amber-400 flex items-center gap-1.5 mb-3">
                      🏅 成就里程碑（基于 {jr.simCount} 次模拟）
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      {[
                        { label: '八强', val: jr.achievements.qfRate, icon: '💪' },
                        { label: '四强', val: jr.achievements.sfRate, icon: '🌟' },
                        { label: '决赛', val: jr.achievements.finalRate, icon: '🏅' },
                        { label: '夺冠', val: jr.achievements.championRate, icon: '👑' },
                      ].map(item => (
                        <div key={item.label} className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                          <div className="text-lg mb-0.5">{item.icon}</div>
                          <div className="text-[10px] text-slate-500">{item.label}</div>
                          <div className={`text-lg font-black ${parseFloat(item.val) > 10 ? 'text-amber-400' : 'text-slate-300'}`}>{item.val}%</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI 洞察 */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                    <h3 className="text-sm font-bold text-teal-400 flex items-center gap-1.5 mb-3">
                      💡 AI 深度洞察
                    </h3>
                    <div className="space-y-3">
                      {jr.insights.map((insight, idx) => {
                        const colors = {
                          good: { bg: 'bg-emerald-950/20', border: 'border-emerald-500/20', icon: '✅', text: 'text-emerald-300' },
                          warn: { bg: 'bg-amber-950/20', border: 'border-amber-500/20', icon: '⚡', text: 'text-amber-300' },
                          risk: { bg: 'bg-rose-950/20', border: 'border-rose-500/20', icon: '⚠️', text: 'text-rose-300' },
                        };
                        const c = colors[insight.type] || colors.warn;
                        return (
                          <div key={idx} className={`${c.bg} p-3 rounded-xl border ${c.border} flex gap-2.5 items-start`}>
                            <span className="text-sm mt-px">{c.icon}</span>
                            <span className={`text-xs ${c.text} leading-relaxed`}>{insight.text}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

              </div>

            </div>

              );
            })()}

          </div>
        )}

      </main>

      {/* 底部信息 */}
      <footer className="border-t border-slate-900 bg-slate-950 py-10 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>美加墨世界杯互动积分与大数据模拟器 — 基于 2026 北京时间与泊松期望进球数动态推算。</p>
        </div>
      </footer>

    </div>
  );
}

// 淘汰赛树状图组件
function KnockoutMatchCard({ match, scores, winner, onScoreChange, onSelectWinner }) {
  const homeMeta = teamMetadata[match.home] || {};
  const awayMeta = teamMetadata[match.away] || {};

  return (
    <div className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-3 shadow-md text-xs relative overflow-hidden transition-all duration-200">
      <div className="text-[9px] text-slate-500 font-bold mb-1.5 flex justify-between items-center">
        <span>{match.name}</span>
        {winner && <span className="text-teal-400 font-extrabold">已锁定</span>}
      </div>

      <div className="space-y-1.5">
        <div 
          onClick={() => onSelectWinner(match.id, match.home)}
          className={`flex items-center justify-between p-1.5 rounded cursor-pointer transition-all ${
            winner === match.home 
              ? 'bg-gradient-to-r from-emerald-950/60 to-slate-900 border-l-2 border-emerald-500 font-bold' 
              : 'hover:bg-slate-800/40 text-slate-300'
          }`}
          title="轻点队名直接判定该队晋级"
        >
          <div className="flex items-center gap-1.5 truncate">
            <span>{homeMeta.flag || '🏳️'}</span>
            <span className="truncate">{match.home}</span>
          </div>
          <input
            type="text"
            maxLength={2}
            value={scores?.home || ''}
            onChange={(e) => onScoreChange(match.id, 'home', e.target.value)}
            placeholder="-"
            onClick={(e) => e.stopPropagation()}
            className="w-7 h-7 rounded bg-slate-950 border border-slate-800 text-center font-bold text-emerald-400 focus:outline-none"
          />
        </div>

        <div 
          onClick={() => onSelectWinner(match.id, match.away)}
          className={`flex items-center justify-between p-1.5 rounded cursor-pointer transition-all ${
            winner === match.away 
              ? 'bg-gradient-to-r from-emerald-950/60 to-slate-900 border-l-2 border-emerald-500 font-bold' 
              : 'hover:bg-slate-800/40 text-slate-300'
          }`}
          title="轻点队名直接判定该队晋级"
        >
          <div className="flex items-center gap-1.5 truncate">
            <span>{awayMeta.flag || '🏳️'}</span>
            <span className="truncate">{match.away}</span>
          </div>
          <input
            type="text"
            maxLength={2}
            value={scores?.away || ''}
            onChange={(e) => onScoreChange(match.id, 'away', e.target.value)}
            placeholder="-"
            onClick={(e) => e.stopPropagation()}
            className="w-7 h-7 rounded bg-slate-950 border border-slate-800 text-center font-bold text-emerald-400 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}