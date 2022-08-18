import { InjectionKey, reactive, ref, toRefs } from "vue";
import axios from "axios";
import { TotalInfo } from "../types/TotalInfo";

type State = { totalInfo: TotalInfo };

export const useTotalInfoProvider = () => {
  // state
  const globalState = reactive<State>({
    totalInfo: new TotalInfo(1, 1, 1, 1, 1),
  });
  // acitions
  const setTotalInfo = async (): Promise<void> => {
    const response = await axios.get(
      "https://www.stopcovid19.jp/data/covid19japan.json"
    );
    const response2 = await axios.get(
      "https://www.stopcovid19.jp/data/covid19japan_beds/latest.json"
    );
    let totalSickBed = ref(0);
    console.log(
      "病床数",
      Number(response2.data[0].宿泊施設受入可能室数) +
        Number(response2.data[0].入院患者受入確保病床)
    );
    for (let area of response2.data) {
      totalSickBed.value =
        Number(area.宿泊施設受入可能室数) +
        Number(area.入院患者受入確保病床) +
        totalSickBed.value;
    }
    console.log(totalSickBed.value);

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

  return { ...toRefs(globalState), setTotalInfo };
};

type storeType = ReturnType<typeof useTotalInfoProvider>;
export const totalInfoKey: InjectionKey<storeType> = Symbol("totalInfo");
