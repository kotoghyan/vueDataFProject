<script setup>
import ToggleField from './ToggleField.vue'

const props = defineProps({
  module: {
    type: String,
    required: true,
  },
})

const modelValue = defineModel('modelValue', { type: Array, default: () => [] })
</script>

<template>
  <ToggleField
    v-model="modelValue"
    textarea-key="zip_code"
    title="ZIP Code"
    :list="[]"
    info="ZIP code or postal code of the user. Must be 5 or more characters. Zips must be split by commas."
    :fields="['textarea']"
    :module="props.module"
  />
</template>
