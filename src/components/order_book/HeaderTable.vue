<template>
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
</template>

<script setup lang="ts">
const props = defineProps({ current_pair: String });
</script>

<style scoped></style>
