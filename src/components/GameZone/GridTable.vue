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

onMounted(() => {
  store.refreshBoardGame();
})

const renderKey = ref(randomString(6));
emitter.on("refreshBoard", () => {
  renderKey.value = randomString(6);
});
</script>

<template lang="">
  <div class="w-full bg-green-600 flex items-center justify-center py-6" :key="renderKey">
    <table class="grid grid-cols-3 w-60 h-60">
      <GridItem v-for="item in (store.size*store.size)"
        :key="item"
        :row="calculateRow(item - 1)"
        :column="calculateColumn(item - 1)"/> <!-- v-for is 1-indexed -->
    </table>
  </div>
</template>

