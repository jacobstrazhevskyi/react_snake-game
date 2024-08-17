import React from 'react';

import {
  Container,
  styled,
} from '@mui/material';

import { GameWrapper } from '../GameWrapper';

import '../../reset.css';

const StyledContainer = styled(Container)({
  height: '100vh',
  overflow: 'hidden',
});

export const App: React.FC = () => (
  <StyledContainer>
    <GameWrapper />
  </StyledContainer>
);
