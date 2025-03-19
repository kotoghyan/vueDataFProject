<script setup>
import ToggleField from './ToggleField.vue'

const props = defineProps({
  module: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <ToggleField
    field-key="zip_code_list"
    title="ZIP Code List"
    :list="[]"
    :fields="['search']"
    :module="props.module"
  />
</template>
