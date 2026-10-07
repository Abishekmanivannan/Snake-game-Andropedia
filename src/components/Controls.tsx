import React from 'react';
import type { Direction, ThemeMode } from '../types/game';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Pause, RotateCcw } from 'lucide-react';

interface ControlsProps {
  onDirectionChange: (dir: Direction) => void;
  onPause: () => void;
  onRestart: () => void;
  theme: ThemeMode;
  controlType?: 'DPAD' | 'SWIPE' | 'BOTH';
}

export const Controls: React.FC<ControlsProps> = ({
  onDirectionChange,
  onPause,
  onRestart,
  theme,
  controlType = 'BOTH',
}) => {
  const handleTouch = (dir: Direction) => (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    onDirectionChange(dir);
  };

  const showDPad = controlType === 'DPAD' || controlType === 'BOTH';

  return (
    <div className={`controls-wrapper ${theme}-theme`}>
      {/* Mobile Touch Floating Glass D-Pad */}
      {showDPad && (
        <div className="glass-dpad-container">
          <div className="dpad-row dpad-row-top">
            <button
              className="glass-dpad-btn dpad-btn-up"
              onTouchStart={handleTouch('UP')}
              onClick={() => onDirectionChange('UP')}
              aria-label="Move Up"
            >
              <ChevronUp size={26} />
            </button>
          </div>

          <div className="dpad-row dpad-row-middle">
            <button
              className="glass-dpad-btn dpad-btn-left"
              onTouchStart={handleTouch('LEFT')}
              onClick={() => onDirectionChange('LEFT')}
              aria-label="Move Left"
            >
              <ChevronLeft size={26} />
            </button>

            <div className="dpad-spacer" />

            <button
              className="glass-dpad-btn dpad-btn-right"
              onTouchStart={handleTouch('RIGHT')}
              onClick={() => onDirectionChange('RIGHT')}
              aria-label="Move Right"
            >
              <ChevronRight size={26} />
            </button>
          </div>

          <div className="dpad-row dpad-row-bottom">
            <button
              className="glass-dpad-btn dpad-btn-down"
              onTouchStart={handleTouch('DOWN')}
              onClick={() => onDirectionChange('DOWN')}
              aria-label="Move Down"
            >
              <ChevronDown size={26} />
            </button>
          </div>
        </div>
      )}

      {/* Auxiliary Mobile Quick Actions */}
      <div className="quick-actions-bar">
        <button className="glass-action-pill" onClick={onPause}>
          <Pause size={14} /> <span>PAUSE</span>
        </button>
        <button className="glass-action-pill" onClick={onRestart}>
          <RotateCcw size={14} /> <span>RESTART</span>
        </button>
      </div>

      {/* Desktop Keyboard Controls Bar */}
      <div className="keyboard-hints-bar">
        <span className="key-badge">W A S D</span>
        <span className="key-badge">ARROWS</span>
        <span className="key-desc">Move</span>
        <span className="key-sep">•</span>
        <span className="key-badge">SPACE</span>
        <span className="key-desc">Pause</span>
        <span className="key-sep">•</span>
        <span className="key-badge">R</span>
        <span className="key-desc">Restart</span>
      </div>
    </div>
  );
};
