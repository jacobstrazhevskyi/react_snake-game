/* eslint-disable no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Board } from '../types/Board';
import { Cell } from '../types/Cell';
import { Snake } from '../types/Snake';

type Direction = 'right' | 'left' | 'up' | 'down';

const BOARD_SIZE = 15;
const initialState: Board = new Array(BOARD_SIZE)
  .fill({
    type: 0,
  }).map(_row => new Array(BOARD_SIZE).fill({
    type: 0,
  }));

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setSnake: (board, action: PayloadAction<Cell[]>) => {
      const snake = action.payload;

      const newBoard = board;

      snake.forEach(cell => {
        const {
          x,
          y,
        } = cell.snakeObject as Snake;

        newBoard[y][x] = cell;
      });

      return newBoard;
    },
    clearBoard: (board) => {
      let newBoard = board;

      newBoard = newBoard.map(row => row.map(
        cell => {
          if (cell.type === 'food') {
            return cell;
          }

          return { type: 0 };
        },
      ));

      return newBoard;
    },
    spawnFood: (board) => {
      const newBoard = board;

      const checkIfAlreadySpawned = () => {
        const hasAnyFood = newBoard.map(row => row.filter(
          cell => cell.type === 'food',
        )).filter(elem => elem.length).length;

        // console.log(hasAnyFood);
        return hasAnyFood;
      };

      if (checkIfAlreadySpawned()) return;

      let y = Math.floor(Math.random() * newBoard.length);
      let x = Math.floor(Math.random() * newBoard[y].length);

      const { type } = newBoard[y][x];

      while (type === 'snake') {
        y = Math.floor(Math.random() * newBoard.length);
        x = Math.floor(Math.random() * newBoard[y].length);
      }

      newBoard[y][x].type = 'food';
      newBoard[y][x].foodObject = {
        x,
        y,
      };

      return newBoard;
    },
  },
});

export const {
  spawnFood,
  setSnake,
  clearBoard,
} = boardSlice.actions;

export default boardSlice.reducer;
