/* eslint-disable no-nested-ternary */
import React from 'react';

import uuid from 'react-uuid';

import { Box, styled } from '@mui/material';
import { useAppSelector } from '../../utils/hooks/useAppSelector';

const StyledRowBox = styled(Box)({
  display: 'contents',
});

const cellStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: '0.5px solid rgb(134, 154, 189)',
};

const StyledCellBox = styled(Box)(({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: '0.5px solid rgb(134, 154, 189)',
}));

const StyledCellBoxSnake = styled(Box)({
  ...cellStyles,
  backgroundColor: 'green',
});

const StyledCellBoxFood = styled(Box)({
  ...cellStyles,
  backgroundColor: 'red',
});

export const Board: React.FC = () => {
  const board = useAppSelector(state => state.game.board);

  return (
    <>
      {
        board.map(row => (
          <StyledRowBox key={uuid()}>
            {row.map(cell => (
              cell.type === 'snake' ? (
                <StyledCellBoxSnake
                  key={uuid()}
                />
              ) : cell.type === 'food' ? (
                <StyledCellBoxFood
                  key={uuid()}
                />
              ) : (
                <StyledCellBox
                  key={uuid()}
                />
              )
            ))}
          </StyledRowBox>
        ))
      }
    </>
  );
};
