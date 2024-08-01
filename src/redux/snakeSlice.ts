/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Cell } from '../types/Cell';
import { Directions } from '../types/Directions';

const initialState: Cell[] = [];

type MoveSnakeProps = {
  direction: Directions,
  snake: Cell[],
}

const snakeSlice = createSlice({
  name: 'snake',
  initialState,
  reducers: {
    spawnSnake: (_snake) => {
      const newSnake: Cell[] = [];

      const y = 6;
      const tailXCoordinate = 2;

      for (let i = 0, xCoordinate = tailXCoordinate; i < 3; i++, xCoordinate++) {
        newSnake.push({
          type: 'snake',
          snakeObject: {
            x: xCoordinate,
            y,
          },
        });
      }

      return newSnake;
    },
    moveSnake: (_snake, action: PayloadAction<MoveSnakeProps>) => {
      const { direction, snake } = action.payload;

      const newSnake: Cell[] = [...snake];

      const head = { ...newSnake[newSnake.length - 1] };

      if (!head.snakeObject) {
        return;
      }

      const newHead = { ...head, snakeObject: { ...head.snakeObject } };

      switch (direction) {
        case 'right':
          newHead.snakeObject.x += 1;
          break;
        case 'left':
          newHead.snakeObject.x -= 1;
          break;
        case 'up':
          newHead.snakeObject.y -= 1;
          break;
        case 'down':
          newHead.snakeObject.y += 1;
          break;
        default:
          break;
      }

      newSnake.push(newHead);
      newSnake.shift();

      return newSnake;
    },
  },
});

export const { spawnSnake, moveSnake } = snakeSlice.actions;

export default snakeSlice.reducer;
