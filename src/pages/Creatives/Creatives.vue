<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import UButton from 'src/components/ui/UButton.vue'
import UButtonToggle from 'src/components/ui/UButtonToggle.vue'
import UTable from 'src/components/ui/UTable/index'
import UIcon from 'components/ui/UIcon.vue'
import UVideo from 'src/components/ui/UVideo.vue'
import UPopover from 'components/ui/UPopover.vue'
import UStatus from 'src/components/ui/UStatus.vue'
import UModal from 'src/components/ui/UModal.vue'
import UBreadcrumbs from 'components/ui/UBreadcrumbs.vue'
import UMarquee from 'components/ui/UMarquee.vue'
import SearchInput from 'src/components/shared/Inputs/SearchInput.vue'
import ConfirmModal from 'src/components/shared/Modals/ConfirmModal.vue'
import moment from 'moment'
import { isNil } from 'lodash-es'
import { BusService, LocalStorageService } from 'src/services'
import { CreativesAPI, LineItemsAPI, AdvertisersAPI, CampaignsAPI } from 'src/api'

const router = useRouter()
const route = useRoute()

const filters = [
  {
    label: 'Active',
    value: 'status',
  },
  {
    label: 'Associated Campaigns',
    value: 'Associated Campaigns',
  },
]
const downloadOptions = [
  { label: 'CSV', value: 'csv' },
  { label: 'XLSX', value: 'xlsx' },
  { label: 'JSON', value: 'json' },
  { label: 'XML', value: 'xml' },
]

const columnClass = '!tw-w-[calc(100%/5)]'
const columns = [
  {},
  {
    name: 'name',
    label: 'Name',
    minWidth: '28.625rem',
    maxWidth: '28.625rem',
  },
  { name: 'status', label: 'Status', class: columnClass },
  { name: 'size', label: 'Size', class: columnClass },
  { name: 'creativeType', label: 'Creative Type', class: columnClass },
  { name: 'startDate', label: 'Start Date', class: columnClass },
  { name: 'endDate', label: 'End Date', class: columnClass },
  {
    name: 'file',
    label: 'File',
  },
]

const usedFilter = ref([])
const hasUsedFilter = computed(() => usedFilter.value.length > 0)

const searchValue = ref('')
const searchModel = computed({
  get() {
    return searchValue.value
  },
  set(val) {
    searchValue.value = val
    getCreatives()
  },
})

const pageSize = ref(LocalStorageService.get('per_page') ?? 10)
const pageSizeModel = computed({
  get: () => pageSize.value,
  set: (val) => {
    LocalStorageService.set('per_page', val)
    pageSize.value = val
    page.value = 1
    getCreatives()
  },
})

const page = ref(route.query.page ? +route.query.page : 1)
const pageModel = computed({
  get: () => page.value,
  set: (val) => {
    page.value = val
    router.push({ query: { page: val } })
    getCreatives()
  },
})

const isCreativesLoading = ref(false)
const creatives = ref({})
const filteredCreatives = computed(() => {
  let data = creatives.value.data ?? []

  if (hasUsedFilter.value) {
    data = data.filter((creative) => {
      if (usedFilter.value.includes('status') && !creative.active) {
        return false
      }
      return true
    })
  }

  return data
})

const hasCreatives = computed(() => filteredCreatives.value.length > 0)
const getCreatives = async () => {
  BusService.emit('CreativesGetAll')
  isCreativesLoading.value = true
  try {
    const params = {
      search: searchValue.value,
      per_page: pageSize.value,
      page: page.value,
    }
    if (route.query.line_item_id) {
      params.line_item_ids = [route.query.line_item_id]
    } else if (route.query.advertiser_id) {
      params.advertiser_ids = [route.query.advertiser_id]
    }

    creatives.value = await CreativesAPI.getAll(params, { customCancelEvent: 'CreativesGetAll' })
  } catch (error) {}
  isCreativesLoading.value = false
}
getCreatives()
watch(() => [route.query.advertiser_id, route.query.line_item_id], getCreatives)

const deleteCreative = async (creative) => {
  await CreativesAPI.delete({ id: creative.id })
  if (creatives.value.data.length === 0) {
    page.value = 1
  }
  getCreatives()
}

const isAdvertiserLoading = ref(false)
const advertiser = ref(null)
const getAdvertiser = async () => {
  isAdvertiserLoading.value = true
  advertiser.value = await AdvertisersAPI.get({ id: route.query.advertiser_id })
  isAdvertiserLoading.value = false
}
if (route.query.advertiser_id) {
  getAdvertiser()
}

const isCampaignLoading = ref(false)
const campaign = ref(null)
const getCampaign = async () => {
  isCampaignLoading.value = true
  campaign.value = await CampaignsAPI.get({ id: route.query.campaign_id })
  isCampaignLoading.value = false
}
if (route.query.campaign_id) {
  getCampaign()
}

const isLineItemLoading = ref(false)
const lineItem = ref(null)
const getLineItem = async () => {
  isLineItemLoading.value = true
  lineItem.value = await LineItemsAPI.get({ id: route.query.line_item_id })
  isLineItemLoading.value = false
}
if (route.query.line_item_id) {
  getLineItem()
}

const breadcrumbs = computed(() => {
  const list = []

  if (route.query.advertiser_id) {
    list.push({
      name: advertiser.value?.name,
      to: { name: 'advertisers' },
      loading: isAdvertiserLoading.value,
    })
  }

  if (route.query.campaign_id) {
    list.push({
      name: campaign.value?.name,
      to: { name: 'campaigns', query: { advertiser_id: route.query.advertiser_id } },
      loading: isCampaignLoading.value,
    })
  }

  if (route.query.line_item_id) {
    list.push({
      name: lineItem.value?.name,
      to: {
        name: 'lineItems',
        query: { advertiser_id: route.query.advertiser_id, campaign_id: route.query.campaign_id },
      },
      loading: isLineItemLoading.value,
    })
  }

  if (list.length > 0) {
    list.push('Creatives')
  }

  return list
})

const creativeTypes = [
  {
    label: 'Banner',
    value: 0,
  },
  {
    label: 'Video',
    value: 1,
  },
  {
    label: 'Audio',
    value: 4,
  },
]
const getCreativeType = (type) => {
  const creativeType = creativeTypes.find(({ value }) => value === type)
  return creativeType
}
const isCreativeType = (type) => ({
  banner: type === 0,
  video: type === 1,
  audio: type === 4,
})

const formatDate = (date) => {
  const newDate = moment(date)
  return newDate.format('MM.DD.YYYY')
}
</script>

<template>
  <UBreadcrumbs class="tw-mb-2" :breadcrumbs="breadcrumbs" />
  <div class="tw-mb-7.5 tw-flex tw-items-center tw-justify-between">
    <h1 class="page-title">Creatives</h1>
    <div class="tw-flex tw-gap-2.5">
      <UButton
        :to="{
          name: 'newCreative',
          query: route.query,
        }"
        icon="add"
        variant="outlined"
      >
        New Creative
      </UButton>
      <UPopover auto-size="min">
        <UButton icon="download" variant="outlined"> Download As </UButton>
        <template #popover>
          <div
            v-for="opt in downloadOptions"
            :key="opt.value"
            v-close-popover
            class="tw-cursor-pointer tw-leading-6 tw-transition-[color] hover:tw-text-primary"
          >
            {{ opt.label }}
          </div>
        </template>
      </UPopover>
    </div>
  </div>
  <div class="tw-rounded-xl tw-bg-white tw-p-6">
    <div class="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2.5">
      <UButtonToggle v-model="usedFilter" :options="filters" type="checkbox" />
      <SearchInput v-model="searchModel" placeholder="Search by Name" :debounce="300" />
    </div>
    <UTable
      v-model:page="pageModel"
      v-model:pageSize="pageSizeModel"
      class="tw-mt-2.5"
      :total="creatives?.meta?.total"
      pagination
    >
      <template #head>
        <UTable.Head :columns="columns"> </UTable.Head>
      </template>
      <template #body>
        <template v-if="isCreativesLoading">
          <UTable.Row v-for="rowN in 10" :key="`row-${rowN}`">
            <UTable.BodyCell v-for="cellN in columns.length" :key="`cell-${cellN}`">
              <div class="tw-h-2.5 tw-w-16 tw-animate-pulse tw-rounded-full tw-bg-black-16"></div>
            </UTable.BodyCell>
            <UTable.BodyCell />
          </UTable.Row>
        </template>
        <template v-else-if="hasCreatives">
          <UTable.Row v-for="(creative, index) in filteredCreatives" :key="creative.id">
            <UTable.BodyCell>
              <UPopover
                :padding="0"
                width="sm"
                placement="right"
                class="tw-cursor-pointer tw-transition-[color] hover:tw-text-primary"
              >
                <UIcon name="ellipsis-vertical" class="tw-text-[1.5rem]" />
                <template #popover>
                  <div class="tw-leading-8 *:tw-relative *:tw-block *:tw-px-popover">
                    <ConfirmModal
                      class="q-hoverable tw-cursor-pointer tw-text-red"
                      @confirm="deleteCreative(creative)"
                    >
                      <template #trigger>
                        <div class="q-focus-helper"></div>
                        Delete
                      </template>
                      <template #content>
                        <p>Are you sure you want to delete item?</p>
                      </template>
                    </ConfirmModal>
                  </div>
                </template>
              </UPopover>
            </UTable.BodyCell>
            <UTable.BodyCell>
              <div class="tw-flex tw-items-center">
                <router-link
                  :to="{
                    name: 'editCreative',
                    params: { id: creative.id },
                    query: route.query,
                  }"
                  class="tw-transition-[color] hover:tw-text-primary"
                >
                  <UMarquee>{{ creative.name }}</UMarquee>
                </router-link>
              </div>
            </UTable.BodyCell>
            <UTable.BodyCell>
              <UStatus :color="creative.active ? 'green' : 'red'">
                {{ creative.active ? 'Active' : 'Inactive' }}
              </UStatus>
            </UTable.BodyCell>
            <UTable.BodyCell>
              {{ (creative.width ?? 0).toLocaleString('en') }}*{{
                (creative.height ?? 0).toLocaleString('en')
              }}
            </UTable.BodyCell>
            <UTable.BodyCell>
              {{ getCreativeType(creative.type).label }}
            </UTable.BodyCell>
            <UTable.BodyCell>
              {{ isNil(creative.start_date) ? '-' : formatDate(creative.start_date) }}
            </UTable.BodyCell>
            <UTable.BodyCell>
              {{ isNil(creative.end_date) ? '-' : formatDate(creative.end_date) }}
            </UTable.BodyCell>
            <UTable.BodyCell>
              <template v-if="isNil(creative.thumbnail_url)">-</template>
              <div
                v-else-if="isCreativeType(creative.type).audio"
                class="tw-flex tw-items-center tw-gap-x-1"
              >
                <UIcon name="audio" class="tw-flex-shrink-0 tw-text-[1.5rem] tw-text-primary" />
                <span class="tw-text-sm tw-font-medium tw-text-dark">{{
                  creative.name ?? `Record ${index + 1}`
                }}</span>
              </div>
              <UModal
                v-else
                class="tw-flex tw-h-16 tw-w-16 tw-cursor-pointer tw-items-center tw-rounded-lg"
                no-padding
              >
                <template #trigger>
                  <img
                    v-if="isCreativeType(creative.type).banner"
                    class="tw-max-h-full tw-max-w-full tw-rounded-[inherit]"
                    :src="creative.thumbnail_url"
                    alt=""
                  />
                  <UVideo
                    v-else-if="isCreativeType(creative.type).video"
                    class="tw-max-h-full tw-max-w-full tw-rounded-[inherit]"
                    :src="creative.thumbnail_url"
                  ></UVideo>
                </template>
                <img
                  v-if="isCreativeType(creative.type).banner"
                  class="tw-max-h-full tw-max-w-full"
                  :src="creative.thumbnail_url"
                  alt=""
                />
                <UVideo
                  v-else-if="isCreativeType(creative.type).video"
                  class="tw-max-h-full tw-max-w-full"
                  controls
                  :src="creative.thumbnail_url"
                ></UVideo>
              </UModal>
            </UTable.BodyCell>
          </UTable.Row>
        </template>
        <UTable.Row v-else w-full>No data</UTable.Row>
      </template>
    </UTable>
  </div>
</template>
