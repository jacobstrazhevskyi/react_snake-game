export const getCalculatedSnakeMoveInterval = (initialScore: number) => {
  const minInterval = 50;
  const initialInterval = 200;
  const decreasePerNumber = 3; // Number, which use for decrase per a certain number of score points
  const decrement = Math.floor(initialScore / 5) * decreasePerNumber;
  const interval = initialInterval - decrement;

  return interval < minInterval ? minInterval : interval;
};
