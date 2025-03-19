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
    field-key="lat_long_list"
    title="Lat. & Long. List"
    :list="[]"
    :fields="['search']"
    :module="props.module"
  />
</template>
