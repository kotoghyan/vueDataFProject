<script setup>
import { computed } from 'vue'
import moment from 'moment'
import Input from 'src/components/ui/UInput.vue'
import Icon from 'src/components/ui/UIcon.vue'
import UDatePicker from 'components/ui/UDatePicker.vue'
import UTimePicker from 'components/ui/UTimePicker.vue'

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Pick Date',
  },
  modelValue: {
    type: [String, Object],
    default: null,
  },
  variant: {
    type: String,
    default: 'contained',
  },
  info: String,
  required: {
    type: Boolean,
    default: false,
  },
  range: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  withTime: {
    type: Boolean,
    default: false,
  },
  withSeconds: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const mask = computed(() => {
  let mask = 'YYYY-MM-DD'
  if (props.withTime) {
    mask += ' HH:mm'
  }
  if (props.withSeconds) {
    mask += ':ss'
  }
  return mask
})

const hasModelValue = computed(() => props.modelValue !== null)
const inputValue = computed(() => {
  if (!hasModelValue.value) {
    return ''
  }

  const formatDate = (value) => {
    const date = moment(value)
    let mask = 'MM.DD.YYYY'
    if (props.withTime) {
      mask += ', HH:mm'
    }
    if (props.withSeconds) {
      mask += ':ss'
    }
    return date.format(mask)
  }

  if (props.range) {
    return `${formatDate(props.modelValue.from)}-${formatDate(props.modelValue.to)}`
  }

  return formatDate(props.modelValue)
})

const updateModelValue = (value) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <Input
    unmasked-model
    :model-value="inputValue"
    :placeholder="placeholder"
    :info="info"
    :variant="variant"
    :required="required"
    :disabled="disabled"
    readonly
  >
    <template #title>
      <slot name="title"></slot>
    </template>
    <template #prepend>
      <label>
        <Icon
          class="tw-cursor-pointer tw-text-[1.5rem] tw-transition-[color] hover:tw-text-primary"
          name="calendar"
        />
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <UDatePicker
            :model-value="modelValue"
            :range="range"
            :mask="mask"
            @update:model-value="updateModelValue"
          />
        </q-popup-proxy>
      </label>
    </template>
    <template v-if="withTime" #append>
      <label>
        <Icon
          class="tw-cursor-pointer tw-text-[1.5rem] tw-transition-[color] hover:tw-text-primary"
          name="clock"
        />
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <UTimePicker
            :model-value="modelValue"
            :range="range"
            :mask="mask"
            :with-seconds="withSeconds"
            format24h
            @update:model-value="updateModelValue"
          />
        </q-popup-proxy>
      </label>
    </template>
  </Input>
</template>
