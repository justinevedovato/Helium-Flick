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
import AnnotationPlugin from 'chartjs-plugin-annotation'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables, AnnotationPlugin)

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
    {
      label: 'average',
      data: -0.4,
      type: 'line',
      borderColor: '#FF312D',
      // fill: false,
      borderWidth: 1,
      order: 1,
    },
  ],
}))

const averageLine = {
  type: 'line',
  borderColor: 'green',
  borderWidth: 2,
  // label: {
  //   enabled: true,
  //   content: 0.4,
  //   position: 'end',
  // },
  scaleID: 'y',
  value: 0.4,
}

const options = ref({
  responsive: true,
  plugins: {
    autocolors: false,
    legend: { display: false },
    tooltip: {
      displayColors: false,
      callbacks: {
        label: (context) => context.parsed.y.toFixed(2) + ' HNT',
      },
    },
    // annotation: {
    //   annotations: {
    //     averageLine,
    //   },
    // },
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
