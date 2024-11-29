<script setup>
import { ref, h, render, onMounted } from 'vue'
import { useGameStore } from '@/stores/state';
import IconX from '../icons/IconX.vue';
import IconO from '../icons/IconO.vue';
import { emitter } from '@/eventbus/mitt';
import { AnimationPosition, Level, Players, Result } from '@/constants/enums';
import { Color } from '@/constants/color';
import anime from 'animejs';

const store = useGameStore();
const tickMarkContainer = ref(null);
const props = defineProps({
  row: Number,
  column: Number,
})
const borderClass = ref(null);
const gridSizeClass = ref(null);
const emit = defineEmits(['aiMove']);

const getIcon = () => {
  return h(store.currentPlayer == Players.X ? IconX : IconO, { size: store.iconTickSize, stroke: store.isXPlayer ? Color.LightGray : Color.LightYellow });
}

const tickMark = async () => {
  if (store.endGame) return;
  if (!store.aiTurn && !store.validMove(props.row, props.column)) return;
  store.tickMark(props.row, props.column);
  const IconComponent = getIcon();
  if (tickMarkContainer.value) {
    render(IconComponent, tickMarkContainer.value);
    await animateTickMark(IconComponent);
  }
  store.checkResult();
  if (store.result == Result.InGame) {
    store.switchPlayer();
  }
  emitter.emit('updateTurn');
  if (store.level != Level.PlayAgainstAFriend && store.you != store.currentPlayer) {
    let [row, column] = store.aiMove();
    setTimeout(() => emit('aiMove', row, column), 500);
  }
}
defineExpose({
  tickMark
})

const animateTickMark = async () => {
  const iconElement = tickMarkContainer.value.querySelector('svg');
  return new Promise((resolve) => {
    if (store.isXPlayer) {
      const paths = iconElement.querySelectorAll('path');
      paths.forEach(path => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
        anime({
          targets: path,
          strokeDashoffset: [length, 0],
          duration: store.tickAnimationDelayTime,
          easing: 'easeOutQuad',
          complete: resolve
        });
      });
    } else {
      const path = iconElement.querySelector('path');
      if (path) {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = 0;
        path.style.fill = 'none';
        path.style.stroke = store.isXPlayer ? Color.LightGray : Color.LightYellow;

        anime({
          targets: path,
          strokeDashoffset: [length, 0],
          duration: store.tickAnimationDelayTime,
          easing: 'easeInOutQuad',
          complete: resolve
        });
      }
    }
  });
}


onMounted(() => {
  let dynamicClass = ``;
  let top = 1, bottom = 1, left = 1, right = 1;
  let pos = null;
  if (props.row == 0) {
    top = 0;
  }
  if (props.row == store.size - 1) {
    bottom = 0;
  }
  if (props.column == 0) {
    left = 0;
  }
  if (props.column == store.size - 1) {
    right = 0;
  }
  if (top) {
    dynamicClass += `border-t-4 `;
  }
  if (bottom) {
    dynamicClass += `border-b-4 `;
  }
  if (left) {
    dynamicClass += `border-l-4 `;
  }
  if (right) {
    dynamicClass += `border-r-4 `;
  }
  borderClass.value = dynamicClass;
  gridSizeClass.value = `w-${store.gridSize} h-${store.gridSize}`;
  // if (props.row == 0){
  //   if (props.column == 0) pos = AnimationPosition.TopLeft;
  //   else if (props.column == store.size - 1) pos = AnimationPosition.BottomLeft;
  //   else {
  //     if (props.column == 0) pos = AnimationPosition.Left;
  //     else if (props.column == store.size - 1) pos = AnimationPosition.Right;
  //     else pos = AnimationPosition.Center;
  //   }
  // }
  // else if (props.row == store.size - 1){
  //   if (props.column == 0) pos = AnimationPosition.TopRight;
  //   else if (props.column == store.size - 1) pos = AnimationPosition.BottomRight;
  //   else {
  //     if (props.column == 0) pos = AnimationPosition.Left;
  //     else if (props.column == store.size - 1) pos = AnimationPosition.Right;
  //     else pos = AnimationPosition.Center;
  //   }
  // }

  //fix soon
  pos = AnimationPosition.Center;
  animateGrid(pos);
})

const animateGrid = (pos) => {
  switch (pos) {
    case AnimationPosition.TopLeft:
      anime({
        targets: tickMarkContainer.value,
        clipPath: [
          "polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)",
          "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
        ],
        duration: store.gridAnimationDelayTime,
        easing: 'easeInOutQuad'
      });
      break;
    case AnimationPosition.TopRight:
      anime({
        targets: tickMarkContainer.value,
        clipPath: [
          'polygon(0% 100%, 0% 100%, 0% 100%, 0% 100%)',
          'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
        ],
        duration: store.gridAnimationDelayTime,
        easing: 'easeInOutQuad'
      })
      break;
    case AnimationPosition.BottomLeft:
      anime({
        targets: tickMarkContainer.value,
        clipPath: [
          'polygon(100% 0%, 100% 0%, 100% 0%, 100% 0%)',
          'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
        ],
        duration: store.gridAnimationDelayTime,
        easing: 'easeInOutQuad'
      })
      break;
    case AnimationPosition.BottomRight:
      anime({
        targets: tickMarkContainer.value,
        clipPath: [
          'polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)',
          'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
        ],
        duration: store.gridAnimationDelayTime,
        easing: 'easeInOutQuad'
      })
      break;
    case AnimationPosition.Left:
    case AnimationPosition.Right:
    case AnimationPosition.Top:
    case AnimationPosition.Bottom:
    case AnimationPosition.Center:
      // anime({
      //   targets: tickMarkContainer.value,
      //   scale: [0, 1],
      //   opacity: [0, 1],
      //   duration: store.gridAnimationDelayTime,
      //   easing: 'easeOutQuad'
      // })
      break;
  }
}
</script>
<template lang="">
  <div :class="[`grid-item border-teal-600 flex justify-center items-center`, borderClass, gridSizeClass]" @click="tickMark" ref="tickMarkContainer">
  </div>
</template>
