<script setup>
import { computed, ref } from 'vue'
import { AdvertisersAPI } from 'src/api'
import { isNil } from 'lodash-es'
import UButton from 'src/components/ui/UButton.vue'
import UButtonToggle from 'src/components/ui/UButtonToggle.vue'
import SearchInput from 'src/components/shared/Inputs/SearchInput.vue'
import UTable from 'src/components/ui/UTable/index'
import UIcon from 'src/components/ui/UIcon.vue'
import UPopover from 'src/components/ui/UPopover.vue'
import UStatus from 'src/components/ui/UStatus.vue'
import ConfirmModal from 'src/components/shared/Modals/ConfirmModal.vue'
import { BusService, LocalStorageService } from 'src/services'
import { useRoute, useRouter } from 'vue-router'
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

const columnClass = '!tw-w-[calc(100%/8)]'
const columns = [
  {},
  {
    name: 'name',
    label: 'Name',
    sort: true,
    minWidth: '28.625rem',
    maxWidth: '28.625rem',
  },
  { name: 'campaigns_count', label: 'Campaigns', sort: true, class: columnClass },
  { name: 'line_items_count', label: 'Line Items', sort: true, class: columnClass },
  { name: 'creatives_count', label: 'Creatives', sort: true, class: columnClass },
  { name: 'active', label: 'Status', sort: true, class: columnClass },
  { name: 'todaySpend', label: 'Today Spend', sort: false, class: columnClass },
  {
    name: 'lifetimeSpend',
    label: 'Lifetime Spend',
    sort: false,
    class: columnClass,
  },
  {
    name: 'todayImpressions',
    label: 'Today Impressions',
    sort: false,
    class: columnClass,
  },
  {
    name: 'lifeImpressions',
    label: 'Life Impressions',
    sort: false,
    class: columnClass,
  },
]

const filters = [
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'Associated Campaigns',
    value: 'associated_campaigns',
  },
  {
    label: 'Favorites only',
    value: 'favorites_only',
  },
]
const usedFilter = ref([])
const usedFilterModel = computed({
  get() {
    return usedFilter.value
  },
  set(value) {
    usedFilter.value = value
    getAdvertisers()
  },
})

const searchValue = ref('')
const searchModel = computed({
  get() {
    return searchValue.value
  },
  set(val) {
    searchValue.value = val
    getAdvertisers()
  },
})

const sort = ref()
const sortModel = computed({
  get: () => sort.value,
  set: (val) => {
    sort.value = val
    getAdvertisers()
  },
})

const pageSize = ref(LocalStorageService.get('per_page') ?? 10)
const pageSizeModel = computed({
  get: () => pageSize.value,
  set: (val) => {
    LocalStorageService.set('per_page', val)
    pageSize.value = val
    page.value = 1
    getAdvertisers()
  },
})

const page = ref(route.query.page ? +route.query.page : 1)
const pageModel = computed({
  get: () => page.value,
  set: (val) => {
    page.value = val
    router.push({ query: { page: val } })
    getAdvertisers()
  },
})

const isAdvertisersLoading = ref(false)
const advertisers = ref({})
const hasAdvertisers = computed(() => advertisers.value.data?.length > 0)
const getAdvertisers = async () => {
  BusService.emit('AdvertisersGetAll')
  isAdvertisersLoading.value = true
  try {
    const filters = usedFilter.value.reduce((acc, curr) => {
      acc[curr] = true
      return acc
    }, {})
    advertisers.value = await AdvertisersAPI.getAll(
      {
        ...filters,
        search: searchValue.value,
        sort: sort.value,
        per_page: pageSize.value,
        page: page.value,
      },
      { customCancelEvent: 'AdvertisersGetAll' }
    )
  } catch (error) {}
  isAdvertisersLoading.value = false
}
getAdvertisers()
const deleteAdvertiser = async (advertiser) => {
  await AdvertisersAPI.delete({ id: advertiser.id })
  if (advertisers.value.data.length === 0) {
    page.value = 1
  }
  getAdvertisers()
}

const selected = ref([])
const hasSelected = computed(() => selected.value.length > 0)
const deleteSelected = async () => {
  await AdvertisersAPI.bulkDelete({ ids: selected.value })
  page.value = 1
  getAdvertisers()
  selected.value = []
}
</script>

<template>
  <div class="tw-mb-7.5 tw-flex tw-items-center tw-justify-between">
    <h1 class="page-title">Advertisers</h1>
    <div class="tw-flex tw-gap-2.5">
      <UButton :to="{ name: 'newAdvertiser', query: { page } }" icon="add" variant="contained" >
        New Advertiser
      </UButton>
      <UPopover auto-size="min">
        <UButton icon="download" variant="contained"> Download As </UButton>
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
      <UButtonToggle v-model="usedFilterModel" :options="filters" type="checkbox" />
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
    </div>
    <UTable
      v-model:page="pageModel"
      v-model:pageSize="pageSizeModel"
      v-model:selected="selected"
      selection="multiple"
      class="tw-mt-2.5"
      :total="advertisers?.meta?.total"
      pagination
    >
      <template #head>
        <UTable.Head v-model:sort="sortModel" :columns="columns"></UTable.Head>
      </template>
      <template #body>
        <template v-if="isAdvertisersLoading">
          <UTable.Row v-for="rowN in 10" :key="`row-${rowN}`">
            <UTable.BodyCell v-for="cellN in columns.length" :key="`cell-${cellN}`">
              <div class="tw-h-2.5 tw-w-16 tw-animate-pulse tw-rounded-full tw-bg-black-16"></div>
            </UTable.BodyCell>
            <UTable.BodyCell />
          </UTable.Row>
        </template>
        <template v-else-if="hasAdvertisers">
          <UTable.Row
            v-for="advertiser in advertisers.data"
            :id="advertiser.id"
            :key="advertiser.id"
          >
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
                        name: 'editAdvertiser',
                        params: { id: advertiser.id },
                        query: { page },
                      }"
                    >
                      <div class="q-focus-helper"></div>
                      Edit
                    </router-link>
                    <ConfirmModal
                      class="q-hoverable tw-cursor-pointer tw-text-red"
                      @confirm="deleteAdvertiser(advertiser)"
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
                :to="{ name: 'campaigns', query: { advertiser_id: advertiser.id } }"
                class="tw-transition-[color] hover:tw-text-primary"
              >
                <UMarquee>{{ advertiser.name }}</UMarquee>
              </router-link>
            </UTable.BodyCell>
            <UTable.BodyCell>
              <router-link :to="{ name: 'campaigns', query: { advertiser_id: advertiser.id } }">
                <Pill>{{ advertiser.campaigns_count.toLocaleString('en') }}</Pill>
              </router-link>
            </UTable.BodyCell>
            <UTable.BodyCell>
              <router-link :to="{ name: 'lineItems', query: { advertiser_id: advertiser.id } }">
                <Pill>{{ advertiser.line_items_count.toLocaleString('en') }}</Pill>
              </router-link>
            </UTable.BodyCell>
            <UTable.BodyCell>
              <router-link :to="{ name: 'creatives', query: { advertiser_id: advertiser.id } }">
                <Pill>{{ advertiser.creatives_count.toLocaleString('en') }}</Pill>
              </router-link>
            </UTable.BodyCell>
            <UTable.BodyCell>
              <UStatus :color="advertiser.active ? 'green' : 'red'">
                {{ advertiser.active ? 'ACTIVE' : 'INACTIVE' }}
              </UStatus>
            </UTable.BodyCell>
            <UTable.BodyCell>
              {{
                isNil(advertiser.metrics?.spend?.today)
                  ? '-'
                  : `$${Number(advertiser.metrics.spend.today.toFixed(2)).toLocaleString('en')}`
              }}
            </UTable.BodyCell>
            <UTable.BodyCell>
              {{
                isNil(advertiser.metrics?.spend?.lifetime)
                  ? '-'
                  : `$${Number(advertiser.metrics.spend.lifetime.toFixed(2)).toLocaleString('en')}`
              }}
            </UTable.BodyCell>
            <UTable.BodyCell>
              {{
                isNil(advertiser.metrics?.impressions?.today)
                  ? '-'
                  : advertiser.metrics.impressions.today.toLocaleString('en')
              }}
            </UTable.BodyCell>
            <UTable.BodyCell>
              {{
                isNil(advertiser.metrics?.impressions?.lifetime)
                  ? '-'
                  : advertiser.metrics.impressions.lifetime.toLocaleString('en')
              }}
            </UTable.BodyCell>
          </UTable.Row>
        </template>
        <UTable.Row v-else w-full>No data</UTable.Row>
      </template>
    </UTable>
  </div>
</template>
