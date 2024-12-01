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
import { compare, Direction } from '@/constants/direction';
const store = useGameStore();
const calculateRow = (item) => {
  return ~~(item / store.size);
};
const calculateColumn = (item) => {
  return item % store.size;
};
const gridClass = ref(null);
onMounted(() => {
  refreshBoard();
})

const renderKey = ref(randomString(6));
emitter.on("refreshBoard", () => refreshBoard());

const refreshBoard = () => {
  store.refreshBoardGame();
  gridClass.value = `grid-cols-` + store.size + ` w-` + store.size * store.gridSize + ` h-` + store.size * store.gridSize;
  renderKey.value = randomString(6);
  hasWinner.value = false;
  victoryShow.value = false;
  // Use nextTick to wait for the DOM to update
  nextTick(() => {
    emitter.emit("updateTurn");
    if (store.aiTurn) aiMove();
  });
}

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
const victoryShow = ref(false);
const victoryNotify = async() => {
  hasWinner.value = true;
  winningCoordinates.value = calculateWinningLineCoordinates();
  await nextTick();
  await animateVictoryWinningLine();
  victoryShow.value = true;
}

const winningCoordinates = ref(null);

// wrong calculation, fix soon
const calculateWinningLineCoordinates = () => {
  let winProof = store.getWinLine();
  let startRow = winProof.start.row;
  let startColumn = winProof.start.col;
  let endRow = winProof.end.row;
  let endColumn = winProof.end.col;
  let lineStroke = 8;
  if (compare(winProof.direction, Direction.Vertical)){
    return {
      start: {
        x: startColumn * (store.gridSize * 8) + store.gridSize + lineStroke * 2,
        y: startRow * (store.gridSize * 8),
      },
      end: {
        x: endColumn * (store.gridSize * 8) + store.gridSize + lineStroke * 2,
        y: endRow * (store.gridSize * 8),
      }
    }
  }
  else if (compare(winProof.direction, Direction.Horizontal)){
    return {
      start: {
        x: startColumn * (store.gridSize * 8),
        y: startRow * (store.gridSize * 8) + store.gridSize / 2,
      },
      end: {
        x: endColumn * (store.gridSize * 8),
        y: endRow * (store.gridSize * 8) + store.gridSize / 2,
      }
    }
  }
  else {
    return {
      start: {
        x: startColumn * (store.gridSize * 8),
        y: startRow * (store.gridSize * 8),
      },
      end: {
        x: endColumn * (store.gridSize * 8),
        y: endRow * (store.gridSize * 8),
      }
    }
  }
}

const winningLine = ref(null)
const animateVictoryWinningLine = async() => {
  let direction = store.getWinLine().direction;
  const length = Math.sqrt((winningCoordinates.value.start.x - winningCoordinates.value.end.x) * (winningCoordinates.value.start.x - winningCoordinates.value.end.x)
    + (winningCoordinates.value.start.y - winningCoordinates.value.end.y) * (winningCoordinates.value.start.y - winningCoordinates.value.end.y));
  console.log(length);
  return new Promise((resolve) => {
    winningLine.value.style.strokeDasharray = length;
    winningLine.value.style.strokeDashoffset = length;

    let lineValue = calculateWinningLineCoordinates();
    let centerX = (lineValue.end.x - lineValue.start.x) / 2;
    let centerY = (lineValue.end.y- lineValue.start.y) / 2;
    // Animate winning line
    var tl = anime.timeline({
      easing: 'easeInOutQuad',
      duration: 750
    });
    tl.add({
      targets: winningLine.value,
      strokeDashoffset: [length, 0],
      duration: store.victoryAnimationDelayTime,
    });
    if (compare(direction, Direction.Horizontal)){
      tl.add({
        targets: winningLine.value,
        x1: [lineValue.start.x, centerX],
        x2: [lineValue.end.x, centerX],
        y1: [lineValue.start.y, lineValue.start.y],
        y2: [lineValue.end.y, lineValue.end.y],
        duration: store.victoryAnimationDelayTime,
      });
    }
    else if (compare(direction, Direction.Vertical)){
      tl.add({
        targets: winningLine.value,
        x1: [lineValue.start.x, lineValue.start.x],
        x2: [lineValue.end.x, lineValue.end.x],
        y1: [lineValue.start.y, centerY],
        y2: [lineValue.end.y, centerY],
        duration: store.victoryAnimationDelayTime,
      });
    }
    else {
      tl.add({
        targets: winningLine.value,
        x1: [lineValue.start.x, centerX],
        x2: [lineValue.end.x, centerX],
        y1: [lineValue.start.y, centerY],
        y2: [lineValue.end.y, centerY],
        duration: store.victoryAnimationDelayTime,

      });
    }
    let winProof = store.getWinLine();
    let centerRow, centerColumn;
    if (winProof.start.row == winProof.end.row){
      centerRow = winProof.start.row;
      centerColumn = (winProof.end.col - winProof.start.col) / 2;
    }
    else if (winProof.start.col == winProof.end.col){
      centerRow = (winProof.end.row - winProof.start.row) / 2;
      centerColumn = winProof.start.col;
    }
    else {
      centerRow = (winProof.end.row - winProof.start.row) / 2;
      centerColumn = (winProof.end.col - winProof.start.col) / 2;
    }
    console.log(gridRefs.value[centerRow * store.size + centerColumn + 1].getIconElement());

    // need code animation all element fly to center
    tl.add({
      targets: gridRefs.value[centerRow * store.size + centerColumn + 1].getIconElement(),
      complete: resolve
    });
  });
}

</script>
<template lang="">
  <div class="relative">
    <div class="w-full bg-teal-500 flex items-center justify-center py-6 px-48" :key="renderKey" v-show="!victoryShow">
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
    <VictoryOverlay
      v-if="victoryShow"
      class="w-full bg-teal-500"
      @refreshBoard="refreshBoard"
    />
  </div>
</template>

