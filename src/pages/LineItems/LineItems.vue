<script setup>
import { computed, ref, watch } from 'vue'
import { LineItemsAPI, AdvertisersAPI, CampaignsAPI } from 'src/api'
import { isNil } from 'lodash-es'
import UButton from 'src/components/ui/UButton.vue'
import UButtonToggle from 'src/components/ui/UButtonToggle.vue'
import SearchInput from 'src/components/shared/Inputs/SearchInput.vue'
import UTable from 'src/components/ui/UTable/index'
import UIcon from 'components/ui/UIcon.vue'
import UPopover from 'components/ui/UPopover.vue'
import UStatus from 'src/components/ui/UStatus.vue'
import ConfirmModal from 'src/components/shared/Modals/ConfirmModal.vue'
import moment from 'moment'
import { BusService, LocalStorageService } from 'src/services'
import { useRoute, useRouter } from 'vue-router'
import UToggle from 'components/ui/UToggle.vue'
import UBreadcrumbs from 'components/ui/UBreadcrumbs.vue'
import Pill from 'components/shared/Pill.vue'
import UMarquee from 'components/ui/UMarquee.vue'

const router = useRouter()
const route = useRoute()

const filters = [
  {
    label: 'Active',
    value: 'status',
  },
]
const downloadOptions = [
  { label: 'CSV', value: 'csv' },
  { label: 'XLSX', value: 'xlsx' },
  { label: 'JSON', value: 'json' },
  { label: 'XML', value: 'xml' },
]

const columnClass = '!tw-w-[calc(100%/13)]'
const columns = [
  {},
  {
    name: 'name',
    label: 'Name',
    minWidth: '28.625rem',
    maxWidth: '28.625rem',
  },
  {
    name: 'creatives',
    label: 'Creatives',
    class: columnClass,
  },
  {
    name: 'status',
    label: 'Status',
    class: columnClass,
  },
  {
    name: 'Delivery Status',
    label: 'Delivery Status',
    class: columnClass,
  },
  {
    name: 'Type',
    label: 'Type',
    class: columnClass,
  },
  {
    name: 'Lifetime Budget',
    label: 'Lifetime Budget',
    class: columnClass,
  },
  {
    name: 'Daily Budget',
    label: 'Daily Budget',
    class: columnClass,
  },
  {
    name: 'Start Date',
    label: 'Start Date',
    class: columnClass,
  },
  {
    name: 'End Date',
    label: 'End Date',
    class: columnClass,
  },
  {
    name: 'OSI',
    label: 'OSI',
    class: columnClass,
  },
  {
    name: 'Today Spend',
    label: 'Today Spend',
    class: columnClass,
  },
  {
    name: 'Lifetime Spend',
    label: 'Lifetime Spend',
    class: columnClass,
  },
  {
    name: 'todayImpressions',
    label: 'Today Impressions',
    class: columnClass,
  },
  {
    name: 'lifeImpressions',
    label: 'Life Impressions',
    class: columnClass,
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
    getLineItems()
  },
})

const pageSize = ref(LocalStorageService.get('per_page') ?? 10)
const pageSizeModel = computed({
  get: () => pageSize.value,
  set: (val) => {
    LocalStorageService.set('per_page', val)
    pageSize.value = val
    page.value = 1
    getLineItems()
  },
})

const page = ref(route.query.page ? +route.query.page : 1)
const pageModel = computed({
  get: () => page.value,
  set: (val) => {
    page.value = val
    router.push({ query: { page: val } })
    getLineItems()
  },
})

const isLineItemsLoading = ref(false)
const lineItems = ref({})
const filteredLineItems = computed(() => {
  let data = lineItems.value.data ?? []

  if (hasUsedFilter.value) {
    data = data.filter((lineItem) => {
      if (usedFilter.value.includes('status') && !lineItem.active) {
        return false
      }
      return true
    })
  }

  return data
})
const hasLineItems = computed(() => filteredLineItems.value.length > 0)
const getLineItems = async () => {
  BusService.emit('LineItemsGetAll')
  isLineItemsLoading.value = true
  try {
    const params = {
      per_page: pageSize.value,
      page: page.value,
      search: searchValue.value,
    }
    if (route.query.campaign_id) {
      params.campaign_ids = [route.query.campaign_id]
    } else if (route.query.advertiser_id) {
      params.advertiser_ids = [route.query.advertiser_id]
    }

    lineItems.value = await LineItemsAPI.getAll(params, { customCancelEvent: 'LineItemsGetAll' })
  } catch (error) {}
  isLineItemsLoading.value = false
}
getLineItems()
watch(() => [route.query.advertiser_id, route.query.campaign_id], getLineItems)

const deleteLineItem = async (lineItem) => {
  await LineItemsAPI.delete({ id: lineItem.id })
  if (lineItems.value.data.length === 0) {
    page.value = 1
  }
  getLineItems()
}
const toggleLineItemActive = async (lineItem) => {
  try {
    const { active } = await LineItemsAPI.switch(lineItem)
    lineItem.active = active
  } catch (error) {}
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

  if (list.length > 0) {
    list.push('Line Items')
  }

  return list
})

const getLineItemTypeLabel = (type) => {
  const types = [
    { label: 'Banner', value: 0 },
    { label: 'Video', value: 1 },
    { label: 'CTV', value: 3 },
    { label: 'DOOH', value: 4 },
    { label: 'Audio', value: 5 },
  ]
  const foundType = types.find((item) => item.value === type)
  return foundType.label
}
const isLineItemBudgetType = (lineItem) => {
  const { budget_type } = lineItem
  return {
    spend: budget_type === 0,
    impression: budget_type === 1,
  }
}
const getLineItemDailyBudget = (lineItem) => {
  const _isBudgetType = isLineItemBudgetType(lineItem)
  if (_isBudgetType.spend) {
    return +lineItem.spend_budget_daily.toFixed(2)
  }
  return lineItem.impressions_budget_daily
}
const getLineItemLifetimeBudget = (lineItem) => {
  const _isBudgetType = isLineItemBudgetType(lineItem)
  if (_isBudgetType.spend) {
    return +lineItem.spend_budget_lifetime.toFixed(2)
  }
  return lineItem.impressions_budget_lifetime
}
const formatDate = (date) => {
  const newDate = moment(date)
  return newDate.format('MM.DD.YYYY')
}
</script>

<template>
  <UBreadcrumbs class="tw-mb-2" :breadcrumbs="breadcrumbs" />
  <div class="tw-mb-7.5 tw-flex tw-items-center tw-justify-between">
    <h1 class="page-title">Line Items</h1>
    <div class="tw-flex tw-gap-2.5">
      <UButton
        :to="{
          name: 'newLineItem',
          query: route.query,
        }"
        icon="add"
        variant="outlined"
      >
        New Line Item
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
      :total="lineItems?.meta?.total"
      pagination
    >
      <template #head>
        <UTable.Head :columns="columns"></UTable.Head>
      </template>
      <template #body>
        <template v-if="isLineItemsLoading">
          <UTable.Row v-for="rowN in 10" :key="`row-${rowN}`">
            <UTable.BodyCell v-for="cellN in columns.length" :key="`cell-${cellN}`">
              <div class="tw-h-2.5 tw-w-16 tw-animate-pulse tw-rounded-full tw-bg-black-16"></div>
            </UTable.BodyCell>
            <UTable.BodyCell />
          </UTable.Row>
        </template>
        <template v-else-if="hasLineItems">
          <UTable.Row v-for="lineItem in filteredLineItems" :key="lineItem.id">
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
                        name: 'editLineItem',
                        params: { id: lineItem.id },
                        query: route.query,
                      }"
                    >
                      <div class="q-focus-helper"></div>
                      Edit
                    </router-link>
                    <ConfirmModal
                      class="q-hoverable tw-cursor-pointer tw-text-red"
                      @confirm="deleteLineItem(lineItem)"
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
                  name: 'creatives',
                  query: {
                    advertiser_id: route.query.advertiser_id,
                    campaign_id: route.query.campaign_id,
                    line_item_id: lineItem.id,
                  },
                }"
                class="tw-transition-[color] hover:tw-text-primary"
              >
                <UMarquee>{{ lineItem.name }}</UMarquee>
              </router-link>
            </UTable.BodyCell>
            <UTable.BodyCell>
              <router-link
                :to="{
                  name: 'creatives',
                  query: {
                    advertiser_id: route.query.advertiser_id,
                    campaign_id: route.query.campaign_id,
                    line_item_id: lineItem.id,
                  },
                }"
              >
                <Pill>
                  {{ lineItem.associated_creatives_count.toLocaleString('en') }}
                </Pill>
              </router-link>
            </UTable.BodyCell>
            <UTable.BodyCell>
              <UToggle
                :model-value="lineItem.active"
                @update:model-value="toggleLineItemActive(lineItem)"
              ></UToggle>
            </UTable.BodyCell>
            <UTable.BodyCell>
              <UStatus v-if="lineItem.delivery_status === 'not_bidding'" color="red">
                NOT BIDDING
              </UStatus>
              <UStatus v-else-if="lineItem.delivery_status === 'winning'" color="green">
                WINNING
              </UStatus>
              <UStatus v-else-if="lineItem.delivery_status === 'not_winning'" color="red">
                NOT WINNING
              </UStatus>
              <template v-else>-</template>
            </UTable.BodyCell>
            <UTable.BodyCell>
              {{ isNil(lineItem.type) ? '-' : getLineItemTypeLabel(lineItem.type) }}
            </UTable.BodyCell>
            <UTable.BodyCell>
              <template v-if="isNil(getLineItemLifetimeBudget(lineItem))">-</template>
              <template v-else>
                <template v-if="isLineItemBudgetType(lineItem).spend">$</template
                >{{ getLineItemLifetimeBudget(lineItem).toLocaleString('en') }}
                <template v-if="isLineItemBudgetType(lineItem).impression">imps</template>
              </template>
            </UTable.BodyCell>
            <UTable.BodyCell>
              <template v-if="isNil(getLineItemDailyBudget(lineItem))">-</template>
              <template v-else>
                <template v-if="isLineItemBudgetType(lineItem).spend">$</template
                >{{ getLineItemDailyBudget(lineItem).toLocaleString('en') }}
                <template v-if="isLineItemBudgetType(lineItem).impression">imps</template>
              </template>
            </UTable.BodyCell>
            <UTable.BodyCell>
              {{ isNil(lineItem.start_date) ? '-' : formatDate(lineItem.start_date) }}
            </UTable.BodyCell>
            <UTable.BodyCell>
              {{ isNil(lineItem.end_date) ? '-' : formatDate(lineItem.end_date) }}
            </UTable.BodyCell>
            <UTable.BodyCell>
              {{ isNil(lineItem.osi) ? '-' : lineItem.osi.toLocaleString('en') }}
            </UTable.BodyCell>
            <UTable.BodyCell>
              {{
                isNil(lineItem.metrics?.spend?.today)
                  ? '-'
                  : `$${Number(lineItem.metrics.spend.today.toFixed(2)).toLocaleString('en')}`
              }}
            </UTable.BodyCell>
            <UTable.BodyCell>
              {{
                isNil(lineItem.metrics?.spend?.lifetime)
                  ? '-'
                  : `$${Number(lineItem.metrics.spend.lifetime.toFixed(2)).toLocaleString('en')}`
              }}
            </UTable.BodyCell>
            <UTable.BodyCell>
              {{
                isNil(lineItem.metrics?.impressions?.today)
                  ? '-'
                  : lineItem.metrics.impressions.today.toLocaleString('en')
              }}
            </UTable.BodyCell>
            <UTable.BodyCell>
              {{
                isNil(lineItem.metrics?.impressions?.lifetime)
                  ? '-'
                  : lineItem.metrics.impressions.lifetime.toLocaleString('en')
              }}
            </UTable.BodyCell>
          </UTable.Row>
        </template>
        <UTable.Row v-else w-full>No data</UTable.Row>
      </template>
    </UTable>
  </div>
</template>
