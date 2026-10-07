import React from 'react';
import { ArrowLeft, Trophy, Lock, CheckCircle2 } from 'lucide-react';
import type { ThemeMode } from '../types/game';
import { ACHIEVEMENTS_LIST } from '../systems/progression';

interface AchievementsProps {
  unlockedIds: string[];
  onBack: () => void;
  theme: ThemeMode;
}

export const Achievements: React.FC<AchievementsProps> = ({
  unlockedIds,
  onBack,
  theme,
}) => {
  const unlockedCount = unlockedIds.length;
  const totalCount = ACHIEVEMENTS_LIST.length;
  const percent = Math.floor((unlockedCount / totalCount) * 100);

  return (
    <div className={`info-page-container ${theme}-theme`}>
      <div className="info-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={18} /> BACK
        </button>
        <h2>ACHIEVEMENTS</h2>
      </div>

      {/* Overview Progress Header */}
      <div className="achievements-progress-card">
        <div className="achieve-card-top">
          <div className="achieve-title-wrap">
            <Trophy size={20} className="trophy-gold" />
            <span>UNLOCKED: <strong>{unlockedCount} / {totalCount}</strong></span>
          </div>
          <span className="achieve-percent">{percent}%</span>
        </div>
        <div className="xp-bar-track">
          <div className="xp-bar-fill" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <div className="achievements-list-card">
        <div className="achievements-grid">
          {ACHIEVEMENTS_LIST.map((ach) => {
            const isUnlocked = unlockedIds.includes(ach.id);
            return (
              <div key={ach.id} className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}>
                <div className="ach-icon-wrap">
                  <span className="ach-emoji">{ach.icon}</span>
                </div>
                <div className="ach-details">
                  <div className="ach-head">
                    <span className="ach-title">{ach.title}</span>
                    {isUnlocked ? (
                      <CheckCircle2 size={16} className="unlocked-check" />
                    ) : (
                      <Lock size={14} className="lock-icon" />
                    )}
                  </div>
                  <p className="ach-desc">{ach.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="info-footer">
        <button className="primary-play-cta" onClick={onBack}>
          BACK TO MENU
        </button>
      </div>
    </div>
  );
};
