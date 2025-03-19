<script setup>
import { computed, provide, ref, toRef, watch } from 'vue'
import UModal from 'src/components/ui/UModal.vue'
import UTabs from 'src/components/ui/UTabs.vue'
import ListItems from './components/ListItems/index.vue'
import Overview from './components/Overview.vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  list: {
    type: Object,
    default: () => ({}),
  },
  listItems: {
    type: Object,
    default: () => ({ isListItemsLoading: false, listItems: [] }),
  },
  handleSubmit: {
    type: Function,
    required: true,
  },
})

provide(
  'listItems',
  toRef(() => props.listItems)
)

const router = useRouter()

const $list = ref({
  active: true,
})
watch(
  () => props.list,
  (value) => {
    $list.value = { ...$list.value, ...value }
  },
  { immediate: true }
)
provide('list', $list)

const isListCreated = computed(() => $list.value.id !== undefined)
provide('isListCreated', isListCreated)

const tabs = computed(() => [
  { label: 'Overview', value: 'overview', component: Overview },
  {
    label: 'List Items',
    value: 'list_items',
    component: ListItems,
    disabled: !isListCreated.value,
  },
])
const tab = ref('overview')
const tabData = computed(() => tabs.value.find(({ value }) => value === tab.value))

const goToListsPage = () => {
  router.push({ name: 'lists' })
}
const submit = async (submitterName) => {
  await props.handleSubmit($list)
  switch (submitterName) {
    case 'close':
      goToListsPage()
      break

    case 'continue':
      tab.value = 'list_items'
      break
  }
}
</script>

<template>
  <UModal model-value tag="form" width="xl" close-button @hide="goToListsPage">
    <template #title>
      <slot name="title"></slot>
    </template>
    <UTabs v-model="tab" align="justify" :tabs="tabs" pills />
    <KeepAlive>
      <component :is="tabData.component" @handle-submit="submit" />
    </KeepAlive>
  </UModal>
</template>

<style lang="scss" scoped></style>
