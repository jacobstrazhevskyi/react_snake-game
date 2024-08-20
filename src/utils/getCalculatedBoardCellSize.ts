import { aux as settingsAux } from '../auх/settings';

const { BOARD_SIZE } = settingsAux.settings;

export const getCalculatedBoardCellSize = () => {
  const cellSize = Math.min(window.innerWidth / BOARD_SIZE, window.innerHeight / BOARD_SIZE);
  const maxCellSize = 500 / BOARD_SIZE;

  if (cellSize > maxCellSize) {
    return maxCellSize;
  }

  return cellSize;
};
