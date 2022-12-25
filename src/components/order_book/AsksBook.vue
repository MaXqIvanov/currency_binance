<template>
  <div>
    <div v-for="(ask, index) in keys_asks" :key="ask">
      <div class="row body__row">
        <div class="column row__column" style="color: #ff0000">
          {{ Number(ask) * 1 }}
        </div>
        <div class="column row__column">{{ asks[ask] * 1 }}</div>
        <div class="column row__column">
          {{ (Number(ask) * asks[ask])?.toFixed(4) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  keys_asks: Array,
  asks: Object,
});
</script>

<style scoped></style>
