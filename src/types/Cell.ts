import { Snake } from './Snake';
import { Food } from './Food';

export interface Cell {
  type: 'snake' | 'food' | 0,
  snakeObject?: Snake | undefined,
  foodObject?: Food,
}
