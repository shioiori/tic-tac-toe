<template lang="">
  <div class="grid-item w-20 h-20 border-4 border-green-800 flex justify-center items-center" @click="tickMark" ref="tickMarkContainer">
  </div>
</template>
<script setup>
import { ref, h, render } from 'vue'
import { useGameStore } from '@/stores/state';
import IconX from '../icons/IconX.vue';
import IconO from '../icons/IconO.vue';
import { emitter } from '@/eventbus/mitt';
import { Result } from '@/constants/enums';

const gameState = useGameStore();
const tickMarkContainer = ref(null);
const props = defineProps({
  row: Number,
  column: Number,
})

const tickMark = () => {
  if (gameState.endGame) return;
  if (!gameState.validMove(props.row, props.column)) return;
  gameState.tickMark(props.row, props.column);
  const IconComponent = h(gameState.isXPlayer ? IconX : IconO, { size: gameState.iconTickSize });
  if (tickMarkContainer.value){
    render(IconComponent, tickMarkContainer.value)
  }
  gameState.checkResult();
  emitter.emit('updateTurn');
  if (gameState.result == Result.InGame)
  gameState.switchPlayer();
}
</script>
<style lang="">
</style>
