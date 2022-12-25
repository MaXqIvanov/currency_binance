<template>
  <v-row align="center" class="d-flex justify-center">
    <v-col cols="12" sm="6" class="d-flex" style="flex-direction: column">
      <v-card
        class="flex-grow list__changes"
        :style="{ overflowY: messages.length > 10 ? 'scroll' : 'auto' }"
      >
        <v-list-item
          v-for="(message, index) in messages"
          :key="message + index"
        >
          <v-list-item-content class="list_item">
            {{ message }}
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="messages.length === 0">
          <v-list-item-content>
            <v-list-item-title class="list_item">Список пуст</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import emitter from "tiny-emitter/instance";
import { onMounted, ref, watch } from "vue";
let messages: any = ref([]);
emitter.on(
  "update-messages",
  (current_messages: string[], current_pair: string) => {
    console.log(current_pair);
    messages.value = [...current_messages];
  }
);
// watch(messages, () => {
//   console.log(messages.value);
// });
onMounted(() => {
  emitter.emit("get-messages");
});
</script>

<style scoped lang="scss">
.list_item {
  font-size: 1vw;

  @media (max-width: 1000px) {
    font-size: 2vh;
  }
}
</style>
