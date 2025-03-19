<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  wFull: {
    type: Boolean,
    default: false,
  },
  id: {
    type: String,
  },
})

const cell = ref()

onMounted(() => {
  setCellFullWidth()
})

const setCellFullWidth = () => {
  if (!props.wFull) {
    return
  }

  const table = cell.value.closest('table')
  const tableRect = table.getBoundingClientRect()
  cell.value.style.width = `${tableRect.width}px`
}
</script>

<template>
  <tr
    class="tw-group/tr tw-relative after:tw-absolute after:tw-left-0 after:tw-top-0 after:tw-z-[2] after:tw-h-px after:tw-w-full after:tw-bg-ultralight-primary"
    :class="{ 'hover:tw-bg-light-gray': !wFull }"
    data-table-row
  >
    <td v-if="wFull" class="tw-relative">
      <div
        ref="cell"
        class="tw-absolute tw-bottom-0 tw-left-0 tw-right-0 tw-top-0 tw-flex tw-items-center tw-justify-center"
      >
        <slot></slot>
      </div>
    </td>
    <slot v-else></slot>
  </tr>
</template>
