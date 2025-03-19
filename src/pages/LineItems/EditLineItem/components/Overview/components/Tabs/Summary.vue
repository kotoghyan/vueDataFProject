<script setup>
import { inject, computed } from 'vue'
import Content from './components/Content.vue'
import { groupBy } from 'lodash-es'

const targetingValues = inject('targetingValues')

const fieldsTitle = {
  app_bundle_list: 'App Bundle List',
  deal: 'Deal',
  deal_id_list: 'Deal list',
  deal_list: 'Deal List',
  domain_list: 'Domain List',
  cat: 'Content Category',
  content_rating: 'Content Rating',
  language: 'Language',
  pos: 'Ad Position',
  ads_txt: 'Ads.txt (Web-only)',
  inventory_source: 'Inventory Source',
  auction_type: 'Auction Type',
  country: 'Country',
  region: 'Region / State',
  metro: 'Metro',
  city: 'City',
  lat_long_list: 'Lat. & Long. List',
  location_type: 'Location Type',
  zip_code: 'ZIP Code',
  zip_code_list: 'ZIP Code List',
  device_type: 'Device Type',
  ip_range: 'IP Range',
  ad_position_video: 'Ad Position',
  placement_type: 'Video Placement Type',
  lat: 'Latitude',
  long: 'Longitude',
  radius: 'Radius(miles)',
  time: 'Time',
}

const getFieldsValue = (fields) =>
  fields[0].key === 'time'
    ? 'Dayparting Enabled'
    : fields.map((item) => item.name ?? item.value).join(', ')
const fieldsData = computed(() =>
  Object.values(groupBy(targetingValues.value, 'key')).map((fields) => ({
    label: fieldsTitle[fields[0].key],
    value: getFieldsValue(fields),
  }))
)
const hasFieldsData = computed(() => fieldsData.value.length > 0)
</script>

<template>
  <Content v-if="hasFieldsData" :data="fieldsData" />
  <p v-else class="tw-text-center tw-font-medium">No fields are selected</p>
</template>
