<script setup>
import { ref, computed } from 'vue'
import ToggleField from '../ToggleField.vue'
import { useApps } from './useApps'

const props = defineProps({
  module: {
    type: String,
    required: true,
  },
})

useApps()

const options = useApps()

const appsSearchValue = ref('')
const apps = ref()
const appsSearchModel = computed({
  get() {
    return appsSearchValue.value
  },
  set(val) {
    appsSearchValue.value = val
    if (appsSearchValue.value !== '') {
      apps.value = options.filter((option) => option.name.toLowerCase().includes(val.toLowerCase()))
    } else {
      apps.value = []
    }
  },
})

const modelValue = defineModel({ type: Array, default: () => [] })
</script>

<template>
  <ToggleField
    v-model="modelValue"
    v-model:search="appsSearchModel"
    field-key="apps"
    title="Apps"
    :list="apps"
    :fields="['search']"
    :module="props.module"
  />
</template>
