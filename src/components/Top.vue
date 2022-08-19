<template>
  <div id="nav">
    <table class="border-collapse border-2 border-red-700">
      <thead>
        <tr>
          <th class="border-collapse border-2 border-red-700">
            現在患者数/対策病床数
          </th>
          <th class="border-collapse border-2 border-red-700">現在患者数</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="font-black bg-red-700 text-white">
            {{ totalInfo.currentAvarage }}%
          </td>
          <td class="font-black bg-red-700 text-white">
            {{ totalInfo.currentPatient }}人
          </td>
        </tr>
      </tbody>
      <thead>
        <tr>
          <th class="border-collapse border-2 border-red-700">累積退院者</th>
          <th class="border-collapse border-2 border-red-700">死亡者</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="font-black bg-red-700 text-white">
            {{ totalInfo.accumulationExits }}人
          </td>
          <td class="font-black bg-red-700 text-white">
            {{ totalInfo.accumulationDead }}人
          </td>
        </tr>
      </tbody>
      <tbody>
        <tr>
          <td class="border-collapse border-2 border-red-700">
            対策病床数 {{ totalInfo.totalSickBed }}床
          </td>
          <td class="border-collapse border-2 border-red-700">
            PCR検査陽性者数 {{ totalInfo.accumulationPatient }}人
          </td>
        </tr>
      </tbody>
      <tbody>
        <tr>
          <td
            class="col-span-2 text-center border-collapse border-1 border-red-700"
          >
            臨床工学技士 14,378人 / 人工呼吸器 28,197台 / ECMO 1,412台
            2020年2月回答 出典 一般社団法人 日本呼吸療法医学会 公益社団法人
            日本臨床工学技士会
          </td>
        </tr>
      </tbody>
    </table>

    <div class="flex bg-white">
      <button
        v-for="preLocalInfo of preInfo"
        :key="preLocalInfo.id"
        class="flex-1 text-white text-center bg-black px-4 py-2 m-2"
        v-on:click="clickPreData(preLocalInfo.name)"
      >
        {{ preLocalInfo.name }}
        {{ preLocalInfo.currentAvarage }}% {{ preLocalInfo.currentPatient }}/{{
          preLocalInfo.totalSickBed
        }}
      </button>
    </div>
    <canvas id="myChart" width="400" height="400"></canvas>
  </div>
</template>

<script setup lang="ts">
import { Chart } from "chart.js";
import { onMounted, inject, reactive, ref } from "vue";
import { totalInfoKey } from "../providers/useTotalInfoProvider";
import { TotalInfo } from "../types/TotalInfo";
import { PreInfo } from "../types/PreInfo";
import router from "../router/router";
const store = inject(totalInfoKey);

const totalInfo = ref(new TotalInfo(0, 0, 0, 0, 0, 0));
let preInfo = ref(new Array<PreInfo>());

const ctx = document.getElementById("myChart");

/**
 * 各県へリンク.
 * @param data
 */
const clickPreData = (data) => {
  router.push(`/${data}`);
};

onMounted(async () => {
  //storeのエラーを回避
  if (!store) {
    throw new Error("");
  }

  await store.setTotalInfo();
  totalInfo.value = store.totalInfo.value;
  await store.setInfoOnEachPrefecture();
  preInfo.value = store.infoOnEachPrefecture.value;
});
</script>
<style scoped></style>
