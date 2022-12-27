<template>
  <div class="asks_book" @mouseenter="mouseOnTable" @mouseleave="mouseOutTable">
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
import { onUpdated, ref } from "vue";

const props = defineProps({
  keys_asks: {
    type: Object,
  },
  asks: { type: Object },
});
const isTableAsks = ref(true);
const mouseOnTable = () => {
  isTableAsks.value = false;
};
const mouseOutTable = () => {
  isTableAsks.value = true;
};
onUpdated(() => {
  if (isTableAsks.value === true) {
    let elem_asks = document.getElementsByClassName("asks_book");
    elem_asks[0].scrollTop = elem_asks[0].scrollHeight + 50;
  }
});
</script>

<style scoped></style>
