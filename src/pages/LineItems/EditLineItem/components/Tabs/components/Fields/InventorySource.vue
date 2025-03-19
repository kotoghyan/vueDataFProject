<script setup>
import ToggleField from './ToggleField.vue'
import { computed, ref } from 'vue'
import { InventorySourcesAPI } from 'src/api'

const props = defineProps({
  module: {
    type: String,
    required: true,
  },
})

const modelValue = defineModel('modelValue', { type: Array, default: () => [] })

const isInventorySourcesLoading = ref(false)
const inventorySources = ref([])
const getInventorySources = async () => {
  isInventorySourcesLoading.value = true
  inventorySources.value = await InventorySourcesAPI.getAll()
  isInventorySourcesLoading.value = false
}
getInventorySources()

const options = computed(() =>
  inventorySources.value.map(({ name }) => ({ name, value: name, id: name }))
)
</script>

<template>
  <ToggleField
    v-model="modelValue"
    field-key="inventory_source"
    title="Inventory Source"
    :list="options"
    :loading="isInventorySourcesLoading"
    info="Exchange inventory source"
    :fields="['search']"
    :module="props.module"
  />
</template>
