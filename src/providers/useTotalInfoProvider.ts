import { InjectionKey, reactive, ref, toRefs } from "vue";
import axios from "axios";
import { TotalInfo } from "../types/TotalInfo";
import { PreInfo } from "../types/PreInfo";

type State = { totalInfo: TotalInfo; infoOnEachPrefecture: Array<PreInfo> };

export const useTotalInfoProvider = () => {
  // state
  /**
   * 全国の情報.
   */
  const globalState = reactive<State>({
    /**
     * 全国の情報.
     */
    totalInfo: new TotalInfo(1, 1, 1, 1, 1, 1),
    /**
     * 各県の情報.
     */
    infoOnEachPrefecture: [],
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

    globalState.totalInfo = ref(
      new TotalInfo(
        Math.trunc((response.data.ncurrentpatients / totalSickBed.value) * 100),
        response.data.ncurrentpatients.toLocaleString(),
        totalSickBed.value.toLocaleString() as any,
        response.data.npatients.toLocaleString(),
        response.data.ndeaths.toLocaleString(),
        response.data.nexits.toLocaleString()
      )
    ).value;
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

  return { ...toRefs(globalState), setTotalInfo, setInfoOnEachPrefecture };
};

type storeType = ReturnType<typeof useTotalInfoProvider>;
export const totalInfoKey: InjectionKey<storeType> = Symbol("totalInfo");
