<template>
  <!-- <div @click="emitter.emit('choose-pair', { number: 1 })">drop_down</div> -->
  <v-row align="center" class="d-flex justify-center">
    <v-col class="d-flex" cols="12" sm="6">
      <v-select
        :items="dropDown"
        label="выберите пару"
        v-model="current_pair"
      ></v-select>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import emitter from "tiny-emitter/instance";
import { ref, watch } from "vue";
const dropDown = [
  {
    id: 1,
    title: "BTCUSDT",
  },
  {
    id: 2,
    title: "BNBBTC",
  },
  {
    id: 3,
    title: "ETHBTC",
  },
];
const current_pair = ref("BTCUSDT");

watch(current_pair, () => emitter.emit("choose-pair", current_pair.value));
// let data;
// emitter.emit("some-event", {});
// emitter.on("some-event", (evt: any) => {
//   console.log(evt);
//   data = evt.eventContent;
// });
</script>
<style scoped lang="scss"></style>
