import { Level, Players, Result } from '@/constants/enums'
import { defineStore } from 'pinia'

const directions = [
  { dr: 0, dc: 1 },   // Horizontal
  { dr: 1, dc: 0 },   // Vertical
  { dr: 1, dc: 1 },   // Diagonal down-right
  { dr: 1, dc: -1 }   // Diagonal down-left
];

export const useGameStore = defineStore('game', {
  state: () => {
    return {
      you: Players.X,
      currentPlayer: Players.X,
      result: Result.NotStart,
      size: 3,
      iconTickSize: 48,
      iconStatusSize: 16,
      iconAlertSize: 48,
      grid: null,
      level: Level.Easy,
      xWinMatch: 0,
      oWinMatch: 0,
      emptyCell: 0
    }
  },
  getters: {
    isXPlayer: (state) => state.currentPlayer == Players.X,
    endGame: (state) => state.result == Result.OWin || state.result == Result.XWin || state.result == Result.Draw
  },
  actions: {
    switchPlayer(){
      this.currentPlayer = 1 - this.currentPlayer;
    },
    changePlayer(player){
      if (this.result == Result.NotStart){
        this.currentPlayer = player;
      }
    },
    checkResult(){
      for (let i = 0; i < this.size; ++i){
        for (let j = 0; j < this.size; ++j){
          if (this.grid[i][j] == this.currentPlayer){
            let res = this.hasWinCondition(i, j, this.currentPlayer);
            if (res) {
              this.result = this.currentPlayer == Players.X ? Result.XWin : Result.OWin;
              if (this.result == Result.XWin) this.xWinMatch++;
              else this.oWinMatch++;
              return;
            }
          }
        }
      }
      this.result = Result.InGame;
      if (this.emptyCell == 0) this.result = Result.Draw;
    },
    hasWinCondition(row, col, player){
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
          count++;
        }
        if (count >= condition) return true;
      }
      return false;
    },
    tickMark(row, column){
      this.grid[row][column] = this.currentPlayer;
      if (this.result == Result.NotStart) this.result == Result.InGame;
      this.emptyCell--;
    },
    validMove(row, column){
      return this.grid[row][column] == null;
    },
    init(){

    },
    refreshBoardGame(){
      this.grid = Array.from({ length: this.size }, () => Array(this.size).fill(null));
      this.result = Result.NotStart;
      this.emptyCell = this.size * this.size;
    }
  }
})
