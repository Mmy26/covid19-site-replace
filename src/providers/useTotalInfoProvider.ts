import { InjectionKey, reactive, ref, toRefs } from "vue";
import axios from "axios";
import { TotalInfo } from "../types/TotalInfo";
import { PreInfo } from "../types/PreInfo";
import { AccInfo } from "../types/AccInfo";
import Papa from "papaparse";
import { MyChartData } from "../types/myChartData";

type State = {
  totalInfo: TotalInfo;
  infoOnEachPrefecture: Array<PreInfo>;
  accuInfo: Array<AccInfo>;
  myChartData: Array<MyChartData>;
  myChartData2: Array<MyChartData>;
};

export const useTotalInfoProvider = () => {
  // state
  const globalState = reactive<State>({
    // 全国の最新情報.
    totalInfo: new TotalInfo(1, 1, 1, 1, 1, 1),
    // 各県の最新情報.
    infoOnEachPrefecture: [],
    // 累入院者数と搬送困難件数情報.
    accuInfo: [],
    // 搬送困難件数をグラフにセット
    myChartData: [],
    // 要入院者数をグラフにセット
    myChartData2: [],
  });

  // acitions
  /**
   * APIから取得した全国の情報をstateにセットする.
   */
  const setTotalInfo = async (): Promise<void> => {
    const response = await axios.get(
      "https://www.stopcovid19.jp/data/covid19japan.json"
    );
    const response2 = await axios.get(
      "https://www.stopcovid19.jp/data/covid19japan_beds/latest.json"
    );
    // 全国病床数
    let totalSickBed = ref(0);
    for (let area of response2.data) {
      totalSickBed.value =
        Number(area.宿泊施設受入可能室数) +
        Number(area.入院患者受入確保病床) +
        totalSickBed.value;
    }

    globalState.totalInfo = new TotalInfo(
      Math.trunc((response.data.ncurrentpatients / totalSickBed.value) * 100),
      response.data.ncurrentpatients.toLocaleString(),
      totalSickBed.value.toLocaleString() as any,
      response.data.npatients.toLocaleString(),
      response.data.ndeaths.toLocaleString(),
      response.data.nexits.toLocaleString()
    );
  };
  /**
   * APIから取得した各県の情報をstateにセットする.
   */
  const setInfoOnEachPrefecture = async (): Promise<void> => {
    const responsePre = await axios.get(
      "https://www.stopcovid19.jp/data/covid19japan.json"
    );
    const responsePre2 = await axios.get(
      "https://www.stopcovid19.jp/data/covid19japan_beds/latest.json"
    );

    const id = ref(0);
    for (let preData of responsePre.data.area) {
      id.value = id.value + 1;
      globalState.infoOnEachPrefecture.push(
        new PreInfo(
          id.value,
          "",
          preData.name,
          0,
          preData.ncurrentpatients,
          0,
          preData.npatients,
          preData.ndeaths.toLocaleString(),
          preData.nexits.toLocaleString()
        )
      );
    }
    for (let areaData of globalState.infoOnEachPrefecture) {
      for (let sickBedData of responsePre2.data) {
        if (sickBedData.都道府県番号 == areaData.id) {
          areaData.currentAvarage = Math.trunc(
            (areaData.currentPatient /
              (Number(sickBedData.宿泊施設受入可能室数) +
                Number(sickBedData.入院患者受入確保病床))) *
              100
          );
          areaData.name = sickBedData.都道府県名;
          areaData.totalSickBed =
            Number(sickBedData.宿泊施設受入可能室数) +
            Number(sickBedData.入院患者受入確保病床);
        }
      }
    }
  };
  /**
   * APIから取得したChartの情報をstateにセットする.
   */
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
          globalState.myChartData.push(
            new MyChartData(data1.date, data1.dischangedFromHospital)
          );
        }
        console.log(globalState.myChartData);
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
        // stateにセット
        globalState.accuInfo = preAccuInfo;
        // 取得したデータをChart.jsに沿う形に組み替え
        for (let data2 of preAccuInfo) {
          console.log("搬送発火");
          if (data2.requiringInpatient > 0) {
            globalState.myChartData2.push(
              new MyChartData(data2.date, data2.requiringInpatient)
            );
          }
        }
        // console.log(globalState.myChartData2);
      },
    });
  };

  return {
    ...toRefs(globalState),
    setTotalInfo,
    setInfoOnEachPrefecture,
    setAccuInfo,
  };
};

type storeType = ReturnType<typeof useTotalInfoProvider>;
export const totalInfoKey: InjectionKey<storeType> = Symbol("totalInfo");
