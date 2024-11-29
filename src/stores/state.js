import { CaroAI } from '@/common/bot';
import { CaroGame } from '@/common/gameplay';
import { Level, Players, Result } from '@/constants/enums'
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => {
    return {
      you: Players.X,
      currentPlayer: Players.X,
      game: new CaroGame(3),
      level: Level.Medium,
      result: Result.NotStart,
      gridSize: 20,
      iconTickSize: 48,
      iconStatusSize: 16,
      iconAlertSize: 48,
      xWinMatch: 0,
      oWinMatch: 0,
      ai: null,
      tickAnimationDelayTime: 200,
      gridAnimationDelayTime: 2000
    }
  },
  getters: {
    isXPlayer: (state) => state.currentPlayer == Players.X,
    endGame: (state) => state.result == Result.OWin || state.result == Result.XWin || state.result == Result.Draw,
    size: (state) => state.game.size,
    aiTurn: (state) => state.you != state.currentPlayer
  },
  actions: {
    switchPlayer(){
      this.currentPlayer = 1 - this.currentPlayer;
    },
    changePlayer(player){
      if (this.result == Result.NotStart){
        this.you = player;
      }
    },
    checkResult(){
      this.result = this.game.checkResult(this.currentPlayer);
      if (this.endGame){
        if (this.result == Result.OWin) this.oWinMatch++;
        else if (this.result == Result.XWin) this.xWinMatch++;
      }
    },
    tickMark(row, column){
      this.game.grid[row][column] = this.currentPlayer;
      if (this.result == Result.NotStart) this.result == Result.InGame;
      this.emptyCell--;
    },
    validMove(row, column){
      return this.game.validMove(row, column);
    },
    refreshBoardGame(){
      this.game.refreshBoardGame();
      if (this.level != Level.PlayAgainstAFriend){
        this.ai = new CaroAI(this.game, this.level, this.you == Players.X ? Players.O : Players.X);
      }
      this.result = Result.NotStart;
    },
    setLevel(level){
      this.level = level;
    },
    setSize(size){
      this.game.size = size;
      switch (size){
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
          this.gridSize = 20;
          this.iconTickSize = 48;
          break;
        case 7:
        case 8:
        case 9:
          this.gridSize = 16;
          this.iconTickSize = 42;
          break;
        default:
          this.gridSize = 12;
          this.iconTickSize = 30;
          break;
      }
    },
    aiMove(){
      let [row, column] = this.ai.aiMove(this.game.grid);
      this.tickMark(row, column);
      return [row, column];
    }
  }
})
