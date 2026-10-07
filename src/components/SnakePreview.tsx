import React, { useEffect, useRef } from 'react';
import type { Position, ThemeMode } from '../types/game';
import { THEMES_LIST } from '../systems/progression';

interface SnakePreviewProps {
  theme: ThemeMode;
}

export const SnakePreview: React.FC<SnakePreviewProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const cols = 28;
    const rows = 18;

    let snake: Position[] = [
      { x: 14, y: 9 }, { x: 13, y: 9 }, { x: 12, y: 9 },
      { x: 11, y: 9 }, { x: 10, y: 9 }, { x: 9, y: 9 },
      { x: 8, y: 9 }, { x: 7, y: 9 },
    ];
    let food: Position = { x: 20, y: 9 };
    let direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' = 'RIGHT';
    let lastTickTime = performance.now();
    const tickInterval = 100;

    const computeNextMove = () => {
      const head = snake[0];
      let possibleDirs: ('UP' | 'DOWN' | 'LEFT' | 'RIGHT')[] = [];
      if (food.x > head.x && direction !== 'LEFT') possibleDirs.push('RIGHT');
      if (food.x < head.x && direction !== 'RIGHT') possibleDirs.push('LEFT');
      if (food.y > head.y && direction !== 'UP') possibleDirs.push('DOWN');
      if (food.y < head.y && direction !== 'DOWN') possibleDirs.push('UP');

      if (possibleDirs.length === 0) {
        if (direction === 'RIGHT' || direction === 'LEFT') possibleDirs = ['UP', 'DOWN'];
        else possibleDirs = ['LEFT', 'RIGHT'];
      }

      for (const dir of possibleDirs) {
        let dx = 0, dy = 0;
        if (dir === 'UP') dy = -1;
        if (dir === 'DOWN') dy = 1;
        if (dir === 'LEFT') dx = -1;
        if (dir === 'RIGHT') dx = 1;
        const nx = head.x + dx;
        const ny = head.y + dy;
        if (nx >= 2 && nx < cols - 2 && ny >= 2 && ny < rows - 2 &&
          !snake.some(s => s.x === nx && s.y === ny)) {
          direction = dir;
          break;
        }
      }

      let dx = 0, dy = 0;
      if (direction === 'UP') dy = -1;
      if (direction === 'DOWN') dy = 1;
      if (direction === 'LEFT') dx = -1;
      if (direction === 'RIGHT') dx = 1;

      const newHead = { x: head.x + dx, y: head.y + dy };
      if (newHead.x < 1 || newHead.x >= cols - 1 || newHead.y < 1 || newHead.y >= rows - 1) {
        direction = direction === 'UP' ? 'RIGHT' : direction === 'RIGHT' ? 'DOWN' : direction === 'DOWN' ? 'LEFT' : 'UP';
        return;
      }

      snake.unshift(newHead);
      if (newHead.x === food.x && newHead.y === food.y) {
        food = {
          x: Math.floor(Math.random() * (cols - 6)) + 3,
          y: Math.floor(Math.random() * (rows - 6)) + 3,
        };
      } else {
        snake.pop();
      }
    };

    const render = (now: number) => {
      if (now - lastTickTime > tickInterval) {
        computeNextMove();
        lastTickTime = now;
      }

      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const w = rect.width;
      const h = rect.height;

      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      const cellW = w / cols;
      const cellH = h / rows;
      const themeDef = THEMES_LIST.find(t => t.id === theme) || THEMES_LIST[0];

      // Background
      const bgGrad = ctx.createRadialGradient(
        w / 2, h / 2, 10,
        w / 2, h / 2, w * 0.72
      );
      bgGrad.addColorStop(0, themeDef.bgStart);
      bgGrad.addColorStop(1, themeDef.bgEnd);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Faint grid
      ctx.strokeStyle = themeDef.gridColor;
      ctx.lineWidth = 1;
      for (let i = 0; i <= cols; i++) {
        ctx.beginPath(); ctx.moveTo(i * cellW, 0); ctx.lineTo(i * cellW, h); ctx.stroke();
      }
      for (let j = 0; j <= rows; j++) {
        ctx.beginPath(); ctx.moveTo(0, j * cellH); ctx.lineTo(w, j * cellH); ctx.stroke();
      }

      // Food orb
      const fx = food.x * cellW + cellW / 2;
      const fy = food.y * cellH + cellH / 2;
      const pulse = Math.sin(now / 120) * 1.5;

      ctx.save();
      ctx.fillStyle = themeDef.glowColor + '44';
      ctx.beginPath();
      ctx.arc(fx, fy, cellW * 0.6 + pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowColor = themeDef.glowColor;
      ctx.shadowBlur = 16;
      ctx.fillStyle = themeDef.accentColor;
      ctx.beginPath();
      ctx.arc(fx, fy, cellW * 0.32 + pulse * 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Continuous Smooth Snake Body
      const bodyWidth = cellW * 0.7;

      if (snake.length >= 2) {
        const centers = snake.map(s => ({
          x: s.x * cellW + cellW / 2,
          y: s.y * cellH + cellH / 2,
        }));

        // Layer 1: Soft Outer Glow
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = bodyWidth + 6;
        ctx.strokeStyle = themeDef.glowColor + '44';
        ctx.shadowColor = themeDef.glowColor;
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.moveTo(centers[0].x, centers[0].y);
        for (let i = 1; i < centers.length - 1; i++) {
          const mx = (centers[i].x + centers[i + 1].x) / 2;
          const my = (centers[i].y + centers[i + 1].y) / 2;
          ctx.quadraticCurveTo(centers[i].x, centers[i].y, mx, my);
        }
        ctx.lineTo(centers[centers.length - 1].x, centers[centers.length - 1].y);
        ctx.stroke();
        ctx.restore();

        // Layer 2: Main Solid Colorful Body
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = bodyWidth;
        ctx.strokeStyle = themeDef.accentColor;
        ctx.shadowColor = themeDef.glowColor;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(centers[0].x, centers[0].y);
        for (let i = 1; i < centers.length - 1; i++) {
          const mx = (centers[i].x + centers[i + 1].x) / 2;
          const my = (centers[i].y + centers[i + 1].y) / 2;
          ctx.quadraticCurveTo(centers[i].x, centers[i].y, mx, my);
        }
        ctx.lineTo(centers[centers.length - 1].x, centers[centers.length - 1].y);
        ctx.stroke();
        ctx.restore();

        // Layer 3: Head Orb
        const headPt = centers[0];
        const headR = bodyWidth * 0.58;
        ctx.save();
        ctx.fillStyle = themeDef.glowColor;
        ctx.shadowColor = themeDef.glowColor;
        ctx.shadowBlur = 16;
        ctx.beginPath();
        ctx.arc(headPt.x, headPt.y, headR, 0, Math.PI * 2);
        ctx.fill();

        // Clean eyes
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#070913';
        ctx.beginPath();
        ctx.arc(headPt.x + headR * 0.4, headPt.y - headR * 0.35, headR * 0.2, 0, Math.PI * 2);
        ctx.arc(headPt.x + headR * 0.4, headPt.y + headR * 0.35, headR * 0.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(headPt.x + headR * 0.4, headPt.y - headR * 0.35, headR * 0.09, 0, Math.PI * 2);
        ctx.arc(headPt.x + headR * 0.4, headPt.y + headR * 0.35, headR * 0.09, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(animationFrameId); };
  }, [theme]);

  return (
    <div className="preview-canvas-container">
      <canvas ref={canvasRef} className="preview-canvas" />
    </div>
  );
};

