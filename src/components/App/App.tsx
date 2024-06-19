import React from 'react';

import {
  Container,
  styled,
} from '@mui/material';

import { Board } from '../Board';

import '../../reset.css';

const StyledContainer = styled(Container)({
  height: '100vh',
  overflow: 'hidden',
});

const App: React.FC = () => (
  <StyledContainer>
    <Board />
  </StyledContainer>
);

export default App;
