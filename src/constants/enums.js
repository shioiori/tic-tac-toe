export const Players = Object.freeze({
  X: 0,
  O: 1,
});

export const Result = Object.freeze({
  NotStart: -1,
  XWin: 0,
  OWin: 1,
  Draw: 2,
  InGame: 3,
});

export const Level = Object.freeze({
  Easy: "Easy",
  Medium: "Medium",
  Impossible: "Impossible",
  PlayAgainstAFriend: "Play Against A Friend",
});

export const AnimationPosition = Object.freeze({
  TopLeft: 0,
  TopRight: 1,
  BottomLeft: 2,
  BottomRight: 3,
  Top: 4,
  Bottom: 5,
  Left: 6,
  Right: 7,
  Center: 8
});
