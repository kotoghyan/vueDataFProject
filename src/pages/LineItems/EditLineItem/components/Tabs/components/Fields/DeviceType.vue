<script setup>
import { ref, computed } from 'vue'
import ToggleField from './ToggleField.vue'
import { DeviceTypesAPI } from 'src/api'

const props = defineProps({
  module: {
    type: String,
    required: true,
  },
})

const modelValue = defineModel('modelValue', { type: Array, default: () => [] })

const isDeviceTypesLoading = ref(false)
const deviceTypes = ref([])
const getDeviceTypes = async () => {
  isDeviceTypesLoading.value = true
  try {
    deviceTypes.value = await DeviceTypesAPI.getAll()
  } catch (error) {}
  isDeviceTypesLoading.value = false
}
getDeviceTypes()

const options = computed(() =>
  deviceTypes.value.reduce(
    (acc, item) => [
      ...acc,
      ...Object.entries(item).map(([key, value]) => ({ id: key, name: value, value })),
    ],
    []
  )
)
</script>

<template>
  <ToggleField
    v-model="modelValue"
    field-key="device_type"
    title="Device Type"
    :list="options"
    info="Device type of the user (e.g. Mobile/Tablet, Desktop)"
    :loading="isDeviceTypesLoading"
    :fields="['search']"
    :module="props.module"
  />
</template>
