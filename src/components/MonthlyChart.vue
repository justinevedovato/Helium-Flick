<template>
  <BarChart
    :chartData="chartData"
    :options="options"
    :width="224"
    :height="80"
  />
</template>

<script setup>
import { computed, ref } from "vue"
import { BarChart } from "vue-chart-3"
import { Chart, registerables } from "chart.js"
Chart.register(...registerables)

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
})

const chartData = computed(() => ({
  labels: props.data.map((n, i) => {
    var d = new Date()
    d.setDate(d.getDate() - (props.data.length - 1 - i))
    return d.toLocaleDateString()
  }),
  datasets: [
    {
      data: props.data,
      backgroundColor: [
        "#396075",
        "#486f85",
        "#5f889e",
        "#6d93a8",
        "#91b0c2",
        "#b2c8d4",
        "#c1d4de",
      ],
    },
  ],
}))
const options = ref({
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      displayColors: false,
      callbacks: {
        label: (context) => context.parsed.y.toFixed(2) + " HNT",
      },
    },
  },
  scales: {
    xAxes: {
      display: false,
    },
    yAxes: {
      display: false,
    },
  },
  elements: {
    bar: {
      borderRadius: "10px",
      backgroundColor: "red",
    },
  },
})
</script>
