<script setup>
import { ref } from 'vue'
import ToggleField from './ToggleField.vue'
import { AdPositionsAPI } from 'src/api'

const props = defineProps({
  module: {
    type: String,
    required: true,
  },
})

const isAdPositionsLoading = ref(false)
const adPositions = ref([])
const getAdPositions = async () => {
  isAdPositionsLoading.value = true
  const data = await AdPositionsAPI.getAll()
  adPositions.value = data
  isAdPositionsLoading.value = false
}
getAdPositions()

const modelValue = defineModel('modelValue', { type: Array, default: () => [] })
</script>

<template>
  <ToggleField
    v-model="modelValue"
    field-key="pos"
    title="Ad Position"
    :list="adPositions"
    :loading="isAdPositionsLoading"
    info="Position of the ad unit on the page. This is provided by the exchange and may not always be reliable."
    :module="props.module"
  />
</template>
