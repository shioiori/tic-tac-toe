import { Direction, getDirection } from "@/constants/direction";
import { Result, Players } from "@/constants/enums";

export class CaroGame{
  constructor(size){
    this.size = size;
    this.init();
    this.winProof = null;
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
    let condition = this.size < 5 ? this.size : 5;
    for (const direction of Object.values(Direction)) {
      let count = 1;
      this.winProof = {
        direction: direction,
      }
      let {dr, dc} = getDirection(direction);
      for (let i = 1; i < condition; i++) {
        const nRow = row + dr * i;
        const nCol = col + dc * i;
        if (nRow < 0 || nRow >= this.size ||
          nCol < 0 || nCol >= this.size ||
          this.grid[nRow][nCol] != player) {
          break;
        }
        this.winProof.end = {row: nRow, col: nCol};
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
        this.winProof.start = {row: nRow, col: nCol};
        count++;
      }
      if (this.winProof.start == undefined) this.winProof.start = {row: row, col: col};
      if (count >= condition) return true;
      else this.winProof = null;
    }
    this.winProof = null;
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
