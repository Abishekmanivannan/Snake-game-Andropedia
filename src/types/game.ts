export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Position {
  x: number;
  y: number;
}

export type AppState =
  | 'MENU'
  | 'PLAYING'
  | 'PAUSED'
  | 'GAME_OVER'
  | 'HOW_TO_PLAY'
  | 'SETTINGS'
  | 'MODES'
  | 'CUSTOMIZE'
  | 'ACHIEVEMENTS'
  | 'STATS'
  | 'LEADERBOARD'
  | 'DAILY_CHALLENGE';

export type GameMode = 'CLASSIC' | 'TIME_ATTACK' | 'ZEN' | 'HARDCORE';

export type SpeedPreset = 'CHILL' | 'CLASSIC' | 'FAST' | 'INSANE';

export type SnakeSkin =
  | 'cyan'
  | 'blue'
  | 'purple'
  | 'fire'
  | 'ice'
  | 'toxic'
  | 'galaxy'
  | 'gold'
  | 'rainbow';

export type ThemeMode =
  | 'midnight'
  | 'ocean'
  | 'galaxy'
  | 'inferno'
  | 'arctic'
  | 'toxic'
  | 'sakura'
  | 'cyber';

export type SpecialFoodType = 'GOLDEN' | 'DIAMOND' | 'SLOW' | 'SPEED';

export interface SpecialFood {
  x: number;
  y: number;
  type: SpecialFoodType;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
  theme: ThemeMode;
  skin: SnakeSkin;
  speedPreset: SpeedPreset;
  controlType: 'DPAD' | 'SWIPE' | 'BOTH';
  showGridLines: boolean;
  particleEffects: boolean;
  reducedMotion: boolean;
}

export interface PlayerStats {
  bestScore: number;
  longestSnake: number;
  bestLevel: number;
  foodEaten: number;
  gamesPlayed: number;
  totalPlayTime: number; // seconds
  timeAttackBest: number;
  hardcoreBest: number;
  playerXP: number;
  playerLevel: number;
}

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
  unlocked: boolean;
  reqScore?: number;
  reqLevel?: number;
  reqLength?: number;
  reqGames?: number;
  reqTime?: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  mode: GameMode;
  date: string;
}

export interface DailyChallenge {
  id: string;
  title: string;
  target: number;
  current: number;
  completed: boolean;
  dateStr: string;
  rewardXP: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  maxLife: number;
  size: number;
}
