<script setup>
import { ref } from 'vue'
import { CountriesAPI } from 'src/api'
import ToggleField from './ToggleField.vue'

const props = defineProps({
  module: {
    type: String,
    required: true,
  },
})

const isCountriesLoading = ref(false)
const countries = ref([])
const getCountries = async () => {
  isCountriesLoading.value = true
  const data = await CountriesAPI.getAll()
  countries.value = data
  isCountriesLoading.value = false
}
getCountries()

const modelValue = defineModel('modelValue', { type: Array, default: () => [] })
</script>

<template>
  <ToggleField
    v-model="modelValue"
    field-key="country"
    title="Country"
    :list="countries"
    :loading="isCountriesLoading"
    :fields="['search']"
    :module="props.module"
  />
</template>
