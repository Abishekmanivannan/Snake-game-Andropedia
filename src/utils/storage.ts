import type {
  GameSettings,
  PlayerStats,
  LeaderboardEntry,
  DailyChallenge,
} from '../types/game';

const HIGH_SCORE_KEY = 'snake_2026_high_score';
const SETTINGS_KEY = 'snake_2026_settings';
const STATS_KEY = 'snake_2026_stats';
const LEADERBOARD_KEY = 'snake_2026_leaderboard';
const ACHIEVEMENTS_KEY = 'snake_2026_achievements';
const DAILY_CHALLENGE_KEY = 'snake_2026_daily';

export const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  musicEnabled: true,
  vibrationEnabled: true,
  theme: 'midnight',
  skin: 'cyan',
  speedPreset: 'CLASSIC',
  controlType: 'BOTH',
  showGridLines: true,
  particleEffects: true,
  reducedMotion: false,
};

export const DEFAULT_STATS: PlayerStats = {
  bestScore: 0,
  longestSnake: 3,
  bestLevel: 1,
  foodEaten: 0,
  gamesPlayed: 0,
  totalPlayTime: 0,
  timeAttackBest: 0,
  hardcoreBest: 0,
  playerXP: 0,
  playerLevel: 1,
};

export const storage = {
  getHighScore(): number {
    try {
      const val = localStorage.getItem(HIGH_SCORE_KEY);
      if (!val) return 0;
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? 0 : parsed;
    } catch {
      return 0;
    }
  },

  saveHighScore(score: number): boolean {
    try {
      const currentHigh = this.getHighScore();
      if (score > currentHigh) {
        localStorage.setItem(HIGH_SCORE_KEY, score.toString());
        return true;
      }
    } catch (e) {
      console.warn('LocalStorage unavailable:', e);
    }
    return false;
  },

  getSettings(): GameSettings {
    try {
      const val = localStorage.getItem(SETTINGS_KEY);
      if (!val) return DEFAULT_SETTINGS;
      const parsed = JSON.parse(val);
      const validThemes = ['midnight', 'ocean', 'galaxy', 'inferno', 'arctic', 'toxic', 'sakura', 'cyber'];
      const theme = validThemes.includes(parsed.theme) ? parsed.theme : 'midnight';
      return { ...DEFAULT_SETTINGS, ...parsed, theme };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: GameSettings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('LocalStorage unavailable:', e);
    }
  },

  getStats(): PlayerStats {
    try {
      const val = localStorage.getItem(STATS_KEY);
      if (!val) return DEFAULT_STATS;
      return { ...DEFAULT_STATS, ...JSON.parse(val) };
    } catch {
      return DEFAULT_STATS;
    }
  },

  saveStats(stats: PlayerStats): void {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch (e) {
      console.warn('LocalStorage unavailable:', e);
    }
  },

  getLeaderboard(): LeaderboardEntry[] {
    try {
      const val = localStorage.getItem(LEADERBOARD_KEY);
      if (!val) return [];
      return JSON.parse(val);
    } catch {
      return [];
    }
  },

  addLeaderboardEntry(entry: Omit<LeaderboardEntry, 'id'>): LeaderboardEntry[] {
    try {
      const current = this.getLeaderboard();
      const newEntry: LeaderboardEntry = {
        ...entry,
        id: Math.random().toString(36).substring(2, 9),
      };
      const updated = [...current, newEntry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10); // Keep top 10
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },

  getUnlockedAchievements(): string[] {
    try {
      const val = localStorage.getItem(ACHIEVEMENTS_KEY);
      if (!val) return [];
      return JSON.parse(val);
    } catch {
      return [];
    }
  },

  saveUnlockedAchievements(ids: string[]): void {
    try {
      localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(ids));
    } catch (e) {
      console.warn('LocalStorage unavailable:', e);
    }
  },

  getDailyChallenge(): DailyChallenge | null {
    try {
      const val = localStorage.getItem(DAILY_CHALLENGE_KEY);
      if (!val) return null;
      return JSON.parse(val);
    } catch {
      return null;
    }
  },

  saveDailyChallenge(challenge: DailyChallenge): void {
    try {
      localStorage.setItem(DAILY_CHALLENGE_KEY, JSON.stringify(challenge));
    } catch (e) {
      console.warn('LocalStorage unavailable:', e);
    }
  },

  resetAllProgress(): void {
    try {
      localStorage.removeItem(HIGH_SCORE_KEY);
      localStorage.removeItem(STATS_KEY);
      localStorage.removeItem(LEADERBOARD_KEY);
      localStorage.removeItem(ACHIEVEMENTS_KEY);
      localStorage.removeItem(DAILY_CHALLENGE_KEY);
    } catch (e) {
      console.warn('LocalStorage unavailable:', e);
    }
  },
};
