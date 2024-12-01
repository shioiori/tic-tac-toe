<template>
  <div class="w-full h-60 py-6 px-48 bg-teal-500 text-center" @click="refreshBoard">
    <div class="flex items-center justify-center iconContainer" ref="iconContainer">
      <IconX v-if="store.currentPlayer == Players.X" :size="store.iconTickSize" :stroke="Color.LightGray"/>
      <IconO :size="store.iconStatusSize" :stroke="Color.LightYellow" v-else/>
    </div>
    <div
      ref="winnerText"
      class="text-5xl font-bold flex justify-end" style="color:#545454"
    >
      {{ winnerMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import anime from 'animejs/lib/anime.es.js'
import { Players, Result } from '@/constants/enums';
import { useGameStore } from '@/stores/state';
import { Color } from '@/constants/color';
import IconX from './icons/IconX.vue';
import IconO from './icons/IconO.vue';
const store = useGameStore();

const iconContainer = ref(null)
const winnerText = ref(null)
const winnerMessage = ref('')

const animateVictory = () => {
  winnerMessage.value = store.result == Result.Draw ? "Draw!" : "Winner!";
  const tl = anime.timeline({
    easing: 'easeInOutQuad'
  })
  tl.add({
    targets: iconContainer.value,
    scale: [1, 3], // Zoom from original size to 3x
    duration: 1000,
  })
  .add({
    targets: winnerText.value,
    opacity: [0, 1],
    translateY: "6rem",
    duration: store.victoryAnimationDelayTime,


  })
}

onMounted(() => animateVictory());
const emit = defineEmits(["refreshBoard"])

const refreshBoard = async() => {
  await nextTick();
  emit("refreshBoard");
}

</script>

<style scoped>
.iconContainer {
  transform-origin: center top;
}
</style>
