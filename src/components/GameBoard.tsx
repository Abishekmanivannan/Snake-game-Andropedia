import React, { useEffect, useRef } from 'react';
import type { Position, Direction, ThemeMode, SnakeSkin, SpecialFood, Particle } from '../types/game';
import { GRID_SIZE } from '../game/constants';
import { calculateSpeed } from '../game/engine';
import { SKINS_LIST, THEMES_LIST } from '../systems/progression';

interface GameBoardProps {
  snake: Position[];
  prevSnakeRef?: React.MutableRefObject<Position[]>;
  lastTickTimeRef?: React.MutableRefObject<number>;
  level?: number;
  food: Position;
  specialFood?: SpecialFood | null;
  direction: Direction;
  theme: ThemeMode;
  skin?: SnakeSkin;
  showGridLines: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  particlesRef: React.MutableRefObject<Particle[]>;
  onDirectionChange?: (dir: Direction) => void;
}

// Draw ONE continuous smooth curved path for the snake body
function drawContinuousPath(ctx: CanvasRenderingContext2D, points: { x: number; y: number }[]) {
  if (points.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  if (points.length === 2) {
    ctx.lineTo(points[1].x, points[1].y);
    return;
  }

  for (let i = 1; i < points.length - 1; i++) {
    const midX = (points[i].x + points[i + 1].x) / 2;
    const midY = (points[i].y + points[i + 1].y) / 2;
    ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
  }
  ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
}

export const GameBoard: React.FC<GameBoardProps> = ({
  snake,
  prevSnakeRef,
  lastTickTimeRef,
  level = 1,
  food,
  specialFood,
  direction,
  theme,
  skin,
  showGridLines,
  isPaused,
  isGameOver,
  particlesRef,
  onDirectionChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Touch Swipe Gesture Controls
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || !onDirectionChange) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    const minSwipeDistance = 25;
    if (Math.abs(dx) < minSwipeDistance && Math.abs(dy) < minSwipeDistance) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) onDirectionChange('RIGHT');
      else onDirectionChange('LEFT');
    } else {
      if (dy > 0) onDirectionChange('DOWN');
      else onDirectionChange('UP');
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = (time: number) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const displayWidth = Math.floor(rect.width);
      const displayHeight = Math.floor(rect.height);

      if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      const width = displayWidth;
      const height = displayHeight;
      const cellW = width / GRID_SIZE;
      const cellH = height / GRID_SIZE;

      const themeDef = THEMES_LIST.find((t) => t.id === theme) || THEMES_LIST[0];
      const skinDef = SKINS_LIST.find((s) => s.id === (skin || 'cyan')) || SKINS_LIST[0];

      ctx.clearRect(0, 0, width, height);

      // ─── 1. Board Background (Dark Navy Charcoal + Vignette) ───
      const bgGrad = ctx.createRadialGradient(
        width / 2, height / 2, 20,
        width / 2, height / 2, width * 0.75
      );
      bgGrad.addColorStop(0, themeDef.bgStart);
      bgGrad.addColorStop(1, themeDef.bgEnd);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // ─── 2. Subtle Faint Grid Overlay ───
      if (showGridLines) {
        ctx.strokeStyle = themeDef.gridColor;
        ctx.lineWidth = 1;
        for (let i = 0; i <= GRID_SIZE; i++) {
          ctx.beginPath();
          ctx.moveTo(i * cellW, 0);
          ctx.lineTo(i * cellW, height);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(0, i * cellH);
          ctx.lineTo(width, i * cellH);
          ctx.stroke();
        }
      }

      // ─── 3. Particle Explosions (Food eaten burst) ───
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04;
        p.life -= 1;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        ctx.save();
        const alpha = p.life / p.maxLife;
        ctx.globalAlpha = alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // ─── 4. Normal Energy Pickup Food (Small glowing orb) ───
      const fx = food.x * cellW + cellW / 2;
      const fy = food.y * cellH + cellH / 2;
      const foodPulse = Math.sin(time / 140) * 1.5;

      ctx.save();
      ctx.fillStyle = themeDef.glowColor + '44';
      ctx.beginPath();
      ctx.arc(fx, fy, cellW * 0.45 + foodPulse, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowColor = themeDef.glowColor;
      ctx.shadowBlur = 16;
      const foodGrad = ctx.createRadialGradient(fx - 1, fy - 2, 1, fx, fy, cellW * 0.32);
      foodGrad.addColorStop(0, '#ffffff');
      foodGrad.addColorStop(0.4, themeDef.accentColor);
      foodGrad.addColorStop(1, themeDef.glowColor);
      ctx.fillStyle = foodGrad;
      ctx.beginPath();
      ctx.arc(fx, fy, cellW * 0.3 + foodPulse * 0.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(fx - cellW * 0.08, fy - cellW * 0.08, cellW * 0.07, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // ─── Special Rare Food Item (If active) ───
      if (specialFood) {
        const sfx = specialFood.x * cellW + cellW / 2;
        const sfy = specialFood.y * cellH + cellH / 2;
        const sfPulse = Math.cos(time / 100) * 2;
        const sfColor = specialFood.type === 'GOLDEN' ? '#fbbf24' : specialFood.type === 'DIAMOND' ? '#38bdf8' : specialFood.type === 'SLOW' ? '#34d399' : '#f43f5e';

        ctx.save();
        ctx.shadowColor = sfColor;
        ctx.shadowBlur = 22;
        ctx.fillStyle = sfColor;
        ctx.beginPath();
        ctx.arc(sfx, sfy, cellW * 0.38 + sfPulse, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(sfx, sfy, cellW * 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // ─── 5. Continuous Smooth Snake.io-Style Body (NO BEADS!) ───
      if (snake.length >= 1) {
        const speed = calculateSpeed(level);
        const lastTick = lastTickTimeRef?.current || time;
        const progress = isPaused || isGameOver
          ? 1
          : Math.min(1, Math.max(0, (time - lastTick) / speed));

        const prevSnake = prevSnakeRef?.current || snake;

        const centers = snake.map((curr, idx) => {
          const prev = prevSnake[idx] || curr;
          const ix = prev.x + (curr.x - prev.x) * progress;
          const iy = prev.y + (curr.y - prev.y) * progress;
          return {
            x: ix * cellW + cellW / 2,
            y: iy * cellH + cellH / 2,
          };
        });

        const bodyWidth = cellW * 0.72;

        if (centers.length >= 2) {
          // Layer A: Controlled Soft Outer Glow
          ctx.save();
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.lineWidth = bodyWidth + 8;
          ctx.strokeStyle = skinDef.glowColor + '55';
          ctx.shadowColor = skinDef.glowColor;
          ctx.shadowBlur = 18;
          drawContinuousPath(ctx, centers);
          ctx.stroke();
          ctx.restore();

          // Layer B: Solid Colorful Continuous Body with Selected Skin Gradient
          ctx.save();
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.lineWidth = bodyWidth;

          const headC = centers[0];
          const tailC = centers[centers.length - 1];
          const bodyGrad = ctx.createLinearGradient(headC.x, headC.y, tailC.x, tailC.y);
          bodyGrad.addColorStop(0, skinDef.gradient[0]);
          bodyGrad.addColorStop(0.5, skinDef.gradient[1]);
          bodyGrad.addColorStop(1, skinDef.gradient[2]);

          ctx.strokeStyle = bodyGrad;
          ctx.shadowColor = skinDef.glowColor;
          ctx.shadowBlur = 10;
          drawContinuousPath(ctx, centers);
          ctx.stroke();
          ctx.restore();

          // Layer C: Subtle Tubular Inner Highlight for smooth 3D shape
          ctx.save();
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.lineWidth = bodyWidth * 0.22;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
          ctx.shadowBlur = 0;
          drawContinuousPath(ctx, centers);
          ctx.stroke();
          ctx.restore();
        }

        // ─── 6. Snake Head (Slightly larger, naturally connected, simple clean eyes) ───
        const headPoint = centers[0];
        const headRadius = bodyWidth * 0.58;

        ctx.save();
        // Head Base Cap / Orb
        ctx.fillStyle = skinDef.gradient[0];
        ctx.shadowColor = skinDef.glowColor;
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(headPoint.x, headPoint.y, headRadius, 0, Math.PI * 2);
        ctx.fill();

        // Specular highlight spot on head
        ctx.shadowBlur = 0;
        const headHighlight = ctx.createRadialGradient(
          headPoint.x - headRadius * 0.3,
          headPoint.y - headRadius * 0.3,
          headRadius * 0.05,
          headPoint.x,
          headPoint.y,
          headRadius
        );
        headHighlight.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
        headHighlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = headHighlight;
        ctx.beginPath();
        ctx.arc(headPoint.x, headPoint.y, headRadius, 0, Math.PI * 2);
        ctx.fill();

        // Simple Clean Eyes looking in movement direction
        let e1x = headPoint.x, e1y = headPoint.y;
        let e2x = headPoint.x, e2y = headPoint.y;
        const eyeOffsetDist = headRadius * 0.42;
        const eyeSideDist = headRadius * 0.38;

        if (direction === 'RIGHT') {
          e1x = headPoint.x + eyeOffsetDist; e1y = headPoint.y - eyeSideDist;
          e2x = headPoint.x + eyeOffsetDist; e2y = headPoint.y + eyeSideDist;
        } else if (direction === 'LEFT') {
          e1x = headPoint.x - eyeOffsetDist; e1y = headPoint.y - eyeSideDist;
          e2x = headPoint.x - eyeOffsetDist; e2y = headPoint.y + eyeSideDist;
        } else if (direction === 'UP') {
          e1x = headPoint.x - eyeSideDist; e1y = headPoint.y - eyeOffsetDist;
          e2x = headPoint.x + eyeSideDist; e2y = headPoint.y - eyeOffsetDist;
        } else {
          e1x = headPoint.x - eyeSideDist; e1y = headPoint.y + eyeOffsetDist;
          e2x = headPoint.x + eyeSideDist; e2y = headPoint.y + eyeOffsetDist;
        }

        const eyeRadius = headRadius * 0.22;
        const pupilRadius = headRadius * 0.1;

        // Dark clean eye sockets
        ctx.fillStyle = '#070913';
        ctx.beginPath();
        ctx.arc(e1x, e1y, eyeRadius, 0, Math.PI * 2);
        ctx.arc(e2x, e2y, eyeRadius, 0, Math.PI * 2);
        ctx.fill();

        // Bright white pupils
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(e1x, e1y, pupilRadius, 0, Math.PI * 2);
        ctx.arc(e2x, e2y, pupilRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // ─── 7. Pause / Game Over Dim Overlay ───
      if (isPaused || isGameOver) {
        ctx.fillStyle = 'rgba(6, 9, 18, 0.6)';
        ctx.fillRect(0, 0, width, height);
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(animationFrameId); };
  }, [snake, food, direction, theme, showGridLines, isPaused, isGameOver, particlesRef, level, lastTickTimeRef, prevSnakeRef]);

  return (
    <div
      className="game-board-wrapper modern-board"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <canvas ref={canvasRef} className="game-canvas" />
    </div>
  );
};

