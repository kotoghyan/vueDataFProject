<script setup>
import { computed, ref, watch } from 'vue'
import { AdvertisersAPI, LineItemsAPI } from 'src/api'
import UModal from 'src/components/ui/UModal.vue'
import UInput from 'src/components/ui/UInput.vue'
import USelect from 'src/components/ui/USelect.vue'
import UButtonToggle from 'src/components/ui/UButtonToggle.vue'
import UButton from 'src/components/ui/UButton.vue'
import { useRoute, useRouter } from 'vue-router'
import { BusService } from 'src/services'

const router = useRouter()
const route = useRoute()

const fieldsOptions = {
  type: [
    { label: 'Banner', value: 0 },
    { label: 'Video', value: 1 },
    { label: 'CTV', value: 3 },
    { label: 'DOOH', value: 4 },
    { label: 'Audio', value: 5 },
  ],
}
const fieldsValues = ref({
  type: route.query.campaign_type ? +route.query.campaign_type : fieldsOptions.type[0].value,
  advertiser_id: route.query.advertiser_id,
  campaign_id: route.query.campaign_id,
})
const hasFieldsValuesAdvertiserId = computed(() => fieldsValues.value.advertiser_id !== undefined)

const isAdvertisersLoading = ref(false)
const advertisers = ref([])
const getAdvertisers = async () => {
  isAdvertisersLoading.value = true
  const data = await AdvertisersAPI.getNames()
  advertisers.value = data
  isAdvertisersLoading.value = false
}
getAdvertisers()

const isAdvertiserCampaignsLoading = ref(false)
const advertiserCampaigns = ref([])
const cancelAdvertiserCampaignsGet = 'cancelNewLineItemAdvertiserCampaignsGet'
const getAdvertiserCampaigns = async () => {
  BusService.emit(cancelAdvertiserCampaignsGet)
  isAdvertiserCampaignsLoading.value = true
  try {
    const data = await AdvertisersAPI.getCampaignNames(
      { advertiser_id: fieldsValues.value.advertiser_id },
      {
        customCancelEvent: cancelAdvertiserCampaignsGet,
      }
    )
    advertiserCampaigns.value = data
  } catch (error) {}
  isAdvertiserCampaignsLoading.value = false
}
watch(
  () => fieldsValues.value.advertiser_id,
  (newValue) => {
    if (newValue !== undefined) {
      getAdvertiserCampaigns()
    }
  },
  {
    immediate: true,
  }
)

const goToLineItems = () => {
  router.push({ name: 'lineItems', query: route.query })
}

const isCreating = ref(false)
const create = async () => {
  isCreating.value = true
  try {
    const { id } = await LineItemsAPI.create(fieldsValues.value)
    router.push({ name: 'editLineItem', params: { id } })
  } catch (error) {}
  isCreating.value = false
}
</script>

<template>
  <UModal model-value tag="form" close-button @hide="goToLineItems">
    <template #title>Create Line Item</template>
    <form id="createLineItemForm" class="tw-space-y-2.5" @submit.prevent="create">
      <USelect
        v-model="fieldsValues.advertiser_id"
        :options="advertisers"
        :loading="isAdvertisersLoading"
        option-label="name"
        option-value="id"
        placeholder="Select Advertiser"
        emit-value
        required
      >
        <template #title>Advertiser</template>
      </USelect>
      <USelect
        v-model="fieldsValues.campaign_id"
        :options="advertiserCampaigns"
        :loading="isAdvertiserCampaignsLoading"
        option-label="name"
        option-value="id"
        placeholder="Select Campaign"
        emit-value
        :disabled="!hasFieldsValuesAdvertiserId"
        required
      >
        <template #title>Campaign</template>
      </USelect>
      <UInput v-model="fieldsValues.name" placeholder="Type Line Item Name" required>
        <template #title>Line Item Name</template>
      </UInput>
      <UButtonToggle
        v-model="fieldsValues.type"
        :options="fieldsOptions.type"
        info="Line item type can be either “banner” or “video”. Line items of type “banner” can only have banner creative associated to them. Line items of type “video” can only have video creatives associated to them. Mobile campaigns can be set up as either “video” or “banner” depending on the creative format being used."
      >
        <template #title>Line Item Type</template>
      </UButtonToggle>
    </form>
    <template #footer>
      <div class="tw-flex tw-justify-center tw-gap-2.5">
        <UButton v-close-popup variant="outlined" icon="cross">Cancel</UButton>
        <UButton form="createLineItemForm" type="submit" icon="add" :loading="isCreating">
          Create
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<style lang="scss" scoped></style>
