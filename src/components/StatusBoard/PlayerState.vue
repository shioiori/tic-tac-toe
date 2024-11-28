<script setup>
import { Players } from '@/constants/enums';
import IconX from '../icons/IconX.vue';
import IconO from '../icons/IconO.vue';
import { useGameStore } from '@/stores/state';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { onMounted } from 'vue';
import { Color } from '@/constants/color';
const highlightClass = `border-b-2 border-b-green-800 shadow-lg`
const currentState = ref(null);
const props = defineProps({
  player: Number
})

const store = useGameStore();
const { xWinMatch, oWinMatch, currentPlayer } = storeToRefs(store);
watch(xWinMatch, () => store.xWinMatch > 0 ? store.xWinMatch : "-");
watch(oWinMatch, () => store.oWinMatch > 0 ? store.oWinMatch : "-");
watch(currentPlayer, () => {
  setHighlight();
})
onMounted(() => {
  setHighlight();
});

const setHighlight = () => {
  if (store.currentPlayer == props.player){
    currentState.value = highlightClass;
  }
  else {
    currentState.value = ``;
  }
}
</script>

<template lang="">
  <div :class="[`flex justify-between items-center w-1/3 py-1 px-8 border-t-2 border-l-2 border-r-2 border-grey-300 rounded-md mt-2 mx-1
    focus:border-b-2 focus:border-grey-300`, currentState]" @click="store.changePlayer(this.player)">
    <div>
      <IconX v-if="props.player == Players.X" :size="store.iconStatusSize" :stroke="Color.Black"/>
      <IconO :size="store.iconStatusSize" :stroke="Color.Black" v-else />
    </div>
    <div>
      <h3 class="font-bold">{{props.player == Players.X ? xWinMatch : oWinMatch}}</h3>
    </div>
  </div>

</template>
