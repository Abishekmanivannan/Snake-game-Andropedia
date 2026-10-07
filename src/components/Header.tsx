import React from 'react';
import { Play, Volume2, VolumeX, Pause, HelpCircle, Settings as SettingsIcon, Gamepad2 } from 'lucide-react';
import type { ThemeMode, AppState } from '../types/game';

interface HeaderProps {
  appState: AppState;
  score: number;
  highScore: number;
  onPlayNow: () => void;
  onHowToPlay: () => void;
  onSettings: () => void;
  onHomeClick: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onTogglePause: () => void;
  isPaused: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  appState,
  onPlayNow,
  onHowToPlay,
  onSettings,
  onHomeClick,
  soundEnabled,
  onToggleSound,
  onTogglePause,
  isPaused,
}) => {
  return (
    <header className="modern-header">
      <div className="header-left" onClick={onHomeClick} role="button" tabIndex={0}>
        <div className="modern-logo-icon">
          <Gamepad2 size={18} className="logo-icon-svg" />
        </div>
        <div className="modern-logo-text">
          <span className="brand-title">S N A K E</span>
        </div>
      </div>

      <nav className="header-nav">
        <button className="nav-link-btn" onClick={onHowToPlay}>
          <HelpCircle size={15} /> <span>HOW TO PLAY</span>
        </button>
        <button className="nav-link-btn" onClick={onSettings}>
          <SettingsIcon size={15} /> <span>SETTINGS</span>
        </button>
        <button className="nav-link-btn sound-nav-btn" onClick={onToggleSound}>
          {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          <span>{soundEnabled ? 'AUDIO' : 'MUTED'}</span>
        </button>
      </nav>

      <div className="header-right">
        {appState === 'PLAYING' || appState === 'PAUSED' ? (
          <button className="header-cta-btn pause-cta" onClick={onTogglePause}>
            {isPaused ? <Play size={14} fill="currentColor" /> : <Pause size={14} />}
            <span>{isPaused ? 'RESUME' : 'PAUSE'}</span>
          </button>
        ) : (
          <button className="header-cta-btn play-cta" onClick={onPlayNow}>
            <Play size={14} fill="currentColor" />
            <span>PLAY NOW</span>
          </button>
        )}
      </div>
    </header>
  );
};

