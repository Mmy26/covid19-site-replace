<script setup lang="ts">
import { onMounted, ref, inject } from "vue";
import Chart, { ChartItem } from "chart.js/auto";
import { totalInfoKey } from "../providers/useTotalInfoProvider";
import { TotalInfo } from "../types/TotalInfo";
import { PreInfo } from "../types/PreInfo";
import { useRoute } from "vue-router";

// storeの定義
const store = inject(totalInfoKey);

// 全国の最新データ
const totalInfo = ref(new TotalInfo(0, 0, 0, 0, 0, 0));
// 各県の最新データ
const preInfo = ref(new Array<PreInfo>());

// paramsから県名を取得
const route = useRoute();
const itemName = route.params.id;

const preInfoCurrentAverage = ref(0);
onMounted(async () => {
  //storeのエラーを回避
  if (!store) {
    throw new Error("");
  }

  console.log(itemName);

  await store.setTotalInfo();
  totalInfo.value = store.totalInfo.value;
  await store.setInfoOnEachPrefecture();
  preInfo.value = store.infoOnEachPrefecture.value;

  const itemId = ref(0);

  for (let pre of preInfo.value) {
    if (itemName === pre.name) {
      itemId.value = pre.id;
    }
  }
  console.log(itemId.value);

  // 円グラフ
  const ctx = document.getElementById("myChart");
  // 円グラフのデータ
  const myChartData = new Array<number>();
  preInfoCurrentAverage.value = preInfo.value[itemId.value - 1].currentAvarage;
  myChartData.push(preInfo.value[itemId.value - 1].currentPatient);
  // 予備病床数
  let remainingSickBed =
    preInfo.value[itemId.value - 1].totalSickBed -
    preInfo.value[itemId.value - 1].currentPatient;
  myChartData.push(remainingSickBed);
  let myChart = new Chart(ctx as ChartItem, {
    type: "bubble",
    data: {
      datasets: [
        {
          type: "doughnut",
          label: "現在患者数",
          data: myChartData,
        },
      ],
      labels: ["January"],
    },
    options: {
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  });
  console.log(preInfo.value[itemId.value - 1]);

  // 線グラフ
  const ctx2 = document.getElementById("myChart2");
  const myChart2 = new Chart(ctx2 as ChartItem, {
    type: "bubble",
    data: {
      datasets: [
        {
          type: "bar",
          label: "Bar Dataset",
          data: [10, 20, 30, 40, 50],
        },
        {
          type: "line",
          label: "Line Dataset",
          data: [50, 50, 50, 50, 50],
        },
      ],
      labels: ["January", "February", "March", "April", "April"],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
});
</script>
<template>
  <p>{{ itemName }} 現在患者数/対策病床数 {{ preInfoCurrentAverage }}%</p>
  <canvas id="myChart" width="400" height="400"></canvas>
  <canvas id="myChart2" width="400" height="400"></canvas>
</template>
<style scoped></style>
