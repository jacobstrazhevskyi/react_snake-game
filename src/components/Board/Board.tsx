/* eslint-disable no-unused-vars */
import React, { useState } from 'react';

import uuid from 'react-uuid';

import {
  Box,
  styled,
} from '@mui/material';

type StyledBoxCustomProps = {
  cellFullness: 'food' | 'snake' | 0,
};

const BOARD_SIZE = 15;

const StyledBoardBox = styled(Box)({
  width: '100%',
  height: '100%',
  maxWidth: '500px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  margin: 'auto',
});

const StyledBoardRowBox = styled(Box)({
  display: 'flex',
  width: '100%',
});

const StyledBoardCellBox = styled(
  Box,
  { shouldForwardProp: (prop) => prop !== 'cellFullness' },
)<StyledBoxCustomProps>(({ cellFullness }) => {
  let cellColor;

  if (cellFullness === 'snake') {
    cellColor = 'green';
  } else if (cellFullness === 'food') {
    cellColor = 'red';
  } else {
    cellColor = '';
  }

  return {
    width: '100%',
    aspectRatio: '1',
    outline: '1px solid rgb(134, 154, 189)',
    backgroundColor: cellColor,
  };
});

export const Board: React.FC = () => {
  const [board, setBoard] = useState(
    new Array(BOARD_SIZE).fill(0).map(_row => new Array(BOARD_SIZE).fill(0)),
  );

  return (
    <StyledBoardBox>
      {board.map(row => (
        <StyledBoardRowBox key={uuid()}>
          {row.map(cell => (
            <StyledBoardCellBox
              key={uuid()}
              cellFullness={cell}
            />
          ))}
        </StyledBoardRowBox>
      ))}
    </StyledBoardBox>
  );
};
