import { InjectionKey, reactive } from "vue";
import axios from "axios";
import { TotalInfo } from "../types/TotalInfo";

type State = { totalInfo: TotalInfo };

export const useTotalInfo = () => {
  // state
  const globalState = reactive<State>({ totalInfo: new TotalInfo(0, 0, 0, 0) });
  // acitions
  const setTotalInfo = async (): Promise<void> => {
    const response = await axios.get(
      "https://www.stopcovid19.jp/data/covid19japan.json"
    );
    console.log(response);
    globalState.totalInfo = new TotalInfo(
      0,
      response.data.ncurrentpatients,
      response.data.npatients,
      response.data.ndeaths
    );
  };

  return {};
};

type storeType = ReturnType<typeof useTotalInfo>;
export const dataKey: InjectionKey<storeType> = Symbol("totalInfo");
