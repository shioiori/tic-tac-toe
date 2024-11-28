import { Level, Players } from "@/constants/enums";

export class CaroAI{
  constructor(caroGame, level, player){
    this.game = caroGame;
    this.level = level;
    this.player = player;
  }

  aiMove(grid){
    const emptySpots = [];
    for (let i = 0; i < this.game.size; i++) {
      for (let j = 0; j < this.game.size; j++) {
        if (grid[i][j] === null) emptySpots.push([i, j]);
      }
    }

    let move;
    switch (this.level) {
      case Level.Easy:
        move = emptySpots[Math.floor(Math.random() * emptySpots.length)];
        break;
      case Level.Medium:
        move = this.findBestMove(grid, 2);
        break;
      case Level.Impossible:
        move = this.findBestMove(grid, 4);
        break;
    }
    console.log(move);
    return move;
  }

  findBestMove(grid, depth){
    let bestScore = this.player == Players.O ? -Infinity : Infinity;
    let bestMove = null;

    for (let i = 0; i < this.game.size; i++) {
      for (let j = 0; j < this.game.size; j++) {
        if (grid[i][j] === null) {
          grid[i][j] = this.player;
          let score = this.minimax(grid, depth - 1, this.player == Players.X ? Players.O : Players.X, false);
          grid[i][j] = null;
          if (this.player == Players.O) {
            if (score > bestScore) {
              bestScore = score;
              bestMove = [i, j];
            }
          } else {
            if (score < bestScore) {
              bestScore = score;
              bestMove = [i, j];
            }
          }
        }
      }
    }
    return bestMove;
  };

  minimax(grid, depth, opponent, isMaximizing) {
    if (depth == 0) return 0;
    for (let i = 0; i < this.game.size; i++) {
      for (let j = 0; j < this.game.size; j++) {
        if (grid[i][j] !== null && this.game.hasWinCondition(i, j, this.player)) {
          return grid[i][j] == this.player ? 10 : -10;
        }
      }
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < this.game.size; i++) {
        for (let j = 0; j < this.game.size; j++) {
          if (grid[i][j] == null) {
            grid[i][j] = this.player;
            let score = this.minimax(grid, depth - 1, opponent, false);
            grid[i][j] = null;
            bestScore = Math.max(score, bestScore);
          }
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < this.game.size; i++) {
        for (let j = 0; j < this.game.size; j++) {
          if (grid[i][j] === null) {
            grid[i][j] = opponent;
            let score = this.minimax(grid, depth - 1, this.player, true);
            grid[i][j] = null;
            bestScore = Math.min(score, bestScore);
          }
        }
      }
      return bestScore;
    }
  };
}
