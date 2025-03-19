<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useReportCenterStore } from '../../../../store'
import Table from './components/Table.vue'

const { general } = storeToRefs(useReportCenterStore())

const tablesData = {
  top_app_sites: {
    columns: ['Top Sites/Apps'],
    rows: ['name'],
  },
  top_cities: {
    columns: ['Top Geo City Name', 'Clicks', 'Impressions', 'Ctr'],
    rows: [
      {
        key: 'name',
        dataType: 'str',
      },
      {
        key: 'clicks',
        dataType: 'int',
      },
      {
        key: 'impressions',
        dataType: 'int',
      },
      {
        key: 'ctr',
        dataType: 'pcnt',
      },
    ],
  },
  top_device_types: {
    columns: ['Device Type', 'Impressions'],
    rows: [
      {
        key: 'name',
        dataType: 'str',
      },
      {
        key: 'impressions',
        dataType: 'int',
      },
    ],
  },
  by_day_of_week: {
    columns: ['Date', 'Clicks', 'Impressions'],
    rows: [
      {
        key: 'name',
        dataType: 'str',
      },
      {
        key: 'clicks',
        dataType: 'int',
      },
      {
        key: 'impressions',
        dataType: 'int',
      },
    ],
  },
}
const tables = computed(() =>
  Object.entries(tablesData).reduce((acc, [key, { columns, rows: rowsKeys }]) => {
    const tableData = general.value[key]

    if (tableData.length === 0) {
      return acc
    }

    const rows = tableData.map((item) =>
      rowsKeys.map(({ key, dataType }) => ({ value: item[key], dataType }))
    )
    return [...acc, { columns, rows }]
  }, [])
)
const hasTables = computed(() => tables.value.length > 0)
</script>

<template>
  <div v-if="hasTables" class="tw-flex tw-items-start tw-gap-2">
    <Table v-for="(table, index) in tables" :key="index" :data="table" />
  </div>
</template>
