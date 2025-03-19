<script setup>
import { ref } from 'vue'
import { LanguagesAPI } from 'src/api'
import ToggleField from './ToggleField.vue'

const props = defineProps({
  module: {
    type: String,
    required: true,
  },
})

const isLanguagesLoading = ref(false)
const languages = ref([])
const getLanguages = async () => {
  isLanguagesLoading.value = true
  const data = await LanguagesAPI.getAll()
  languages.value = data
  isLanguagesLoading.value = false
}
getLanguages()

const modelValue = defineModel('modelValue', { type: Array, default: () => [] })
</script>

<template>
  <ToggleField
    v-model="modelValue"
    field-key="language"
    title="Language"
    :list="languages"
    :loading="isLanguagesLoading"
    :fields="['search']"
    info="Language of the page content"
    :module="props.module"
  />
</template>
