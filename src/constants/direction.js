export const Direction = Object.freeze({
  Horizontal: { dr: 0, dc: 1 },
  Vertical: { dr: 1, dc: 0 },
  DiagonalDownRight: { dr: 1, dc: 1 },
  DiagonalDownLeft: { dr: 1, dc: -1 }
});

export const compare = (direct1, direct2) => {
  if (direct1.dc == direct2.dc && direct1.dr == direct2.dr) return true;
  return false;
}
