import React from 'react';
import { SnakePreview } from './SnakePreview';
import { formatScore } from '../game/engine';
import type { ThemeMode } from '../types/game';
import { Play, Trophy, Sparkles, ShieldCheck, Cpu, Palette, BarChart3, Calendar, Settings as SettingsIcon, Gamepad2 } from 'lucide-react';

interface MainMenuProps {
  highScore: number;
  onPlay: () => void;
  onSettings: () => void;
  onModes: () => void;
  onCustomize: () => void;
  onAchievements: () => void;
  onStats: () => void;
  onDaily: () => void;
  theme: ThemeMode;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  highScore,
  onPlay,
  onSettings,
  onModes,
  onCustomize,
  onAchievements,
  onStats,
  onDaily,
  theme,
}) => {
  return (
    <div className="modern-menu-container">
      {/* Hero Card with Canvas Background */}
      <div className="menu-hero-card">
        <div className="menu-canvas-bg">
          <SnakePreview theme={theme} />
        </div>

        <div className="menu-hero-overlay">
          <div className="hero-category-tag">
            <span className="hero-category-badge">CLASSIC</span>
            <span className="hero-divider-line" />
            <span className="hero-year-badge">2026 EDITION</span>
          </div>

          <h1 className="modern-hero-title">SNAKE</h1>

          <p className="modern-tagline-main">
            Simple game. Endless run.
          </p>

          <div className="menu-navigation-col">
            <button className="primary-play-cta large-cta" onClick={onPlay}>
              <Play size={24} fill="currentColor" />
              <span>PLAY NOW</span>
            </button>

            <div className="menu-grid-nav">
              <button className="menu-grid-btn" onClick={onModes}>
                <Gamepad2 size={18} className="grid-icon cyan" />
                <span>MODES</span>
              </button>

              <button className="menu-grid-btn" onClick={onCustomize}>
                <Palette size={18} className="grid-icon violet" />
                <span>CUSTOMIZE</span>
              </button>

              <button className="menu-grid-btn" onClick={onAchievements}>
                <Trophy size={18} className="grid-icon amber" />
                <span>ACHIEVEMENTS</span>
              </button>

              <button className="menu-grid-btn" onClick={onStats}>
                <BarChart3 size={18} className="grid-icon emerald" />
                <span>STATS</span>
              </button>

              <button className="menu-grid-btn" onClick={onDaily}>
                <Calendar size={18} className="grid-icon rose" />
                <span>DAILY</span>
              </button>

              <button className="menu-grid-btn" onClick={onSettings}>
                <SettingsIcon size={18} className="grid-icon muted" />
                <span>SETTINGS</span>
              </button>
            </div>
          </div>

          {highScore > 0 && (
            <div className="high-score-pill">
              <Trophy size={14} className="trophy-gold" />
              <span>BEST SCORE: <strong className="score-num">{formatScore(highScore)}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="feature-badges-row">
        <div className="feature-badge">
          <Cpu size={18} className="badge-icon" />
          <div className="badge-info">
            <span className="badge-title">60 FPS Arena</span>
            <span className="badge-sub">Smooth Canvas Body</span>
          </div>
        </div>

        <div className="feature-badge">
          <Sparkles size={18} className="badge-icon" />
          <div className="badge-info">
            <span className="badge-title">Controlled Glow</span>
            <span className="badge-sub">Dynamic Skins & Themes</span>
          </div>
        </div>

        <div className="feature-badge">
          <ShieldCheck size={18} className="badge-icon" />
          <div className="badge-info">
            <span className="badge-title">Client Persistence</span>
            <span className="badge-sub">Stats & Achievements</span>
          </div>
        </div>
      </div>
    </div>
  );
};
