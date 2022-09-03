<script setup lang="ts">
import { provide } from "vue";
import {
  totalInfoKey,
  useTotalInfoProvider,
} from "./providers/useTotalInfoProvider";
//基本的にはルートコンポーネントでprovideをかく。
//親コンポーネントで必要。第一引数はkey, 第二引数はStore。
provide(totalInfoKey, useTotalInfoProvider());
</script>

<template>
  <div>
    <slot />
  </div>
</template>

<style scoped></style>
