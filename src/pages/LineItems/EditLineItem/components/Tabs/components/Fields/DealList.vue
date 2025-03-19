<script setup>
import { ref, computed } from 'vue'
import { ListsAPI } from 'src/api'
import { BusService } from 'src/services'
import ToggleField from './ToggleField.vue'

const props = defineProps({
  module: {
    type: String,
    required: true,
  },
})

const modelValue = defineModel('modelValue', { type: Array, default: () => [] })

const searchValue = ref('')

const isListsLoading = ref(false)
const lists = ref([])
const getLists = async () => {
  BusService.emit('cancelDealIDListGetAll')

  isListsLoading.value = true
  try {
    const params = {
      types: ['deal_id'],
      search: searchValue.value,
    }
    const { data } = await ListsAPI.getAll(params, { customCancelEvent: 'cancelDealIDListGetAll' })
    lists.value = data
  } catch (error) {}
  isListsLoading.value = false
}
getLists()

const options = computed(() =>
  lists.value.map((item) => ({
    ...item,
    value: item.id,
  }))
)
</script>

<template>
  <ToggleField
    v-model="modelValue"
    field-key="deal_id_list"
    title="Deal list"
    :list="options"
    :loading="isListsLoading"
    :fields="['search']"
    :module="props.module"
  />
</template>
