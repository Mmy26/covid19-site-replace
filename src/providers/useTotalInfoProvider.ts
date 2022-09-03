import { InjectionKey, reactive, ref, toRefs } from "vue";
import axios from "axios";
import { TotalInfo } from "../types/TotalInfo";
import { PreInfo } from "../types/PreInfo";
import { AccInfo } from "../types/AccInfo";
import Papa from "papaparse";
import { MyChartData } from "../types/MyChartData";
import { EcmoData } from "../types/Ecmo";

type State = {
  totalInfo: TotalInfo;
  infoOnEachPrefecture: Array<PreInfo>;
  chartHospitalData: Array<MyChartData>;
  chartPatientsData: Array<MyChartData>;
  chartDeadData: Array<MyChartData>;
  myChartDate: Array<string>;
  ecmoData: Array<EcmoData>;
};

export const useTotalInfoProvider = () => {
  // state
  const globalState = reactive<State>({
    // 全国の最新情報.
    totalInfo: new TotalInfo(1, 1, 1, 1, 1, 1, "", ""),
    // 各県の最新情報.
    infoOnEachPrefecture: [],
    // 搬送困難件数をグラフにセット
    chartHospitalData: [],
    // 要入院者数をグラフにセット
    chartPatientsData: [],
    // 各県の累計死者数
    chartDeadData: [],
    // グラフの日付
    myChartDate: [],
    // ECMOなどの情報.
    ecmoData: [],
  });

  // acitions
  /**
   * APIから取得した全国の情報をstateにセットする.
   */
  const setTotalInfo = async (): Promise<void> => {
    // stateをリセット
    globalState.totalInfo = new TotalInfo(0, 0, 0, 0, 0, 0, "", "");
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
    // console.log(totalSickBed.value);

    globalState.totalInfo = new TotalInfo(
      Math.trunc((response.data.ncurrentpatients / totalSickBed.value) * 100),
      response.data.ncurrentpatients,
      totalSickBed.value.toLocaleString() as any,
      response.data.npatients.toLocaleString(),
      response.data.ndeaths.toLocaleString(),
      response.data.nexits.toLocaleString(),
      response.data.lastUpdate,
      response2.data[0].更新日
    );
    // console.log("globalState.totalInfo", globalState.totalInfo);
  };
  /**
   * APIから取得した各県の情報をstateにセットする.
   */
  const setInfoOnEachPrefecture = async (): Promise<void> => {
    globalState.infoOnEachPrefecture.splice(0);
    const responsePre = await axios.get(
      "https://www.stopcovid19.jp/data/covid19japan.json"
    );
    const responsePre2 = await axios.get(
      "https://www.stopcovid19.jp/data/covid19japan_beds/latest.json"
    );
    const responsePre3 = await axios.get(
      "https://www.stopcovid19.jp/data/covid19japan-trend.json"
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
          0,
          0,
          preData.npatients,
          preData.ndeaths.toLocaleString(),
          preData.nexits.toLocaleString(),
          0
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
          areaData.宿泊施設 = sickBedData.宿泊施設受入可能室数;
          areaData.医療機関 = sickBedData.入院患者受入確保病床;
          areaData.name = sickBedData.都道府県名;
          areaData.totalSickBed =
            Number(sickBedData.宿泊施設受入可能室数) +
            Number(sickBedData.入院患者受入確保病床);
        }
      }
    }
    for (let areaData2 of globalState.infoOnEachPrefecture) {
      for (let dcurrentpatients of responsePre3.data) {
        if (dcurrentpatients.name === areaData2.nameEng) {
          areaData2.dcurrentpatients = dcurrentpatients.dcurrentpatients;
        }
      }
    }
  };
  /**
   * APIから取得したChartの情報をstateにセットする.
   */
  const setMyChartData = async (name: string): Promise<void> => {
    // stateをリセット
    globalState.chartHospitalData.splice(0);
    globalState.chartPatientsData.splice(0);
    globalState.myChartDate.splice(0);
    globalState.chartDeadData.splice(0);
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
        // console.log(res1);
        res1.map((data1) => {
          if (data1.Date) {
            globalState.chartPatientsData.push(
              new MyChartData(
                data1.Date,
                data1[`(${name}) Requiring inpatient care`]
              )
            );
            globalState.myChartDate.push(data1.Date);
          } else {
            // console.log(data1);
          }
        });
      },
    });
    const url2 =
      "https://code4fukui.github.io/fdma_go_jp/emergencytransport_difficult_all.csv";
    Papa.parse(url2, {
      download: true,
      header: true,
      complete: function (results) {
        const res2: any = results.data;
        res2.map((data2) => {
          if (data2.終了日) {
            const lastDay = String(data2.終了日).replace("-0", "-");
            const lastDay2 = lastDay.replace("-0", "-");
            const lastDay3 = lastDay2.replace("-", "/");
            const lastDay4 = lastDay3.replace("-", "/");
            if (
              !lastDay4.includes("2020/4") &&
              !lastDay4.includes("2020/5/3")
            ) {
              globalState.chartHospitalData.push(
                new MyChartData(lastDay4, data2.救急搬送困難事案数)
              );
            }
          } else {
            // console.log(data2);
          }
        });
        // console.log(globalState.chartPatientsData);
      },
    });
    //     // 取得した搬送困難事案数をセット
    //     for (let r of res2) {
    //       const lastDay = String(r.終了日).replace("-0", "-");
    //       const lastDay2 = lastDay.replace("-0", "-");
    //       const lastDay3 = lastDay2.replace("-", "/");
    //       const lastDay4 = lastDay3.replace("-", "/");
    //       for (let d of preAccuInfo) {
    //         if (lastDay4 == d.date) {
    //           d.requiringInpatient = r.救急搬送困難事案数;
    //         }
    //       }
    //     }
    //     // stateにセット
    //     globalState.accuInfo = preAccuInfo;
    //     // 取得したデータをChart.jsに沿う形に組み替え
    //     for (let data2 of preAccuInfo) {
    //       console.log("搬送発火");
    //       if (data2.requiringInpatient > 0) {
    //         globalState.myChartData2.push(
    //           new MyChartData(data2.date, data2.requiringInpatient)
    //         );
    //       }
    //     }

    if (name !== "ALL") {
      // console.log(name);
      const url3 = `https://www.stopcovid19.jp/data/covid19japan/pref/${name}.csv`;
      Papa.parse(url3, {
        download: true,
        header: true,
        complete: function (results) {
          const res3: any = results.data;
          res3.map((data3) => {
            if (data3) {
              const lastDay = String(data3.date).replace("-0", "-");
              const lastDay2 = lastDay.replace("-0", "-");
              const lastDay3 = lastDay2.replace("-", "/");
              const lastDay4 = lastDay3.replace("-", "/");
              if (
                !lastDay4.includes("2020/3") &&
                !lastDay4.includes("2020/4") &&
                !lastDay4.includes("2020/5/1") &&
                !lastDay4.includes("2020/5/2") &&
                !lastDay4.includes("2020/5/3") &&
                !lastDay4.includes("2020/5/4") &&
                !lastDay4.includes("2020/5/5") &&
                !lastDay4.includes("2020/5/6") &&
                !lastDay4.includes("2020/5/7") &&
                !lastDay4.includes("2020/5/8")
              ) {
                globalState.chartDeadData.push(
                  new MyChartData(lastDay4, data3.ndeaths)
                );
              }
            } else {
              console.log(data3);
            }
          });
          // console.log(globalState.chartDeadData);
        },
      });
    }
  };
  const setEcmoData = () => {
    globalState.ecmoData.splice(0);
    const url = `https://www.stopcovid19.jp/data/ventilator-20200306.csv?1661997061518`;
    Papa.parse(url, {
      download: true,
      header: true,
      complete: function (results) {
        const res: any = results.data;

        let id = -1;
        res.map((result) => {
          id = id + 1;
          let data: EcmoData = new EcmoData(
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            ""
          );
          data.id = id;
          data.ECMO装置取扱 = result["ECMO装置取扱（台）"];
          data.ECMO装置待機 = result["ECMO装置待機（台）"];
          data.マスク専用人工呼吸器取扱 =
            result["マスク専用人工呼吸器取扱（台）"];
          data.マスク専用人工呼吸器待機 =
            result["マスク専用人工呼吸器待機（台）"];
          data.人工呼吸器取扱うち小児 = result["人工呼吸器取扱うち小児（台）"];
          data.人工呼吸器取扱 = result["人工呼吸器取扱（台）"];
          data.人工呼吸器待機 = result["人工呼吸器待機（台）"];
          data.回答数 = result["回答数（施設）"];
          data.特定感染症指定医療機関 =
            result["特定感染症指定医療機関（施設）"];
          data.第一種感染症指定医療機関 =
            result["第一種感染症指定医療機関（施設）"];
          data.第二種感染症指定医療機関 =
            result["第二種感染症指定医療機関（施設）"];
          data.総CE = result["総CE（名）"];
          data.総病床 = result["総病床（床）"];
          data.都道府県 = result["都道府県"];
          globalState.ecmoData.push(data);
        });
      },
    });
  };

  return {
    ...toRefs(globalState),
    setTotalInfo,
    setInfoOnEachPrefecture,
    setMyChartData,
    setEcmoData,
  };
};

type storeType = ReturnType<typeof useTotalInfoProvider>;
export const totalInfoKey: InjectionKey<storeType> = Symbol("totalInfo");
