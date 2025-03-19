<script setup>
import { useAttrs } from 'vue'
import { Doughnut, Line } from 'vue-chartjs'
import Chart from 'chart.js/auto'

defineProps({
  type: {
    type: String,
    required: true,
    validator(value) {
      return ['line', 'doughnut'].includes(value)
    },
  },
})
const attrs = useAttrs()

const components = {
  line: Line,
  doughnut: Doughnut,
}

Chart.defaults.font.family = 'Xolonium'
Chart.defaults.plugins.tooltip.backgroundColor = '#fff'
Chart.defaults.plugins.tooltip.titleColor = '#000'
Chart.defaults.plugins.tooltip.bodyColor = '#000'
</script>

<template>
  <component :is="components[type]" v-bind="attrs" />
</template>
