import React from 'react';
import { ArrowLeft, Play, Timer, HeartHandshake, Flame, Zap } from 'lucide-react';
import type { GameMode, SpeedPreset, ThemeMode } from '../types/game';

interface ModeSelectorProps {
  selectedMode: GameMode;
  selectedSpeed: SpeedPreset;
  onSelectMode: (mode: GameMode) => void;
  onSelectSpeed: (speed: SpeedPreset) => void;
  onStartGame: () => void;
  onBack: () => void;
  theme: ThemeMode;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  selectedMode,
  selectedSpeed,
  onSelectMode,
  onSelectSpeed,
  onStartGame,
  onBack,
  theme,
}) => {
  const modes: { id: GameMode; title: string; desc: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'CLASSIC',
      title: 'CLASSIC',
      desc: 'The pure Snake experience. Automatic speed acceleration, grow, survive.',
      icon: <Play size={22} className="mode-icon-cyan" />,
      badge: 'PRIMARY',
    },
    {
      id: 'TIME_ATTACK',
      title: 'TIME ATTACK',
      desc: '60 seconds on the clock. Score as many points as possible before time runs out.',
      icon: <Timer size={22} className="mode-icon-amber" />,
      badge: '60s TIMER',
    },
    {
      id: 'ZEN',
      title: 'ZEN MODE',
      desc: 'Relaxing casual play. Slower speed, calm atmosphere, zero collision pressure.',
      icon: <HeartHandshake size={22} className="mode-icon-emerald" />,
      badge: 'RELAX',
    },
    {
      id: 'HARDCORE',
      title: 'HARDCORE',
      desc: 'Maximum difficulty. Faster start, rapid speed scaling, 1.5x score multiplier.',
      icon: <Flame size={22} className="mode-icon-rose" />,
      badge: '1.5x MULTIPLIER',
    },
  ];

  const speeds: { id: SpeedPreset; label: string; desc: string }[] = [
    { id: 'CHILL', label: 'CHILL', desc: '180ms tick' },
    { id: 'CLASSIC', label: 'CLASSIC', desc: '140ms tick' },
    { id: 'FAST', label: 'FAST', desc: '100ms tick' },
    { id: 'INSANE', label: 'INSANE', desc: '70ms tick' },
  ];

  return (
    <div className={`info-page-container ${theme}-theme`}>
      <div className="info-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={18} /> BACK
        </button>
        <h2>GAME MODES</h2>
      </div>

      <div className="mode-selector-card">
        <h3 className="section-subtitle">SELECT MODE</h3>
        <div className="modes-grid">
          {modes.map((m) => (
            <button
              key={m.id}
              className={`mode-card-btn ${selectedMode === m.id ? 'active' : ''}`}
              onClick={() => onSelectMode(m.id)}
            >
              <div className="mode-card-top">
                <div className="mode-icon-wrap">{m.icon}</div>
                {m.badge && <span className="mode-badge-tag">{m.badge}</span>}
              </div>
              <div className="mode-card-body">
                <h4 className="mode-title">{m.title}</h4>
                <p className="mode-desc">{m.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <h3 className="section-subtitle" style={{ marginTop: '1.5rem' }}>STARTING SPEED</h3>
        <div className="speeds-row">
          {speeds.map((s) => (
            <button
              key={s.id}
              className={`speed-pill-btn ${selectedSpeed === s.id ? 'active' : ''}`}
              onClick={() => onSelectSpeed(s.id)}
            >
              <Zap size={14} />
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="info-footer">
        <button className="primary-play-cta large-cta" onClick={onStartGame}>
          <Play size={22} fill="currentColor" />
          <span>START {selectedMode.replace('_', ' ')}</span>
        </button>
      </div>
    </div>
  );
};
