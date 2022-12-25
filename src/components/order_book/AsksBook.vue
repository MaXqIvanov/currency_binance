<template>
  <div>
    <div v-for="(ask, index) in keys_asks" :key="ask">
      <div class="row body__row" v-if="Number(ask) >= 0">
        <div class="column row__column" style="color: #ff0000">
          {{ Number(ask) * 1 }}
        </div>
        <div class="column row__column" v-if="asks">{{ asks[ask] * 1 }}</div>
        <div class="column row__column" v-if="asks">
          {{ (Number(ask) * asks[ask])?.toFixed(4) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  keys_asks: {
    type: Object,
  },
  asks: { type: Object },
});
</script>

<style scoped></style>
