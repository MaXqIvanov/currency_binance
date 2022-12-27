<template>
  <div class="table-responsive">
    <div class="table">
      <HeaderTable :current_pair="current_pair" />
      <div class="body table__body">
        <AsksBook :asks="asks" :keys_asks="keys_asks" />
        <BidsBook :bids="bids" :keys_bids="keys_bids" />
      </div>
    </div>
  </div>
  <div v-if="isLoader" class="loader"></div>
</template>

<script lang="ts" setup>
import { inject, onMounted, onUnmounted, ref, watch } from "vue";
import emitter from "tiny-emitter/instance";
import cloneDeep from "lodash/cloneDeep";
import AsksBook from "@/components/order_book/AsksBook.vue";
import BidsBook from "@/components/order_book/BidsBook.vue";
import HeaderTable from "@/components/order_book/HeaderTable.vue";
import { IAsks, IBids, IDataSocket } from "@/ts/types";

const current_pair = ref<string>("");
const socket: any = ref(null);
const isLoader = ref<boolean>(false);

const asks = ref<IAsks>({});
const keys_asks = ref<string[]>([]);
const bids = ref<IBids>({});
const keys_bids = ref<string[]>([]);

const lastUpdateId = ref<number | null>(null);
const exchangeEvent = ref<{ u: number } | null>(null);
const buffer = ref<IDataSocket[]>([]);

const getOrderBook: CallableFunction | undefined = inject("getOrderBook");
const subscribeOrderBook: CallableFunction | undefined =
  inject("subscribeOrderBook");

emitter.on("update-pair", async (pair: string) => {
  current_pair.value = pair;

  if (subscribeOrderBook) {
    const response = await subscribeOrderBook(pair);
    socket.value = response;

    socket.value.onopen = async function () {
      if (getOrderBook) {
        isLoader.value = true;
        const response = await getOrderBook(pair);
        isLoader.value = false;
        const fullData = { ...response, asks: {}, bids: {} };

        response.data.asks.forEach((ask: string[]) => {
          fullData.asks[ask[0]] = ask[1];
        });
        response.data.bids.forEach((bid: string[]) => {
          fullData.bids[bid[0]] = bid[1];
        });
        fullData.asks = await getKeysSort(fullData.asks, 2);
        fullData.bids = await getKeysSort(fullData.bids, 1);
        asks.value = fullData.asks;
        bids.value = fullData.bids;
        lastUpdateId.value = response.data.lastUpdateId;
        console.log("lastUpdateId");
        setTimeout(function () {
          let elem_bid = document.getElementById("start_bid");
          if (elem_bid) {
            elem_bid.scrollIntoView({ block: "center" });
          }
        }, 100);
      }
    };

    socket.value.onmessage = function (event: { data: string }) {
      let response: IDataSocket = JSON.parse(event.data);
      let asks_a: IAsks = cloneDeep(asks.value);
      let bids_b: IBids = cloneDeep(bids.value);
      console.log("message");
      if (
        buffer.value.length > 0 &&
        lastUpdateId.value &&
        lastUpdateId.value + 1 >= response.U &&
        lastUpdateId.value + 1 <= response.u
      ) {
        console.log("buffer");
        console.log(buffer.value);
        buffer.value.forEach((element: any) => {
          if (lastUpdateId.value && element.u <= lastUpdateId.value) {
            if (Number(element[1]) === 0) {
              delete asks_a[element[0]];
            } else {
              if (asks_a[element[0]]) {
              }
              asks_a[element[0]] = element[1];
            }
          }
        });
        buffer.value = [];
      }
      if (lastUpdateId.value === null) {
        buffer.value.push(response);
      } else if (
        exchangeEvent.value &&
        exchangeEvent.value?.u + 1 === response.U
      ) {
        response.a.forEach((element: string) => {
          if (Number(element[1]) === 0) {
            delete asks_a[element[0]];
          } else {
            if (asks_a[element[0]]) {
              emitter.emit(
                "diff_value",
                `diff: Спрос: Валюта:${current_pair.value.split("")[3]}${
                  current_pair.value.split("")[4]
                }${current_pair.value.split("")[5]}${
                  current_pair.value.length > 6
                    ? current_pair.value.split("")[6]
                    : ""
                } цена [${element[0]}] было кол-во [${
                  asks_a[element[0]]
                } стало [${element[1]}]`
              );
            }
            asks_a[element[0]] = Number(element[1]);
          }
        });

        response.b.forEach((element: string) => {
          if (Number(element[1]) === 0) delete bids_b[element[0]];
          else {
            if (bids_b[element[0]]) {
              emitter.emit(
                "diff_value",
                `diff: Предложение: Валюта:${current_pair.value.split("")[3]}${
                  current_pair.value.split("")[4]
                }${current_pair.value.split("")[5]}${
                  current_pair.value.length > 6
                    ? current_pair.value.split("")[6]
                    : ""
                }/${current_pair.value.split("")[0]}${
                  current_pair.value.split("")[1]
                }${current_pair.value.split("")[2]} цена [${
                  element[0]
                }] было кол-во [${bids_b[element[0]]} стало [${element[1]}]`
              );
            }
            bids_b[element[0]] = Number(element[1]);
          }
        });
      }

      asks.value = getKeysSort(asks_a, 2);
      bids.value = getKeysSort(bids_b, 1);
      // let elem_bids = document.getElementById("start_bid");
      // let elem_asks = document.getElementsByClassName("asks_book");
      // if (elem_bids && isTable.value === true) {
      //   elem_bids.scrollIntoView({ block: "center" });
      // }
      exchangeEvent.value = response;
    };

    socket.value.onclose = function () {};
  }
});

function getKeysSort(obj: IAsks | IBids, type: number) {
  let keys: string[] = Object.keys(obj);
  keys.sort((a: string, b: string) => {
    return -(Number(a) - Number(b));
  });
  const res: IAsks | IBids = {};
  if (keys.length > 500) {
    if (type === 1) {
      keys = keys.slice(0, 500);
    } else {
      let length = keys.length - 500 > 0 ? keys.length - 500 : 0;
      keys = keys.slice(length, keys.length);
    }
  }
  if (type === 1) {
    keys_bids.value = keys;
  } else {
    keys_asks.value = keys;
  }
  keys.forEach((i) => (res[i] = obj[i]));
  return res;
}
onMounted(() => {
  emitter.emit("get-pair");
});
onUnmounted(() => {
  emitter.off("update-pair");
  socket.value.close();
  buffer.value = [];
});
</script>
<style lang="scss"></style>
