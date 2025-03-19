<script setup>
import { ref, computed, watch } from 'vue'
import { AdvertisersAPI, CampaignsAPI, LineItemsAPI } from 'src/api'
import { BusService } from 'src/services'
import USelect from 'src/components/ui/USelect.vue'
import AccountField from 'pages/ReportCenter/components/General/components/AccountField.vue'
import { storeToRefs } from 'pinia'
import { useReportCenterStore } from 'pages/ReportCenter/store'

const fieldsOptions = {
  type: [
    { label: 'Banner', value: '0' },
    { label: 'Video', value: '1' },
    { label: 'Ctv', value: '3' },
    { label: 'Dooh', value: '4' },
  ],
}

const { general, settings } = storeToRefs(useReportCenterStore())

const advertiserIdModel = computed({
  get() {
    return settings.value.advertiser_id
  },
  set(value) {
    settings.value.advertiser_id = value
    getCampaigns()
    getLineItems()
  },
})
const hasAdvertiserId = computed(() => settings.value.advertiser_id !== undefined)
const getComputedModel = (type) => ({
  get() {
    if (settings.value.option?.type === type) {
      return settings.value.option?.value
    }
    return undefined
  },
  set(value) {
    settings.value.option = {
      type,
      value,
    }
  },
})
const campaignIdModel = computed(getComputedModel('campaign'))
const lineItemIdModel = computed(getComputedModel('line_item'))
const typeModel = computed(getComputedModel('type'))

const isAdvertisersLoading = ref(false)
const advertisers = ref([])
const getAdvertisers = async () => {
  BusService.emit('cancelAdvertisersGet')
  isAdvertisersLoading.value = true
  try {
    const params = {}
    if (settings.value.account) {
      params.user_ids = [settings.value.account]
    }
    advertisers.value = await AdvertisersAPI.getNames(params, {
      customCancelEvent: 'cancelAdvertisersGet',
    })
  } catch (error) {}
  isAdvertisersLoading.value = false
}
getAdvertisers()
watch(
  () => settings.value.account,
  () => {
    settings.value = {
      account: settings.value.account,
      date_from: settings.value.date_from,
      date_to: settings.value.date_to,
    }
    general.value = null
    getAdvertisers()
  }
)

const isCampaignsLoading = ref(false)
const campaigns = ref([])
const getCampaigns = async () => {
  BusService.emit('cancelCampaignsGet')
  isCampaignsLoading.value = true
  try {
    campaigns.value = await CampaignsAPI.getNames(
      { advertiser_ids: [settings.value.advertiser_id] },
      {
        customCancelEvent: 'cancelCampaignsGet',
      }
    )
  } catch (error) {}
  isCampaignsLoading.value = false
}

const isLineItemsLoading = ref(false)
const lineItems = ref([])
const getLineItems = async () => {
  BusService.emit('cancelLineItemsGet')
  isLineItemsLoading.value = true
  try {
    lineItems.value = await LineItemsAPI.getNames(
      { advertiser_ids: [settings.value.advertiser_id] },
      { customCancelEvent: 'cancelLineItemsGet' }
    )
  } catch (error) {}
  isLineItemsLoading.value = false
}
</script>

<template>
  <div class="tw-grid tw-grid-cols-4 tw-gap-2.5 tw-rounded-xl tw-bg-white tw-p-6">
    <AccountField />
    <USelect
      v-model="advertiserIdModel"
      :options="advertisers"
      :loading="isAdvertisersLoading"
      option-label="name"
      option-value="id"
      placeholder="Select Advertiser"
      emit-value
    >
      <template #title>Advertiser</template>
    </USelect>
    <USelect
      v-model="campaignIdModel"
      :options="campaigns"
      :loading="isCampaignsLoading"
      option-label="name"
      option-value="id"
      placeholder="Select Campaign"
      emit-value
      :disabled="!hasAdvertiserId"
    >
      <template #title>Campaign</template>
    </USelect>
    <USelect
      v-model="lineItemIdModel"
      :options="lineItems"
      :loading="isLineItemsLoading"
      option-label="name"
      option-value="id"
      placeholder="Select Line Item"
      emit-value
      :disabled="!hasAdvertiserId"
    >
      <template #title>Line item</template>
    </USelect>
    <USelect
      v-model="typeModel"
      :options="fieldsOptions.type"
      placeholder="Select Type"
      emit-value
      :disabled="!hasAdvertiserId"
    >
      <template #title>Type</template>
    </USelect>
  </div>
</template>
