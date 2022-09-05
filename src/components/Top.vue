<script setup lang="ts">
import { inject, ref, onBeforeMount, onUnmounted } from "vue";
import Chart, { ChartItem } from "chart.js/auto";
import { totalInfoKey } from "../providers/useTotalInfoProvider";
import { TotalInfo } from "../types/TotalInfo";
import { PreInfo } from "../types/PreInfo";
import router from "../router";
import { MyChartData } from "../types/MyChartData";

// storeの定義
const store = inject(totalInfoKey);
// 全国の最新データ
const totalInfo: any = ref(new TotalInfo(0, 0, 0, 0, 0, 0, "", ""));
// 各県の最新データ
const preInfo = ref<PreInfo[]>([]);
// myChartのデータ
const myChartData = ref<MyChartData[]>([]);
// myChart2のデータ
const myChartData2 = ref<MyChartData[]>([]);
// chartのラベル
const myChartDate = ref<string[]>([]);

const chartFlag = ref(false);

onBeforeMount(async (): Promise<void> => {
  // リセット
  totalInfo.value = new TotalInfo(0, 0, 0, 0, 0, 0, "", "");

  //storeのエラーを回避
  if (!store) {
    throw new Error("");
  }
  await store.setTotalInfo();
  store.setInfoOnEachPrefecture();
  await store.setMyChartData("ALL");

  totalInfo.value = store.totalInfo.value;
  // console.log(totalInfo.value.totalSickBed);

  totalInfo.value.totalSickBed = store.totalInfo.value.totalSickBed;
  // console.log(store.totalInfo.value);

  totalInfo.value.currentPatient =
    store.totalInfo.value.currentPatient.toLocaleString();
  totalInfo.value.currentAvarage =
    store.totalInfo.value.currentAvarage.toLocaleString();

  preInfo.value.splice(0);
  preInfo.value = store.infoOnEachPrefecture.value;
  setTimeout(() => {
    chartFlag.value = true;
    chart();
  }, 500);
});
onUnmounted(() => {
  // console.log("離脱");
});

/**
 * 各県へリンク.
 * @param data
 */
const clickPreData = (data: string) => {
  router.push(`/${data}`);
};
/**
 * 取得したデータをChartにセット.
 */
const chart = () => {
  //storeのエラーを回避
  if (!store) {
    throw new Error("");
  }
  const ctx = document.getElementById("myChart") as ChartItem;
  // console.log("発火");

  if (!ctx) {
    throw new Error("");
  }

  const MyChart = new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
        {
          label: "搬送困難事案",
          data: [...store.chartHospitalData.value],
          backgroundColor: "rgb(250,0,50)",
          yAxisID: "yleft",
        },
        {
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
          position: "left",
          beginAtZero: true,
          min: 0,
          title: {
            display: true,
            text: "搬送困難事案",
          },
        },

        yright: {
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
  <div id="nav my-0 mx-auto">
    <div class="lg:flex lg:flex-row auto-cols-auto flex flex-col">
      <span class="lg:w-5/12">
        <!-- 全国の最新データテーブル -->
        <table
          class="w-10/12 aspect-video mx-auto border-collapse border-2 border-red-700 m-7"
        >
          <thead>
            <tr>
              <th
                class="border-collapse border-2 border-red-700 lg:text-xs h-7"
              >
                現在患者数/対策病床数
              </th>
              <th class="border-collapse border-2 border-red-700 h-7">
                現在患者数
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="bg-red-700 text-white text-3xl w-1/2">
                {{ totalInfo.currentAvarage }}
                <span class="text-xl">%</span>
              </td>
              <td class="text-3xl bg-red-700 text-white w-1/2">
                {{ totalInfo.currentPatient }}
                <span class="text-xl">人</span>
              </td>
            </tr>
          </tbody>
          <thead>
            <tr>
              <th class="border-collapse border-2 border-red-700 h-7">
                累積退院者
              </th>
              <th class="border-collapse border-2 border-red-700 h-7">
                死亡者
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-3xl bg-red-700 text-white">
                {{ totalInfo.accumulationExits }}
                <span class="text-xl">人</span>
              </td>
              <td class="text-3xl bg-red-700 text-white">
                {{ totalInfo.accumulationDead }}
                <span class="text-xl">人</span>
              </td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <td class="border-collapse border-2 border-red-700 h-2">
                対策病床数 {{ totalInfo.totalSickBed }}床
              </td>
              <td class="border-collapse border-2 border-red-700 h-2">
                PCR検査陽性者数 {{ totalInfo.accumulationPatient }}人
              </td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <td
                colspan="2"
                class="col-span-2 text-center border-collapse border-1 border-red-700"
              >
                <p class="text-xs">
                  臨床工学技士 14,378人 / 人工呼吸器 28,197台 / ECMO 1,412台
                  2020年2月回答 <br />出典
                  <a
                    href="https://ja-ces.or.jp/info-ce/%e4%ba%ba%e5%b7%a5%e5%91%bc%e5%90%b8%e5%99%a8%e3%81%8a%e3%82%88%e3%81%b3ecmo%e8%a3%85%e7%bd%ae%e3%81%ae%e5%8f%96%e6%89%b1%e5%8f%b0%e6%95%b0%e7%ad%89%e3%81%ab%e9%96%a2%e3%81%99%e3%82%8b%e7%b7%8a/"
                    >一般社団法人 日本呼吸療法医学会 公益社団法人
                    日本臨床工学技士会</a
                  >
                </p>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="w-10/12 mx-auto">
          <p class="text-xs">
            現在患者数 更新日: {{ totalInfo.updatePatientInfo }}
            <br />対策病床数 発表日: {{ totalInfo.updateHospitalInfo }}<br />
            新型コロナ対策病床数は「感染症指定医療機関の指定状況」の下記合計と仮定<br />
            <input type="checkbox" checked />特定
            <input type="checkbox" checked />一種
            <input type="checkbox" checked />二種(感染)<input type="checkbox" />
            二種(結核)<input type="checkbox" /> 二種(一般/精神)<br />
            <input
              type="checkbox"
              checked
            />「新型コロナウイルス対策病床数オープンデータ」を使用<br />
            <input
              type="checkbox"
            />「新型コロナウイルス患者数オープンデータ」を使用(速報)
          </p>
        </div>
        <!-- テーブル終わり -->
      </span>

      <div class="lg:w-7/12">
        <!-- 各所の最新データ -->
        <div class="bg-white col-auto grid grid-cols-7">
          <div
            class="flex-1 col-span-2 cursor-pointer text-white text-sm text-center bg-black px-4 py-2 m-2"
            v-on:click="clickPreData('全国')"
          >
            <p class="">
              {{ totalInfo.currentPatient }}/{{ totalInfo.totalSickBed }}<br />
              (全国)現在患者数/対策病床数
            </p>
          </div>
          <div
            v-for="preLocalInfo of preInfo"
            :key="preLocalInfo.id"
            v-on:click="clickPreData(preLocalInfo.name)"
          >
            <div
              class="cursor-pointer text-white text-center text-sm bg-black py-2 m-2"
            >
              <span class="text-xs font-black">
                {{ preLocalInfo.name }}<br />
                {{ preLocalInfo.currentAvarage }}%
              </span>
              <span v-if="preLocalInfo.dcurrentpatients > 0">
                <img
                  src="../assets/trendarrow01.svg"
                  alt="trender"
                  class="trender"
                />
              </span>
              <span v-if="preLocalInfo.dcurrentpatients < 0">
                <img
                  src="../assets/trendarrow03.svg"
                  alt="trender"
                  class="trender underTrend"
                /> </span
              ><br />
              <span class="text-xs font-black">
                {{ preLocalInfo.currentPatient }}</span
              ><span class="text-xs">/{{ preLocalInfo.totalSickBed }}</span>
            </div>
          </div>
        </div>

        <p class="text-xs">
          新型コロナウイルス感染症（国内事例） 現在患者数 / 対策病床数
          ※軽症者等は自宅療養など、病床を使用しないことがあります（詳細）
          （現在患者数
          <img src="../assets/trendarrow01.svg" alt="trender" class="trender" />
          前日より増加
          <img
            src="../assets/trendarrow03.svg"
            alt="trender"
            class="trender underTrend"
          />前日より減少）
        </p>
      </div>
    </div>
    <div class="flex justify-center">
      <a href="https://note.stopcovid19.jp/n/n0b078f2b3dce"
        ><img
          src="../assets/notestopcovid19-banner.png"
          alt="Logo"
          class="header__logo"
      /></a>
      <a href="https://tk3-805-12365.vw.sakura.ne.jp:3443/thanks"
        ><img src="../assets/mini-center.png" alt="Logo" class="header__logo"
      /></a>
      <a href="https://whowatch.tv/"
        ><img
          src="../assets/whowatch-banner.png"
          alt="Logo"
          class="header__logo"
      /></a>
    </div>

    <div class="w-10/12 mx-auto">
      <p class="">日本の新型コロナウイルス概況</p>
      <div
        v-if="!chartFlag"
        className="mx-auto animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"
      ></div>
      <div class="canvas-container">
        <canvas id="myChart"></canvas>
      </div>
    </div>
  </div>
</template>
<style scoped>
.header__logo {
  width: 30vw;
  object-fit: cover;
  max-width: 300px;
  margin: auto;
  max-height: 50px;
}
.trender {
  width: 10px;
  height: auto;
  display: inline-block;
}
.underTrend {
  transform: rotate(90deg);
}
.canvas-container {
  position: relative;
  width: calc(100% - 40px);
  height: 450px;
  overflow: hidden;
  margin: 20px;
}
</style>
