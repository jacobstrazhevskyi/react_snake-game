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
import useLocalStorage from '../../utils/hooks/useLocalStorage';

import { Directions } from '../../types/Directions';

import {
  spawnFood,
  setSnake,
  spawnSnake,
  moveSnake,
  setGameOver,
  resetScore,
} from '../../redux/gameSlice';

import { GameOverModal } from '../GameOverModal';
import { ScoreDisplay } from '../ScoreDisplay/ScoreDisplay';

import { Board } from '../Board';
import { ControlsButtons } from '../ControlsButtons';

import { getCalculatedBoardCellSize } from '../../utils/getCalculatedBoardCellSize';
import { getCalculatedSnakeMoveInterval } from '../../utils/getCalculatedSnakeMoveInterval';

import { aux as settingsAux } from '../../auх/settings';
import { aux as directionsNamesAux } from '../../auх/directionsNames';
import { aux as keyboardArrowKeysAux } from '../../auх/keyboardArrowKeys';
import { aux as localStorageKeysAux } from '../../auх/localStorageKeys';

type Key = 'ArrowRight' | 'ArrowLeft' | 'ArrowDown' | 'ArrowUp';

type StyledBoardBoxCustomProps = {
  cellsSize: number | undefined,
}

const { BOARD_SIZE } = settingsAux.settings;

const { bestScore: bestScoreKey } = localStorageKeysAux.localStorageKeys;

const {
  right,
  left,
  down,
  up,
} = directionsNamesAux.directions;

const {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
} = keyboardArrowKeysAux.keys as {[key: string]: Key};

const createKeyboardEvent = (key: Key) => new KeyboardEvent('keydown', { key });

const StyledBox = styled(Box)({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
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

export const GameWrapper: React.FC = () => {
  const dispatch = useAppDispatch();

  const {
    board,
    food,
    gameOver,
    score,
    snake,
  } = useAppSelector(state => state.game);

  const [finalCellSize, setFinalCellSize] = useState<number>(() => getCalculatedBoardCellSize());
  const [moveInterval, setMoveInterval] = useState<number>(200);

  const [bestScore, setBestScore] = useLocalStorage(bestScoreKey, score);

  let prevWindowSize: number;

  const prevDirectionRef = useRef<Directions>(right);
  const gameStarted = useRef(false);
  const hasRendered = useRef(false);

  const handleResize = () => {
    const currentWindowSize = window.innerHeight + window.innerWidth;

    if (prevWindowSize === currentWindowSize) {
      return;
    }

    setFinalCellSize(getCalculatedBoardCellSize());

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
    prevDirectionRef.current = right;
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

    const allowedKeys = [ArrowRight, ArrowLeft, ArrowDown, ArrowUp];
    if (!allowedKeys.includes(key as Key)) {
      return;
    }

    if (!gameStarted.current) {
      startGame();
      return;
    }

    const directionMap: { [key: string]: Directions } = {
      ArrowLeft: left,
      ArrowRight: right,
      ArrowDown: down,
      ArrowUp: up,
    };

    const currentDirection = directionMap[key];

    const oppositeDirections = {
      left: right,
      right: left,
      up: down,
      down: up,
    };

    if (prevDirectionRef.current === oppositeDirections[currentDirection]) {
      return;
    }

    if (prevDirectionRef.current === currentDirection) {
      return;
    }

    prevDirectionRef.current = currentDirection;

    dispatch(moveSnake({
      direction: currentDirection,
      snake,
    }));
  };

  const moveHandlers = useRef({
    moveRight: () => handleKeypress(createKeyboardEvent(ArrowRight)),
    moveLeft: () => handleKeypress(createKeyboardEvent(ArrowLeft)),
    moveDown: () => handleKeypress(createKeyboardEvent(ArrowDown)),
    moveUp: () => handleKeypress(createKeyboardEvent(ArrowUp)),
  });

  const getSwipeHandlers = () => {
    const {
      moveDown,
      moveLeft,
      moveRight,
      moveUp,
    } = moveHandlers.current;

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
    const newInterval = getCalculatedSnakeMoveInterval(score);
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
        <ControlsButtons
          {...{ ...moveHandlers.current }}
        />
      </StyledMainBox>
    </StyledBox>
  );
};
