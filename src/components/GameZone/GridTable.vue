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
import { Direction } from '@/constants/direction';
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
  if (store.result != Result.Draw){
    hasWinner.value = true;
    winningCoordinates.value = calculateWinningLineCoordinates();
    await nextTick();
    await animateVictory();
  }
  victoryShow.value = true;
}

const winningCoordinates = ref(null);
const calculateWinningLineCoordinates = () => {
  let winProof = store.getWinLine();
  let startRow = winProof.start.row;
  let startColumn = winProof.start.col;
  let endRow = winProof.end.row;
  let endColumn = winProof.end.col;

  let gridItemSize = 100;
  switch (winProof.direction){
    case Direction.Vertical:
      return {
        start: {
          x: (startColumn * gridItemSize) + gridItemSize / 2,
          y: startRow * gridItemSize,
        },
        end: {
          x: (endColumn * gridItemSize) + gridItemSize / 2,
          y: (endRow + 1) * gridItemSize,
        }
      }
    case Direction.Horizontal:
      return {
        start: {
          x: startColumn * gridItemSize,
          y: (startRow * gridItemSize) + gridItemSize / 2,
        },
        end: {
          x: (endColumn + 1) * gridItemSize,
          y: (endRow * gridItemSize) + gridItemSize / 2,
        }
      }
    case Direction.DiagonalDownRight:
      return {
        start: {
          x: startColumn * gridItemSize,
          y: startRow * gridItemSize,
        },
        end: {
          x: (endColumn + 1) * gridItemSize,
          y: (endRow + 1) * gridItemSize,
        }
      }
    case Direction.DiagonalDownLeft:
      return {
        start: {
          x: (startColumn + 1) * gridItemSize,
          y: startRow * gridItemSize,
        },
        end: {
          x: endColumn * gridItemSize,
          y: (endRow + 1) * gridItemSize,
        }
      }
  }
}

const gridTable = ref(null);
const winningLine = ref(null);
const startPosition = ref(null);
const animateVictory = async() => {
  const length = Math.sqrt((winningCoordinates.value.start.x - winningCoordinates.value.end.x) * (winningCoordinates.value.start.x - winningCoordinates.value.end.x)
    + (winningCoordinates.value.start.y - winningCoordinates.value.end.y) * (winningCoordinates.value.start.y - winningCoordinates.value.end.y));
  console.log(length);
  return new Promise((resolve) => {
    winningLine.value.style.strokeDasharray = length;
    winningLine.value.style.strokeDashoffset = length;
    // Animate winning line
    var tl = anime.timeline({
      easing: 'easeOutQuad',
      complete: () => {
        Promise.all([...animateGroupingMark(),
          animeteDisappearWinningLine()
        ]).then(() => {
          resolve();
        })
      }
    });
    tl.add({
      targets: winningLine.value,
      strokeDashoffset: [length, 0],
      duration: store.victoryAnimationDelayTime,
    });
  });
}

const animeteDisappearWinningLine = () => {
  let direction = store.getWinLine().direction;
  let lineValue = calculateWinningLineCoordinates();
  let centerX = (lineValue.end.x - lineValue.start.x) / 2;
  let centerY = (lineValue.end.y- lineValue.start.y) / 2;
  switch (direction){
    case Direction.Horizontal:
      return anime({
        targets: winningLine.value,
        x1: [lineValue.start.x, centerX],
        x2: [lineValue.end.x, centerX],
        y1: [lineValue.start.y, lineValue.start.y],
        y2: [lineValue.end.y, lineValue.end.y],
        duration: store.victoryAnimationDelayTime,
      });
    case Direction.Vertical:
      return anime({
        targets: winningLine.value,
        x1: [lineValue.start.x, lineValue.start.x],
        x2: [lineValue.end.x, lineValue.end.x],
        y1: [lineValue.start.y, centerY],
        y2: [lineValue.end.y, centerY],
        duration: store.victoryAnimationDelayTime,
      });
    case Direction.DiagonalDownRight:
      return anime({
        targets: winningLine.value,
        x1: [lineValue.start.x, centerX],
        x2: [lineValue.end.x, centerX],
        y1: [lineValue.start.y, centerY],
        y2: [lineValue.end.y, centerY],
        duration: store.victoryAnimationDelayTime,
      });
    case Direction.DiagonalDownLeft:
      return anime({
        targets: winningLine.value,
        x1: [lineValue.start.x, centerX],
        x2: [lineValue.end.x, centerX],
        y1: [lineValue.start.y, centerY],
        y2: [lineValue.end.y, centerY],
        duration: store.victoryAnimationDelayTime,
      });
  }
}

const animateGroupingMark = () => {
  let winCell = [];
  let winProof = store.getWinLine();
  if (winProof.start.row == winProof.end.row){
    for (let i = winProof.start.col; i <= winProof.end.col; ++i){
      winCell.push({
        row: winProof.start.row,
        col: i
      })
    }
  }
  else if (winProof.start.col == winProof.end.col){
    for (let i = winProof.start.row; i <= winProof.end.row; ++i){
      winCell.push({
        row: i,
        col: winProof.start.col
      })
    }
  }
  else {
    for (let i = winProof.start.row, j = winProof.start.col; i <= winProof.end.row; ++i){
      winCell.push({
        row: i,
        col: winProof.start.col > winProof.end.col ? j-- : j++
      })
    }
  }
  let animations = [];
  let centerRow = ~~(store.size / 2);
  let centerColumn = ~~(store.size / 2);
  const gridTableSize = gridRefs.value[centerRow * store.size + centerColumn + 1].getBoundingClientRect();
  startPosition.value = {x: gridTableSize.x, y: gridTableSize.y};
  // need code animation all element fly to center
  winCell.forEach((cell) => {
    if (cell.row == centerRow && cell.col == centerColumn) return;
    let el = gridRefs.value[cell.row * store.size + cell.col + 1].getElement();
    let translateX = gridTableSize.x - el.getBoundingClientRect().x;
    let translateY = gridTableSize.y - el.getBoundingClientRect().y;
    animations.push(anime({
      targets: el,
      translateX: translateX,
      translateY: translateY,
      duration: store.animateVictory,
    }));
  })
  return animations;
}

</script>
<template lang="">
  <div class="relative">
    <div class="w-full bg-teal-500 flex items-center justify-center py-6 px-48" :key="renderKey" v-show="!victoryShow">
      <div :class="[`grid gap-0`, gridClass, { 'pointer-events-none': disablePointerEvent }]" ref="gridTable">
        <GridItem v-for="item in (store.size * store.size)"
          :key="item"
          :row="calculateRow(item - 1)"
          :column="calculateColumn(item - 1)"
          :ref="el => (gridRefs[item] = el)"
          @aiMove="aiMove"
          @boardDisable="boardDisable"
          @victoryNotify="victoryNotify"/><!-- v-for is 1-indexed -->
        <div :class="(`absolute w-` + store.size * store.gridSize + ` h-` + store.size * store.gridSize)" v-if="hasWinner">
          <svg
            ref="victorySvg"
            class="victory-svg"
            xmlns="http://www.w3.org/2000/svg"
            :viewBox="(`0 0 ` + store.size * 100 + ` ` + store.size * 100)"
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
<style>
</style>
