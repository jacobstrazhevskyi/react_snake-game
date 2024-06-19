/* eslint-disable no-unused-vars */
import React, { useState } from 'react';

import uuid from 'react-uuid';

import {
  Box,
  styled,
} from '@mui/material';

const BOARD_SIZE = 10;

const StyledBoardBox = styled(Box)({
  width: '100%',
  height: '100%',
  maxWidth: '500px',
  maxHeight: '1000px',
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

const StyledBoardCellBox = styled(Box)({
  width: '100%',
  aspectRatio: '1',
  outline: '1px solid rgb(134, 154, 189)',
  flex: '1',
});

export const Board: React.FC = () => {
  const [board, setBoard] = useState(
    new Array(BOARD_SIZE).fill(0).map(_row => new Array(BOARD_SIZE).fill(0)),
  );

  return (
    <StyledBoardBox>
      {board.map(row => (
        <StyledBoardRowBox key={uuid()}>
          {row.map(_cell => (
            <StyledBoardCellBox
              key={uuid()}
            />
          ))}
        </StyledBoardRowBox>
      ))}
    </StyledBoardBox>
  );
};
