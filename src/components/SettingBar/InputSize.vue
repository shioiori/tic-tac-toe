
<script setup>
import { emitter } from '@/eventbus/mitt';
import { useGameStore } from '@/stores/state';

const store = useGameStore();
const handleInputChange = (e) => {
  store.setSize(parseInt(e.target.value));
  setTimeout(() => {
    emitter.emit("refreshBoard");
  }, store.animationDelayTime);
}
</script>

<template>
  <input type="number" class="border border-grey-300 w-8 h-8 rounded-lg my-2 bg-transparent text-center transition duration-300 ease focus:outline-none focus:border-slate-300 hover:border-slate-300 shadow-sm focus:shadow"
    @input="handleInputChange" v-model="store.size">
</template>

<style>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
