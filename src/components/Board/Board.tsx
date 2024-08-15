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
  Typography,
} from '@mui/material';

import { SwipeableHandlers, useSwipeable } from 'react-swipeable';

import { useAppDispatch } from '../../utils/hooks/useAppDispatch';
import { useAppSelector } from '../../utils/hooks/useAppSelector';

import {
  spawnFood,
  setSnake,
  spawnSnake,
  moveSnake,
  setGameOver,
  resetScore,
} from '../../redux/boardSlice';

import { Directions } from '../../types/Directions';
import { GameOverModal } from '../GameOverModal';
import useLocalStorage from '../../utils/hooks/useLocalStorage';

type StyledBoardBoxCustomProps = {
  cellsSize: number | undefined,
}

type Key = 'ArrowRight' | 'ArrowLeft' | 'ArrowDown' | 'ArrowUp'

const BOARD_SIZE = 15;

const StyledBox = styled(Box)({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
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

const StyledScoreBox = styled(Box)({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
});

const calculateCellSize = () => {
  const cellSize = Math.min(window.innerWidth / BOARD_SIZE, window.innerHeight / BOARD_SIZE);
  const maxCellSize = 500 / BOARD_SIZE;

  if (cellSize > maxCellSize) {
    return maxCellSize;
  }

  return cellSize;
};

const calculateInterval = (initialScore: number) => {
  const minInterval = 50;
  const initialInterval = 200;
  const decrement = Math.floor(initialScore / 5) * 5;
  const interval = initialInterval - decrement;
  return interval < minInterval ? minInterval : interval;
};

export const Board: React.FC = () => {
  const dispatch = useAppDispatch();

  const {
    board,
    food,
    gameOver,
    score,
    snake,
  } = useAppSelector(state => state.board);

  const [finalCellSize, setFinalCellSize] = useState<number>(() => calculateCellSize());
  const [moveInterval, setMoveInterval] = useState<number>(200);
  
  const [bestScore, setBestScore] = useLocalStorage('bestScore', score);

  let prevWindowSize: number;

  const prevDirectionRef = useRef<Directions>('right');
  const gameStarted = useRef(false);
  const hasRendered = useRef(false);

  const handleResize = () => {
    const currentWindowSize = window.innerHeight + window.innerWidth;

    if (prevWindowSize === currentWindowSize) {
      return;
    }

    setFinalCellSize(calculateCellSize());

    prevWindowSize = window.innerHeight + window.innerWidth;
  };

  const spawnEntities = () => {
    dispatch(spawnFood());
    dispatch(spawnSnake());
  };

  const startGame = () => {
    spawnEntities();
    gameStarted.current = true;
  };

  const prepareToGame = () => {
    prevDirectionRef.current = 'right';
    dispatch(resetScore());
    spawnEntities();
    handleResize();
  };

  const onGameOver = () => {
    dispatch(setGameOver(false));
    prepareToGame();
  };

  const handleKeypress = (event: KeyboardEvent) => {
    if (gameOver) {
      gameStarted.current = false;
      return;
    }

    const { key } = event;

    if (
      key !== 'ArrowRight'
      && key !== 'ArrowLeft'
      && key !== 'ArrowDown'
      && key !== 'ArrowUp'
    ) {
      return;
    }

    if (!gameStarted.current) {
      startGame();
      return;
    }

    switch (key) {
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

  const getSwipeHandlers = () => {
    const createKeyboardEvent = (key: Key) => new KeyboardEvent('keydown', { key });

    const handlersToReturn = useSwipeable({
      onSwipedRight: () => handleKeypress(createKeyboardEvent('ArrowRight')),
      onSwipedLeft: () => handleKeypress(createKeyboardEvent('ArrowLeft')),
      onSwipedDown: () => handleKeypress(createKeyboardEvent('ArrowDown')),
      onSwipedUp: () => handleKeypress(createKeyboardEvent('ArrowUp')),
    });

    return handlersToReturn;
  };

  const handlers = getSwipeHandlers();

  // THIS USE EFFECT IS TRIGGERED ONCE BEFORE FIRST RENDER
  useEffect(() => {
    if (hasRendered.current) {
      prepareToGame();
    } else {
      hasRendered.current = true;
    }
  }, []);

  useEffect(() => {
    if (!gameStarted.current) {
      return;
    }

    if (gameOver) {
      gameStarted.current = false;
      return;
    }

    const intervalId = setInterval(() => {
      dispatch(moveSnake({
        direction: prevDirectionRef.current,
        snake,
      }));
    }, moveInterval);

    return () => clearInterval(intervalId);
  }, [snake, gameOver]);

  useEffect(() => {
    const newInterval = calculateInterval(score);
    setMoveInterval(newInterval);
  }, [score]);

  useEffect(() => {
    dispatch(setSnake(snake));
  }, [snake]);

  useEffect(() => {
    if (!food) {
      dispatch(spawnFood());
    }

    if (score > bestScore) {
      setBestScore(score);
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeypress);

    return () => {
      window.removeEventListener('keydown', handleKeypress);
      window.removeEventListener('resize', handleResize);
    };
  }, [board]);

  return (
    <StyledBox>
      <GameOverModal
        modalOpen={gameOver}
        onClose={onGameOver}
      />
      <Box>
        <StyledScoreBox>
          <Typography>
            {`Score: ${score}`}
          </Typography>
          <Typography>
            {`Best score: ${bestScore}`}
          </Typography>
          <Typography>
            {`Interval: ${moveInterval}`}
          </Typography>
        </StyledScoreBox>
        <StyledBoardBox
          cellsSize={finalCellSize}
          {...handlers}
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
      </Box>
    </StyledBox>
  );
};
