<template>
  <div class="table-responsive">
    <div class="table" @mouseenter="mouseOnTable" @mouseleave="mouseOutTable">
      <div class="head table__head">
        <div class="column head__column">
          Цена
          {{
            current_pair?.length >= 6
              ? `(${current_pair.split("")[3]}${current_pair.split("")[4]}${
                  current_pair.split("")[5]
                }${current_pair.length > 6 ? current_pair.split("")[6] : ""})`
              : ""
          }}
        </div>
        <div class="column head__column">
          Количество
          {{
            current_pair?.length >= 6
              ? `(${current_pair.split("")[0]}${current_pair.split("")[1]}${
                  current_pair.split("")[2]
                })`
              : ""
          }}
        </div>
        <div class="column head__column">Всего</div>
      </div>
      <div class="body table__body">
        <div v-for="(ask, index) in Object.keys(asks)" :key="ask + index">
          <div class="row body__row">
            <div class="column row__column" style="color: #ff3549">
              {{ Number(ask) * 1 }}
            </div>
            <div class="column row__column">{{ asks[ask] * 1 }}</div>
            <div class="column row__column">
              {{ (Number(ask) * asks[ask])?.toFixed(4) }}
            </div>
          </div>
        </div>
        <div v-for="(bid, index) in Object.keys(bids)" :key="bid + index">
          <div class="row body__row" id="start_bid">
            <div class="column row__column" style="color: #16c281">
              {{ Number(bid) * 1 }}
            </div>
            <div class="column row__column">{{ bids[bid] * 1 }}</div>
            <div class="column row__column">
              {{ (Number(bid) * bids[bid])?.toFixed(4) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- <div v-for="ask in asks" :key="ask">{{ ask }}</div> -->
</template>

<script lang="ts" setup>
import { inject, onMounted, onUnmounted, ref } from "vue";
import emitter from "tiny-emitter/instance";

const current_pair = ref("");
const socket: any = ref(null);
const isTable: any = ref(true);

const asks: any = ref([]);
const bids: any = ref([]);

const lastUpdateId: any = ref(null);
const exchangeEvent: any = ref(null);
const buffer: any = ref([]);

const getOrderBook: CallableFunction | undefined = inject("getOrderBook");
const subscribeOrderBook: CallableFunction | undefined =
  inject("subscribeOrderBook");

emitter.on("update-pair", async (pair: string) => {
  console.log(pair);
  current_pair.value = pair;

  if (subscribeOrderBook) {
    const response = await subscribeOrderBook(pair);
    console.log("Socket");
    if (socket.value) {
      socket.value.close();
      buffer.value = null;
    }
    socket.value = response;

    socket.value.onopen = async function (e: any) {
      if (getOrderBook) {
        const response = await getOrderBook(pair);

        const fullData = { ...response, asks: {}, bids: {} };

        response.data.asks.forEach((ask: any) => {
          fullData.asks[ask[0]] = ask[1];
        });
        response.data.bids.forEach((bid: any) => {
          fullData.bids[bid[0]] = bid[1];
        });
        fullData.asks = await getKeysSort(fullData.asks);
        fullData.bids = await getKeysSort(fullData.bids);
        asks.value = fullData.asks;
        bids.value = fullData.bids;
        lastUpdateId.value = response.data.lastUpdateId;
        setTimeout(function () {
          let obj = document.getElementById("start_bid");
          console.log(obj);
          if (obj) {
            obj.scrollIntoView({ block: "center" });
          }
        }, 100);
      }
    };

    socket.value.onmessage = function (event: any) {
      // console.log(JSON.parse(event.data));
      let response = JSON.parse(event.data);
      let asks_a = JSON.parse(JSON.stringify(asks.value));
      let bids_b = JSON.parse(JSON.stringify(bids.value));
      // console.log(lastUpdateId.value);
      // console.log(response.u);
      // console.log(response.U);

      if (lastUpdateId === null) {
        buffer.value.push(response);
      }
      // 5
      else if (
        exchangeEvent.value === null &&
        lastUpdateId.value + 1 >= response.U &&
        lastUpdateId.value + 1 <= response.u
      ) {
        if (buffer.value.length !== 0) {
          buffer.value = buffer.value.filter(
            (elem: any) => elem.u <= lastUpdateId
          );
        }
      }
      // 6
      else if (exchangeEvent.value.u + 1 === response.U) {
        console.log("Верно");
        response.a.forEach((element: any) => {
          if (Number(element[1]) === 0) {
            delete asks_a[element[0]];
          } else {
            if (asks_a[element[0]]) {
            }
            asks_a[element[0]] = element[1];
          }
        });

        response.b.forEach((element: any) => {
          if (Number(element[1]) === 0) delete bids_b[element[0]];
          else {
            if (bids_b[element[0]]) {
            }
            bids_b[element[0]] = element[1];
          }
        });
      }

      asks.value = getKeysSort(asks_a);
      bids.value = getKeysSort(bids_b);
      let obj = document.getElementById("start_bid");
      if (obj && isTable.value === true) {
        obj.scrollIntoView({ block: "center" });
      }
      exchangeEvent.value = response;
    };

    socket.value.onclose = function (event: any) {};
  }
});

function getKeysSort(obj: any) {
  const keys = Object.keys(obj);
  keys.sort((a: any, b: any) => {
    return -(a - b);
  });
  const res: any = {};
  keys.forEach((i) => (res[i] = obj[i]));
  return res;
}
const mouseOnTable = () => {
  isTable.value = false;
};
const mouseOutTable = () => {
  isTable.value = true;
};
onMounted(() => {
  emitter.emit("get-pair");
});
onUnmounted(() => {
  emitter.off("update-pair");
});
</script>
<style lang="scss"></style>
