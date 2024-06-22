/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';

import uuid from 'react-uuid';

import {
  Box,
  styled,
} from '@mui/material';

type StyledBoxCustomProps = {
  cellFullness: 'food' | 'snake' | 0,
};

type StyledBoardBoxCustomProps = {
  cellsSize: number | undefined,
}

const BOARD_SIZE = 15;

const StyledBox = styled(Box)({
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const StyledBoardBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'cellsSize',
})<StyledBoardBoxCustomProps>(({ cellsSize }) => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${BOARD_SIZE}, ${cellsSize}px)`,
  gridTemplateRows: `repeat(${BOARD_SIZE}, ${cellsSize}px)`,
}));

const StyledRowBox = styled(Box)({
  display: 'contents',
});

const StyledColumnBox = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#4caf50',
  color: 'white',
});

export const Board: React.FC = () => {
  const [board, setBoard] = useState(
    new Array(BOARD_SIZE).fill(0).map(_row => new Array(BOARD_SIZE).fill(0)),
  );

  const [firstRender, setFirstRender] = useState(true);

  const [finalCellSize, setFinalCellSize] = useState<number>();

  let prevWindowSize: number;

  const handleResize = () => {
    const currentWindowSize = window.innerHeight + window.innerWidth;

    if (prevWindowSize === currentWindowSize) {
      return;
    }

    const cellSize = Math.min(window.innerWidth / BOARD_SIZE, window.innerHeight / BOARD_SIZE);

    const maxCellSize = 500 / BOARD_SIZE;

    if (cellSize > maxCellSize) {
      setFinalCellSize(maxCellSize);
    } else {
      setFinalCellSize(cellSize);
    }

    // We add them because it doesnt matter which value we have in each of this
    prevWindowSize = window.innerHeight + window.innerHeight; 
  };

  useEffect(() => {
    if (firstRender) {
      handleResize();
      setFirstRender(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [board]);

  return (
    <StyledBox>
      <StyledBoardBox
        cellsSize={finalCellSize}
      >
        {board.map(row => (
          <StyledRowBox key={uuid()}>
            {row.map(_cell => (
              <StyledColumnBox
                key={uuid()}
              // cellFullness={cell}
              />
            ))}
          </StyledRowBox>
        ))}
      </StyledBoardBox>
    </StyledBox>
  );
};
