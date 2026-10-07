import React from 'react';
import { ArrowLeft, Keyboard, Smartphone, Target, ShieldAlert, Award } from 'lucide-react';
import type { ThemeMode } from '../types/game';

interface HowToPlayProps {
  onBack: () => void;
  theme: ThemeMode;
}

export const HowToPlay: React.FC<HowToPlayProps> = ({ onBack, theme }) => {
  return (
    <div className={`info-page-container ${theme}-theme`}>
      <div className="info-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={18} /> BACK
        </button>
        <h2>HOW TO PLAY</h2>
      </div>

      <div className="info-content-card">
        <div className="rule-item">
          <div className="rule-icon"><Target size={22} /></div>
          <div className="rule-text">
            <h3>Objective</h3>
            <p>Guide the snake to collect glowing energy Orbs. Each Orb eaten increases your score by <b>10 points</b> and expands your snake.</p>
          </div>
        </div>

        <div className="rule-item">
          <div className="rule-icon"><ShieldAlert size={22} /></div>
          <div className="rule-text">
            <h3>Avoid Collisions</h3>
            <p>Do NOT run into the arena perimeter walls or crash into your own body segments.</p>
          </div>
        </div>

        <div className="rule-item">
          <div className="rule-icon"><Keyboard size={22} /></div>
          <div className="rule-text">
            <h3>Desktop Controls</h3>
            <p>
              Use <b>Arrow Keys</b> or <b>WASD</b> to steer.<br />
              Press <b>Space</b> to Pause/Resume game.<br />
              Press <b>R</b> to restart instantly.
            </p>
          </div>
        </div>

        <div className="rule-item">
          <div className="rule-icon"><Smartphone size={22} /></div>
          <div className="rule-text">
            <h3>Mobile Touch Controls</h3>
            <p>Use the sleek floating glass D-Pad or swipe directly on the arena board.</p>
          </div>
        </div>

        <div className="rule-item">
          <div className="rule-icon"><Award size={22} /></div>
          <div className="rule-text">
            <h3>Level Acceleration</h3>
            <p>Every <b>50 points</b> (5 items), your level advances and movement speed increases!</p>
          </div>
        </div>
      </div>

      <div className="info-footer">
        <button className="primary-play-cta" onClick={onBack}>
          GOT IT, LET'S PLAY!
        </button>
      </div>
    </div>
  );
};

