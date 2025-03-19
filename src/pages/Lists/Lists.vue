<script setup>
import { computed, ref } from 'vue'
import { ListsAPI } from 'src/api'
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
import Pill from 'components/shared/Pill.vue'
import UMarquee from 'components/ui/UMarquee.vue'

const router = useRouter()
const route = useRoute()

const columnClass = '!tw-w-[calc(100%/3)]'
const columns = [
  {},
  {
    name: 'name',
    label: 'Name',
    minWidth: '28.625rem',
    maxWidth: '28.625rem',
  },
  {
    name: 'list_items',
    label: 'List Items',
    class: columnClass,
  },
  {
    name: 'list_type',
    label: 'List Type',
    class: columnClass,
  },
  {
    name: 'active',
    label: 'Status',
    class: columnClass,
  },
]

const filters = [
  {
    label: 'Lat Long',
    value: 'lat_long',
  },
  {
    label: 'Zip Code',
    value: 'zip_code',
  },
  {
    label: 'Deal ID',
    value: 'deal_id',
  },
]
const usedFilter = ref([])
const usedFilterModel = computed({
  get() {
    return usedFilter.value
  },
  set(value) {
    usedFilter.value = value
    getLists()
  },
})

const searchValue = ref('')
const searchModel = computed({
  get() {
    return searchValue.value
  },
  set(val) {
    searchValue.value = val
    getLists()
  },
})

const pageSize = ref(LocalStorageService.get('per_page') ?? 10)
const pageSizeModel = computed({
  get: () => pageSize.value,
  set: (val) => {
    LocalStorageService.set('per_page', val)
    pageSize.value = val
    page.value = 1
    getLists()
  },
})

const page = ref(route.query.page ? +route.query.page : 1)
const pageModel = computed({
  get: () => page.value,
  set: (val) => {
    page.value = val
    router.push({ query: { page: val } })
    getLists()
  },
})

const isListsLoading = ref(false)
const lists = ref({})
const hasLists = computed(() => lists.value.data?.length > 0)
const getLists = async () => {
  BusService.emit('cancelListsGetAll')

  isListsLoading.value = true
  try {
    const params = {
      types: usedFilter.value,
      per_page: pageSize.value,
      page: page.value,
      search: searchValue.value,
    }
    lists.value = await ListsAPI.getAll(params, { customCancelEvent: 'cancelListsGetAll' })
  } catch (error) {}
  isListsLoading.value = false
}
getLists()

const deleteList = async (list) => {
  await ListsAPI.delete({ id: list.id })
  if (!hasLists.value) {
    page.value = 1
  }
  getLists()
}

const listTypes = [
  {
    label: 'Lat/Long',
    value: 'lat_long',
  },
  {
    label: 'Zip Code',
    value: 'zip_code',
  },
  {
    label: 'Deal ID',
    value: 'deal_id',
  },
]
const getListTypeLabel = (type) => {
  const foundType = listTypes.find(({ value }) => value === type)
  return foundType.label
}
</script>

<template>
  <div class="tw-mb-7.5 tw-flex tw-items-center tw-justify-between">
    <h1 class="page-title">Lists</h1>
    <UButton :to="{ name: 'newList' }" icon="add" variant="outlined">New List</UButton>
  </div>
  <div class="tw-rounded-xl tw-bg-white tw-p-6">
    <div class="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2.5">
      <UButtonToggle v-model="usedFilterModel" :options="filters" type="checkbox" />
      <SearchInput v-model="searchModel" placeholder="Search by Name" :debounce="300" />
    </div>
    <UTable
      v-model:page="pageModel"
      v-model:pageSize="pageSizeModel"
      class="tw-mt-2.5"
      :total="lists?.meta?.total"
      pagination
    >
      <template #head>
        <UTable.Head :columns="columns"> </UTable.Head>
      </template>
      <template #body>
        <template v-if="isListsLoading">
          <UTable.Row v-for="rowN in 10" :key="`row-${rowN}`">
            <UTable.BodyCell v-for="cellN in columns.length" :key="`cell-${cellN}`">
              <div class="tw-h-2.5 tw-w-16 tw-animate-pulse tw-rounded-full tw-bg-black-16"></div>
            </UTable.BodyCell>
            <UTable.BodyCell />
          </UTable.Row>
        </template>
        <template v-else-if="hasLists">
          <UTable.Row v-for="list in lists.data" :key="list.id">
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
                      :to="{ name: 'editList', params: { id: list.id } }"
                    >
                      <div class="q-focus-helper"></div>
                      Edit
                    </router-link>
                    <ConfirmModal
                      class="q-hoverable tw-cursor-pointer tw-text-red"
                      @confirm="deleteList(list)"
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
              <UMarquee>{{ list.name }}</UMarquee>
            </UTable.BodyCell>
            <UTable.BodyCell>
              <Pill>
                {{ list.items_count.toLocaleString('en') }}
              </Pill>
            </UTable.BodyCell>
            <UTable.BodyCell>
              {{ getListTypeLabel(list.type) }}
            </UTable.BodyCell>
            <UTable.BodyCell>
              <UStatus :color="list.active ? 'green' : 'red'">
                {{ list.active ? 'Active' : 'Inactive' }}
              </UStatus>
            </UTable.BodyCell>
          </UTable.Row>
        </template>
        <UTable.Row v-else w-full>No data</UTable.Row>
      </template>
    </UTable>
  </div>
</template>
