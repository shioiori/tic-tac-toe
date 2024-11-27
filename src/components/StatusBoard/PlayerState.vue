<script setup>
import { Players } from '@/constants/enums';
import IconX from '../icons/IconX.vue';
import IconO from '../icons/IconO.vue';
import { useGameStore } from '@/stores/state';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';

const highlightClass = ref(null);

const props = defineProps({
  player: Number
})

const gameState = useGameStore();
const { xWinMatch, oWinMatch, currentPlayer } = storeToRefs(gameState);
watch(xWinMatch, () => gameState.xWinMatch > 0 ? gameState.xWinMatch : "-");
watch(oWinMatch, () => gameState.oWinMatch > 0 ? gameState.oWinMatch : "-");
watch(currentPlayer, () => {
  if (currentPlayer.value == props.player){
    highlightClass.value = `border-b-2 border-b-green-800 shadow-lg`;
  }
  else {
    highlightClass.value = ``;
  }
})
</script>

<template lang="">
  <div :class="[`flex justify-between items-center w-1/4 py-1 px-8 border-t-2 border-l-2 border-r-2 border-grey-300 rounded-md mt-4 mx-1
    focus:border-b-2 focus:border-grey-300`, highlightClass]" @click="gameState.changePlayer(this.player)">
    <div>
      <IconX v-if="props.player == Players.X" :size="gameState.iconStatusSize"/>
      <IconO :size="gameState.iconStatusSize" v-else />
    </div>
    <div>
      <h3 class="font-bold">{{props.player == Players.X ? xWinMatch : oWinMatch}}</h3>
    </div>
  </div>

</template>
