<script setup>
import { ref, computed, inject } from 'vue'
import { FirstPartyDealsAPI } from 'src/api'
import ToggleField from './ToggleField.vue'
import { BusService } from 'src/services'

const props = defineProps({
  module: {
    type: String,
    required: true,
  },
})

const modelValue = defineModel('modelValue', { type: Array, default: () => [] })

const searchValue = ref('')
const searchModel = computed({
  get() {
    return searchValue.value
  },
  set(val) {
    searchValue.value = val
    getDeals()
  },
})

const lineItem = inject('lineItem')
const isListsLoading = ref(false)
const list = ref([])
const getDeals = async () => {
  BusService.emit('cancelLineItemGetDeals')
  isListsLoading.value = true
  try {
    const data = await FirstPartyDealsAPI.getAll(
      {
        advertiser_id: lineItem.value.advertiser_id,
        deal_format: lineItem.value.type,
        search: searchValue.value,
      },
      { customCancelEvent: 'cancelLineItemGetDeals' }
    )
    list.value = data
  } catch (error) {}
  isListsLoading.value = false
}
getDeals()

const options = computed(() =>
  list.value.map((item) => ({
    ...item,
    name: item.deal_name,
    value: item.deal_id,
  }))
)
</script>

<template>
  <ToggleField
    v-model="modelValue"
    v-model:search="searchModel"
    field-key="first_party_deal_id"
    textarea-key="deal_id"
    title="Deal"
    :list="options"
    :loading="isListsLoading"
    info="Unique identifier for the direct deal on an exchange. Deal IDs are only unique per exchange, so you must prepend the exchange abbreviation before the Deal ID. For example, to target Deal ID 'deal12345' on Google’s AdX, you should input 'adx/deal12345'."
    :fields="['search', 'textarea']"
    :module="props.module"
    default-field="textarea"
  />
</template>
