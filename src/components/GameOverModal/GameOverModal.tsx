import React from 'react';

import {
  Box,
  Modal,
  styled,
  Typography, 
} from '@mui/material';

import { aux as gameOverAux } from '../../auх/gameOverModalTitle';

const { gameOverTitle } = gameOverAux;

type Props = {
  modalOpen: boolean,
  onClose: () => void,
};

const StyledBox = styled(Box)({
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  border: 'none',
  outline: 'none',
});

const StyledTypography = styled(Typography)({
  color: 'red',
  fontSize: '40px',

  '@media (max-width: 400px)': {
    fontSize: '30px',
  },
});

export const GameOverModal: React.FC<Props> = ({
  modalOpen,
  onClose,
}) => (
  <Modal
    open={modalOpen}
    onClose={onClose}
  >
    <StyledBox>
      <StyledTypography>
        {gameOverTitle}
      </StyledTypography>
    </StyledBox>
  </Modal>
);
