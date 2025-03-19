<script setup>
import { computed, ref, useSlots, watch } from 'vue'
import HintPopover from 'src/components/shared/Popovers/HintPopover.vue'
import { useIMask } from 'vue-imask'

const props = defineProps({
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
  rounded: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String,
    default: 'contained',
  },
  info: String,
  debounce: Number,
  mask: {
    type: Object,
    default: () => ({
      mask: String,
    }),
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  unmaskedModel: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['focus'])

const modelValue = defineModel({ type: [String, Number], default: '' })

const slots = useSlots()

const className = {
  variant: {
    contained: 'is-contained',
    outlined: 'is-outlined',
  },
}

const value = ref('')
const hasValue = computed(() => value.value !== '')

const {
  el: input,
  masked,
  unmasked,
} = useIMask(props.mask, {
  defaultUnmaskedValue: String(modelValue.value),
  onAccept: () => {
    if (debounceTimeoutId.value !== null) {
      clearTimeout(debounceTimeoutId.value)
    }

    value.value = props.unmaskedModel ? unmasked.value : masked.value

    if (props.debounce !== undefined) {
      debounceTimeoutId.value = setTimeout(() => {
        modelValue.value = value.value
      }, props.debounce)
    } else {
      modelValue.value = value.value
    }
  },
})
watch(modelValue, (newValue) => {
  if (props.unmaskedModel) {
    unmasked.value = String(newValue)
  } else {
    masked.value = String(newValue)
  }
})

const isInvalid = ref(false)
const checkInvalid = () => {
  isInvalid.value = !props.readonly && !hasValue.value && props.required
}
watch(() => props.required, checkInvalid)

const isFocused = ref(false)
const debounceTimeoutId = ref(null)

const handleFocus = (event) => {
  isFocused.value = true
  isInvalid.value = false
  emit('focus', event)
}
const handleBlur = () => {
  checkInvalid()
  isFocused.value = false
}

watch(
  modelValue,
  (newValue) => {
    const hasVal = newValue !== ''

    if (hasVal) {
      isInvalid.value = false
    }

    value.value = newValue
  },
  { immediate: true }
)
</script>

<template>
  <div class="tw-w-full">
    <div v-if="slots.title" class="tw-mb-1.5 tw-flex tw-items-center tw-font-medium">
      <slot name="title"></slot
      ><span v-if="required" class="tw-text-primary">*</span>&nbsp;<HintPopover :text="info" />
    </div>
    <label
      class="form-field tw-cursor-text"
      :class="[
        disabled ? 'is-disabled' : { 'on-hover': !readonly },
        className.variant[variant],
        {
          'rounded-lg': rounded,
          'is-focused': !readonly && isFocused,
          'is-invalid': isInvalid,
        },
      ]"
    >
      <slot name="prepend"></slot>
      <div class="tw-relative tw-w-full">
        <input
          ref="input"
          :required="!readonly && required"
          class="form-element"
          :type="type"
          :placeholder="placeholder"
          :readonly="readonly"
          :disabled="disabled || undefined"
          @focus="handleFocus"
          @blur="handleBlur"
        />
        <input
          v-if="readonly"
          class="tw-absolute tw-bottom-0 tw-left-0 tw-right-0 tw-top-0 tw-z-[-1] tw-opacity-0"
          :type="type"
          :value="value"
          :required="required"
        />
      </div>
      <slot name="append"></slot>
    </label>
  </div>
</template>

<style lang="scss" scoped>
@import 'src/css/form';
</style>
