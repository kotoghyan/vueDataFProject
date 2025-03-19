<script setup>
import ToggleField from './ToggleField.vue'

const props = defineProps({
  module: {
    type: String,
    required: true,
  },
})

const options = [
  {
    id: '0',
    name: 'Ads.txt file not scanned',
    value: 'Ads.txt file not scanned',
  },
  {
    id: '1',
    name: 'Authorized - Direct',
    value: 'Authorized - Direct',
  },
  {
    id: '2',
    name: 'Authorized - Reseller',
    value: 'Authorized - Reseller',
  },
  {
    id: '3',
    name: 'No Ads.txt file',
    value: 'No Ads.txt file',
  },
  {
    id: '4',
    name: 'No advertising allowed',
    value: 'No advertising allowed',
  },
  {
    id: '5',
    name: 'No domain',
    value: 'No domain',
  },
]

const modelValue = defineModel('modelValue', { type: Array, default: () => [] })
</script>

<template>
  <ToggleField
    v-model="modelValue"
    field-key="ads_txt"
    title="Ads.txt (Web-only)"
    :list="options"
    :module="props.module"
  />
</template>
