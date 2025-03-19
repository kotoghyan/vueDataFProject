<script setup>
import { ref } from 'vue'
import { RegionsAPI } from 'src/api'
import ToggleField from './ToggleField.vue'

const props = defineProps({
  module: {
    type: String,
    required: true,
  },
})

const isRegionsLoading = ref(false)
const regions = ref([])
const getRegions = async () => {
  isRegionsLoading.value = true
  const data = await RegionsAPI.getAll()
  regions.value = data
  isRegionsLoading.value = false
}
getRegions()

const modelValue = defineModel('modelValue', { type: Array, default: () => [] })
</script>

<template>
  <ToggleField
    v-model="modelValue"
    field-key="region"
    title="Region / State"
    :list="regions"
    :loading="isRegionsLoading"
    :fields="['search']"
    info="Region of the user. Includes states in the U.S. and regions internationally."
    :module="props.module"
  />
</template>
