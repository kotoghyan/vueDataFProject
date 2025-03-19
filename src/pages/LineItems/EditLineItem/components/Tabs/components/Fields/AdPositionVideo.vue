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
    name: 'Pre-Roll',
    value: 'Pre-Roll',
  },
  {
    id: '1',
    name: 'Mid-Roll',
    value: 'Mid-Roll',
  },
  {
    id: '2',
    name: 'Post-Roll',
    value: 'Post-Roll',
  },
]

const modelValue = defineModel('modelValue', { type: Array, default: () => [] })
</script>

<template>
  <ToggleField
    v-model="modelValue"
    field-key="ad_position_video"
    title="Ad Position"
    :list="options"
    :module="props.module"
  />
</template>
