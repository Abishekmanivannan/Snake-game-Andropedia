import React from 'react';
import { ArrowLeft, BarChart3, Trophy, Flame, Timer, Play, Clock, Medal } from 'lucide-react';
import type { PlayerStats, LeaderboardEntry, ThemeMode } from '../types/game';

interface StatsProps {
  stats: PlayerStats;
  leaderboard: LeaderboardEntry[];
  onBack: () => void;
  theme: ThemeMode;
}

export const Stats: React.FC<StatsProps> = ({
  stats,
  leaderboard,
  onBack,
  theme,
}) => {
  // Format seconds to mm:ss or hh:mm
  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m ${totalSec % 60}s`;
  };

  return (
    <div className={`info-page-container ${theme}-theme`}>
      <div className="info-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={18} /> BACK
        </button>
        <h2>CAREER STATS & LEADERBOARD</h2>
      </div>

      {/* Stats Cards Grid */}
      <div className="stats-overview-grid">
        <div className="stat-card-box">
          <Trophy size={18} className="stat-icon gold" />
          <div className="stat-card-info">
            <span className="stat-card-title">BEST SCORE</span>
            <span className="stat-card-val tabular-nums">{stats.bestScore}</span>
          </div>
        </div>

        <div className="stat-card-box">
          <Flame size={18} className="stat-icon rose" />
          <div className="stat-card-info">
            <span className="stat-card-title">LONGEST SNAKE</span>
            <span className="stat-card-val tabular-nums">{stats.longestSnake} pts</span>
          </div>
        </div>

        <div className="stat-card-box">
          <Play size={18} className="stat-icon cyan" />
          <div className="stat-card-info">
            <span className="stat-card-title">BEST LEVEL</span>
            <span className="stat-card-val tabular-nums">Level {stats.bestLevel}</span>
          </div>
        </div>

        <div className="stat-card-box">
          <BarChart3 size={18} className="stat-icon emerald" />
          <div className="stat-card-info">
            <span className="stat-card-title">FOOD EATEN</span>
            <span className="stat-card-val tabular-nums">{stats.foodEaten} Orbs</span>
          </div>
        </div>

        <div className="stat-card-box">
          <Clock size={18} className="stat-icon violet" />
          <div className="stat-card-info">
            <span className="stat-card-title">GAMES PLAYED</span>
            <span className="stat-card-val tabular-nums">{stats.gamesPlayed}</span>
          </div>
        </div>

        <div className="stat-card-box">
          <Timer size={18} className="stat-icon amber" />
          <div className="stat-card-info">
            <span className="stat-card-title">TOTAL PLAY TIME</span>
            <span className="stat-card-val tabular-nums">{formatTime(stats.totalPlayTime)}</span>
          </div>
        </div>
      </div>

      {/* Mode Specific Bests */}
      <div className="mode-bests-card">
        <h3 className="section-subtitle">MODE BESTS</h3>
        <div className="mode-bests-row">
          <div className="mode-best-pill">
            <span className="mode-pill-label">TIME ATTACK</span>
            <span className="mode-pill-val tabular-nums">{stats.timeAttackBest}</span>
          </div>
          <div className="mode-best-pill">
            <span className="mode-pill-label">HARDCORE</span>
            <span className="mode-pill-val tabular-nums">{stats.hardcoreBest}</span>
          </div>
        </div>
      </div>

      {/* Local Leaderboard */}
      <div className="leaderboard-card">
        <h3 className="section-subtitle">
          <Medal size={16} className="trophy-gold" /> LOCAL BEST SCORES
        </h3>

        {leaderboard.length === 0 ? (
          <p className="empty-lead-desc">No high score entries yet. Play a game to record your score!</p>
        ) : (
          <div className="leaderboard-table">
            <div className="table-row table-head">
              <span className="col-rank">#</span>
              <span className="col-name">PLAYER</span>
              <span className="col-mode">MODE</span>
              <span className="col-score">SCORE</span>
            </div>
            {leaderboard.map((entry, idx) => (
              <div key={entry.id} className="table-row">
                <span className={`col-rank rank-${idx + 1}`}>{idx + 1}</span>
                <span className="col-name">{entry.name}</span>
                <span className="col-mode">{entry.mode}</span>
                <span className="col-score tabular-nums">{entry.score}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="info-footer">
        <button className="primary-play-cta" onClick={onBack}>
          BACK TO MENU
        </button>
      </div>
    </div>
  );
};
