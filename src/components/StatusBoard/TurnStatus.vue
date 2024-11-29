<script setup>
import { useGameStore } from '@/stores/state';
import { h, ref, render } from 'vue';
import { emitter } from '@/eventbus/mitt';
import { Result } from '@/constants/enums';
import IconX from '../icons/IconX.vue';
import IconO from '../icons/IconO.vue';
import { Color } from '@/constants/color';

const svgContainer = ref(null);
const textMessage = ref("Start game or select player");
const store = useGameStore();
emitter.on("updateTurn", () => {
  if (store.result == Result.NotStart){
    textMessage.value = "Start game or select player";
    return;
  }
  if (store.result != Result.InGame){
    // fix soon
    svgContainer.value.innerHTML = ``;
    textMessage.value = "Game Over";
    return;
  }
  const IconComponent = h(store.isXPlayer ? IconX : IconO, { size: store.iconStatusSize, stroke: Color.Black });
  render(IconComponent, svgContainer.value)
  textMessage.value = " turn";
})

</script>
<template lang="">
  <div class="text-center my-3 text-sm flex justify-center items-center">
    <span ref="svgContainer"></span>
    <span class="ml-1">{{textMessage}}</span>
  </div>
</template>
