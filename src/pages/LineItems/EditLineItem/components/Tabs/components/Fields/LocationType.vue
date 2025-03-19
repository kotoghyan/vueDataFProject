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
  <ToggleField field-key="location_type" title="Location Type" :list="[]" :module="props.module" />
</template>
