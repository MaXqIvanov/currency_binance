<template>
  <div class="bids_book" @mouseenter="mouseOnTable" @mouseleave="mouseOutTable">
    <div v-for="(bid, index) in keys_bids" :key="bid">
      <div class="row body__row" id="start_bid" v-if="Number(bid) >= 0">
        <div class="column row__column" style="color: #16c281">
          {{ Number(bid) * 1 }}
        </div>
        <div class="column row__column" v-if="bids">{{ bids[bid] * 1 }}</div>
        <div class="column row__column" v-if="bids">
          {{ (Number(bid) * bids[bid])?.toFixed(4) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onUpdated, ref } from "vue";
const props = defineProps({ keys_bids: Object, bids: Object });
const isTableBids = ref(true);
const mouseOnTable = () => {
  isTableBids.value = false;
};
const mouseOutTable = () => {
  isTableBids.value = true;
};
onUpdated(() => {
  let elem_bids = document.getElementById("start_bid");
  if (elem_bids && isTableBids.value === true) {
    elem_bids.scrollIntoView({ block: "center" });
  }
});
</script>
<style lasng="scss">
.rr-intersectionable--invisible .rr-heavy-part {
  display: none;
}
</style>
