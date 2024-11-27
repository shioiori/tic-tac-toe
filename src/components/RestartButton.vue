<script setup>
import { emitter } from '@/eventbus/mitt';
import { useGameStore } from '@/stores/state';
const store = useGameStore();
const restartGame = () => {
  store.refreshBoardGame();
  emitter.emit("refreshBoard");
}
</script>

<template lang="">
  <button class="bg-none text-green-800 border-t-gray-300 font-bold w-full py-1.5" @click="restartGame">Restart game</button>
</template>
