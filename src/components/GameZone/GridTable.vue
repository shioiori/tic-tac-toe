<script setup>
import { useGameStore } from '@/stores/state';
import GridItem from './GridItem.vue';
import { nextTick, onMounted } from 'vue';
import { randomString } from '@/common/random';
import { emitter } from '@/eventbus/mitt';
import { ref } from 'vue';
import VictoryOverlay from '../VictoryOverlay.vue';
import anime from 'animejs';
import { Result } from '@/constants/enums';
import { Color } from '@/constants/color';
const store = useGameStore();
const calculateRow = (item) => {
  return ~~(item / store.size);
};
const calculateColumn = (item) => {
  return item % store.size;
};
const gridClass = ref(null);
onMounted(() => {
  store.refreshBoardGame();
  gridClass.value = `grid-cols-` + store.size + ` w-` + store.size * store.gridSize + ` h-` + store.size * store.gridSize;
})

const renderKey = ref(randomString(6));
emitter.on("refreshBoard", () => {
  store.refreshBoardGame();
  gridClass.value = `grid-cols-` + store.size + ` w-` + store.size * store.gridSize + ` h-` + store.size * store.gridSize;
  renderKey.value = randomString(6);
  // Use nextTick to wait for the DOM to update
  nextTick(() => {
    emitter.emit("updateTurn");
    if (store.aiTurn) aiMove();
  });
});

emitter.on("aiMove", () => aiMove());

const gridRefs = ref([]);
const aiMove = async () => {
  disablePointerEvent.value = true;
  let [row, column] = store.aiMove();
  const gridItem = gridRefs.value[row * store.size + column + 1];
  if (gridItem) {
    await gridItem.tickMark();
  }
  disablePointerEvent.value = false;
}
const disablePointerEvent = ref(false);
const boardDisable = (disabled) => disablePointerEvent.value = disabled;

const hasWinner = ref(false);
const victoryNotify = async() => {
  hasWinner.value = true;
  calculateWinningLineCoordinates();
  await nextTick();
  animateVictoryWinningLine();
}

const winningCoordinates = ref(null);

const calculateWinningLineCoordinates = () => {
  let winningCells = store.getWinLine();
  let startRow = winningCells[0].row;
  let startColumn = winningCells[0].col;
  let gridContainer = gridRefs.value[startRow * store.size + startColumn + 1];
  let gridRect = gridContainer.getBoundingClientRect();
  let startX = gridRect.x + (gridRect.right - gridRect.left) / 2;
  let startY = gridRect.y + (gridRect.bottom - gridRect.top) / 2;

  let endRow = winningCells[0].row;
  let endColumn = winningCells[0].col;
  gridContainer = gridRefs.value[endRow * store.size + endColumn + 1];
  gridRect = gridContainer.getBoundingClientRect();
  let endX = gridRect.x + (gridRect.right - gridRect.left) / 2;
  let endY = gridRect.y + (gridRect.bottom - gridRect.top) / 2;
  winningCoordinates.value = {
    start: {
      x: 0,
      y: 0
    },
    end: {
      x: 480,
      y: 480
    }
  };
}

const winningLine = ref(null)
const animateVictoryWinningLine = () => {
  const tl = anime.timeline({
    easing: 'easeInOutQuad'
  })

  const length = Math.sqrt((winningCoordinates.value.start.x - winningCoordinates.value.end.x) * (winningCoordinates.value.start.x - winningCoordinates.value.end.x)
    + (winningCoordinates.value.start.y - winningCoordinates.value.end.y) * (winningCoordinates.value.start.y - winningCoordinates.value.end.y));
  console.log(length);

  winningLine.value.style.strokeDasharray = length;
  winningLine.value.style.strokeDashoffset = length;
  // Animate winning line
  tl.add({
    targets: winningLine.value,
    strokeDashoffset: [length, 0],
    duration: store.victoryAnimationDelayTime
  })
  .add({
    targets: winningLine.value,
    opacity: [0, length],
    duration: store.victoryAnimationDelayTime
  }, '-=2000');
  tl.play();
}

</script>
<template lang="">
  <div class="relative">
    <div class="w-full bg-teal-500 flex items-center justify-center py-6 px-48" :key="renderKey">
      <div :class="[`grid gap-0`, gridClass, { 'pointer-events-none': disablePointerEvent }]">
        <GridItem v-for="item in (store.size * store.size)"
          :key="item"
          :row="calculateRow(item - 1)"
          :column="calculateColumn(item - 1)"
          :ref="el => (gridRefs[item] = el)"
          @aiMove="aiMove"
          @boardDisable="boardDisable"
          @victoryNotify="victoryNotify"/><!-- v-for is 1-indexed -->
        <div class="absolute w-60 h-60" v-if="hasWinner">
          <svg
            ref="victorySvg"
            class="victory-svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 300 300"
          >
            <!-- Winning line will be dynamically created here -->
            <line
              ref="winningLine"
              :x1="winningCoordinates.start.x"
              :y1="winningCoordinates.start.y"
              :x2="winningCoordinates.end.x"
              :y2="winningCoordinates.end.y"
              :stroke="(store.result == Result.XWin ? Color.LightGray : Color.LightYellow)"
              stroke-width="8"
              class="victory-line"
            />
          </svg>
        </div>
      </div>
    </div>
    <!-- <VictoryOverlay
        v-if="hasWinner"
        class="bg-teal-500 flex items-center justify-center w-60 h-60 py-6 px-48"
        :winner="store.currentPlayer"
        :winningCoordinates="winningCoordinates"
      /> -->
  </div>
</template>

