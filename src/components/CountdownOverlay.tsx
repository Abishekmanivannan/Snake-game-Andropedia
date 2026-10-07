import React, { useEffect, useState } from 'react';
import { soundManager } from '../utils/sound';

interface CountdownOverlayProps {
  onComplete: () => void;
}

export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'READY' | '3' | '2' | '1' | 'GO!'>('READY');

  useEffect(() => {
    soundManager.playCountdown(false);

    const t1 = setTimeout(() => {
      setStep('3');
      soundManager.playCountdown(false);
    }, 400);

    const t2 = setTimeout(() => {
      setStep('2');
      soundManager.playCountdown(false);
    }, 900);

    const t3 = setTimeout(() => {
      setStep('1');
      soundManager.playCountdown(false);
    }, 1400);

    const t4 = setTimeout(() => {
      setStep('GO!');
      soundManager.playCountdown(true);
    }, 1900);

    const t5 = setTimeout(() => {
      onComplete();
    }, 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onComplete]);

  return (
    <div className="countdown-overlay">
      <div className="countdown-text animate-pulse-scale" key={step}>
        {step}
      </div>
    </div>
  );
};
