<script setup>
import UIcon from 'src/components/ui/UIcon.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { useMutationObserver } from '@vueuse/core'

const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  sort: {
    type: Object,
    default: () => ({ key: [], value: [] }),
  },
})
const emit = defineEmits(['update:sort'])

const sortBy = ref()
watch(
  () => props.sort,
  (newValue) => {
    sortBy.value = newValue
  },
  {
    immediate: true,
  }
)
const isSortBy = computed(() => ({
  asc: sortBy.value.value[0] === 'asc',
  desc: sortBy.value.value[0] === 'desc',
}))
const handleSort = (column) => {
  if (!column.sort) {
    return
  }
  const sortParams = {
    key: [column.name],
    value: [isSortBy.value.asc && sortBy.value.key[0] === column.name ? 'desc' : 'asc'],
  }
  emit('update:sort', sortParams)
}

const isArrowIconVisible = (column) => {
  const isSortKeyDiff = sortBy.value.key[0] !== column.name
  return {
    both: isSortKeyDiff,
    up: isSortBy.value.asc,
    down: isSortBy.value.desc,
  }
}

const el = ref(null)

const getTable = () => el.value?.closest('table')
const addCellsDimension = () => {
  const allTr = getTable().querySelectorAll('tr')

  props.columns.forEach(({ name, minWidth, maxWidth, width }) => {
    const styles = {
      minWidth,
      maxWidth,
      width,
    }

    for (const tr of allTr) {
      const tdInHeadWithName = el.value.querySelector(`td[data-id="${name}"]`)
      if (!tdInHeadWithName) {
        continue
      }

      const td = tr.querySelector(`td:nth-child(${tdInHeadWithName.cellIndex + 1})`)
      if (!td) {
        continue
      }

      for (const [key, value] of Object.entries(styles)) {
        td.style[key] = value === undefined ? 'unset' : value
      }
    }
  })
}
onMounted(() => {
  const table = getTable()
  if (table) {
    addCellsDimension()
    useMutationObserver(table, addCellsDimension, {
      subtree: true,
      childList: true,
    })
  }
})
</script>

<template>
  <thead ref="el" class="tw-sticky tw-top-0 tw-z-[2] tw-bg-white">
    <tr>
      <td
        v-for="column in columns"
        :key="column.name"
        class="tw-text-dark-primary"
        :class="[{ 'tw-cursor-pointer': column.sort }, column.class]"
        :data-id="column.name"
        @click="handleSort(column)"
      >
        <div class="tw-flex">
          <slot :name="column.name">
            {{ column.label }}
          </slot>
          <div v-if="column.sort" class="tw-ml-1 tw-text-[1.5rem]">
            <UIcon v-if="isArrowIconVisible(column).both" name="arrow-up-arrow-down" />
            <UIcon v-else-if="isArrowIconVisible(column).up" name="arrow-up" />
            <UIcon v-else-if="isArrowIconVisible(column).down" name="arrow-down" />
          </div>
        </div>
      </td>
    </tr>
  </thead>
</template>
