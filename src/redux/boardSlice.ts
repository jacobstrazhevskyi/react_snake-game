/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Board } from '../types/Board';
import { Cell } from '../types/Cell';
import { Snake } from '../types/Snake';
import { Directions } from '../types/Directions';

interface InitialState {
  board: Board,
  snake: Cell[],
  food: Cell | null,
  gameOver: boolean,
  score: number,
}

type MoveSnakeProps = {
  direction: Directions,
  snake: Cell[],
}

const BOARD_SIZE = 15;

const initialState: InitialState = {
  board: new Array(BOARD_SIZE)
    .fill({
      type: 0,
    }).map(_row => new Array(BOARD_SIZE).fill({
      type: 0,
    })),
  snake: [
    { type: 'snake', snakeObject: { y: 6, x: 2 } },
    { type: 'snake', snakeObject: { y: 6, x: 3 } },
    { type: 'snake', snakeObject: { y: 6, x: 4 } },
  ],
  food: { type: 'food' },
  score: 0,
  gameOver: false,
};

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setSnake: (state, action: PayloadAction<Cell[]>) => {
      const snake = action.payload;

      state.board.forEach(row => {
        row.forEach(cell => {
          if (cell.type === 'snake') {
            cell.type = 0;
          }
        });
      });

      snake.forEach(cell => {
        const { x, y } = cell.snakeObject as Snake;
        state.board[y][x] = cell;
      });
    },
    spawnFood: (state) => {
      const newBoard = state.board;

      const checkIfAlreadySpawned = () => {
        const hasAnyFood = newBoard.map(row => row.filter(
          cell => cell.type === 'food',
        )).filter(elem => elem.length).length;

        return hasAnyFood;
      };

      if (checkIfAlreadySpawned()) return;

      let y = Math.floor(Math.random() * newBoard.length);
      let x = Math.floor(Math.random() * newBoard[y].length);

      let { type } = newBoard[y][x];

      while (type === 'snake') {
        y = Math.floor(Math.random() * newBoard.length);
        x = Math.floor(Math.random() * newBoard[y].length);
        type = newBoard[y][x].type;
      }

      const foodObject: Cell = {
        type: 'food',
        foodObject: { x, y },
      };

      newBoard[y][x] = foodObject;

      state.food = foodObject;
      state.board = newBoard;
    },
    spawnSnake: (state) => {
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

      state.snake = newSnake;
    },
    moveSnake: (state, action: PayloadAction<MoveSnakeProps>) => {
      const { direction } = action.payload;

      const {
        snake,
      } = state;

      const head = snake[snake.length - 1];

      if (!head.snakeObject) return;

      const { x, y } = head.snakeObject;
      let newX = x;
      let newY = y;

      switch (direction) {
        case 'right':
          newX += 1;
          break;
        case 'left':
          newX -= 1;
          break;
        case 'up':
          newY -= 1;
          break;
        case 'down':
          newY += 1;
          break;
        default:
          return;
      }

      // Collisions and self-collision checks
      if (
        newX < 0 || newX + 1 === 16 
        || newY < 0 || newY + 1 === 16 
        || state.board[newY][newX].type === 'snake'
      ) {
        state.gameOver = true;
        return;
      }

      const newHead = { ...head, snakeObject: { x: newX, y: newY } };
      const newSnake = [...snake, newHead];
      const { food } = state;

      if (food && newX === food.foodObject?.x && newY === food.foodObject?.y) {
        state.score += 5;
        state.food = null;
      } else {
        newSnake.shift();
      }

      state.snake = newSnake;
    },
    resetScore: (state) => {
      state.score = 0;
    },
    setGameOver: (state, action: PayloadAction<boolean>) => {
      state.gameOver = action.payload;
    },
  },
});

export const {
  spawnFood,
  setSnake,
  moveSnake,
  spawnSnake,
  setGameOver,
  resetScore,
} = boardSlice.actions;

export default boardSlice.reducer;
