<script setup>
import { ref } from 'vue'
import { AdvertiserCategoriesAPI } from 'src/api'
import ToggleField from './ToggleField.vue'

const props = defineProps({
  module: {
    type: String,
    required: true,
  },
})

const isAdvertiserCategoriesLoading = ref(false)
const advertiserCategories = ref([])
const getAdvertiserCategories = async () => {
  isAdvertiserCategoriesLoading.value = true
  const data = await AdvertiserCategoriesAPI.getAll({ sort: { value: 'name', direction: 'asc' } })
  advertiserCategories.value = data
  isAdvertiserCategoriesLoading.value = false
}
getAdvertiserCategories()

const modelValue = defineModel('modelValue', { type: Array, default: () => [] })
</script>

<template>
  <ToggleField
    v-model="modelValue"
    field-key="cat"
    title="Content Category"
    :list="advertiserCategories"
    :loading="isAdvertiserCategoriesLoading"
    :fields="['search']"
    info="IAB content categories of the page. Note: Many exchanges do not or rarely send content categories. As a result, targeting content categories may severely constrain available inventory."
    :module="props.module"
  />
</template>
