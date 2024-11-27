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

const gameState = useGameStore();
const tickMarkContainer = ref(null);
defineProps({
  row: Number,
  column: Number,
})

const tickMark = () => {
  const IconComponent = h(gameState.isXPlayer ? IconX : IconO, { size: gameState.iconTickSize });
  if (tickMarkContainer.value){
    render(IconComponent, tickMarkContainer.value)
  }
  gameState.switchPlayer();
  emitter.emit('updateTurn');
}
</script>
<style lang="">
</style>
