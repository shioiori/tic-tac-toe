
<script setup>
import { emitter } from '@/eventbus/mitt';
import { useGameStore } from '@/stores/state';

const store = useGameStore();
const handleInputChange = (e) => {
  let size = parseInt(e.target.value);
  if (size < 3 || isNaN(size) || size > 9) {
    e.target.value = 3;
    size = 3;
  }
  store.setSize(size);
  emitter.emit("refreshBoard");
}
</script>

<template>
  <input type="number" class="border border-grey-300 w-8 h-8 rounded-lg my-2 bg-transparent text-center transition duration-300 ease focus:outline-none focus:border-slate-300 hover:border-slate-300 shadow-sm focus:shadow"
  :value="store.size" @input="handleInputChange">
  <span class="text-sm text-gray-500 italic ml-2">Size range from 3 to 9</span>
</template>

<style>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
