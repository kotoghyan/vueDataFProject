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
    name: 'First-Price Auction',
    value: 'First-Price Auction',
  },
  {
    id: '1',
    name: 'Second-Price Auction',
    value: 'Second-Price Auction',
  },
  {
    id: '2',
    name: 'Header Bidding',
    value: 'Header Bidding',
  },
]

const modelValue = defineModel('modelValue', { type: Array, default: () => [] })
</script>

<template>
  <ToggleField
    v-model="modelValue"
    field-key="auction_type"
    title="Auction Type"
    :list="options"
    :module="props.module"
  />
</template>
