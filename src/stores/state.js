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
      gridAnimationDelayTime: 400,
      victoryAnimationDelayTime: 400,
      gridStroke: 4
    }
  },
  getters: {
    isXPlayer: (state) => state.currentPlayer == Players.X,
    endGame: (state) => state.result == Result.OWin || state.result == Result.XWin || state.result == Result.Draw,
    size: (state) => state.game.size,
    aiTurn: (state) => state.level != Level.PlayAgainstAFriend && state.you != state.currentPlayer,
    playWithAI: (state) => state.level != Level.PlayAgainstAFriend,
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
      this.game.move(row, column, this.currentPlayer);
      if (this.result == Result.NotStart) this.result == Result.InGame;
    },
    validMove(row, column){
      return this.game.validMove(row, column);
    },
    refreshBoardGame(){
      this.game.refreshBoardGame();
      if (this.playWithAI){
        this.ai = new CaroAI(this.game, this.level, this.you == Players.X ? Players.O : Players.X);
      }
      // X always goes first
      this.currentPlayer = Players.X;
      // If you are X, you can start a game by go first or change to O and let AI go first
      if (this.aiTurn){
        this.result = Result.InGame;
      }
      else {
        this.result = Result.NotStart;
      }
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
          this.gridSize = 20;
          this.iconTickSize = 48;
          this.gridStroke = 8;
          break;
        case 5:
        case 6:
          this.gridSize = 16;
          this.iconTickSize = 42;
          this.gridStroke = 4;
          break;
        case 7:
          this.gridSize = 8;
          this.iconTickSize = 24;
          this.gridStroke = 2;
          break;
      }
    },
    aiMove(){
      let [row, column] = this.ai.aiMove(this.game.grid);
      return [row, column];
    },
    getWinLine(){
      if (this.endGame && this.result != Result.Draw){
        return this.game.winProof;
      }
      return null;
    }
  }
})
