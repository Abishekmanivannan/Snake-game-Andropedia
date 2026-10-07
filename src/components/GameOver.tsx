import React, { useEffect } from 'react';
import { formatScore } from '../game/engine';
import { RotateCcw, Home, Sparkles, Trophy } from 'lucide-react';
import type { ThemeMode } from '../types/game';
import confetti from 'canvas-confetti';

interface GameOverProps {
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  onPlayAgain: () => void;
  onMainMenu: () => void;
  theme: ThemeMode;
}

export const GameOver: React.FC<GameOverProps> = ({
  score,
  highScore,
  isNewHighScore,
  onPlayAgain,
  onMainMenu,
}) => {
  useEffect(() => {
    if (isNewHighScore) {
      try {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#22d3ee', '#a855f7', '#34d399', '#ffffff'],
        });
      } catch {
        // Safe catch
      }
    }
  }, [isNewHighScore]);

  return (
    <div className="modal-overlay game-over-overlay">
      <div className="modern-modal-card game-over-card">
        {isNewHighScore && (
          <div className="new-record-banner">
            <Sparkles size={16} /> NEW BEST ✦
          </div>
        )}

        <div className="game-over-header">
          <h2 className="game-over-heading">GAME OVER</h2>
          <p className="game-over-subtitle">Your run ended.</p>
        </div>

        <div className="game-over-stats-grid">
          <div className="stat-box">
            <span className="stat-label">SCORE</span>
            <span className="stat-value tabular-nums">{formatScore(score)}</span>
          </div>

          <div className="stat-box">
            <span className="stat-label">
              <Trophy size={11} className="label-icon gold" /> BEST
            </span>
            <span className="stat-value tabular-nums">{formatScore(highScore)}</span>
          </div>
        </div>

        <div className="modal-actions-col">
          <button className="primary-play-cta full-width" onClick={onPlayAgain}>
            <RotateCcw size={18} />
            <span>PLAY AGAIN</span>
          </button>

          <button className="secondary-menu-btn full-width" onClick={onMainMenu}>
            <Home size={18} />
            <span>BACK TO MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};

