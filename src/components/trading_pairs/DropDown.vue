<template>
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
import { onMounted, ref, watch } from "vue";
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
const current_pair: any = ref("BTCUSDT");

emitter.on("update-messages", (current_messages: string[], pair: string) => {
  current_pair.value = pair;
});

watch(current_pair, () => emitter.emit("choose-pair", current_pair.value));
onMounted(() => {
  emitter.emit("get-messages");
});
</script>
<style scoped lang="scss"></style>
