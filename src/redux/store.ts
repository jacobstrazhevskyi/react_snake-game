import { configureStore } from '@reduxjs/toolkit';
import boardSlice from './boardSlice';
import snakeSlice from './snakeSlice';

export const store = configureStore({
  reducer: {
    board: boardSlice,
    snake: snakeSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
