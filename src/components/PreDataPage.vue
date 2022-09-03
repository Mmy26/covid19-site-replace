<script setup lang="ts">
import { onMounted, ref, inject } from "vue";
import Chart, { ChartItem } from "chart.js/auto";
import { totalInfoKey } from "../providers/useTotalInfoProvider";
import { TotalInfo } from "../types/TotalInfo";
import { PreInfo } from "../types/PreInfo";
import { EcmoData } from "../types/Ecmo";
import { useRoute } from "vue-router";
import router from "../router";
import { AccInfo } from "../types/AccInfo";
import { MyChartData } from "../types/MyChartData";

// storeの定義
const store = inject(totalInfoKey);
// 全国の最新データ
const totalInfo = ref(new TotalInfo(0, 0, 0, 0, 0, 0, "", ""));
// 各県の最新データ
const preInfo = ref(new Array<PreInfo>());
// 累積データ
const accuInfo = ref<AccInfo[]>([]);
// 各県のstoreのデータ
const preDataInfo = ref<PreInfo>(
  new PreInfo(0, "", "", 0, 0, 0, 0, 0, 0, 0, 0, 0)
);
// storeのECMOなどのデータ
const ecmoData = ref<EcmoData[]>([]);
// paramsから県名を取得
const route = useRoute();
// params名(エリア名)
const itemName = route.params.id;

const preInfoCurrentAverage = ref(0);

const マスク専用含む人工呼吸器取扱 = ref(0);
const 臨床工学技士 = ref(0);
const ECMO装置取扱 = ref(0);

// myChartのデータ
const myChartData2 = ref<MyChartData[]>([]);
// myChart2のデータ
const myChartData3 = ref<MyChartData[]>([]);
// グラフの日時
const myChartDate = ref<string[]>([]);

const chartFlag = ref(false);

onMounted(async (): Promise<void> => {
  // storeにデータをセット
  if (!store) {
    throw new Error("");
  }
  store.setEcmoData();
  // await store.setAccuInfo(preDataInfo.value.nameEng);
  await store.setTotalInfo();
  await store.setInfoOnEachPrefecture();

  totalInfo.value = store.totalInfo.value;
  preInfo.value = store.infoOnEachPrefecture.value;
  ecmoData.value = store.ecmoData.value;
  // console.log(ecmoData.value);

  ecmoData.value.map((ecmo) => {
    if (itemName === ecmo.都道府県) {
      マスク専用含む人工呼吸器取扱.value =
        Number(ecmo.人工呼吸器取扱) + Number(ecmo.マスク専用人工呼吸器取扱);
      臨床工学技士.value = ecmo.総CE;
      ECMO装置取扱.value = ecmo.ECMO装置取扱;
    }
  });
  const itemId = ref(0);

  for (let pre of preInfo.value) {
    if (itemName === pre.name) {
      itemId.value = pre.id;
    }
  }
  // 円グラフ
  const ctx = document.getElementById("myChart");
  // 円グラフのデータ
  const myChartData = new Array<number>();
  if (itemName !== "全国") {
    preDataInfo.value = preInfo.value[itemId.value - 1];
    await store.setMyChartData(preDataInfo.value.nameEng);
  } else {
    preDataInfo.value.name = "全国";
    preDataInfo.value.nameEng = "All";
    preDataInfo.value.currentAvarage = totalInfo.value.currentAvarage;
    preDataInfo.value.currentPatient = totalInfo.value.currentPatient;
    preDataInfo.value.accumulationPatient = totalInfo.value.accumulationPatient;
    preDataInfo.value.accumulationDead = totalInfo.value.accumulationDead;
    preDataInfo.value.accumulationExits = totalInfo.value.accumulationExits;
    preDataInfo.value.dcurrentpatients = 0;
    preDataInfo.value.totalSickBed = totalInfo.value.totalSickBed;
  }

  myChartData.push(preDataInfo.value.currentPatient);

  preInfoCurrentAverage.value = preDataInfo.value.currentAvarage;
  // 予備病床数
  let remainingSickBed =
    preDataInfo.value.totalSickBed - preDataInfo.value.currentPatient;
  if (remainingSickBed > 0) {
    myChartData.push(remainingSickBed);
  }
  let myChart = new Chart(ctx as ChartItem, {
    type: "bubble",

    data: {
      datasets: [
        {
          type: "doughnut",
          data: myChartData,
          label: "現在患者数",
          backgroundColor: "rgb(230,0,0)",
        },
      ],
      labels: [
        `現在患者数(${preDataInfo.value.currentPatient})`,
        `想定病床残数(${remainingSickBed})`,
      ],
    },
    options: {},
  });
  setTimeout(() => {
    createLineGraph();
    chartFlag.value = true;
  }, 500);
});
/**
 * トップページへ遷移.
 */
const toTopPage = () => {
  router.push("/");
};
const createLineGraph = () => {
  // storeにデータをセット
  if (!store) {
    throw new Error("");
  }
  const ctx2 = document.getElementById("myChart2") as ChartItem;
  // console.log("発火");
  if (!ctx2) {
    throw new Error("");
  }
  new Chart(ctx2, {
    type: "bubble",
    data: {
      datasets: [
        {
          type: "line",
          label: "累計死亡者数",
          data: [...store.chartDeadData.value],
          borderColor: "rgb(0,0,0)",
          yAxisID: "yleft",
        },
        {
          type: "line",
          label: "入院を要する者",
          data: [...store.chartPatientsData.value],
          borderColor: "rgb(80,80,200)",
          yAxisID: "yright",
        },
      ],
      labels: [...store.myChartDate.value],
    },
    options: {
      scales: {
        yleft: {
          type: "linear",
          position: "left",
          beginAtZero: true,
          min: 0,
          title: {
            display: true,
            text: "累計死者数",
          },
        },

        yright: {
          type: "linear",
          position: "right",
          beginAtZero: true,
          min: 0,
          title: {
            display: true,
            text: "入院を要する者",
          },
        },
      },
    },
  });
};
</script>
<template>
  <main class="w-10/12 max-w-xl my-0 mx-auto">
    <p class="text-2xl">
      {{ itemName }} 現在患者数/対策病床数 {{ preInfoCurrentAverage }}%
    </p>
    <canvas id="myChart" width="400" height="400"></canvas>
    <p class="text-xl">
      累積陽性者: {{ preDataInfo.accumulationPatient.toLocaleString() }}人
      累積退院者: {{ preDataInfo.accumulationExits }}人 <br />
      累積死者:
      {{ preDataInfo.accumulationDead.toLocaleString() }}人 対策病床数:
      {{ preDataInfo.totalSickBed.toLocaleString() }}床
    </p>
    <p class="text-xs">
      現在患者数 出典: 厚生労働省 新型コロナウイルス感染症
      各都道府県の検査陽性者の状況(更新日:
      {{ totalInfo.updatePatientInfo }})<br />
      一般社団法人 日本耳鼻咽喉科学会定義におけるハイリスク地域（現在患者数
      {{ preDataInfo.currentPatient }}名 >= 10名）<br />
      対策病床数 医療機関{{ preDataInfo.医療機関 }}床+宿泊施設{{
        preDataInfo.宿泊施設
      }}室 出典: 新型コロナウイルス対策病床数オープンデータ(発表日:
      {{ totalInfo.updateHospitalInfo }})
    </p>
    <p class="text-xs">
      (参考) 臨床工学技士:{{ 臨床工学技士 }}人 マスク専用含む人工呼吸器取扱:
      {{ マスク専用含む人工呼吸器取扱 }}台 ECMO装置取扱:{{ ECMO装置取扱 }}台
      <br />
      2020年2月回答 出典: 一般社団法人 日本呼吸療法医学会 公益社団法人
      日本臨床工学技士会
    </p>
    <div v-if="itemName !== '全国'" class="mx-auto">
      <div
        v-if="!chartFlag"
        className="mx-auto animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"
      ></div>
      <canvas id="myChart2" width="400" height="300"></canvas>
    </div>
    <div class="mx-auto">
      <button
        @click="toTopPage"
        class="bg-gray-400 hover:bg-glay-700 font-bold py-2 px-4 rounded m-2 h-10"
      >
        閉じる
      </button>
    </div>
  </main>
</template>
<style scoped></style>
