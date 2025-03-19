<script setup>
import { ref, computed } from 'vue'
import { CitiesAPI } from 'src/api'
import { BusService } from 'src/services'
import ToggleField from './ToggleField.vue'

const props = defineProps({
  module: {
    type: String,
    required: true,
  },
})

const isCitiesLoading = ref(false)
const cities = ref()
const citySearchValue = ref('')
const getCities = async () => {
  BusService.emit('cancelLineItemGetCities')
  isCitiesLoading.value = true
  try {
    const data = await CitiesAPI.getAll(
      { search: citySearchValue.value },
      { customCancelEvent: 'cancelLineItemGetCities' }
    )
    cities.value = data
  } catch (error) {}

  isCitiesLoading.value = false
}
const citySearchModel = computed({
  get() {
    return citySearchValue.value
  },
  set(val) {
    citySearchValue.value = val
    if (citySearchValue.value !== '') {
      getCities()
    } else {
      BusService.emit('cancelLineItemGetCities')
      cities.value = []
    }
  },
})

const modelValue = defineModel('modelValue', {
  type: Array,
  default: () => [],
})
</script>

<template>
  <ToggleField
    v-model="modelValue"
    v-model:search="citySearchModel"
    field-key="city"
    title="City"
    :list="cities"
    :loading="isCitiesLoading"
    :fields="['search']"
    info="City of the user: Since city names may be repeated, we recommend specifying the corresponding metro and region."
    :module="props.module"
  />
</template>
