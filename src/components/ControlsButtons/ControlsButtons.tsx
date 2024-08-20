import React from 'react';

import {
  Box, Button, Grid, styled,
} from '@mui/material';

import {
  ArrowUpward, ArrowDownward, ArrowBack, ArrowForward,
} from '@mui/icons-material';

const StyledBox = styled(Box)({
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

const StyledButton = styled(Button)({
  '@media (max-width: 400px)': {
    padding: '4px 8px',
  },
});

type Props = {
  moveRight: () => void,
  moveLeft: () => void,
  moveDown: () => void,
  moveUp: () => void,
};

export const ControlsButtons: React.FC<Props> = ({
  moveDown,
  moveLeft,
  moveRight,
  moveUp,
}) => (
  <StyledBox>
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
  </StyledBox>
);
