<script setup>
import { ref, h, render, onMounted } from 'vue'
import { useGameStore } from '@/stores/state';
import IconX from '../icons/IconX.vue';
import IconO from '../icons/IconO.vue';
import { emitter } from '@/eventbus/mitt';
import { Level, Players, Result } from '@/constants/enums';
import { Color } from '@/constants/color';

const store = useGameStore();
const tickMarkContainer = ref(null);
const props = defineProps({
  row: Number,
  column: Number,
})
const borderClass = ref(null);
const gridSizeClass = ref(null);

const tickMark = () => {
  if (store.endGame) return;
  if (!store.validMove(props.row, props.column)) return;
  store.tickMark(props.row, props.column);
  const IconComponent = getIcon();
  if (tickMarkContainer.value){
    render(IconComponent, tickMarkContainer.value)
  }
  store.checkResult();
  emitter.emit('updateTurn');
  if (store.result == Result.InGame)
  store.switchPlayer();
  if (store.level != Level.PlayAgainstAFriend && store.you != store.currentPlayer){
    let [row, column] = store.aiMove();
    emit('aiMove', row, column);
    store.switchPlayer();
  }
}

const emit = defineEmits(['aiMove']);

const getIcon = () => {
  return h(store.currentPlayer == Players.X ? IconX : IconO, { size: store.iconTickSize, stroke: store.isXPlayer ? Color.LightGray : Color.LightYellow });
}

onMounted(() => {
  let dynamicClass = ``;
  let top = 1, bottom = 1, left = 1, right = 1;
  if (props.row == 0){
    top = 0;
  }
  if (props.row == store.size - 1){
    bottom = 0;
  }
  if (props.column == 0){
    left = 0;
  }
  if (props.column == store.size - 1){
    right = 0;
  }
  if (top){
    dynamicClass += `border-t-4 `;
  }
  if (bottom){
    dynamicClass += `border-b-4 `;
  }
  if (left){
    dynamicClass += `border-l-4 `;
  }
  if (right){
    dynamicClass += `border-r-4 `;
  }
  borderClass.value = dynamicClass;
  gridSizeClass.value = `w-${store.gridSize} h-${store.gridSize}`;
})

</script>
<template lang="">
  <div :class="[`grid-item border-teal-600 flex justify-center items-center`, borderClass, gridSizeClass]" @click="tickMark" ref="tickMarkContainer">
  </div>
</template>
