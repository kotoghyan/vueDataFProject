<script setup>
import { ref } from 'vue'
import { AdvertisersAPI, InventorySourcesAPI, DealTypesAPI, FirstPartyDealsAPI } from 'src/api'
import UButton from 'src/components/ui/UButton.vue'
import UInput from 'src/components/ui/UInput.vue'
import DateInput from 'src/components/shared/Inputs/DateInput.vue'
import USelect from 'src/components/ui/USelect.vue'
import UToggle from 'src/components/ui/UToggle.vue'

const fieldsValues = ref({})

const formats = [
  { label: 'All', value: null },
  { label: 'Banner', value: 0 },
  { label: 'Video', value: 1 },
  { label: 'CTV', value: 3 },
  { label: 'DOOH', value: 4 },
]

const currencies = [{ label: 'USD', value: 'USD' }]

const isInventorySourcesLoading = ref(false)
const inventorySources = ref([])
const getInventorySources = async () => {
  isInventorySourcesLoading.value = true
  inventorySources.value = await InventorySourcesAPI.getAll()
  isInventorySourcesLoading.value = false
}
getInventorySources()

const dealTypes = ref([])
const isDealTypesLoading = ref(false)
const getDealTypes = async () => {
  isDealTypesLoading.value = true
  dealTypes.value = await DealTypesAPI.getAll()
  isDealTypesLoading.value = false
}
getDealTypes()

const isAdvertisersLoading = ref(false)
const advertisers = ref([])
const getAdvertisers = async () => {
  isAdvertisersLoading.value = true
  advertisers.value = await AdvertisersAPI.getNames()
  isAdvertisersLoading.value = false
}
getAdvertisers()

const isSubmitting = ref(false)
const submit = async () => {
  isSubmitting.value = true
  try {
    await FirstPartyDealsAPI.create(fieldsValues.value)
  } catch (error) {
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <form @submit.prevent="submit">
    <div class="tw-mb-7.5 tw-flex tw-items-center tw-justify-between">
      <h1 class="page-title">New First Party Deal</h1>
      <div class="tw-flex tw-gap-2.5">
        <UButton :to="{ name: 'advertisers' }" icon="cross" variant="outlined">Cancel</UButton>
        <UButton type="submit" icon="add" variant="outlined">Create</UButton>
      </div>
    </div>
    <div class="tw-rounded-xl tw-bg-white tw-p-6">
      <div class="tw-grid tw-grid-cols-4 tw-gap-2.5">
        <UInput v-model="fieldsValues.deal_name" placeholder="Type Deal Name" required>
          <template #title>Deal Name</template>
        </UInput>
        <USelect
          v-model="fieldsValues.inventory_source"
          placeholder="Pick Inventory Source"
          :options="inventorySources"
          :loading="isInventorySourcesLoading"
          option-label="name"
          option-value="name"
          emit-value
          required
        >
          <template #title>Inventory Source</template>
        </USelect>
        <UInput v-model="fieldsValues.deal_id" placeholder="Type Deal ID" required>
          <template #title>Deal ID</template>
        </UInput>
        <USelect
          v-model="fieldsValues.advertiser_id"
          :options="advertisers"
          :loading="isAdvertisersLoading"
          option-label="name"
          option-value="id"
          placeholder="Select Advertiser"
          emit-value
        >
          <template #title>Advertiser</template>
        </USelect>
        <UInput v-model="fieldsValues.publisher" placeholder="Type Publisher">
          <template #title>Publisher</template>
        </UInput>
        <USelect
          v-model="fieldsValues.deal_type"
          :options="dealTypes"
          :loading="isDealTypesLoading"
          option-label="name"
          option-value="type"
          placeholder="Select Deal Type"
          info="Open Auction Deal (any buyer). Private Auction Deal (only specific buyers). Preferred Deal (price or other preferred priority). Guaranteed Deal (guaranteed impressions at fixed CPM)"
          emit-value
        >
          <template #title>Deal Type</template>
        </USelect>
        <USelect
          v-model="fieldsValues.deal_format"
          :options="formats"
          placeholder="Select Supported Formats"
          info="Deals of a given format can only be targeted by line items with matching type (for example, a 'Video' deal may only be targeted by a video line item). Once set, this field cannot be updated."
          emit-value
        >
          <template #title>Supported Formats</template>
        </USelect>
        <USelect
          v-model="fieldsValues.currency"
          :options="currencies"
          class="tw-row-start-3"
          placeholder="Select Currency"
          emit-value
        >
          <template #title>Currency</template>
        </USelect>
        <DateInput v-model="fieldsValues.start_date" class="tw-row-start-3">
          <template #title>Start Date</template>
        </DateInput>
        <DateInput v-model="fieldsValues.end_date" class="tw-row-start-3">
          <template #title>End Date</template>
        </DateInput>
        <UToggle v-model="fieldsValues.archived" class="tw-row-start-4 tw-w-max">Archived</UToggle>
      </div>
    </div>
  </form>
</template>
