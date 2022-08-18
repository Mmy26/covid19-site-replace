import { InjectionKey, reactive, ref, toRefs } from "vue";
import axios from "axios";
import { TotalInfo } from "../types/TotalInfo";

type State = { totalInfo: TotalInfo };

export const useTotalInfoProvider = () => {
  // state
  const globalState = reactive<State>({ totalInfo: new TotalInfo(1, 1, 1, 1) });
  // acitions
  const setTotalInfo = async (): Promise<void> => {
    const response = await axios.get(
      "https://www.stopcovid19.jp/data/covid19japan.json"
    );
    console.log("患者", response.data.ncurrentpatients);
    globalState.totalInfo = ref(
      new TotalInfo(
        0,
        response.data.ncurrentpatients,
        response.data.npatients,
        response.data.ndeaths
      )
    ).value;
    console.log(
      "new TotalInfo",
      ref(
        new TotalInfo(
          0,
          response.data.ncurrentpatients,
          response.data.npatients,
          response.data.ndeaths
        )
      ).value
    );
    console.log("globalState.totalInfo", globalState.totalInfo);
  };

  return { ...toRefs(globalState), setTotalInfo };
};

type storeType = ReturnType<typeof useTotalInfoProvider>;
export const totalInfoKey: InjectionKey<storeType> = Symbol("totalInfo");
