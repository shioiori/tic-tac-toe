<template>
  <div
    class="w-full bg-teal-500 flex items-center justify-center"
  >
    <div
      ref="victoryContainer"
      class="victory-container text-center"
    >
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
          stroke="rgba(0, 255, 0, 0.7)"
          stroke-width="10"
          class="victory-line"
        />
      </svg>

      <div
        ref="winnerText"
        class="winner-text opacity-0 mt-4 text-5xl font-bold"
        :class="winnerTextClass"
      >
        {{ winnerMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted } from 'vue'
import anime from 'animejs/lib/anime.es.js'
import { Players } from '@/constants/enums';
import { useGameStore } from '@/stores/state';

const props = defineProps({
  winningCoordinates: Object,
  winner: Number
})

const store = useGameStore();

const victoryContainer = ref(null)
const victorySvg = ref(null)
const winningLine = ref(null)
const winnerText = ref(null)
const restartButton = ref(null)

const winnerMessage = ref('')
const winnerTextClass = ref('')

const calculateLineCoordinates = () => {
  // This is a placeholder. You'll need to adjust based on your grid layout
  // The coordinates should map to the start and end points of the winning line
  const padding = 50 // Adjust based on your layout
  props.winningCoordinates.start.x = 0;
  props.winningCoordinates.start.y = 0;
  // Example calculation - you'll need to customize this
  // lineStart.x = padding
  // lineStart.y = padding
}

const animateVictory = () => {
  calculateLineCoordinates()

  // Set winner message and color
  winnerMessage.value = props.winner === Players.X
    ? 'X Wins!'
    : 'O Wins!'

  winnerTextClass.value = props.winner === Players.X
    ? 'text-red-500'
    : 'text-blue-500'

  // Victory animation timeline
  const tl = anime.timeline({
    easing: 'easeInOutQuad'
  })

  const length = Math.sqrt((props.winningCoordinates.start.x - props.winningCoordinates.end.x) * (props.winningCoordinates.start.x - props.winningCoordinates.end.x)
    + (props.winningCoordinates.start.y - props.winningCoordinates.end.y) * (props.winningCoordinates.start.y - props.winningCoordinates.end.y));
  console.log(length);

  winningLine.value.style.strokeDasharray = length;
  winningLine.value.style.strokeDashoffset = length;
  // Animate winning line
  tl.add({
    targets: winningLine.value,
    strokeDashoffset: [length, 0],
    duration: store.victoryAnimationDelayTime
  })
  // Animate winner text
  .add({
    targets: winnerText.value,
    opacity: [0, 1],
    translateY: [50, 0],
    duration: store.victoryAnimationDelayTime
  }, '-=200')

  // Animate restart button
  .add({
    targets: restartButton.value,
    opacity: [0, 1],
    translateY: [50, 0],
    duration: store.victoryAnimationDelayTime
  }, '-=300');
  tl.play();
}

onMounted(() => animateVictory());

</script>

<style scoped>
.victory-svg {
  width: 300px;
  height: 300px;
}

.winner-text {
  text-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.restart-btn {
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
</style>
