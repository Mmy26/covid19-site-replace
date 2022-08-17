<template>
  <div id="nav">
    <table class="border-collapse border-2 border-red-700">
      <thead>
        <tr>
          <th class="border-collapse border-2 border-red-700">
            現在患者数/対策病床数
          </th>
          <th class="border-collapse border-2 border-red-700">現在患者数</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="font-black bg-red-700 text-white">100%</td>
          <td class="font-black bg-red-700 text-white">1000人</td>
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
          <td class="font-black bg-red-700 text-white">100人</td>
          <td class="font-black bg-red-700 text-white">1000人</td>
        </tr>
      </tbody>
      <tbody>
        <tr>
          <td class="border-collapse border-2 border-red-700">
            対策病床数 115,400床
          </td>
          <td class="border-collapse border-2 border-red-700">
            PCR検査陽性者数 15,446,827人
          </td>
        </tr>
      </tbody>
      <tbody>
        <tr>
          <td
            class="col-span-2 text-center border-collapse border-1 border-red-700"
          >
            臨床工学技士 14,378人 / 人工呼吸器 28,197台 / ECMO 1,412台
            2020年2月回答 出典 一般社団法人 日本呼吸療法医学会 公益社団法人
            日本臨床工学技士会
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { onMounted } from "vue";
onMounted(() => {});
</script>
<style scoped></style>
