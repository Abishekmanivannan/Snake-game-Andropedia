import type { Direction, Position } from '../types/game';

export const GRID_SIZE = 20;

export const INITIAL_SPEED_MS = 150;
export const MIN_SPEED_MS = 60;
export const SPEED_DECREMENT_PER_LEVEL = 10;
export const POINTS_PER_FOOD = 10;
export const POINTS_PER_LEVEL = 50; // Every 5 food items (50 points)

export const INITIAL_SNAKE: Position[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
  { x: 7, y: 10 },
];

export const INITIAL_DIRECTION: Direction = 'RIGHT';

export const DIRECTION_VECTORS: Record<Direction, Position> = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

export const OPPOSITE_DIRECTIONS: Record<Direction, Direction> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};
