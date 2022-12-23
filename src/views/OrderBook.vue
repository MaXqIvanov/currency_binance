<template>
  <div class="table-responsive">
    <div class="table">
      <div class="head table__head">
        <div class="column head__column">
          Цена
          {{
            current_pair?.length >= 6
              ? `(${current_pair.split("")[0]}${current_pair.split("")[1]}${
                  current_pair.split("")[2]
                })`
              : ""
          }}
        </div>
        <div class="column head__column">
          Количество
          {{
            current_pair?.length >= 6
              ? `(${current_pair.split("")[3]}${current_pair.split("")[4]}${
                  current_pair.split("")[5]
                }${current_pair.length > 6 ? current_pair.split("")[6] : ""})`
              : ""
          }}
        </div>
        <div class="column head__column">Всего</div>
      </div>
      <div class="body table__body">
        <div v-for="ask in asks" class="row body__row" :key="ask">
          <div class="column row__column">{{ 5 }}</div>
          <div class="column row__column">43</div>
          <div class="column row__column">22</div>
        </div>
      </div>
      <div class="separate_line"></div>
      <div class="separate_line"></div>
    </div>
  </div>

  <!-- <div v-for="ask in asks" :key="ask">{{ ask }}</div> -->
</template>

<script lang="ts" setup>
import { inject, onMounted, onUnmounted, ref } from "vue";
import emitter from "tiny-emitter/instance";

const current_pair = ref("");
const socket: any = ref(null);
const asks: any = ref([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
]);
const bids: any = ref([]);
const getOrderBook: CallableFunction | undefined = inject("getOrderBook");
const subscribeOrderBook: CallableFunction | undefined =
  inject("subscribeOrderBook");

emitter.on("update-pair", async (pair: string) => {
  console.log(pair);
  current_pair.value = pair;
  if (getOrderBook) {
    const response = await getOrderBook(pair);
    asks.value = response.data.asks;
  }
  if (subscribeOrderBook) {
    const response = await subscribeOrderBook(pair);
    console.log("Socket");
    socket.value = response;

    socket.value.onopen = function (e: any) {};

    socket.value.onmessage = function (event: any) {
      console.log(JSON.parse(event.data));
      let response = JSON.parse(event.data);
      asks.value = response;
      console.log(response);
      // console.log(`[message] Данные получены с сервера: ${event.data}`);
    };

    socket.value.onclose = function (event: any) {
      if (event.wasClean) {
        console.log(
          `[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`
        );
      } else {
        console.log("[close] Соединение прервано");
      }
    };

    socket.value.onerror = function (error: any) {
      console.log(error);
    };
  }
});

onMounted(() => {
  emitter.emit("get-pair");
});
onUnmounted(() => {
  emitter.off("update-pair");
  socket.value.close();
});
</script>
<style lang="scss"></style>
