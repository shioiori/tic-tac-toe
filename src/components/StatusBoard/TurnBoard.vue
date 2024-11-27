<script setup>
import { useGameStore } from '@/stores/state';
import { h, ref, render } from 'vue';
import IconX from '../icons/IconX.vue';
import IconO from '../icons/IconO.vue';
import { emitter } from '@/eventbus/mitt';
import { Result } from 'postcss';

const statusContent = ref(null);
const gameState = useGameStore();
emitter.on("updateStatus", () => {
  if (gameState.result == Result.NotStart){
    statusContent.value = "Start game or select player";
    return;
  }
  if (gameState.result != Result.InGame){
    statusContent.value = "Game Over";
    return;
  }
  const IconComponent = h(gameState.isXPlayer ? IconX : IconO, { size: gameState.iconTickSize });
  if (statusContent.value){
    render(IconComponent, statusContent.value)
  }
  const text = h('span', "turn");
  if (statusContent.value){
    render(text, statusContent.value)
  }
})

</script>
<template lang="">
  <p ref="statusContent" class="text-center my-3 text-sm">
    Start game or select player
  </p>
</template>
