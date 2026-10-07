import React from 'react';
import { formatScore, calculateSpeed } from '../game/engine';
import { Volume2, VolumeX, Pause, Play, Trophy, Zap, Clock } from 'lucide-react';
import type { ThemeMode, GameMode } from '../types/game';

interface ScoreBoardProps {
  score: number;
  highScore: number;
  level: number;
  combo?: number;
  timeAttackLeft?: number;
  mode?: GameMode;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onTogglePause: () => void;
  isPaused: boolean;
  theme: ThemeMode;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  score,
  highScore,
  level,
  combo = 1,
  timeAttackLeft,
  mode = 'CLASSIC',
  soundEnabled,
  onToggleSound,
  onTogglePause,
  isPaused,
}) => {
  const pointsInCurrentLevel = score % 50;
  const progressPercent = Math.min(100, (pointsInCurrentLevel / 50) * 100);

  const speedMs = calculateSpeed(level);
  const speedMultiplier = (150 / speedMs).toFixed(1);

  return (
    <div className="scoreboard-hud-container">
      {/* Score Card */}
      <div className="hud-card score-card">
        <div className="hud-card-label-row">
          <span className="hud-label">SCORE</span>
          {combo > 1 && <span className="combo-badge-tag">x{combo}</span>}
        </div>
        <span className="hud-value-large tabular-nums">{formatScore(score)}</span>
      </div>

      {/* Best Score Card */}
      <div className="hud-card best-card">
        <span className="hud-label">
          <Trophy size={11} className="label-icon gold" /> BEST
        </span>
        <span className="hud-value-large tabular-nums">{formatScore(highScore)}</span>
      </div>

      {/* Level / Time Card */}
      <div className="hud-card level-card">
        {mode === 'TIME_ATTACK' && timeAttackLeft !== undefined ? (
          <div className="level-card-top">
            <span className="hud-label">
              <Clock size={11} className="label-icon amber" /> TIME LEFT
            </span>
            <span className="level-number tabular-nums" style={{ color: '#fbbf24' }}>
              00:{timeAttackLeft.toString().padStart(2, '0')}
            </span>
          </div>
        ) : (
          <>
            <div className="level-card-top">
              <span className="hud-label">LEVEL</span>
              <span className="level-number">{level.toString().padStart(2, '0')}</span>
            </div>
            <div className="xp-bar-track">
              <div className="xp-bar-fill" style={{ width: `${progressPercent}%` }} />
            </div>
          </>
        )}
      </div>

      {/* Section 9: Top Controls [ ⚡ 1.0x ] [ 🔊 ] [ ⏸ ] */}
      <div className="hud-card actions-card">
        <div className="speed-pill">
          <Zap size={12} className="speed-icon" />
          <span>{speedMultiplier}x</span>
        </div>

        <div className="hud-quick-btns">
          <button
            className="hud-icon-btn"
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute Audio' : 'Enable Audio'}
            aria-label={soundEnabled ? 'Mute Audio' : 'Enable Audio'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          <button
            className="hud-icon-btn pause-btn"
            onClick={onTogglePause}
            title={isPaused ? 'Resume Game' : 'Pause Game'}
            aria-label={isPaused ? 'Resume Game' : 'Pause Game'}
          >
            {isPaused ? <Play size={16} fill="currentColor" /> : <Pause size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};
