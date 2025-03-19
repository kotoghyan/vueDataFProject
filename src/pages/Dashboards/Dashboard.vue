<script setup>
import UIcon from 'src/components/ui/UIcon.vue'
import UPopover from 'src/components/ui/UPopover.vue'
import Metric from 'src/components/shared/Metric.vue'
import UChart from 'src/components/ui/UChart.vue'
import Icon from 'components/ui/UIcon.vue'

const getRandomInteger = (min, max) => Math.floor(Math.random() * (max - min) + min)
const getRandomChartData = (length) => {
  const result = []
  for (let i = 0; i < length; i++) {
    result.push(getRandomInteger(0, 100))
  }
  return result
}
const primaryMetrics = [
  {
    name: 'Total Impressions',
    value: getRandomInteger(0, 10000000),
    dataType: 'int',
  },
  {
    name: 'Total Clicks',
    value: getRandomInteger(0, 10000000),
    dataType: 'int',
  },
  {
    name: 'Average CTR',
    value: getRandomInteger(0, 100) / 100,
    dataType: 'pcnt',
  },
  {
    name: 'Total Spend',
    value: getRandomInteger(0, 10000000),
    dataType: 'money',
  },
  {
    name: 'Active Campaigns',
    value: getRandomInteger(0, 100),
    dataType: 'int',
  },
  {
    name: 'Active Line Items',
    value: getRandomInteger(0, 10000),
    dataType: 'int',
  },
]
const highlightMetrics = [
  {
    name: "Yesterday's Spend",
    value: getRandomInteger(0, 10000),
    dataType: 'int',
  },
  {
    name: "Yesterday's Impressions",
    value: getRandomInteger(0, 100000),
    dataType: 'int',
  },
]
const trendingKpisChartData = {
  datasets: [
    {
      label: 'Cochran',
      data: getRandomChartData(5),
      backgroundColor: '#71D0FA',
      borderColor: '#71D0FA',
      pointRadius: 6,
      pointHoverRadius: 8,
      tension: 0.45,
    },
    {
      label: 'Cochran2',
      data: getRandomChartData(5),
      backgroundColor: '#4C5CE3',
      borderColor: '#4C5CE3',
      pointRadius: 6,
      pointHoverRadius: 8,
      tension: 0.45,
    },
  ],
  labels: ['Sept 23', 'Sept 24', 'Sept 25', 'Sept 26', 'Sept 27'],
}
const trendingKpisChartOptions = {
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
}

const impressionBreakdownsChartData = {
  labels: ['Cochran', 'Cochran1'],
  datasets: [
    {
      data: getRandomChartData(2),
      backgroundColor: ['#71D0FA', '#4C5CE3'],
      tension: 0.45,
    },
  ],
}
const impressionBreakdownsChartOptions = {
  cutout: '31.5789474%',
  plugins: {
    legend: {
      display: false,
    },
  },
}
</script>

<template>
  <h1 class="page-title tw-mb-7.5">Dashboard</h1>
  <div class="tw-flex tw-items-center tw-gap-10 tw-rounded-xl tw-bg-ultralight-primary tw-p-6">
    <UPopover>
      <template #default="{ shown }">
        <div
          class="tw-flex tw-cursor-pointer tw-items-center tw-gap-2.5 tw-font-medium tw-text-primary"
        >
          Day
          <UIcon
            class="tw-text-[1.5rem] tw-text-primary tw-transition-[transform]"
            :class="{ 'tw-rotate-180': shown }"
            name="angle-down"
          />
        </div>
      </template>
    </UPopover>
    <UPopover>
      <template #default="{ shown }">
        <div
          class="tw-flex tw-cursor-pointer tw-items-center tw-gap-2.5 tw-font-medium tw-text-primary"
        >
          View Level
          <UIcon
            class="tw-text-[1.5rem] tw-text-primary tw-transition-[transform]"
            :class="{ 'tw-rotate-180': shown }"
            name="angle-down"
          />
        </div>
      </template>
    </UPopover>
    <UPopover>
      <template #default="{ shown }">
        <div
          class="tw-flex tw-cursor-pointer tw-items-center tw-gap-2.5 tw-font-medium tw-text-primary"
        >
          Metric
          <UIcon
            class="tw-text-[1.5rem] tw-text-primary tw-transition-[transform]"
            :class="{ 'tw-rotate-180': shown }"
            name="angle-down"
          />
        </div>
      </template>
    </UPopover>
  </div>
  <div class="tw-mt-2.5 tw-grid tw-auto-rows-auto tw-grid-cols-2 tw-gap-2.5">
    <div class="tw-col-span-2 tw-grid tw-grid-cols-6 tw-gap-2.5">
      <Metric v-for="(metric, index) in primaryMetrics" :key="index" :data="metric" />
    </div>
    <div class="tw-relative tw-row-span-2 tw-rounded-xl tw-bg-white tw-p-6">
      <Icon
        name="ellipsis-vertical"
        class="tw-absolute tw-right-[0.5rem] tw-top-[0.75rem] tw-cursor-pointer tw-text-[1.5rem] tw-transition-[color] hover:tw-text-primary"
      />
      <p class="tw-text-lg tw-font-medium">Performance Dashboard - Trending KPIs</p>
      <div class="tw-mt-8 tw-h-[38.75rem]">
        <UChart type="line" :data="trendingKpisChartData" :options="trendingKpisChartOptions" />
      </div>
    </div>
    <div class="tw-rounded-xl tw-bg-white tw-p-6">
      <p class="tw-text-lg tw-font-medium">Yesterday's Highlights</p>
      <div class="tw-mt-5 tw-grid tw-grid-cols-2 tw-gap-2.5">
        <Metric
          v-for="(metric, index) in highlightMetrics"
          :key="index"
          :data="metric"
          variant="outlined"
        />
      </div>
    </div>
    <div class="tw-rounded-xl tw-bg-white tw-p-6">
      <p class="tw-text-lg tw-font-medium">Yesterday's Impression Breakdown</p>
      <div class="tw-mt-5 tw-flex tw-items-center tw-gap-[3.75rem]">
        <div class="tw-size-[23.75rem]">
          <UChart
            type="doughnut"
            :data="impressionBreakdownsChartData"
            :options="impressionBreakdownsChartOptions"
          />
        </div>
        <div class="tw-space-y-5">
          <div class="tw-flex tw-items-center tw-gap-2.5 tw-font-medium">
            <div class="tw-size-2.5 tw-rounded-full tw-bg-[#71D0FA]"></div>
            <p class="tw-text-dark-primary">Cochran:</p>
            <p>{{ impressionBreakdownsChartData.datasets[0].data[0] }}%</p>
          </div>
          <div class="tw-flex tw-items-center tw-gap-2.5">
            <div class="tw-size-2.5 tw-rounded-full tw-bg-[#4C5CE3]"></div>
            <p class="tw-text-dark-primary">Cochran:</p>
            <p>{{ impressionBreakdownsChartData.datasets[0].data[1] }}%</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
