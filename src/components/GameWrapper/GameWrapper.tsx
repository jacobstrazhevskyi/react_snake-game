import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Box,
  Button,
  Grid,
  styled,
} from '@mui/material';

import { useSwipeable } from 'react-swipeable';

import {
  ArrowUpward, ArrowDownward, ArrowBack, ArrowForward,
} from '@mui/icons-material';

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

const createKeyboardEvent = (key: Key) => new KeyboardEvent('keydown', { key });

const BOARD_SIZE = 15;

const StyledBox = styled(Box)({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

const StyledButton = styled(Button)({
  '@media (max-width: 400px)': {
    padding: '4px 8px',
  },
});

const StyledContentBox = styled(Box)({
  position: 'relative',

  '@media (max-height: 550px)': {
    display: 'flex',
    flexDirection: 'row',
  },

  '@media (max-width: 670px)': {
    display: 'block',
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

const StyledMainBox = styled(Box)({
  display: 'flex',
  position: 'relative',

  '@media (max-width: 340px) and (min-height: 555px)': {
    flexDirection: 'column',
  },
});

const StyledControlsBox = styled(Box)({
  marginLeft: '20px',

  '@media (max-width: 850px)': {
    marginLeft: '0',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    bottom: '10%',
    opacity: '0.6',
  },

  '@media (max-height: 550px) and (max-width: 850px)': {
    left: '60%',
    transform: 'translateX(-60%)',
  },

  '@media (max-width: 670px) and (max-height: 550px)': {
    left: '50%',
    transform: 'translateX(-50%)',
  },

  '@media (min-width: 670px) and (max-height: 320px)': {
    left: '60%',
    transform: 'translateX(-60%)',
  },

  '@media (max-width: 340px) and (min-height: 555px)': {
    position: 'relative',
    left: '0',
    transform: 'none',
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },
});

const StyledGrid = styled(Grid)({
  width: '100%',
  height: '100%',

  '@media (max-height: 290px)': {
    height: 'max-content',
    width: '140px',
  },

  '@media (max-width: 340px) and (min-height: 555px)': {
    width: 'max-content',
  },
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

  const moveRight = () => handleKeypress(createKeyboardEvent('ArrowRight'));
  const moveLeft = () => handleKeypress(createKeyboardEvent('ArrowLeft'));
  const moveDown = () => handleKeypress(createKeyboardEvent('ArrowDown'));
  const moveUp = () => handleKeypress(createKeyboardEvent('ArrowUp'));

  const getSwipeHandlers = () => {
    const handlersToReturn = useSwipeable({
      onSwipedRight: () => moveRight(),
      onSwipedLeft: () => moveLeft(),
      onSwipedDown: () => moveDown(),
      onSwipedUp: () => moveUp(),
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
      <StyledMainBox>
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
        <StyledControlsBox>
          <StyledGrid container direction="column" alignItems="center" justifyContent="center" gap={1}>
            <Grid item>
              <StyledButton 
                variant="contained"
                onClick={moveUp}
              >
                <ArrowUpward />
              </StyledButton>
            </Grid>
            <Grid item container direction="row" justifyContent="space-between" gap={3}>
              <StyledButton
                variant="contained"
                onClick={moveLeft}
              >
                <ArrowBack />
              </StyledButton>
              <StyledButton
                variant="contained"
                onClick={moveRight}
              >
                <ArrowForward />
              </StyledButton>
            </Grid>
            <Grid item>
              <StyledButton
                variant="contained"
                onClick={moveDown}
              >
                <ArrowDownward />
              </StyledButton>
            </Grid>
          </StyledGrid>
        </StyledControlsBox>
      </StyledMainBox>
    </StyledBox>
  );
};
