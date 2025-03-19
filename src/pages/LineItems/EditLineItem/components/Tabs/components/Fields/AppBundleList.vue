<script setup>
import ToggleField from './ToggleField.vue'

const props = defineProps({
  module: {
    type: String,
    required: true,
  },
})

const options = [
  { id: '0', name: 'Global_PX_Bundle_Blocklist', value: 'Global_PX_Bundle_Blocklist' },
  { id: '1', name: 'TTU CTV Block List', value: 'TTU CTV Block List' },
  {
    id: '2',
    name: 'PilotX_535_Approved_BundleIDList',
    value: 'PilotX_535_Approved_BundleIDList',
  },
  { id: '3', name: 'DiscoveryPlus_BundleBlockList', value: 'DiscoveryPlus_BundleBlockList' },
  { id: '4', name: 'Master_PX_Approved_BundleIDList', value: 'Master_PX_Approved_BundleIDList' },
  { id: '5', name: 'Max_BundleList', value: 'Max_BundleList' },
  { id: '6', name: 'Cochran CDJR App Blocklist', value: 'Cochran CDJR App Blocklist' },
  { id: '7', name: 'Cochran Ford App Blocklist', value: 'Cochran Ford App Blocklist' },
  { id: '8', name: 'LGKG App Blocklist', value: 'LGKG App Blocklist' },
  { id: '9', name: 'UC Entertainment App Blocklist', value: 'UC Entertainment App Blocklist' },
  {
    id: '10',
    name: 'Cochran_Pittsburgh_Bundle_Blocklist',
    value: 'Cochran_Pittsburgh_Bundle_Blocklist',
  },
  {
    id: '11',
    name: 'Cochran_Monroeville_Bundle_Blocklist',
    value: 'Cochran_Monroeville_Bundle_Blocklist',
  },
  { id: '12', name: 'Cochran_Sports_Bundle_List', value: 'Cochran_Sports_Bundle_List' },
  { id: '13', name: 'CBS News Bundle WL', value: 'CBS News Bundle WL' },
  { id: '14', name: 'Local_Pittsburgh_BundleIDs_WL', value: 'Local_Pittsburgh_BundleIDs_WL' },
  {
    id: '15',
    name: 'Miss_Utility_Targeted_App/Bundle_BL',
    value: 'Miss_Utility_Targeted_App/Bundle_BL',
  },
  {
    id: '16',
    name: 'Miss_Utility_GeoFence_App/Bundle_BL',
    value: 'Miss_Utility_GeoFence_App/Bundle_BL',
  },
  { id: '17', name: 'Pluto_BundleID_List', value: 'Pluto_BundleID_List' },
  { id: '18', name: 'App Bundle Block List', value: 'App Bundle Block List' },
  {
    id: '19',
    name: 'Cochran_PreRoll_Bundle_Block List',
    value: 'Cochran_PreRoll_Bundle_Block List',
  },
  { id: '20', name: 'WTAJ App Bundle List', value: 'WTAJ App Bundle List' },
  { id: '21', name: 'Cochran Block List', value: 'Cochran Block List' },
]

const block = {
  app_bundle_list: 'App Bundle List',
}

const modelValue = defineModel('modelValue', { type: Array, default: () => [] })
</script>

<template>
  <ToggleField
    v-model="modelValue"
    field-key="app_bundle_list"
    title="App Bundle List"
    :list="options"
    :fields="['search']"
    :module="props.module"
    :block="block"
  />
</template>
