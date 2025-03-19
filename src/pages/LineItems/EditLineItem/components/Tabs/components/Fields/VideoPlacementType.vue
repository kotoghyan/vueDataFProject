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
    name: 'In-Article',
    value: 'In-Article',
  },
  {
    id: '1',
    name: 'In-Banner',
    value: 'In-Banner',
  },
  {
    id: '2',
    name: 'In-Feed',
    value: 'In-Feed',
  },
  {
    id: '3',
    name: 'In-Stream',
    value: 'In-Stream',
  },
  {
    id: '4',
    name: 'Interstitial',
    value: 'Interstitial',
  },
]

const modelValue = defineModel('modelValue', { type: Array, default: () => [] })
</script>

<template>
  <ToggleField
    v-model="modelValue"
    field-key="placement_type"
    title="Video Placement Type"
    :list="options"
    :module="props.module"
  />
</template>
