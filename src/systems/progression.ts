import type { Achievement, SnakeSkin, ThemeMode, DailyChallenge } from '../types/game';

export interface SkinDefinition {
  id: SnakeSkin;
  name: string;
  gradient: [string, string, string];
  glowColor: string;
  reqScore: number;
  reqDesc: string;
}

export interface ThemeDefinition {
  id: ThemeMode;
  name: string;
  bgStart: string;
  bgEnd: string;
  gridColor: string;
  glowColor: string;
  accentColor: string;
}

export const SKINS_LIST: SkinDefinition[] = [
  { id: 'cyan', name: 'Electric Cyan', gradient: ['#67e8f9', '#22d3ee', '#3b82f6'], glowColor: '#00f3ff', reqScore: 0, reqDesc: 'Default Unlocked' },
  { id: 'blue', name: 'Sapphire Blue', gradient: ['#93c5fd', '#3b82f6', '#1d4ed8'], glowColor: '#3b82f6', reqScore: 100, reqDesc: 'Reach Score 100' },
  { id: 'purple', name: 'Cyber Purple', gradient: ['#d8b4fe', '#a855f7', '#7e22ce'], glowColor: '#a855f7', reqScore: 250, reqDesc: 'Reach Score 250' },
  { id: 'fire', name: 'Inferno Fire', gradient: ['#fde047', '#f97316', '#ef4444'], glowColor: '#f97316', reqScore: 500, reqDesc: 'Reach Score 500' },
  { id: 'ice', name: 'Glacial Ice', gradient: ['#bae6fd', '#38bdf8', '#0284c7'], glowColor: '#38bdf8', reqScore: 750, reqDesc: 'Reach Score 750' },
  { id: 'toxic', name: 'Toxic Lime', gradient: ['#bef264', '#84cc16', '#4d7c0f'], glowColor: '#84cc16', reqScore: 1000, reqDesc: 'Reach Score 1000' },
  { id: 'galaxy', name: 'Cosmic Galaxy', gradient: ['#f472b6', '#c084fc', '#6366f1'], glowColor: '#c084fc', reqScore: 1500, reqDesc: 'Reach Score 1500' },
  { id: 'gold', name: 'Golden Royale', gradient: ['#fef08a', '#eab308', '#ca8a04'], glowColor: '#eab308', reqScore: 2500, reqDesc: 'Reach Score 2500' },
  { id: 'rainbow', name: 'Prismatic Rainbow', gradient: ['#ff007f', '#00f3ff', '#00ff88'], glowColor: '#ff007f', reqScore: 0, reqDesc: 'Unlock 5 Achievements' },
];

export const THEMES_LIST: ThemeDefinition[] = [
  { id: 'midnight', name: 'Midnight', bgStart: '#080d1a', bgEnd: '#04060c', gridColor: 'rgba(34, 211, 238, 0.04)', glowColor: '#22d3ee', accentColor: '#22d3ee' },
  { id: 'ocean', name: 'Deep Ocean', bgStart: '#051824', bgEnd: '#020b12', gridColor: 'rgba(56, 189, 248, 0.04)', glowColor: '#38bdf8', accentColor: '#38bdf8' },
  { id: 'galaxy', name: 'Cosmic Galaxy', bgStart: '#130924', bgEnd: '#06030c', gridColor: 'rgba(168, 85, 247, 0.04)', glowColor: '#a855f7', accentColor: '#a855f7' },
  { id: 'inferno', name: 'Volcanic Inferno', bgStart: '#1c0a06', bgEnd: '#0a0302', gridColor: 'rgba(249, 115, 22, 0.04)', glowColor: '#f97316', accentColor: '#f97316' },
  { id: 'arctic', name: 'Arctic Frost', bgStart: '#051b2c', bgEnd: '#020c16', gridColor: 'rgba(186, 230, 253, 0.04)', glowColor: '#7dd3fc', accentColor: '#7dd3fc' },
  { id: 'toxic', name: 'Bio Toxic', bgStart: '#0b1907', bgEnd: '#040b02', gridColor: 'rgba(132, 204, 22, 0.04)', glowColor: '#84cc16', accentColor: '#84cc16' },
  { id: 'sakura', name: 'Night Sakura', bgStart: '#1d0914', bgEnd: '#0b0307', gridColor: 'rgba(244, 114, 182, 0.04)', glowColor: '#f472b6', accentColor: '#f472b6' },
  { id: 'cyber', name: 'Cyberpunk', bgStart: '#081428', bgEnd: '#030812', gridColor: 'rgba(0, 243, 255, 0.04)', glowColor: '#00f3ff', accentColor: '#00f3ff' },
];

export const ACHIEVEMENTS_LIST: Achievement[] = [
  { id: 'first_bite', title: 'FIRST BITE', desc: 'Eat your first food orb.', icon: '🍎', unlocked: false, reqScore: 10 },
  { id: 'growing_up', title: 'GROWING UP', desc: 'Reach a snake length of 20 segments.', icon: '🐍', unlocked: false, reqLength: 20 },
  { id: 'century', title: 'CENTURY', desc: 'Score 100 points in a single run.', icon: '💯', unlocked: false, reqScore: 100 },
  { id: 'snake_king', title: 'SNAKE KING', desc: 'Reach an impressive score of 1000.', icon: '👑', unlocked: false, reqScore: 1000 },
  { id: 'speed_demon', title: 'SPEED DEMON', desc: 'Reach Level 10 speed acceleration.', icon: '⚡', unlocked: false, reqLevel: 10 },
  { id: 'survivor', title: 'SURVIVOR', desc: 'Survive in an active run for over 2 minutes.', icon: '⏳', unlocked: false, reqTime: 120 },
  { id: 'feast', title: 'FEAST', desc: 'Eat 100 food items total across games.', icon: '🍔', unlocked: false, reqScore: 0 },
  { id: 'untouchable', title: 'UNTOUCHABLE', desc: 'Score 500 points in a single clean run.', icon: '🛡️', unlocked: false, reqScore: 500 },
  { id: 'new_heights', title: 'NEW HEIGHTS', desc: 'Set a new personal high score record.', icon: '🏆', unlocked: false },
];

export function isSkinUnlocked(skinId: SnakeSkin, bestScore: number, unlockedCount: number): boolean {
  if (skinId === 'cyan') return true;
  if (skinId === 'rainbow') return unlockedCount >= 5;
  const skin = SKINS_LIST.find(s => s.id === skinId);
  return skin ? bestScore >= skin.reqScore : false;
}

export function generateTodayChallenge(): DailyChallenge {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));

  const challengeTemplates = [
    { title: 'Score 300 points in Classic Mode', target: 300, rewardXP: 250 },
    { title: 'Eat 25 food Orbs in a single run', target: 25, rewardXP: 200 },
    { title: 'Reach Level 6 Speed', target: 6, rewardXP: 300 },
    { title: 'Reach 15 snake length', target: 15, rewardXP: 180 },
    { title: 'Score 200 points in Time Attack', target: 200, rewardXP: 350 },
  ];

  const template = challengeTemplates[dayOfYear % challengeTemplates.length];
  return {
    id: `daily_${dateStr}`,
    title: template.title,
    target: template.target,
    current: 0,
    completed: false,
    dateStr,
    rewardXP: template.rewardXP,
  };
}

export function calculatePlayerLevel(totalXP: number): { level: number; currentXP: number; nextLevelXP: number; percent: number } {
  let level = 1;
  let xpForNext = 500;
  let accumulated = totalXP;

  while (accumulated >= xpForNext) {
    accumulated -= xpForNext;
    level += 1;
    xpForNext = Math.floor(xpForNext * 1.25);
  }

  return {
    level,
    currentXP: accumulated,
    nextLevelXP: xpForNext,
    percent: Math.min(100, Math.floor((accumulated / xpForNext) * 100)),
  };
}
