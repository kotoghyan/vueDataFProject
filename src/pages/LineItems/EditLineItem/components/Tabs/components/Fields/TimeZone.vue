<script setup>
import { ref, computed, inject } from 'vue'
import { LocalStorageService } from 'src/services'
import HintPopover from 'src/components/shared/Popovers/HintPopover.vue'
import Select from 'src/components/ui/USelect.vue'
import ButtonToggle from 'src/components/ui/UButtonToggle.vue'
import TimeGrid from 'src/components/ui/UTimeGrid.vue'
import { cloneDeep } from 'lodash-es'

const props = defineProps({
  module: {
    type: String,
    required: true,
  },
})

const model = defineModel({ type: Array, default: () => [] })

const lineItem = inject('lineItem')

const fieldKey = 'time'
const fieldGet = ($key) => model.value.find(({ key }) => key === $key)?.value
const encodeTime = (data) =>
  Object.entries(data)
    .reduce((acc, [key, values]) => [...acc, [key, values.join(',')].join(':')], [])
    .join(';')
const decodeTime = (data) =>
  data?.split(';').reduce((acc, field) => {
    const [day, times] = field.split(':')
    return { ...acc, [day]: times.split(',') }
  }, {})

const convert12hTo24h = (value) => {
  let _value = parseInt(value)

  const period = value.match(/am|pm/i)[0].toLowerCase()
  if (period === 'pm') {
    _value += 12
  }

  return _value
}
const convert24hto12h = (value) => (value <= 12 ? `${value}AM` : `${value - 12}PM`)

const increaseTime = (time = {}, term = 0) => {
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const result = {}
  for (const [weekday, timeArray] of Object.entries(time)) {
    const weekdayIndex = weekdays.findIndex((item) => item === weekday)
    for (const _time of timeArray) {
      const time24 = convert12hTo24h(_time)
      const absoluteValue = time24 + term

      if (absoluteValue <= 0) {
        let currentIndex = weekdayIndex - 1
        if (currentIndex < 0) {
          currentIndex = weekdays.length - 1
        }
        if (!result[weekdays[currentIndex]]) {
          result[weekdays[currentIndex]] = []
        }
        result[weekdays[currentIndex]].push(`${convert24hto12h(24 - Math.abs(absoluteValue))}`)
      } else if (absoluteValue > 24) {
        let currentIndex = weekdayIndex + 1
        if (currentIndex > weekdays.length - 1) {
          currentIndex = Math.abs(weekdays.length - currentIndex)
        }
        if (!result[weekdays[currentIndex]]) {
          result[weekdays[currentIndex]] = []
        }
        result[weekdays[currentIndex]].push(`${convert24hto12h(Math.abs(24 - absoluteValue))}`)
      } else {
        if (!result[weekdays[weekdayIndex]]) {
          result[weekdays[weekdayIndex]] = []
        }
        result[weekdays[weekdayIndex]].push(`${convert24hto12h(Math.abs(absoluteValue))}`)
      }
    }
  }
  return result
}

const timezoneStorageKey = 'lineItemTimezone'
const timezones = [
  {
    label: 'UTC',
    value: 'utc',
  },
  {
    label: 'EST',
    value: 'est',
  },
  {
    label: 'CST',
    value: 'cst',
  },
  {
    label: 'PST',
    value: 'pst',
  },
]
const timezonesOffset = {
  utc: 0,
  est: -5,
  cst: -6,
  pst: -8,
}
const timezone = ref(
  LocalStorageService.get(timezoneStorageKey)?.[lineItem.value.id]?.timezone ?? 'est'
)
const timezoneModel = computed({
  get() {
    return timezone.value
  },
  set(value) {
    timezone.value = value

    let values = LocalStorageService.get(timezoneStorageKey) ?? {}
    values = { ...values, [lineItem.value.id]: { timezone: value } }
    LocalStorageService.set(timezoneStorageKey, values)
  },
})
const isTimezone = computed(() => ({
  utc: timezoneModel.value === 'utc',
  est: timezoneModel.value === 'est',
  cst: timezoneModel.value === 'cst',
  pst: timezoneModel.value === 'pst',
}))

const time = ref(decodeTime(fieldGet(fieldKey)) ?? null)
const getNormalizedTime = (time, isReverse = false) => {
  const k = isReverse ? -1 : 1

  if (isTimezone.value.est) {
    return increaseTime(time ?? {}, k * timezonesOffset.est)
  }

  if (isTimezone.value.cst) {
    return increaseTime(time ?? {}, k * timezonesOffset.cst)
  }

  if (isTimezone.value.pst) {
    return increaseTime(time ?? {}, k * timezonesOffset.pst)
  }

  return time
}
const timeModel = computed({
  get() {
    return getNormalizedTime(time.value)
  },
  set(value) {
    const newValue = cloneDeep(value)
    for (const [key, times] of Object.entries(value)) {
      if (times.length === 0) {
        delete newValue[key]
      }
    }

    if (Object.keys(newValue).length === 0) {
      time.value = null
    } else {
      time.value = getNormalizedTime(newValue, true)
    }

    shortcutModel.value = null
    updateModel()
  },
})
const getCleanedModelValue = () => model.value.filter(({ key }) => key !== fieldKey)
const updateModel = () => {
  const newModel = getCleanedModelValue()

  if (time.value) {
    newModel.push({
      value: encodeTime(time.value),
      key: fieldKey,
      operator: 'include',
      comparator: 'equals',
      module: props.module,
      entity_id: null,
      name: null,
    })
  }

  model.value = newModel
}

const shortcuts = [
  {
    label: 'Work Hours',
    value: 'work_hours',
    time: {
      Mon: ['9AM', '10AM', '11AM', '12AM', '1PM', '2PM', '3PM', '4PM', '5PM'],
      Tue: ['9AM', '10AM', '11AM', '12AM', '1PM', '2PM', '3PM', '4PM', '5PM'],
      Wed: ['9AM', '10AM', '11AM', '12AM', '1PM', '2PM', '3PM', '4PM', '5PM'],
      Thu: ['9AM', '10AM', '11AM', '12AM', '1PM', '2PM', '3PM', '4PM', '5PM'],
      Fri: ['9AM', '10AM', '11AM', '12AM', '1PM', '2PM', '3PM', '4PM', '5PM'],
    },
  },
  {
    label: 'After Work',
    value: 'after_work',
    time: {
      Mon: ['6PM', '7PM', '8PM'],
      Tue: ['6PM', '7PM', '8PM'],
      Wed: ['6PM', '7PM', '8PM'],
      Thu: ['6PM', '7PM', '8PM'],
      Fri: ['6PM', '7PM', '8PM'],
    },
  },
  {
    label: 'Sleeping Time',
    value: 'sleeping_time',
    time: {
      Mon: ['1AM', '2AM', '3AM', '4AM', '5AM', '6AM'],
      Tue: ['1AM', '2AM', '3AM', '4AM', '5AM', '6AM'],
      Wed: ['1AM', '2AM', '3AM', '4AM', '5AM', '6AM'],
      Thu: ['1AM', '2AM', '3AM', '4AM', '5AM', '6AM'],
      Fri: ['1AM', '2AM', '3AM', '4AM', '5AM', '6AM'],
      Sat: ['1AM', '2AM', '3AM', '4AM', '5AM', '6AM'],
      Sun: ['1AM', '2AM', '3AM', '4AM', '5AM', '6AM'],
    },
  },
  {
    label: 'Weekends',
    value: 'weekends',
    time: {
      Sat: [
        '1AM',
        '2AM',
        '3AM',
        '4AM',
        '5AM',
        '6AM',
        '7AM',
        '8AM',
        '9AM',
        '10AM',
        '11AM',
        '12AM',
        '1PM',
        '2PM',
        '3PM',
        '4PM',
        '5PM',
        '6PM',
        '7PM',
        '8PM',
        '9PM',
        '10PM',
        '11PM',
        '12PM',
      ],
      Sun: [
        '1AM',
        '2AM',
        '3AM',
        '4AM',
        '5AM',
        '6AM',
        '7AM',
        '8AM',
        '9AM',
        '10AM',
        '11AM',
        '12AM',
        '1PM',
        '2PM',
        '3PM',
        '4PM',
        '5PM',
        '6PM',
        '7PM',
        '8PM',
        '9PM',
        '10PM',
        '11PM',
        '12PM',
      ],
    },
  },
  {
    label: 'Primetime',
    value: 'primetime',
    time: {
      Mon: ['9PM', '10PM', '11PM', '12PM'],
      Tue: ['9PM', '10PM', '11PM', '12PM'],
      Wed: ['9PM', '10PM', '11PM', '12PM'],
      Thu: ['9PM', '10PM', '11PM', '12PM'],
      Fri: ['9PM', '10PM', '11PM', '12PM'],
      Sat: ['9PM', '10PM', '11PM', '12PM'],
      Sun: ['9PM', '10PM', '11PM', '12PM'],
    },
  },
]
const shortcut = ref(null)
const shortcutModel = computed({
  get: () => shortcut.value,
  set: (value) => {
    shortcut.value = value

    if (value) {
      const { time: timeShortcut } = shortcuts.find((item) => item.value === value)
      time.value = timeShortcut
      updateModel()
    }
  },
})
</script>

<template>
  <div class="tw-rounded-xl tw-bg-white tw-p-6">
    <p class="tw-mb-2.5 tw-flex tw-items-center tw-gap-1 tw-text-lg tw-font-medium">
      Time of Week
      <HintPopover
        text="You can schedule your Line Item to appear only on specific days and/or during specific
            hours. Green depicts 'include' targeting and red depicts 'exclude' targeting. Click on
            individual cells or click on the table columns or rows to toggle between include and
            exclude."
      />
    </p>
    <div class="tw-flex tw-items-center tw-gap-10">
      <Select v-model="timezoneModel" :options="timezones" emit-value>
        <template #title> Timezone </template>
      </Select>
      <ButtonToggle
        v-model="shortcutModel"
        class="tw-ml-auto tw-w-max"
        :options="shortcuts"
        type="radio"
      >
        <template #title> Timeline </template>
      </ButtonToggle>
    </div>
    <div class="tw-mt-5 tw-w-full">
      <TimeGrid v-model="timeModel" class="tw-mx-auto tw-mt-12" />
    </div>
  </div>
</template>
