<script setup lang="ts">
import { Players } from '@/constants/enums';
import PlayerState from './PlayerState.vue';
import TurnBoard from './TurnStatus.vue';
</script>

<template>
  <div>
    <div class="flex justify-center">
      <PlayerState :player="Players.X"/>
      <PlayerState :player="Players.O"/>
    </div>
    <TurnBoard/>
  </div>
</template>
