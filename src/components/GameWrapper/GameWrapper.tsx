import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Box,
  styled,
} from '@mui/material';

import { useSwipeable } from 'react-swipeable';

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
import { ScoreDisplay } from '../ScoreDisplay/ScoreDisplay';

import { Board } from '../Board';

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

const StyledContentBox = styled(Box)({
  '@media (max-height: 550px)': {
    display: 'flex',
    flexDirection: 'row',
  },
});

const StyledBoardBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'cellsSize',
})<StyledBoardBoxCustomProps>(({ cellsSize }) => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${BOARD_SIZE}, ${cellsSize}px)`,
  gridTemplateRows: `repeat(${BOARD_SIZE}, ${cellsSize}px)`,
  border: '0.5px solid rgb(134, 154, 189)',
}));

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

export const GameWrapper: React.FC = () => {
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
    const { key } = event;
  
    if (gameOver) {
      gameStarted.current = false;
      return;
    }
  
    const allowedKeys = ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'];
    if (!allowedKeys.includes(key)) {
      return;
    }
  
    if (!gameStarted.current) {
      startGame();
      return;
    }
  
    const directionMap: { [key: string]: Directions } = {
      ArrowLeft: 'left',
      ArrowRight: 'right',
      ArrowDown: 'down',
      ArrowUp: 'up',
    };
  
    const currentDirection = directionMap[key];
    const oppositeDirections = {
      left: 'right',
      right: 'left',
      up: 'down',
      down: 'up',
    };
  
    if (prevDirectionRef.current === oppositeDirections[currentDirection]) {
      return;
    }
  
    prevDirectionRef.current = currentDirection;
  
    dispatch(moveSnake({
      direction: currentDirection,
      snake,
    }));
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
      <StyledContentBox>
        <ScoreDisplay
          score={score}
          bestScore={bestScore}
        />
        <StyledBoardBox
          cellsSize={finalCellSize}
          {...handlers}
        >
          <Board />
        </StyledBoardBox>
      </StyledContentBox>
    </StyledBox>
  );
};
