<script setup>
import { Level } from '@/constants/enums';
import { emitter } from '@/eventbus/mitt';
import { useGameStore } from '@/stores/state';
import { ref } from 'vue';
const store = useGameStore();

const selectLevel = (level) => {
  store.setLevel(level);
  emitter.emit("refreshBoard");
  showDropdown.value = false;
}

const showDropdown = ref(false);

</script>

<template lang="">
  <div class="relative inline-block text-left group">
    <div>
      <button @click="(showDropdown = !showDropdown)"
        type="button"
        tabindex="0"
        class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold my-1"
        id="menu-button"
        aria-expanded="false"
        aria-haspopup="false"
      >
        <svg class="-mr-1 size-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
          <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
        </svg>
        {{store.level}}
      </button>
    </div>
    <div v-show="showDropdown"
      tabindex="-1"
      class="absolute left-4 z-10 w-56 origin-top-right rounded-md bg-white border border-grey-300 drop-shadow-xl"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
    >
      <div class="py-1" role="none">
        <a
          @click="selectLevel(item)"
          class="block px-4 py-0.5 text-sm hover:bg-gray-200"
          role="menuitem"
          tabindex="-1"
          v-for="item in Object.values(Level)"
          :key="item"
        >
          {{item}}
        </a>
      </div>
    </div>
  </div>
</template>
