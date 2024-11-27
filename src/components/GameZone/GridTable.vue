<template lang="">
  <div class="w-full bg-green-600 flex items-center justify-center py-6">
    <table class="grid grid-cols-3 w-60 h-60">
      <GridItem v-for="item in (size*size)"
        :key="item"
        :row="calculateRow(item)"
        :column="calculateColumn(item)"/>
    </table>
  </div>
</template>
<script>
import GridItem from './GridItem.vue';

export default {
  components: {GridItem},
  data() {
    return {
      size: 3,
    }
  },
  methods: {
    calculateRow(item) {
      return ~~(item / this.size);
    },
    calculateColumn(item) {
      return item % this.size;
    },
  },
}
</script>
<style lang="">

</style>
