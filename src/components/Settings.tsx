import React from 'react';
import { ArrowLeft, Volume2, VolumeX, Smartphone, Grid, Palette, Music, Eye, RefreshCw } from 'lucide-react';
import type { GameSettings, SpeedPreset } from '../types/game';
import { THEMES_LIST } from '../systems/progression';

interface SettingsProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onBack: () => void;
  onResetProgress?: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  settings,
  onUpdateSettings,
  onBack,
  onResetProgress,
}) => {
  const speeds: { id: SpeedPreset; name: string }[] = [
    { id: 'CHILL', name: 'Chill (180ms)' },
    { id: 'CLASSIC', name: 'Classic (140ms)' },
    { id: 'FAST', name: 'Fast (100ms)' },
    { id: 'INSANE', name: 'Insane (70ms)' },
  ];

  return (
    <div className={`info-page-container ${settings.theme}-theme`}>
      <div className="info-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={18} /> BACK
        </button>
        <h2>SETTINGS</h2>
      </div>

      <div className="settings-card">
        {/* Sound Effects Toggle */}
        <div className="setting-row">
          <div className="setting-info">
            <div className="setting-title">
              {settings.soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />} Sound Effects
            </div>
            <div className="setting-desc">Synthesized Web Audio FX</div>
          </div>
          <button
            className={`toggle-switch ${settings.soundEnabled ? 'active' : ''}`}
            onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
          >
            <span className="toggle-slider" />
          </button>
        </div>

        {/* Music Toggle */}
        <div className="setting-row">
          <div className="setting-info">
            <div className="setting-title">
              <Music size={18} /> Ambient Audio
            </div>
            <div className="setting-desc">Enable subtle ambient tones</div>
          </div>
          <button
            className={`toggle-switch ${settings.musicEnabled ? 'active' : ''}`}
            onClick={() => onUpdateSettings({ musicEnabled: !settings.musicEnabled })}
          >
            <span className="toggle-slider" />
          </button>
        </div>

        {/* Haptic / Vibration Toggle */}
        <div className="setting-row">
          <div className="setting-info">
            <div className="setting-title">
              <Smartphone size={18} /> Haptic Feedback
            </div>
            <div className="setting-desc">Vibrate on eating or collisions</div>
          </div>
          <button
            className={`toggle-switch ${settings.vibrationEnabled ? 'active' : ''}`}
            onClick={() => onUpdateSettings({ vibrationEnabled: !settings.vibrationEnabled })}
          >
            <span className="toggle-slider" />
          </button>
        </div>

        {/* Control Type Selection */}
        <div className="setting-row theme-setting-row">
          <div className="setting-info">
            <div className="setting-title">
              <Smartphone size={18} /> Mobile Control Type
            </div>
            <div className="setting-desc">Select preferred mobile input method</div>
          </div>
          <div className="speeds-row">
            {(['DPAD', 'SWIPE', 'BOTH'] as const).map((ctrl) => (
              <button
                key={ctrl}
                className={`speed-pill-btn ${settings.controlType === ctrl ? 'active' : ''}`}
                onClick={() => onUpdateSettings({ controlType: ctrl })}
              >
                <span>{ctrl}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Speed Preset Selection */}
        <div className="setting-row theme-setting-row">
          <div className="setting-info">
            <div className="setting-title">
              <Grid size={18} /> Starting Speed Preset
            </div>
            <div className="setting-desc">Choose initial snake tick speed</div>
          </div>
          <div className="speeds-row">
            {speeds.map((s) => (
              <button
                key={s.id}
                className={`speed-pill-btn ${settings.speedPreset === s.id ? 'active' : ''}`}
                onClick={() => onUpdateSettings({ speedPreset: s.id })}
              >
                <span>{s.id}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Reduced Motion Toggle */}
        <div className="setting-row">
          <div className="setting-info">
            <div className="setting-title">
              <Eye size={18} /> Reduced Motion
            </div>
            <div className="setting-desc">Minimize screen transitions & particles</div>
          </div>
          <button
            className={`toggle-switch ${settings.reducedMotion ? 'active' : ''}`}
            onClick={() => onUpdateSettings({ reducedMotion: !settings.reducedMotion })}
          >
            <span className="toggle-slider" />
          </button>
        </div>

        {/* Visual Theme Selection */}
        <div className="setting-row theme-setting-row">
          <div className="setting-info">
            <div className="setting-title">
              <Palette size={18} /> Arena Theme
            </div>
            <div className="setting-desc">Select your preferred modern theme</div>
          </div>
          <div className="theme-options">
            {THEMES_LIST.map((item) => (
              <button
                key={item.id}
                className={`theme-card-btn ${settings.theme === item.id ? 'selected' : ''}`}
                onClick={() => onUpdateSettings({ theme: item.id })}
              >
                <div
                  className="theme-swatch"
                  style={{ background: `linear-gradient(135deg, ${item.bgStart}, ${item.accentColor})` }}
                />
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Reset Progress */}
        {onResetProgress && (
          <div className="setting-row" style={{ borderBottom: 'none', paddingTop: '1rem' }}>
            <button className="reset-progress-btn" onClick={onResetProgress}>
              <RefreshCw size={16} /> RESET ALL SAVED PROGRESS
            </button>
          </div>
        )}
      </div>

      <div className="info-footer">
        <button className="primary-play-cta" onClick={onBack}>
          SAVE & BACK
        </button>
      </div>
    </div>
  );
};
