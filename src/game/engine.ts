import type { Direction, Position } from '../types/game';
import {
  GRID_SIZE,
  DIRECTION_VECTORS,
  OPPOSITE_DIRECTIONS,
  INITIAL_SPEED_MS,
  MIN_SPEED_MS,
  SPEED_DECREMENT_PER_LEVEL,
  POINTS_PER_LEVEL,
} from './constants';

export function getNextHead(currentHead: Position, direction: Direction): Position {
  const vector = DIRECTION_VECTORS[direction];
  return {
    x: currentHead.x + vector.x,
    y: currentHead.y + vector.y,
  };
}

export function isOutOfBounds(pos: Position): boolean {
  return pos.x < 0 || pos.x >= GRID_SIZE || pos.y < 0 || pos.y >= GRID_SIZE;
}

export function isCollidingWithSelf(head: Position, snakeBody: Position[]): boolean {
  // Check if head hits any body segment (excluding the head itself if passed full snake)
  return snakeBody.some((segment) => segment.x === head.x && segment.y === head.y);
}

export function generateFood(snake: Position[]): Position {
  const availableGrid: Position[] = [];

  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      const isOccupied = snake.some((segment) => segment.x === x && segment.y === y);
      if (!isOccupied) {
        availableGrid.push({ x, y });
      }
    }
  }

  if (availableGrid.length === 0) {
    // Rare edge case: board completely filled with snake
    return { x: 0, y: 0 };
  }

  const randomIndex = Math.floor(Math.random() * availableGrid.length);
  return availableGrid[randomIndex];
}

export function isValidDirectionChange(currentDir: Direction, newDir: Direction): boolean {
  return OPPOSITE_DIRECTIONS[currentDir] !== newDir;
}

export function calculateLevel(score: number): number {
  return Math.floor(score / POINTS_PER_LEVEL) + 1;
}

export function calculateSpeed(level: number): number {
  return Math.max(MIN_SPEED_MS, INITIAL_SPEED_MS - (level - 1) * SPEED_DECREMENT_PER_LEVEL);
}

export function formatScore(score: number, digits: number = 5): string {
  return score.toString().padStart(digits, '0');
}
