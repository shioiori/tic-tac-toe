import { Result, Players } from "@/constants/enums";

const directions = [
  { dr: 0, dc: 1 },   // Horizontal
  { dr: 1, dc: 0 },   // Vertical
  { dr: 1, dc: 1 },   // Diagonal down-right
  { dr: 1, dc: -1 }   // Diagonal down-left
];

export class CaroGame{
  constructor(size){
    this.size = size;
    this.init();
    this.winLine = [];
  }

  checkResult(player){
    if (this.emptyCell == 0) return Result.Draw;
    for (let i = 0; i < this.size; ++i){
      for (let j = 0; j < this.size; ++j){
        if (this.grid[i][j] == player){
          let res = this.hasWinCondition(i, j, player);
          if (res) {
            let result = player == Players.X ? Result.XWin : Result.OWin;
            return result;
          }
        }
      }
    }
    return Result.InGame;
  }

  hasWinCondition(row, col, player){
    this.winLine.push({row: row, col: col});
    let condition = this.size < 5 ? this.size : 5;
    for (const { dr, dc } of directions) {
      let count = 1;
      for (let i = 1; i < condition; i++) {
        const nRow = row + dr * i;
        const nCol = col + dc * i;
        if (nRow < 0 || nRow >= this.size ||
          nCol < 0 || nCol >= this.size ||
          this.grid[nRow][nCol] != player) {
          break;
        }
        this.winLine.push({row: nRow, col: nCol});
        count++;
      }
      for (let i = 1; i < condition; i++) {
        const nRow = row - dr * i;
        const nCol = col - dc * i;
        if (nRow < 0 || nRow >= this.size ||
          nCol < 0 || nCol >= this.size ||
          this.grid[nRow][nCol] != player) {
          break;
        }
        this.winLine.push({row: nRow, col: nCol});
        count++;
      }
      if (count >= condition) return true;
      else this.winLine = [];
    }
    this.winLine = [];
    return false;
  }

  move(row, column, player){
    this.grid[row][column] = player;
    this.emptyCell --;
  }

  validMove(row, column){
    return this.grid[row][column] == null;
  }

  init(){
    this.refreshBoardGame();
  }

  refreshBoardGame(){
    this.grid = Array.from({ length: this.size }, () => Array(this.size).fill(null));
    this.result = Result.NotStart;
    this.emptyCell = this.size * this.size;
  }
}
