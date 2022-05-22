<template>
  <component
    :is="componentType"
    :chartData="chartData"
    :options="options"
    :width="224"
    :height="80"
    ref="chartRef"
  />
</template>

<script setup>
import { computed, ref } from 'vue'
import { BarChart, LineChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const chartRef = ref()

const props = defineProps({
  type: {
    type: String,
    default: 'bar',
  },
  data: {
    type: Array,
    default: () => [],
  },
  color: {
    type: Array,
    default: () => [],
  },
})

const componentType = computed(() =>
  props.type === 'line' ? LineChart : BarChart
)

const chartData = computed(() => ({
  labels: props.data.map((n, i) => {
    var d = new Date()
    d.setDate(d.getDate() - (props.data.length - 1 - i))
    return d.toLocaleDateString()
  }),
  datasets: [
    {
      data: props.data,
      backgroundColor: props.color,
      borderColor: props.color,
      order: 2,
    },
  ],
}))

const options = ref({
  lineAt: 0.04,
  responsive: true,
  plugins: {
    autocolors: false,
    legend: false,
    tooltip: {
      displayColors: false,
      callbacks: {
        label: (context) => context.parsed.y.toFixed(2) + ' HNT',
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
      borderRadius: '10px',
      backgroundColor: 'red',
    },
    point: {
      radius: 2,
    },
  },
})
</script>
