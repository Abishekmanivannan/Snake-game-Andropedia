import React from 'react';
import { ArrowLeft, Calendar, Award, CheckCircle2, Play } from 'lucide-react';
import type { DailyChallenge as DailyChallengeType, ThemeMode } from '../types/game';

interface DailyChallengeProps {
  challenge: DailyChallengeType;
  onStartChallenge: () => void;
  onBack: () => void;
  theme: ThemeMode;
}

export const DailyChallenge: React.FC<DailyChallengeProps> = ({
  challenge,
  onStartChallenge,
  onBack,
  theme,
}) => {
  const percent = Math.min(100, Math.floor((challenge.current / challenge.target) * 100));

  return (
    <div className={`info-page-container ${theme}-theme`}>
      <div className="info-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={18} /> BACK
        </button>
        <h2>DAILY CHALLENGE</h2>
      </div>

      <div className="daily-challenge-card">
        <div className="daily-card-head">
          <div className="daily-badge">
            <Calendar size={14} /> TODAY'S MISSION
          </div>
          <span className="daily-date">{challenge.dateStr}</span>
        </div>

        <h3 className="daily-title">{challenge.title}</h3>

        <div className="daily-progress-wrap">
          <div className="daily-progress-info">
            <span>PROGRESS</span>
            <span className="tabular-nums">{challenge.current} / {challenge.target}</span>
          </div>
          <div className="xp-bar-track">
            <div className="xp-bar-fill" style={{ width: `${percent}%` }} />
          </div>
        </div>

        <div className="daily-reward-box">
          <Award size={18} className="trophy-gold" />
          <span>COMPLETION REWARD: <strong className="reward-xp">+{challenge.rewardXP} XP</strong></span>
        </div>

        {challenge.completed ? (
          <div className="completed-banner">
            <CheckCircle2 size={20} /> MISSION COMPLETED ✓
          </div>
        ) : (
          <button className="primary-play-cta full-width" onClick={onStartChallenge}>
            <Play size={20} fill="currentColor" />
            <span>PLAY DAILY CHALLENGE</span>
          </button>
        )}
      </div>

      <div className="info-footer">
        <button className="secondary-menu-btn" onClick={onBack}>
          BACK TO MENU
        </button>
      </div>
    </div>
  );
};
