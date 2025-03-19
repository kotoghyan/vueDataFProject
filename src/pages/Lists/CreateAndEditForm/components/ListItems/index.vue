<script setup>
import { ListsAPI } from 'src/api'
import { computed, ref, inject, watch } from 'vue'
import UButton from 'components/ui/UButton.vue'
import UIcon from 'components/ui/UIcon.vue'
import LatLongRow from './components/LatLongRow.vue'
import ZipCodeRow from './components/ZipCodeRow.vue'
import DealIDRow from './components/DealIDRow.vue'

const list = inject('list')
const $listItems = inject('listItems')

const isListType = computed(() => ({
  lat_long: list.value.type === 'lat_long',
  zip_code: list.value.type === 'zip_code',
  deal_id: list.value.type === 'deal_id',
}))

const listItems = ref([])
watch(
  () => $listItems.value.listItems,
  (value) => {
    listItems.value.unshift(...value)
  },
  { immediate: true }
)
const hasListsItems = computed(() => listItems.value.length > 0)

const setListItem = (index, values) => {
  listItems.value[index] = { ...listItems.value[index], ...values }
}
const addListItem = () => {
  listItems.value.push({ canEdit: true, attributes: {} })
}
const removeListItem = async (index, id) => {
  listItems.value.splice(index, 1)
  if (id !== undefined) {
    ListsAPI.deleteListItem({ list_id: list.value.id, id })
  }
}
const saveListItem = async (item) => {
  item.isSaving = true
  item.canEdit = false
  try {
    if (item.id !== undefined) {
      await ListsAPI.editListItem({ list_id: list.value.id, ...item })
    } else {
      const data = await ListsAPI.createListItem({ id: list.value.id, ...item })
      item.id = data.id
    }
  } catch (e) {}
  item.isSaving = false
}
</script>

<template>
  <div class="tw-mt-6">
    <div v-if="$listItems.isListItemsLoading" class="tw-flex tw-justify-center">
      <UIcon class="tw-animate-spin tw-text-[2.5rem] tw-text-primary" name="spinner" />
    </div>
    <template v-else>
      <div v-if="hasListsItems" class="tw-space-y-2.5">
        <form
          v-for="(item, index) in listItems"
          :key="index"
          class="tw-flex tw-items-end tw-gap-2.5"
          @submit.prevent="saveListItem(item)"
        >
          <LatLongRow
            v-if="isListType.lat_long"
            :model-value="item"
            :index="index"
            @update:model-value="setListItem(index, $event)"
          />
          <ZipCodeRow
            v-else-if="isListType.zip_code"
            :model-value="item"
            :index="index"
            @update:model-value="setListItem(index, $event)"
          />
          <DealIDRow
            v-else-if="isListType.deal_id"
            :model-value="item"
            :index="index"
            @update:model-value="setListItem(index, $event)"
          />
          <UButton
            v-if="!item.canEdit"
            bg="light-gray"
            square
            :disabled="item.isSaving"
            @click="item.canEdit = true"
          >
            <UIcon v-if="item.isSaving" class="tw-animate-spin tw-text-[1.5rem]" name="spinner" />
            <UIcon v-else class="tw-text-[1.5rem]" name="edit" />
          </UButton>
          <UButton v-else type="submit" icon="sign" bg="light-gray" square />
          <UButton
            type="submit"
            icon="cross"
            bg="light-gray"
            square
            @click="removeListItem(index, item.id)"
          />
        </form>
      </div>
      <div v-else class="tw-w-full tw-text-center">No List Items</div>
    </template>
  </div>
  <div class="tw-mt-4 tw-flex tw-justify-between tw-gap-2.5">
    <UButton v-if="!$listItems.isListItemsLoading" @click="addListItem">Add List Item</UButton>
    <UButton v-close-popup class="tw-ml-auto" variant="outlined">Close</UButton>
  </div>
</template>
