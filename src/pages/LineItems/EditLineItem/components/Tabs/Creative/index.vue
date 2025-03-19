<script setup>
import { computed, inject, onBeforeUnmount, ref } from 'vue'
import UStatus from 'src/components/ui/UStatus.vue'
import UTable from 'src/components/ui/UTable/index'
import UModal from 'src/components/ui/UModal.vue'
import UMarquee from 'components/ui/UMarquee.vue'
import UIcon from 'components/ui/UIcon.vue'
import SearchInput from 'components/shared/Inputs/SearchInput.vue'
import CreateButton from './components/CreateButton.vue'
import moment from 'moment'
import { AdvertisersAPI, LineItemsAPI } from 'src/api'
import { BusService, LocalStorageService } from 'src/services'
import { isNil } from 'lodash-es'

BusService.emit('lineItemWaitRequest', 'creatives')

const lineItem = inject('lineItem')

const columnClass = '!tw-w-[calc(100%/5)]'
const columns = [
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

const creativeTypes = ref([
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
])
const isType = (type) => ({
  banner: type === 0,
  video: type === 1,
  audio: type === 4,
})

const searchValue = ref('')
const hasSearchValue = computed(() => searchValue.value.length > 0)

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

const page = ref(1)
const pageModel = computed({
  get: () => page.value,
  set: (val) => {
    page.value = val
    getCreatives()
  },
})

const isCreativesLoading = ref(false)
const creatives = ref([])
const filteredCreatives = computed(() => {
  let data = creatives.value.data ?? []

  if (hasSearchValue.value) {
    data = data.filter(({ name }) => name.toLowerCase().includes(searchValue.value.toLowerCase()))
  }

  return data
})
const hasCreatives = computed(() => filteredCreatives.value.length > 0)
const getCreatives = async () => {
  BusService.emit('cancelAdvertisersGetCreatives')
  isCreativesLoading.value = true
  try {
    const params = {
      per_page: pageSize.value,
      page: page.value,
      advertiser_id: lineItem.value.advertiser_id,
    }
    creatives.value = await AdvertisersAPI.getCreatives(params, {
      customCancelEvent: 'cancelAdvertisersGetCreatives',
    })
  } catch (error) {}
  isCreativesLoading.value = false
}
getCreatives()

const getCreativeType = (type) => {
  const creativeType = creativeTypes.value.find(({ value }) => value === type)
  return creativeType
}
const formatDate = (date) => moment(date).format('MM.DD.YYYY')
const getCreativeStartDate = (creativeId) => {
  const creative = lineItemCreatives.value.data.find(
    ({ creative_id }) => creative_id === creativeId
  )
  return isNil(creative?.start_date) ? creative?.start_date : formatDate(creative.start_date)
}
const getCreativeEndDate = (creativeId) => {
  const creative = lineItemCreatives.value.data.find(
    ({ creative_id }) => creative_id === creativeId
  )
  return isNil(creative?.end_date) ? creative?.end_date : formatDate(creative.end_date)
}

const { selectedCreatives: selected, lineItemCreatives } = inject('lineItemCreatives')
const createCreatives = async () => {
  const addedCreatives = selected.value.filter(
    (id) => !lineItemCreatives.value.data.some((item) => item.creative_id === id)
  )
  const promises = addedCreatives.map((id) =>
    LineItemsAPI.createCreative({
      line_item_id: lineItem.value.id,
      creative_id: id,
    })
  )
  await Promise.all(promises)
}
const deleteCreatives = async () => {
  const removedCreatives = lineItemCreatives.value.data.filter(
    (item) => !selected.value.includes(item.creative_id)
  )
  const promises = removedCreatives.map((item) =>
    LineItemsAPI.deleteCreative({
      line_item_id: lineItem.value.id,
      creative_id: item.id,
    })
  )
  await Promise.all(promises)
}
const handleSubmit = async () => {
  try {
    await Promise.all([createCreatives(), deleteCreatives()])
    BusService.emit('lineItemCompletedRequest', 'creatives')
  } catch (error) {
    BusService.emit('lineItemWaitRequestError', 'creatives')
  }
}
BusService.on('lineItemSubmit', handleSubmit)
onBeforeUnmount(() => {
  BusService.off('lineItemSubmit', handleSubmit)
})
</script>

<template>
  <div class="tw-w-full tw-rounded-xl tw-bg-white tw-p-6">
    <p class="tw-text-lg tw-font-medium">Creative Association</p>
    <div class="tw-my-6 tw-flex tw-items-center tw-gap-4">
      <SearchInput v-model="searchValue" placeholder="Search by Name" :debounce="300" />
      <CreateButton class="tw-ml-auto" @hide="getCreatives" />
    </div>
    <UTable
      v-model:selected="selected"
      v-model:page="pageModel"
      v-model:pageSize="pageSizeModel"
      :total="creatives?.meta?.total"
      selection="multiple"
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
          </UTable.Row>
        </template>
        <template v-else-if="hasCreatives">
          <UTable.Row v-for="creative in filteredCreatives" :id="creative.id" :key="creative.id">
            <UTable.BodyCell>
              <div class="tw-flex tw-items-center">
                <router-link
                  :to="{ name: 'editCreative', params: { id: creative.id } }"
                  class="tw-transition-[color] hover:tw-text-primary"
                  target="_blank"
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
              <template #default>{{ getCreativeType(creative.type).label }}</template>
            </UTable.BodyCell>
            <UTable.BodyCell>
              {{ getCreativeStartDate(creative.id) ?? '-' }}
            </UTable.BodyCell>
            <UTable.BodyCell>
              {{ getCreativeEndDate(creative.id) ?? '-' }}
            </UTable.BodyCell>
            <UTable.BodyCell>
              <template v-if="isNil(creative.thumbnail_url)">-</template>
              <div
                v-else-if="isType(creative.type).audio"
                class="tw-flex tw-items-center tw-gap-x-1"
              >
                <UIcon name="audio" class="tw-flex-shrink-0 tw-text-[1.5rem] tw-text-primary" />
                <span class="tw-text-sm tw-font-medium tw-text-dark">{{
                  creative.name ?? `Record ${index + 1}`
                }}</span>
              </div>
              <UModal v-else class="tw-flex tw-h-16 tw-w-16 tw-items-center" no-padding>
                <template #trigger>
                  <img
                    class="tw-max-h-full tw-max-w-full tw-cursor-pointer tw-rounded-lg"
                    :src="creative.thumbnail_url"
                    alt=""
                  />
                </template>
                <img class="tw-max-h-full tw-max-w-full" :src="creative.thumbnail_url" alt="" />
              </UModal>
            </UTable.BodyCell>
          </UTable.Row>
        </template>
        <UTable.Row v-else w-full>No data</UTable.Row>
      </template>
    </UTable>
  </div>
</template>
