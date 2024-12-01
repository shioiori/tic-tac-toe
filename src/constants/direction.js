const directions = [
  { dr: 0, dc: 1 },   // Horizontal
  { dr: 1, dc: 0 },   // Vertical
  { dr: 1, dc: 1 },   // Diagonal down-right
  { dr: 1, dc: -1 }   // Diagonal down-left
];

export const Direction = Object.freeze({
  Horizontal: 0,
  Vertical: 1,
  DiagonalDownRight: 2,
  DiagonalDownLeft: 3
});

export const getDirection = (index) => {
  return directions[index];
}
