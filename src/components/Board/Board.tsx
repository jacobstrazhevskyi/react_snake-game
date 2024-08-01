/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import uuid from 'react-uuid';

import {
  Box,
  styled,
} from '@mui/material';
import { useAppDispatch } from '../../utils/hooks/useAppDispatch';
import { useAppSelector } from '../../utils/hooks/useAppSelector';
import { spawnFood, setSnake, clearBoard } from '../../redux/boardSlice';

import { moveSnake, spawnSnake } from '../../redux/snakeSlice';

import { Cell } from '../../types/Cell';
import { Directions } from '../../types/Directions';

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
  border: '0.5px solid rgb(134, 154, 189)',
}));

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

type PrevDirection = {
  current: Directions,
};

export const Board: React.FC = () => {
  const hasRendered = useRef(false);

  const dispatch = useAppDispatch();
  const board = useAppSelector(state => state.board);

  let prevWindowSize: number;
  const prevDirectionRef = useRef<Directions>('right');
  const [finalCellSize, setFinalCellSize] = useState<number>();

  const gameStarted = useRef(false);

  const snake = useAppSelector(state => state.snake);

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

  const spawnEntities = () => {
    dispatch(spawnFood());
    dispatch(spawnSnake());
  };

  const startGame = () => {
    spawnEntities();
    gameStarted.current = true;
  };

  // THIS USE EFFECT IS TRIGGERED ONCE BEFORE FIRST RENDER
  useEffect(() => {
    if (hasRendered.current) {
      dispatch(clearBoard());
      spawnEntities();
      handleResize();
    } else {
      hasRendered.current = true;
    }
  }, []);

  useEffect(() => {
    if (!gameStarted.current) {
      return;
    }

    const intervalId = setTimeout(() => {
      dispatch(moveSnake({ direction: prevDirectionRef.current, snake }));
    }, 200);

    return () => clearTimeout(intervalId);
  }, [snake]);

  useEffect(() => {
    dispatch(clearBoard());
    dispatch(setSnake(snake));
  }, [snake]);

  const handleKeypress = (event: KeyboardEvent) => {
    if (!gameStarted.current) {
      startGame();
      return;
    }

    switch (event.key) {
      case 'ArrowLeft':
        if (prevDirectionRef.current === 'right' || prevDirectionRef.current === 'left') {
          return;
        }
        prevDirectionRef.current = 'left';
        dispatch(moveSnake({
          direction: 'left',
          snake,
        }));
        break;
      case 'ArrowRight':
        if (prevDirectionRef.current === 'left' || prevDirectionRef.current === 'right') {
          return;
        }
        prevDirectionRef.current = 'right';
        dispatch(moveSnake({
          direction: 'right',
          snake,
        }));
        break;
      case 'ArrowDown':
        if (prevDirectionRef.current === 'up' || prevDirectionRef.current === 'down') {
          return;
        }
        prevDirectionRef.current = 'down';
        dispatch(moveSnake({
          direction: 'down',
          snake,
        }));
        break;
      case 'ArrowUp':
        if (prevDirectionRef.current === 'down' || prevDirectionRef.current === 'up') {
          return;
        }
        prevDirectionRef.current = 'up';
        dispatch(moveSnake({
          direction: 'up',
          snake,
        }));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeypress);

    return () => {
      window.removeEventListener('keydown', handleKeypress);
      window.removeEventListener('resize', handleResize);
    };
  }, [board]);

  // console.log(board);

  return (
    <StyledBox>
      <StyledBoardBox
        cellsSize={finalCellSize}
      >
        {board.map(row => (
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
        ))}
      </StyledBoardBox>
    </StyledBox>
  );
};
