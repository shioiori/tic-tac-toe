<template>
  <div class="w-full py-6 px-48 bg-teal-500 text-center relative" @click="refreshBoard">
    <div :class="[`flex justify-center items-center `, divSizeClass]" ref="noticeContainer">

      <div class="flex items-center justify-center" ref="iconContainer">
        <IconX v-if="store.currentPlayer == Players.X" :size="store.iconTickSize" :stroke="Color.LightGray"/>
        <IconO :size="store.iconTickSize" :stroke="Color.LightYellow" v-else/>
      </div>
      <div
        ref="winnerText"
        class="text-5xl font-bold text-center absolute mb-20" style="color:#545454">
        {{ winnerMessage }}
      </div>
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
const divSizeClass = ref('');
const noticeContainer = ref(null);
const props = defineProps({
  startPosition: Object
})

const animateVictory = () => {
  winnerMessage.value = store.result == Result.Draw ? "DRAW!" : "WINNER!";
  const tl = anime.timeline({
    easing: 'easeInOutQuad'
  })
  tl.add({
    targets: iconContainer.value,
    scale: [1, 3], // Zoom from original size to 3x
    duration: 1000,
  })
  .add({
    targets: iconContainer.value,
    translateY: "-.75rem",
    duration: 1000,
  })
  .add({
    targets: winnerText.value,
    opacity: [0, 1],
    duration: 100,
  })
}

onMounted(() => {
  console.log(props.startPosition);
  console.log(iconContainer.value.getBoundingClientRect());

  divSizeClass.value = `w-` + store.size * store.gridSize + ` h-` + store.size * store.gridSize;
  winnerText.value.style.transform = `translateY(6.5rem)`;
  animateVictory();
});

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
