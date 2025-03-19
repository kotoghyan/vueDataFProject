<script setup>
import { computed, useSlots } from 'vue'
import HintPopover from 'src/components/shared/Popovers/HintPopover.vue'

const props = defineProps({
  modelValue: {
    type: [Boolean, Number, String, Array],
    default: () => [],
  },
  type: {
    type: String,
    default: 'radio',
    validator(value) {
      return ['radio', 'checkbox'].includes(value)
    },
  },
  options: {
    type: Array,
    required: true,
  },
  info: String,
  wFull: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:modelValue'])

const slots = useSlots()

const isTypeRadio = props.type === 'radio'

const isOptActive = computed(() => (opt) => {
  if (isTypeRadio) {
    return props.modelValue === opt.value
  }

  return props.modelValue.includes(opt.value)
})

const handleClick = (opt) => {
  let value = props.modelValue
  if (isTypeRadio) {
    value = opt.value
  } else if (value.includes(opt.value)) {
    value = value.filter((item) => item !== opt.value)
  } else {
    value.push(opt.value)
  }
  emit('update:modelValue', value)
}
</script>

<template>
  <div :class="{ 'tw-w-full': wFull }">
    <div v-if="slots.title" class="tw-mb-1.5 tw-flex tw-items-center tw-font-medium">
      <slot name="title"></slot>&nbsp;<HintPopover :text="info" />
    </div>
    <div
      class="tw-inline-flex tw-h-12 tw-gap-1 tw-rounded-lg tw-bg-ultralight-primary tw-p-1"
      :class="{ 'tw-w-full': wFull }"
    >
      <button
        v-for="(opt, index) in options"
        :key="index"
        v-ripple
        class="q-hoverable tw-relative tw-flex tw-flex-grow tw-cursor-pointer tw-items-center tw-justify-center tw-rounded-lg tw-px-7.5 tw-font-medium tw-text-dark-primary tw-transition-[background-color,color]"
        :class="{ '!tw-bg-primary !tw-text-white': isOptActive(opt) }"
        type="button"
        :disabled="disabled || opt.disabled"
        @click="handleClick(opt)"
      >
        <div class="q-focus-helper"></div>
        {{ opt.label }}
      </button>
    </div>
  </div>
</template>
