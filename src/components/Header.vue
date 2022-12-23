<template>
  <div class="header">
    <v-toolbar dark prominent>
      <v-toolbar-title>Currency Binance</v-toolbar-title>
      <v-spacer class="spacer"></v-spacer>
      <div v-for="item in items" :key="item.id" class="header__menu__desktop">
        <v-btn @click="navHeader(item.navigate)"> {{ item.title }} </v-btn>
      </div>
      <div class="header__menu__mobile">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </div>
    </v-toolbar>
    <v-navigation-drawer v-model="drawer" absolute bottom temporary>
      <v-list nav dense>
        <v-list-item-group active-class="deep-purple--text text--accent-12">
          <v-list-item
            v-for="item in items"
            :key="item.id"
            @click="navHeader(item.navigate)"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts" setup>
import router from "@/router";
import { ref } from "vue";
const drawer = ref(false);
const items = [
  {
    id: 1,
    title: "Order Book",
    navigate: "/",
  },
  {
    id: 2,
    title: "Trading Pairs",
    navigate: "/trading_pairs",
  },
];
const navHeader = (navigate: string) => {
  drawer.value = false;
  router.push(navigate);
};
</script>
<style lang="scss" scoped>
.spacer {
  @media (max-width: 600px) {
    display: none;
  }
}
.header__menu__desktop {
  display: none;
  @media (min-width: 601px) {
    display: block;
  }
}
.header__menu__mobile {
  display: none;
  @media (max-width: 600px) {
    display: block;
  }
}
</style>
