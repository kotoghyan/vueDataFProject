<script setup>
import { ref } from 'vue'
import { MetrosAPI } from 'src/api'
import ToggleField from './ToggleField.vue'

const props = defineProps({
  module: {
    type: String,
    required: true,
  },
})

const isMetrosLoading = ref(false)
const metros = ref([])
const getMetros = async () => {
  isMetrosLoading.value = true
  const data = await MetrosAPI.getAll()
  metros.value = data
  isMetrosLoading.value = false
}
getMetros()

const modelValue = defineModel('modelValue', { type: Array, default: () => [] })
</script>

<template>
  <ToggleField
    v-model="modelValue"
    field-key="metro"
    title="Metro"
    :list="metros"
    :loading="isMetrosLoading"
    :fields="['search']"
    info="Metro code of the user. Metro codes are similar but not exactly the same as Nielsen DMAs."
    :module="props.module"
  />
</template>
