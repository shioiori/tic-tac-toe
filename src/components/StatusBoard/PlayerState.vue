<script setup>
import { Level, Players } from '@/constants/enums';
import IconX from '../icons/IconX.vue';
import IconO from '../icons/IconO.vue';
import { useGameStore } from '@/stores/state';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { onMounted } from 'vue';
import { Color } from '@/constants/color';
import { emitter } from '@/eventbus/mitt';

const highlightClass = `border-b-2 border-b-teal-500 shadow-lg`
const currentState = ref(null);
const props = defineProps({
  player: Number
})

const store = useGameStore();
const { currentPlayer } = storeToRefs(store);
watch(currentPlayer, () => {
  setHighlight();
})
onMounted(() => {
  setHighlight();
});

const setHighlight = () => {
  if (store.endGame) currentState.value = ``;
  if (store.currentPlayer == props.player){
    currentState.value = highlightClass;
  }
  else {
    currentState.value = ``;
  }
}

const changePlayer = () => {
  if (store.level == Level.PlayAgainstAFriend) return;
  store.changePlayer(props.player);
  // because X always goes first, if change need call AI to move
  emitter.emit("aiMove");
}
</script>

<template lang="">
  <div :class="[`flex justify-between items-center w-1/3 py-1 px-8 border-t-2 border-l-2 border-r-2 border-grey-300 rounded-md mt-2 mx-1
    focus:border-b-2 focus:border-grey-300`, currentState]" @click="changePlayer">
    <div>
      <IconX v-if="props.player == Players.X" :size="store.iconStatusSize" :stroke="Color.Black"/>
      <IconO :size="store.iconStatusSize" :stroke="Color.Black" v-else />
    </div>
    <div>
      <h3 class="font-bold">{{props.player == Players.X ? (store.xWinMatch > 0 ? store.xWinMatch : "-") : (store.oWinMatch > 0 ? store.oWinMatch : "-")}}</h3>
    </div>
  </div>

</template>
