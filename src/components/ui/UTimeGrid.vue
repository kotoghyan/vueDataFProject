<script setup>
import { ref, watch, computed } from 'vue'
import moment from 'moment'
import { useMousePressed, useElementByPoint, useMouse, watchDebounced } from '@vueuse/core'

const model = defineModel({ type: Object, default: () => ({}) })

const COLUMNS = 25

const value = ref({})

moment.updateLocale('en', {
  week: { dow: 1 },
})
const weekdaysShort = moment.weekdaysShort(true)
const hours = Array.from({ length: 24 }, (_, i) => ({
  hour: (i % 12) + 1,
  ampm: i < 12 ? 'AM' : 'PM',
}))

const currentState = ref()
const { pressed } = useMousePressed()
const debouncedPressed = ref(false)
watchDebounced(
  pressed,
  () => {
    if (pressed.value) {
      debouncedPressed.value = pressed.value

      const index = currentElement.value.dataset.cellIndex
      if (index) {
        currentState.value = isCellSelected(index)
      }
    }
  },
  { debounce: 100 }
)
watch(pressed, () => {
  if (!pressed.value) {
    debouncedPressed.value = pressed.value
  }
})
const { x, y } = useMouse({ type: 'client' })
const { element } = useElementByPoint({ x, y })
const currentElement = computed(() => debouncedPressed.value && element.value)
watch(currentElement, () => {
  if (!currentElement.value) {
    return
  }

  const index = currentElement.value.dataset.cellIndex
  if (index) {
    if (currentState.value) {
      unselectCell(index)
    } else {
      selectCell(index)
    }
  }
})
const selectCell = (index) => {
  if (isCellSelected(index)) {
    return
  }

  const row = getRowFromIndex(index)
  const col = getColumnFromIndex(index)
  value.value[row] = [...(value.value[row] || []), col]

  updateModel()
}
const unselectCell = (index) => {
  if (!isCellSelected(index)) {
    return
  }

  const row = getRowFromIndex(index)
  const col = getColumnFromIndex(index)
  value.value[row] = value.value[row].filter((item) => item !== col)

  updateModel()
}

const isHour = (index) => index > 0 && index < COLUMNS
const isWeekday = (index) => index >= COLUMNS && index % COLUMNS === 0
const getRowFromIndex = (index) => Math.floor(index / COLUMNS)
const getColumnFromIndex = (index) => index % COLUMNS
const isCellSelected = (index) =>
  value.value[getRowFromIndex(index)]?.includes(getColumnFromIndex(index))
const startPress = ref()
const handleMouseDown = () => (startPress.value = Date.now())
const toggleSelect = (index) => {
  if (Date.now() - startPress.value >= 100) {
    return
  }

  const row = getRowFromIndex(index)
  const col = getColumnFromIndex(index)

  if (isHour(index)) {
    const isSomeSelected = Object.values(value.value).some((item) => item.includes(col))
    value.value = Object.fromEntries(
      Object.entries(value.value).map(([w, hours]) => [
        w,
        isSomeSelected ? hours.filter((item) => item !== col) : [...(hours || []), col],
      ])
    )
  } else if (isWeekday(index)) {
    const isSomeSelected = value.value[row]?.length > 0
    if (isSomeSelected) {
      delete value.value[row]
    } else {
      const rowAllCols = Array.from({ length: COLUMNS - 1 }, (_, i) => i + 1)
      value.value[row] = [...(value.value[row] || []), ...rowAllCols]
    }
  } else if (isCellSelected(index)) {
    value.value[row] = value.value[row].filter((item) => item !== col)
  } else {
    value.value[row] = [...(value.value[row] || []), col]
  }

  updateModel()
}

const updateModel = () => {
  model.value = Object.fromEntries(
    Object.entries(value.value).map(([weekday, weekHours]) => [
      weekdaysShort[weekday - 1],
      weekHours.map((h) => {
        const { hour, ampm } = hours[h - 1]
        return `${hour}${ampm}`
      }),
    ])
  )
}
watch(
  model,
  (newValue) => {
    value.value = Object.fromEntries(
      Object.entries(newValue).map(([weekday, weekHours]) => [
        weekdaysShort.indexOf(weekday) + 1,
        weekHours.map((h) => hours.findIndex(({ hour, ampm }) => `${hour}${ampm}` === h) + 1),
      ])
    )
  },
  { immediate: true }
)
</script>

<template>
  <div
    class="tw-grid tw-h-[17.5625rem] tw-w-max tw-grid-cols-[repeat(25,1fr)] tw-grid-rows-[repeat(8,1fr)]"
  >
    <div
      v-for="(_, index) in Array(200)"
      :key="index"
      class="cell tw-flex tw-cursor-pointer tw-select-none tw-items-center tw-justify-center"
      :data-cell-index="!isHour(index) && !isWeekday(index) ? index : undefined"
      :class="{
        '!tw-border-dark-green tw-bg-dark-green': isCellSelected(index),
        'tw-rounded-ss-xl':
          isCellSelected(index) && !isCellSelected(index - 1) && !isCellSelected(index - COLUMNS),
        'tw-rounded-se-xl':
          isCellSelected(index) && !isCellSelected(index + 1) && !isCellSelected(index - COLUMNS),
        'tw-rounded-bl-xl':
          isCellSelected(index) && !isCellSelected(index - 1) && !isCellSelected(index + COLUMNS),
        'tw-rounded-br-xl':
          isCellSelected(index) && !isCellSelected(index + 1) && !isCellSelected(index + COLUMNS),
      }"
      @mousedown="handleMouseDown"
      @click="toggleSelect(index)"
    >
      <p v-if="isHour(index)">
        {{ hours[index - 1].hour }}
        <span class="tw-text-xs tw-text-gray">{{ hours[index - 1].ampm }}</span>
      </p>
      <template v-else-if="isWeekday(index)">
        {{ weekdaysShort[getRowFromIndex(index) - 1] }}
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cell {
  @apply tw-border-t tw-border-ultralight-primary;

  &:not(:nth-child(25n)) {
    @apply tw-border-r;
  }

  @for $i from 0 through 6 {
    &:nth-child(#{$i * 25 + 26}) {
      @apply tw-border-r-0 tw-border-t-0;
    }
  }

  @for $i from 1 through 25 {
    &:nth-child(#{$i}) {
      @apply tw-border-r-0;
    }
  }

  @for $i from 1 through 50 {
    &:nth-child(#{$i}) {
      @apply tw-border-t-0;
    }
  }
}
</style>
