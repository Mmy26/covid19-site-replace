<script setup lang="ts">
import { onMounted, ref } from "vue";
import Chart, { ChartItem } from "chart.js/auto";
onMounted(() => {
  const ctx = document.getElementById("myChart");
  const myChart = new Chart(ctx as ChartItem, {
    type: "bubble",
    data: {
      datasets: [
        {
          type: "bar",
          label: "Bar Dataset",
          data: [10, 20, 30, 40, 50],
        },
        {
          type: "line",
          label: "Line Dataset",
          data: [50, 50, 50, 50, 50],
        },
      ],
      labels: ["January", "February", "March", "April", "April"],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
});
</script>
<template>
  <p>テスト</p>
  <canvas id="myChart" width="400" height="400"></canvas>
</template>
<style scoped></style>

<!-- // BarChart.ts
<template>
  <Bar
    :chart-options="chartOptions"
    :chart-data="chartData"
    :chart-id="chartId"
    :dataset-id-key="datasetIdKey"
    :plugins="plugins"
    :css-classes="cssClasses"
    :styles="styles"
    :width="width"
    :height="height"
  />
</template>
<script lang="ts">
import { defineComponent, h, PropType } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PluginOptionsByType,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default defineComponent({
  name: "BarChart",
  components: { Bar },
  props: {
    chartId: {
      type: String,
      default: "bar-chart",
    },
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 400,
    },
    cssClasses: {
      default: "",
      type: String,
    },
    styles: {
      type: Object as PropType<Partial<CSSStyleDeclaration>>,
      default: () => {},
    },
    plugins: {
      type: Array as PropType<Plugin<"bar">[]>,
      default: () => [],
    },
  },
  setup(props) {
    const chartData = {
      labels: ["January", "February", "March", "a"],
      datasets: [{ data: [40, 20, 12, 20] }],
    };

    const chartOptions = { responsive: true };

    return () =>
      h(Bar, {
        chartData,
        chartOptions,
        chartId: props.chartId,
        width: props.width,
        height: props.height,
        cssClasses: props.cssClasses,
        styles: props.styles,
        plugins: props.plugins,
      });
  },
});
</script> -->
