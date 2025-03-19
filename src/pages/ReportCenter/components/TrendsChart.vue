<script setup>
import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import moment from 'moment'
import DateInput from 'components/shared/Inputs/DateInput.vue'
import UChart from 'components/ui/UChart.vue'
import { useReportCenterStore } from 'pages/ReportCenter/store'
import { hexToRGB } from 'src/utils'
import { ReportCenterAPI } from 'src/api'
import { BusService } from 'src/services'
import UIcon from 'components/ui/UIcon.vue'

const { isGeneralLoading, general, settings, hasGeneral } = storeToRefs(useReportCenterStore())

settings.value.date_from = moment().startOf('month').format('YYYY-MM-DD')
settings.value.date_to = moment().endOf('month').format('YYYY-MM-DD')

const getGeneral = async () => {
  BusService.emit('cancelReportCenterGetGeneral')
  isGeneralLoading.value = true
  try {
    const type = settings.value.option.type
    const optionValue = settings.value.option.value
    const params = {}
    switch (type) {
      case 'campaign':
        params.campaign_id = optionValue
        break
      case 'line_item':
        params.line_item_id = optionValue
        break
      case 'type':
        params.type = optionValue
        params.advertiser_id = settings.value.advertiser_id
        params.date_from = settings.value.date_from
        params.date_to = settings.value.date_to
    }
    general.value = await ReportCenterAPI.getGeneral(params, {
      customCancelEvent: 'cancelReportCenterGetGeneral',
    })
  } catch (error) {}
  isGeneralLoading.value = false
}
watch(() => [settings.value.option, settings.value.date_from, settings.value.date_to], getGeneral, {
  deep: true,
})

const isDateInputsVisible = computed(() => settings.value.option?.type === 'type')

const chartItems = [
  {
    key: 'spend',
    label: 'Spend',
    color: '#0570BA',
    dataType: 'money',
  },
  {
    key: 'impressions',
    label: 'Impressions',
    color: '#2A8B03',
    dataType: 'int',
  },
]
const chartData = computed(() => {
  const resultKeys = Object.keys(general.value.kpi_trends)
  const resultValues = Object.values(general.value.kpi_trends)
  return {
    datasets: chartItems.map(({ key, label, color, dataType }) => ({
      label,
      dataType,
      data: resultValues.map((value) => value[key]),
      borderColor: color,
      fill: true,
      backgroundColor({ chart }) {
        const { ctx, chartArea } = chart

        if (!chartArea) {
          return
        }

        const gradient = ctx.createLinearGradient(0, 0, 0, chartArea.height)
        gradient.addColorStop(0, hexToRGB(color, 0.4))
        gradient.addColorStop(1, hexToRGB(color, 0))
        return gradient
      },
      pointBackgroundColor: color,
      yAxisID: key,
    })),
    labels: resultKeys.map((value) => moment(value).format('M/D')),
  }
})
const chartOptions = {
  responsive: true,
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
    ...chartItems.reduce((acc, item, index) => {
      acc[item.key] = {
        axis: 'y',
        display: false,
      }
      if (index === 0) {
        acc[item.key].display = true
        acc[item.key].ticks = {
          display: false,
          suggestedMin: 0,
          suggestedMax: 200,
        }
      }
      return acc
    }, {}),
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label(tooltipItem) {
          const { dataType } = tooltipItem.dataset
          let value = tooltipItem.raw.toLocaleString('en')

          if (dataType === 'money') {
            value = `$${value}`
          }

          return value
        },
      },
    },
  },
  tension: 0.4,
}
</script>

<template>
  <div v-if="isGeneralLoading || hasGeneral" class="tw-rounded-xl tw-bg-white tw-p-6">
    <div class="tw-flex tw-justify-between tw-gap-4">
      <h2 class="tw-text-lg tw-font-medium">KPI Trends</h2>
      <div v-if="isDateInputsVisible" class="tw-flex tw-gap-4">
        <DateInput v-model="settings.date_from">
          <template #title>Start Date</template>
        </DateInput>
        <DateInput v-model="settings.date_to">
          <template #title>End Date</template>
        </DateInput>
      </div>
    </div>
    <div v-if="isGeneralLoading" class="tw-flex tw-justify-center">
      <UIcon name="spinner" class="tw-animate-spin tw-text-[3rem] tw-text-primary" />
    </div>
    <div v-else-if="hasGeneral" class="tw-mt-6">
      <div class="tw-flex tw-items-center tw-gap-5">
        <div v-for="item in chartItems" :key="item.key" class="tw-flex tw-items-center tw-gap-2.5">
          <div
            class="tw-size-2.5 tw-rounded-full"
            :style="{
              backgroundColor: item.color,
            }"
          ></div>
          {{ item.label }}
        </div>
      </div>
      <div class="tw-mt-4 tw-h-[22.5rem] tw-w-full">
        <UChart type="line" :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>
