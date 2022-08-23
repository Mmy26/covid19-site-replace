<script setup lang="ts">
import Papa from "papaparse";
import { onMounted, ref } from "vue";

const url =
  "https://www.stopcovid19.jp/data/mhlw_go_jp/opendata/requiring_inpatient_care_etc_daily.csv";

onMounted(() => {
  Papa.parse(url, {
    download: true,
    header: true,
    complete: function (results) {
      const data: any = results.data;
      console.log(data);
       console.log(data[0].Date);
      console.log(data[0]["(ALL) Requiring inpatient care"]);
    },
  });
});
</script>
<template>test</template>
<style scoped></style>
