<script setup>
import { useGameStore } from '@/stores/state';
import GridItem from './GridItem.vue';
import { onMounted } from 'vue';
import { randomString } from '@/utils/random';
import { emitter } from '@/eventbus/mitt';
import { ref } from 'vue';

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
  renderKey.value = randomString(6);
  gridClass.value = `grid-cols-` + store.size + ` w-` + store.size * store.gridSize + ` h-` + store.size * store.gridSize;
});
</script>
<template lang="">
  <div class="w-full bg-teal-500 flex items-center justify-center py-6 px-48" :key="renderKey">
    <div :class="[`grid`, gridClass]">
      <GridItem v-for="item in (store.size * store.size)"
        :key="item"
        :row="calculateRow(item - 1)"
        :column="calculateColumn(item - 1)"/> <!-- v-for is 1-indexed -->
    </div>
  </div>
</template>

