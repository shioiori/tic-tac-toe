<template lang="">
  <div class="w-2/5 mx-auto border border-gray-300 rounded-md">
    <SettingBar/>
    <StatusBoard/>
    <div>
      <GridTable/>
    </div>
    <div>
      <RestartButton/>
    </div>
  </div>
</template>
<script>
import GridTable from '@/components/GameZone/GridTable.vue';
import RestartButton from '@/components/RestartButton.vue';
import SettingBar from '@/components/SettingBar/SettingBar.vue';
import StatusBoard from '@/components/StatusBoard/StatusBoard.vue';

export default {
  components: {SettingBar, GridTable, RestartButton, StatusBoard}
}
</script>
