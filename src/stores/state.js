import { Level, Players, Result } from '@/constants/enums'
import { defineStore } from 'pinia'

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
      grid: Array.from({ length: 3 }, () => Array(3).fill(null)),
      level: Level.Easy,
      xWinMatch: 0,
      oWinMatch: 0,
    }
  },
  getters: {
    isXPlayer: (state) => state.currentPlayer == Players.X
  },
  actions: {
    switchPlayer(){
      this.currentPlayer = 1 - this.currentPlayer;
    },
    changePlayer(player){
      if (this.result == Result.NotStart){
        this.currentPlayer = player;
      }
    }
  }
})
