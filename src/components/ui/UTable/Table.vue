<script setup>
import {
  ref,
  watch,
  computed,
  onMounted,
  createApp,
  onBeforeUnmount,
  useSlots,
  h,
  Fragment,
} from 'vue'
import Select from 'src/components/ui/USelect.vue'
import UCheckbox from 'components/ui/UCheckbox.vue'
import UScrollbar from 'components/ui/UScrollbar.vue'
import UPagination from 'components/ui/UPagination.vue'

const props = defineProps({
  stickyColumn: {
    type: Number,
    default: 1,
  },
  pagination: {
    type: Boolean,
  },
  page: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  total: {
    type: Number,
  },
  selection: {
    type: String,
    validator(value) {
      return [undefined, 'multiple', 'single'].includes(value)
    },
  },
  selected: {
    type: Array,
    default: () => [],
  },
  scrollParent: {
    type: Element,
    default: null,
  },
})
const emit = defineEmits(['update:page', 'update:pageSize', 'update:selected'])
const slots = useSlots()

const table = ref(null)
const tableWrap = ref(null)

const perPageOptions = [10, 20, 50]
const pagesMaxCount = computed(() => Math.ceil(props.total / itemsPerPage.value))

const currentPage = ref()
watch(
  () => props.page,
  (newValue) => {
    currentPage.value = newValue
  },
  { immediate: true }
)
const pageModel = computed({
  get() {
    return currentPage.value
  },
  set(value) {
    currentPage.value = value
    emit('update:page', value)
  },
})

const itemsPerPage = ref()
watch(
  () => props.pageSize,
  (newValue) => {
    itemsPerPage.value = newValue
  },
  { immediate: true }
)
const pageSizeModel = computed({
  get() {
    return itemsPerPage.value
  },
  set(value) {
    itemsPerPage.value = value
    emit('update:pageSize', value)
  },
})

const isSelection = computed(() => ({
  multiple: props.selection === 'multiple',
}))
const bodyRowsIds = ref([])
const renderSelection = () => {
  if (props.selection === undefined || table.value === null) {
    return
  }

  const SELECTION_CELL_ID = 'js_table_row_selection'

  if (bodyRowsIds.value.length === 0) {
    for (const el of table.value.querySelectorAll(`.${SELECTION_CELL_ID}`)) {
      el.remove()
    }
    return
  }

  const checkboxClass = 'tw-mr-2.5'

  const headRows = table.value.querySelectorAll('thead tr')
  for (const row of headRows) {
    const selectionCell = row.querySelector(`.${SELECTION_CELL_ID}`)
    if (selectionCell !== null && isSelection.value.multiple) {
      continue
    }

    const td = document.createElement('td')
    td.className = SELECTION_CELL_ID

    if (isSelection.value.multiple) {
      const updateModelValue = (bool) => {
        let selected

        if (bool) {
          selected = [...new Set([...props.selected, ...bodyRowsIds.value])]
        } else {
          selected = props.selected.filter((id) => !bodyRowsIds.value.includes(id))
        }

        emit('update:selected', selected)
      }
      const checkboxInstance = createApp({
        render: () =>
          h(UCheckbox, {
            class: checkboxClass,
            modelValue: bodyRowsIds.value.every((id) => props.selected.includes(id)),
            'onUpdate:modelValue': updateModelValue,
          }),
      })
      checkboxInstance.mount(td)
    }

    row.insertAdjacentElement('afterbegin', td)
  }

  const bodyRows = table.value.querySelectorAll('tr[data-table-row]')
  for (const [index, row] of bodyRows.entries()) {
    const selectionCell = row.querySelector(`.${SELECTION_CELL_ID}`)
    if (selectionCell !== null) {
      continue
    }

    const id = bodyRowsIds.value[index]

    const td = document.createElement('td')
    td.className = SELECTION_CELL_ID
    const updateModelValue = (bool) => {
      let selected = props.selected

      if (bool) {
        selected.push(id)
      } else {
        selected = selected.filter((val) => val !== id)
      }

      emit('update:selected', selected)
    }
    const checkboxInstance = createApp({
      render: () =>
        h(UCheckbox, {
          class: checkboxClass,
          modelValue: props.selected.includes(id),
          'onUpdate:modelValue': updateModelValue,
        }),
    })
    checkboxInstance.mount(td)
    row.insertAdjacentElement('afterbegin', td)
  }
}
watch(
  () => slots.body(),
  (newValue) => {
    const bodySlotChildren = newValue[0].type === Fragment ? newValue[0].children : newValue
    const ids = bodySlotChildren.reduce((acc, child) => {
      const { id } = child.props

      if (id !== undefined) {
        return [...acc, id]
      }

      return acc
    }, [])
    bodyRowsIds.value = ids
    renderSelection()
  },
  {
    immediate: true,
  }
)
onMounted(renderSelection)

const _scrollParent = computed(() => props.scrollParent || window)
const makeHeadSticky = () => {
  const thead = table.value.querySelector('thead')
  const tableRect = table.value.getBoundingClientRect()
  const offsetTop = tableRect.top

  const isSticky = offsetTop < 0
  thead.style.translate = `0 ${isSticky ? Math.abs(offsetTop) : 0}px`
}
onMounted(() => {
  _scrollParent.value?.addEventListener('scroll', makeHeadSticky)
})
onBeforeUnmount(() => {
  _scrollParent.value?.removeEventListener('scroll', makeHeadSticky)
})

const makeBodyCellsSticky = () => {
  const isScrollStarted = tableWrap.value.scrollLeft > 0
  const columns = table.value.querySelectorAll(`td:nth-child(${props.stickyColumn})`)
  for (const col of columns) {
    col.classList.toggle('_table-column--sticky', isScrollStarted)
  }
}

const mutationObserver = ref(null)
onMounted(() => {
  mutationObserver.value = new MutationObserver(() => {
    renderSelection()
    makeHeadSticky()
    makeBodyCellsSticky()
  })
  mutationObserver.value.observe(table.value, {
    childList: true,
    subtree: true,
  })
})
onBeforeUnmount(() => {
  mutationObserver.value?.disconnect()
})

const resizeObserver = ref(null)
onMounted(() => {
  resizeObserver.value = new ResizeObserver(() => {
    makeHeadSticky()
    makeBodyCellsSticky()
  })
  resizeObserver.value.observe(table.value)
})
onBeforeUnmount(() => {
  resizeObserver.value?.disconnect()
})
</script>

<template>
  <div>
    <div
      ref="tableWrap"
      class="tw-no-scrollbar tw-overflow-x-auto tw-overflow-y-hidden"
      @scroll="makeBodyCellsSticky"
    >
      <table
        ref="table"
        class="tw-max-w-full tw-table-auto tw-border-separate tw-border-spacing-0 tw-whitespace-nowrap tw-font-medium"
      >
        <slot name="head"></slot>
        <slot name="body"></slot>
      </table>
    </div>
    <UScrollbar :target="tableWrap" />
    <div v-if="pagination && total" class="tw-mr-auto tw-mt-12 tw-flex tw-justify-between">
      <UPagination v-model="pageModel" :max="pagesMaxCount" :max-pages="7" direction-links />
      <Select v-model="pageSizeModel" :options="perPageOptions"> </Select>
    </div>
  </div>
</template>

<style lang="scss">
._table-column--sticky {
  @apply tw-bg-white;

  position: sticky;
  left: 0;
  z-index: 1;
  filter: drop-shadow(0.125rem 0 0.25rem rgb(0 0 0 / 10%));
}
</style>

<style lang="scss" scoped>
:deep {
  tr {
    height: 4.0625rem;
  }

  td:not(:first-child) {
    padding-left: 0.625rem;
  }
}
</style>
