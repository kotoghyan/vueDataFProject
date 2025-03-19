<script setup>
import { computed, ref, watch } from 'vue'
import { CampaignsAPI, AdvertisersAPI } from 'src/api'
import { isNil } from 'lodash-es'
import UButton from 'src/components/ui/UButton.vue'
import UButtonToggle from 'src/components/ui/UButtonToggle.vue'
import SearchInput from 'src/components/shared/Inputs/SearchInput.vue'
import UTable from 'src/components/ui/UTable/index'
import UIcon from 'components/ui/UIcon.vue'
import UPopover from 'components/ui/UPopover.vue'
import UStatus from 'src/components/ui/UStatus.vue'
import ConfirmModal from 'src/components/shared/Modals/ConfirmModal.vue'
import { BusService, LocalStorageService } from 'src/services'
import { useRoute, useRouter } from 'vue-router'
import UBreadcrumbs from 'components/ui/UBreadcrumbs.vue'
import Pill from 'components/shared/Pill.vue'
import UMarquee from 'components/ui/UMarquee.vue'

const router = useRouter()
const route = useRoute()

const downloadOptions = [
  { label: 'CSV', value: 'csv' },
  { label: 'XLSX', value: 'xlsx' },
  { label: 'JSON', value: 'json' },
  { label: 'XML', value: 'xml' },
]

const columnClass = '!tw-w-[calc(100%/6)]'
const columns = [
  {},
  {
    name: 'name',
    label: 'Name',
    sort: true,
    minWidth: '28.625rem',
    maxWidth: '28.625rem',
  },
  { name: 'line_items_count', label: 'Line Items', sort: true, class: columnClass },
  {
    name: 'active',
    label: 'Status',
    sort: true,
    class: columnClass,
  },
  { name: 'today_spend', label: 'Today Spend', sort: true, class: columnClass },
  {
    name: 'lifetime_spend',
    label: 'Lifetime Spend',
    sort: true,
    class: columnClass,
  },
  {
    name: 'impressions_budget_daily',
    label: 'Today Impressions',
    sort: true,
    class: columnClass,
  },
  {
    name: 'impressions_budget_lifetime',
    label: 'Life Impressions',
    sort: true,
    class: columnClass,
  },
]

const filters = [
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'Associated Line Items',
    value: 'associated_line_items',
  },
  {
    label: 'Edited Today',
    value: 'edited_today',
  },
]
const usedFilter = ref([])
const usedFilterModel = computed({
  get() {
    return usedFilter.value
  },
  set(value) {
    usedFilter.value = value
    getCampaigns()
  },
})
const searchValue = ref('')
const searchModel = computed({
  get() {
    return searchValue.value
  },
  set(val) {
    searchValue.value = val
    getCampaigns()
  },
})

const sort = ref()
const sortModel = computed({
  get: () => sort.value,
  set: (val) => {
    sort.value = val
    getCampaigns()
  },
})

const pageSize = ref(LocalStorageService.get('per_page') ?? 10)
const pageSizeModel = computed({
  get: () => pageSize.value,
  set: (val) => {
    LocalStorageService.set('per_page', val)
    pageSize.value = val
    page.value = 1
    getCampaigns()
  },
})

const page = ref(route.query.page ? +route.query.page : 1)
const pageModel = computed({
  get: () => page.value,
  set: (val) => {
    page.value = val
    router.push({ query: { page: val } })
    getCampaigns()
  },
})

const isCampaignsLoading = ref(false)
const campaigns = ref({})

const hasCampaigns = computed(() => campaigns.value.data?.length > 0)
const getCampaigns = async () => {
  BusService.emit('CampaignsGetAll')
  isCampaignsLoading.value = true
  try {
    const filters = usedFilter.value.reduce((acc, curr) => {
      acc[curr] = 1
      return acc
    }, {})
    const params = {
      ...filters,
      search: searchValue.value,
      sort: sort.value,
      per_page: pageSize.value,
      page: page.value,
    }
    if (route.query.advertiser_id) {
      params.advertiser_ids = [route.query.advertiser_id]
    }

    campaigns.value = await CampaignsAPI.getAll(params, { customCancelEvent: 'CampaignsGetAll' })
  } catch (error) {}
  isCampaignsLoading.value = false
}
getCampaigns()
watch(() => route.query.advertiser_id, getCampaigns)

const deleteCampaign = async (campaign) => {
  await CampaignsAPI.delete({ id: campaign.id })
  if (!hasCampaigns.value) {
    page.value = 1
  }
  getCampaigns()
}

const selected = ref([])
const hasSelected = computed(() => selected.value.length > 0)
const deleteSelected = async () => {
  await CampaignsAPI.bulkDelete({ ids: selected.value })
  page.value = 1
  getCampaigns()
  selected.value = []
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

const breadcrumbs = computed(() => {
  const list = []

  if (route.query.advertiser_id) {
    list.push({
      name: advertiser.value?.name,
      to: { name: 'advertisers' },
      loading: isAdvertiserLoading.value,
    })
  }

  if (list.length > 0) {
    list.push('Campaigns')
  }

  return list
})
</script>

<template>
  <UBreadcrumbs class="tw-mb-2" :breadcrumbs="breadcrumbs" />
  <div class="tw-mb-7.5 tw-flex tw-items-center tw-justify-between">
    <h1 class="page-title">Campaigns</h1>
    <div class="tw-flex tw-gap-2.5">
      <UButton :to="{ name: 'newCampaign', query: route.query }" icon="add" variant="outlined"
        >New Campaign</UButton
      >
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
      <div class="tw-flex tw-items-center tw-gap-2.5">
        <SearchInput v-model="searchModel" placeholder="Search by Name" :debounce="300" />
        <ConfirmModal v-if="hasSelected" @confirm="deleteSelected">
          <template #trigger>
            <UButton icon="delete" bg="light-gray" square />
          </template>
          <template #content>
            <p>Are you sure you want to delete items?</p>
          </template>
        </ConfirmModal>
      </div>
      <UButtonToggle v-model="usedFilterModel" :options="filters" type="checkbox" />
    </div>
    <UTable
      v-model:page="pageModel"
      v-model:pageSize="pageSizeModel"
      v-model:selected="selected"
      selection="multiple"
      class="tw-mt-2.5"
      :total="campaigns?.meta?.total"
      pagination
    >
      <template #head>
        <UTable.Head v-model:sort="sortModel" :columns="columns"> </UTable.Head>
      </template>
      <template #body>
        <template v-if="isCampaignsLoading">
          <UTable.Row v-for="rowN in 10" :key="`row-${rowN}`">
            <UTable.BodyCell v-for="cellN in columns.length" :key="`cell-${cellN}`">
              <div class="tw-h-2.5 tw-w-16 tw-animate-pulse tw-rounded-full tw-bg-black-16"></div>
            </UTable.BodyCell>
            <UTable.BodyCell />
          </UTable.Row>
        </template>
        <template v-else-if="hasCampaigns">
          <UTable.Row v-for="campaign in campaigns.data" :id="campaign.id" :key="campaign.id">
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
                    <router-link
                      class="q-hoverable"
                      :to="{
                        name: 'editCampaign',
                        params: { id: campaign.id },
                        query: route.query,
                      }"
                    >
                      <div class="q-focus-helper"></div>
                      Edit
                    </router-link>
                    <ConfirmModal
                      class="q-hoverable tw-cursor-pointer tw-text-red"
                      @confirm="deleteCampaign(campaign)"
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
              <router-link
                :to="{
                  name: 'lineItems',
                  query: { advertiser_id: route.query.advertiser_id, campaign_id: campaign.id },
                }"
                class="tw-transition-[color] hover:tw-text-primary"
              >
                <UMarquee>{{ campaign.name }}</UMarquee>
              </router-link>
            </UTable.BodyCell>
            <UTable.BodyCell>
              <router-link
                :to="{
                  name: 'lineItems',
                  query: { campaign_id: campaign.id, advertiser_id: route.query.advertiser_id },
                }"
              >
                <Pill>
                  {{ campaign.line_items_count.toLocaleString('en') }}
                </Pill>
              </router-link>
            </UTable.BodyCell>
            <UTable.BodyCell>
              <UStatus :color="campaign.active ? 'green' : 'red'">
                {{ campaign.active ? 'Active' : 'Inactive' }}
              </UStatus>
            </UTable.BodyCell>
            <UTable.BodyCell>
              {{
                isNil(campaign.metrics?.spend?.today)
                  ? '-'
                  : `$${Number(campaign.metrics.spend.today.toFixed(2)).toLocaleString('en')}`
              }}
            </UTable.BodyCell>
            <UTable.BodyCell>
              {{
                isNil(campaign.metrics?.spend?.lifetime)
                  ? '-'
                  : `$${Number(campaign.metrics.spend.lifetime.toFixed(2)).toLocaleString('en')}`
              }}
            </UTable.BodyCell>
            <UTable.BodyCell>
              {{
                isNil(campaign.metrics?.impressions?.today)
                  ? '-'
                  : campaign.metrics.impressions.today.toLocaleString('en')
              }}
            </UTable.BodyCell>
            <UTable.BodyCell>
              {{
                isNil(campaign.metrics?.impressions?.lifetime)
                  ? '-'
                  : campaign.metrics.impressions.lifetime.toLocaleString('en')
              }}
            </UTable.BodyCell>
          </UTable.Row>
        </template>
        <UTable.Row v-else w-full>No data</UTable.Row>
      </template>
    </UTable>
  </div>
</template>
