import React from 'react';
import { Play, RotateCcw, Home } from 'lucide-react';
import type { ThemeMode } from '../types/game';

interface PauseOverlayProps {
  onResume: () => void;
  onRestart: () => void;
  onMainMenu: () => void;
  theme: ThemeMode;
}

export const PauseOverlay: React.FC<PauseOverlayProps> = ({
  onResume,
  onRestart,
  onMainMenu,
  theme,
}) => {
  return (
    <div className={`modal-overlay pause-overlay ${theme}-theme`}>
      <div className="modern-modal-card pause-modal-card">
        <div className="pause-header">
          <h2 className="pause-heading">PAUSED</h2>
          <p className="pause-subtitle">Take a breath.</p>
        </div>

        <div className="modal-actions-col">
          <button className="primary-play-cta full-width" onClick={onResume}>
            <Play size={18} fill="currentColor" />
            <span>RESUME</span>
          </button>

          <button className="secondary-menu-btn full-width" onClick={onRestart}>
            <RotateCcw size={18} />
            <span>RESTART</span>
          </button>

          <button className="secondary-menu-btn full-width" onClick={onMainMenu}>
            <Home size={18} />
            <span>MAIN MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};

