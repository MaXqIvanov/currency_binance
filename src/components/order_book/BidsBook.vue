<template>
  <div>
    <div v-for="(bid, index) in keys_bids" :key="bid">
      <div class="row body__row" id="start_bid">
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
const props = defineProps({ keys_bids: Object, bids: Object });
const bigData = [
  {
    id: 1,
  },
  {
    id: 2,
  },
];
</script>
<style lasng="scss">
.rr-intersectionable--invisible .rr-heavy-part {
  display: none;
}
</style>
