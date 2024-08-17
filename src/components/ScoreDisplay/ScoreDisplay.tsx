import React from 'react';

import {
  Box,
  styled,
  Typography,
} from '@mui/material';

type Props = {
  score: number,
  bestScore: number,
};

const StyledBox = styled(Box)({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',

  '@media (max-height: 550px)': {
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    marginRight: '10px',
  },
});

const StyledTypography = styled(Typography)({
  '@media (max-width: 680px)': {
    fontSize: '12px',
  },
});

export const ScoreDisplay: React.FC<Props> = ({
  score,
  bestScore,
}) => (
  <StyledBox>
    <StyledTypography>
      {`Score: ${score}`}
    </StyledTypography>
    <StyledTypography>
      {`Best score: ${bestScore}`}
    </StyledTypography>
  </StyledBox>
);
