<script setup>
import { computed, ref } from 'vue'
import { AdvertisersAPI, EventsAPI } from 'src/api'
import { isNil } from 'lodash-es'
import UButton from 'src/components/ui/UButton.vue'
import UButtonToggle from 'src/components/ui/UButtonToggle.vue'
import SearchInput from 'src/components/shared/Inputs/SearchInput.vue'
import UTable from 'src/components/ui/UTable/index'
import UIcon from 'components/ui/UIcon.vue'
import UStatus from 'src/components/ui/UStatus.vue'
import ConfirmModal from 'src/components/shared/Modals/ConfirmModal.vue'
import { BusService, LocalStorageService } from 'src/services'
import UPopover from 'components/ui/UPopover.vue'
import { useRoute, useRouter } from 'vue-router'
import UMarquee from 'components/ui/UMarquee.vue'

const router = useRouter()
const route = useRoute()

const filters = [
  {
    label: 'Favorites Only',
    value: 'favorite',
  },
]
const downloadOptions = [
  { label: 'CSV', value: 'csv' },
  { label: 'XLSX', value: 'xlsx' },
  { label: 'JSON', value: 'json' },
  { label: 'XML', value: 'xml' },
]

const columnClass = '!tw-w-[calc(100%/2)]'
const columns = [
  {},
  {
    name: 'name',
    label: 'Name',
    minWidth: '28.625rem',
    maxWidth: '28.625rem',
  },
  { name: 'advertiser', label: 'Advertiser', class: columnClass },
  { name: 'archived', label: 'Archived', class: columnClass },
]

const usedFilter = ref([])

const searchValue = ref('')
const searchModel = computed({
  get() {
    return searchValue.value
  },
  set(val) {
    searchValue.value = val
    getEvents()
  },
})

const pageSize = ref(LocalStorageService.get('per_page') ?? 10)
const pageSizeModel = computed({
  get: () => pageSize.value,
  set: (val) => {
    LocalStorageService.set('per_page', val)
    pageSize.value = val
    page.value = 1
    getEvents()
  },
})

const page = ref(route.query.page ? +route.query.page : 1)
const pageModel = computed({
  get: () => page.value,
  set: (val) => {
    page.value = val
    router.push({ query: { page: val } })
    getEvents()
  },
})

const isEventsLoading = ref(false)
const events = ref({})
const hasEvents = computed(() => events.value.data?.length > 0)
const getEvents = async () => {
  BusService.emit('EventsGetAll')
  isEventsLoading.value = true
  try {
    events.value = await EventsAPI.getAll(
      {
        search: searchValue.value,
        per_page: pageSize.value,
        page: page.value,
      },
      { customCancelEvent: 'EventsGetAll' }
    )
  } catch (error) {}
  isEventsLoading.value = false
}
getEvents()
const deleteEvent = async (event) => {
  await EventsAPI.delete({ id: event.id })
  if (!hasEvents.value) {
    page.value = 1
  }
  getEvents()
}

const selected = ref([])
const hasSelected = computed(() => selected.value.length > 0)
const deleteSelected = async () => {
  await EventsAPI.bulkDelete({ ids: selected.value })
  page.value = 1
  getEvents()
  selected.value = []
}

const isAdvertisersLoading = ref(false)
const advertisers = ref({})
const getAdvertisers = async () => {
  isAdvertisersLoading.value = true
  try {
    const data = await AdvertisersAPI.getAll()
    advertisers.value = data
  } catch (error) {}
  isAdvertisersLoading.value = false
}
getAdvertisers()
const getAdvertiser = (advertiserId) => advertisers.value.data.find(({ id }) => id === advertiserId)
</script>

<template>
  <div class="tw-mb-7.5 tw-flex tw-items-center tw-justify-between">
    <h1 class="page-title">Events</h1>
    <div class="tw-flex tw-gap-2.5">
      <UButton :to="{ name: 'newEvent' }" icon="add" variant="outlined">New Event</UButton>
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
      :total="events?.meta?.total"
      pagination
    >
      <template #head>
        <UTable.Head :columns="columns"> </UTable.Head>
      </template>
      <template #body>
        <template v-if="isEventsLoading">
          <UTable.Row v-for="rowN in 10" :key="`row-${rowN}`">
            <UTable.BodyCell v-for="cellN in columns.length" :key="`cell-${cellN}`">
              <div class="tw-h-2.5 tw-w-16 tw-animate-pulse tw-rounded-full tw-bg-black-16"></div>
            </UTable.BodyCell>
            <UTable.BodyCell />
          </UTable.Row>
        </template>
        <template v-else-if="hasEvents">
          <UTable.Row v-for="event in events.data" :id="event.id" :key="event.id">
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
                      @confirm="deleteEvent(event)"
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
              <UMarquee>{{ event.name }}</UMarquee>
            </UTable.BodyCell>
            <UTable.BodyCell>
              <div
                v-if="isAdvertisersLoading"
                class="tw-h-2.5 tw-w-16 tw-animate-pulse tw-rounded-full tw-bg-black-16"
              ></div>
              <template v-else-if="isNil(getAdvertiser(event.advertiser_id))"> - </template>
              <template v-else>{{ getAdvertiser(event.advertiser_id).name }}</template>
            </UTable.BodyCell>
            <UTable.BodyCell>
              <UStatus :color="event.active ? 'green' : 'red'">
                {{ event.active ? 'Active' : 'Inactive' }}
              </UStatus>
            </UTable.BodyCell>
          </UTable.Row>
        </template>
        <UTable.Row v-else w-full>No data</UTable.Row>
      </template>
    </UTable>
  </div>
</template>
