<template>
  <div
    id="nav"
    class="lg:flex lg:flex-row justify-center items-center auto-cols-auto flex flex-col"
  >
    <table
      class="w-8/12 aspect-video border-collapse border-2 border-red-700 basis-1/2 m-7"
    >
      <thead>
        <tr>
          <th class="border-collapse border-2 border-red-700 lg:text-xs">
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
            <p class="text-xs">
              臨床工学技士 14,378人 / 人工呼吸器 28,197台 / ECMO 1,412台
              2020年2月回答 出典 一般社団法人 日本呼吸療法医学会 公益社団法人
              日本臨床工学技士会
            </p>
          </td>
        </tr>
      </tbody>
    </table>
    <p class="text-xs">
      新型コロナ対策病床数は「感染症指定医療機関の指定状況」の下記合計と仮定
      特定 一種 二種(感染) 二種(結核) 二種(一般/精神)
      「新型コロナウイルス対策病床数オープンデータ」を使用
      「新型コロナウイルス患者数オープンデータ」を使用(速報)
    </p>
    <div class="basis-1/2 w-8/12">
      <div class="flex bg-white col-auto">
        <button class="flex-1 text-white text-center bg-black px-4 py-2 m-2">
          {{ totalInfo.currentPatient }}/{{ totalInfo.totalSickBed }}
          (全国)現在患者数/対策病床数
        </button>
      </div>
      <div class="flex bg-white overflow-y-auto">
        <button
          v-for="preLocalInfo of preInfo"
          :key="preLocalInfo.id"
          class="flex-1 text-white text-center bg-black px-4 py-2 m-2"
          v-on:click="clickPreData(preLocalInfo.name)"
        >
          {{ preLocalInfo.name }}
          {{ preLocalInfo.currentAvarage }}%
          {{ preLocalInfo.currentPatient }}/{{ preLocalInfo.totalSickBed }}
        </button>
      </div>
    </div>

    <p class="text-xs">
      新型コロナウイルス感染症（国内事例） 現在患者数 / 対策病床数
      ※軽症者等は自宅療養など、病床を使用しないことがあります（詳細）
      （現在患者数 前日より増加 前日より減少） COVID-19
      日本の新型コロナウイルス概況
    </p>
    <canvas id="myChart" width="400" height="400"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, inject, reactive, ref } from "vue";
import Chart, { ChartItem } from "chart.js/auto";
import { totalInfoKey } from "../providers/useTotalInfoProvider";
import { TotalInfo } from "../types/TotalInfo";
import { PreInfo } from "../types/PreInfo";
import router from "../router/router";
import { AccInfo } from "../types/AccInfo";
import { MyChartData } from "../types/myChartData";
import Papa from "papaparse";
// storeの定義
const store = inject(totalInfoKey);
// 全国の最新データ
const totalInfo = ref(new TotalInfo(0, 0, 0, 0, 0, 0));
// 各県の最新データ
const preInfo = ref(new Array<PreInfo>());
// 累積データ
const accuInfo = ref<AccInfo[]>([]);
// myChartのデータ
let myChartData: { x: string; y: number }[] = [];
// myChart2のデータ
let myChartData2: { x: string; y: number }[] = [];
// chartのラベル
const myChartDate = ref<string[]>([]);

onMounted(async (): Promise<void> => {
  //storeのエラーを回避

  if (!store) {
    throw new Error("");
  }
  await store.setTotalInfo();
  store.setInfoOnEachPrefecture();
  await setAccuInfo("ALL");
  // console.log("戻った");

  totalInfo.value = store.totalInfo.value;
  // console.log(totalInfo.value);

  preInfo.value = store.infoOnEachPrefecture.value;
  accuInfo.value = store.accuInfo.value;
  // myChartData = store.myChartData.value;
  // myChartData2 = store.myChartData2.value;
  // console.log("myChartData.value", myChartData);
  // console.log("myChartData2.value", myChartData2);
  // グラフの日時
  for (let data of accuInfo.value) {
    myChartDate.value.push(data.date);
  }
  // setTimeout(() => {
  chart();
  // }, 5000);
});
/**
 * 各県へリンク.
 * @param data
 */
const clickPreData = (data: string) => {
  router.push(`/${data}`);
};
/**
 * stateにデータをセット.
 */
const dataSet = () => {
  if (!store) {
    throw new Error("");
  }
  store.setTotalInfo();
  store.setInfoOnEachPrefecture();
  setAccuInfo("ALL");
};

/**
 * 取得したデータをChartにセット.
 */
const chart = () => {
  const ctx = document.getElementById("myChart");
  new Chart(ctx as ChartItem, {
    type: "bubble",
    data: {
      datasets: [
        {
          type: "bar",
          label: "搬送困難事案",
          data: myChartData2,
          borderColor: "rgb(80,80,200)",
        },
        {
          type: "line",
          label: "入院を要する者",
          data: myChartData,
          borderColor: "rgb(80,80,200)",
        },
      ],
      labels: myChartDate.value,
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};
const setAccuInfo = async (name: string): Promise<void> => {
  // stateをリセット
  // globalState.myChartData = [];
  // globalState.myChartData2 = [];
  const url =
    "https://www.stopcovid19.jp/data/mhlw_go_jp/opendata/requiring_inpatient_care_etc_daily.csv";
  // 取得したデータ
  let preAccuInfo: AccInfo[] = [];
  // 取得した要入院者数をセット
  Papa.parse(url, {
    download: true,
    header: true,
    complete: function (results) {
      const res1: any = results.data;
      let id = 0;
      for (let area of res1) {
        id = id + 1;
        preAccuInfo.push(
          new AccInfo(
            id,
            area.Date,
            name,
            area[`(${name}) Requiring inpatient care`],
            0
          )
        );
      }
      // 取得したデータをChart.jsに沿う形に組み替え
      for (let data1 of preAccuInfo) {
        console.log("要入院発火");
        myChartData.push(
          new MyChartData(data1.date, data1.dischangedFromHospital)
        );
      }
    },
  });
  const url2 =
    "https://code4fukui.github.io/fdma_go_jp/emergencytransport_difficult_all.csv";
  Papa.parse(url2, {
    download: true,
    header: true,
    complete: function (results) {
      const res2: any = results.data;
      // 取得した搬送困難事案数をセット
      for (let r of res2) {
        const lastDay = String(r.終了日).replace("-0", "-");
        const lastDay2 = lastDay.replace("-0", "-");
        const lastDay3 = lastDay2.replace("-", "/");
        const lastDay4 = lastDay3.replace("-", "/");
        for (let d of preAccuInfo) {
          if (lastDay4 == d.date) {
            d.requiringInpatient = r.救急搬送困難事案数;
          }
        }
      }
      // 取得したデータをChart.jsに沿う形に組み替え
      for (let data2 of preAccuInfo) {
        console.log("搬送発火");
        if (data2.requiringInpatient > 0) {
          myChartData2.push(
            new MyChartData(data2.date, data2.requiringInpatient)
          );
        }
      }
      // console.log(globalState.myChartData2);
    },
  });
};
</script>
<style scoped></style>
