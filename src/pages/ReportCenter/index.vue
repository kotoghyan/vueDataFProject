<script setup>
import UButton from 'src/components/ui/UButton.vue'
import General from './components/General/index.vue'
import Summary from './components/Summary/index.vue'
import TrendsChart from 'pages/ReportCenter/components/TrendsChart.vue'
</script>

<template>
  <div class="tw-mb-7.5 tw-flex tw-items-center tw-justify-between">
    <h1 class="page-title">Report Center</h1>
    <UButton>Export</UButton>
  </div>
  <div class="tw-space-y-6">
    <General />
    <TrendsChart />
    <Summary />
  </div>
</template>
