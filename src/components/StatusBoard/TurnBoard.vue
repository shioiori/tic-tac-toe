<script setup>
import { useGameStore } from '@/stores/state';
import { h, ref, render } from 'vue';
import IconX from '../../assets/X.svg?raw';
import IconO from '../../assets/O.svg?raw';
import { emitter } from '@/eventbus/mitt';
import { Color } from '@/constants/color';
import { Result } from '@/constants/enums';

const statusContent = ref("Start game or select player");
const store = useGameStore();
emitter.on("updateTurn", () => {
  if (store.result == Result.NotStart){
    statusContent.value = "Start game or select player";
    return;
  }
  if (store.result != Result.InGame){
    statusContent.value = "Game Over";
    return;
  }
  const IconComponent = h('svg', store.isXPlayer ? IconX : IconO);
  if (statusContent.value){
    render(IconComponent, statusContent.value)
  }
  const text = h('span', " turn");
  if (statusContent.value){
    render(text, statusContent.value)
  }
})

</script>
<template lang="">
  <p ref="statusContent" class="text-center my-3 text-sm">
  </p>
</template>
