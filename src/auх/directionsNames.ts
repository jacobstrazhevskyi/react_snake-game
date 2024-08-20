import { Directions } from '../types/Directions';

interface Aux {
  directions: { [key: string]: Directions },
}

export const aux: Aux = {
  directions: {
    right: 'right',
    left: 'left',
    down: 'down',
    up: 'up',
  },
};
