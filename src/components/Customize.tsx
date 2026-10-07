import React from 'react';
import { ArrowLeft, Lock, Check, Sparkles, Palette, Shield } from 'lucide-react';
import type { GameSettings } from '../types/game';
import { SKINS_LIST, THEMES_LIST, isSkinUnlocked } from '../systems/progression';
import { SnakePreview } from './SnakePreview';

interface CustomizeProps {
  settings: GameSettings;
  highScore: number;
  unlockedAchievementsCount: number;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onBack: () => void;
}

export const Customize: React.FC<CustomizeProps> = ({
  settings,
  highScore,
  unlockedAchievementsCount,
  onUpdateSettings,
  onBack,
}) => {
  return (
    <div className={`info-page-container ${settings.theme}-theme`}>
      <div className="info-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={18} /> BACK
        </button>
        <h2>SNAKE LAB — CUSTOMIZE</h2>
      </div>

      {/* Preview Card */}
      <div className="customize-preview-card">
        <div className="customize-canvas-wrap">
          <SnakePreview theme={settings.theme} />
        </div>
        <div className="customize-preview-label">
          <Sparkles size={14} className="sparkle-icon" />
          <span>CURRENT SKIN: <strong>{settings.skin.toUpperCase()}</strong></span>
        </div>
      </div>

      <div className="customize-sections-card">
        {/* Section 1: Skins */}
        <div className="customize-section">
          <h3 className="section-subtitle">
            <Shield size={16} /> SNAKE SKINS
          </h3>
          <div className="skins-grid">
            {SKINS_LIST.map((s) => {
              const unlocked = isSkinUnlocked(s.id, highScore, unlockedAchievementsCount);
              const selected = settings.skin === s.id;
              return (
                <button
                  key={s.id}
                  className={`skin-card-btn ${selected ? 'selected' : ''} ${!unlocked ? 'locked' : ''}`}
                  onClick={() => {
                    if (unlocked) onUpdateSettings({ skin: s.id });
                  }}
                  disabled={!unlocked}
                >
                  <div
                    className="skin-swatch"
                    style={{
                      background: `linear-gradient(135deg, ${s.gradient[0]}, ${s.gradient[1]}, ${s.gradient[2]})`,
                      boxShadow: `0 0 12px ${s.glowColor}`,
                    }}
                  />
                  <div className="skin-info">
                    <span className="skin-name">{s.name}</span>
                    <span className="skin-req">{unlocked ? 'Unlocked' : s.reqDesc}</span>
                  </div>
                  {selected && <Check size={16} className="check-icon" />}
                  {!unlocked && <Lock size={14} className="lock-icon" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Modern Themes */}
        <div className="customize-section" style={{ marginTop: '1.5rem' }}>
          <h3 className="section-subtitle">
            <Palette size={16} /> ARENA THEMES
          </h3>
          <div className="themes-grid">
            {THEMES_LIST.map((t) => {
              const selected = settings.theme === t.id;
              return (
                <button
                  key={t.id}
                  className={`theme-card-btn ${selected ? 'selected' : ''}`}
                  onClick={() => onUpdateSettings({ theme: t.id })}
                >
                  <div
                    className="theme-swatch"
                    style={{
                      background: `linear-gradient(135deg, ${t.bgStart}, ${t.accentColor})`,
                    }}
                  />
                  <span className="theme-name">{t.name}</span>
                  {selected && <Check size={16} className="check-icon" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="info-footer">
        <button className="primary-play-cta" onClick={onBack}>
          APPLY & SAVE
        </button>
      </div>
    </div>
  );
};
