<script setup>
import { computed, ref, useSlots, watch } from 'vue'
import HintPopover from 'src/components/shared/Popovers/HintPopover.vue'

const props = defineProps({
  placeholder: {
    type: String,
    default: '',
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
  info: String,
  debounce: Number,
  required: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:modelValue'])
const slots = useSlots()

const isInvalid = ref(false)
const isFocused = ref(false)
const value = ref('')
const input = ref(null)
const debounceTimeoutId = ref(null)

const hasValue = computed(() => value.value !== '')

const handleInput = (event) => {
  if (debounceTimeoutId.value !== null) {
    clearTimeout(debounceTimeoutId.value)
  }

  value.value = event.target.value

  const _emit = () => {
    emit('update:modelValue', value.value)
  }
  if (props.debounce !== undefined) {
    debounceTimeoutId.value = setTimeout(_emit, props.debounce)
  } else {
    _emit()
  }
}

const handleFocus = () => {
  isFocused.value = true
  isInvalid.value = false
}
const handleBlur = () => {
  if (!hasValue.value && props.required) {
    isInvalid.value = true
  }

  isFocused.value = false
}

watch(
  () => props.modelValue,
  (newValue) => {
    const hasVal = newValue !== ''

    if (hasVal) {
      isInvalid.value = false
    }

    value.value = newValue
  },
  { immediate: true }
)
watch(value, () => {
  const el = input.value
  const elBorderWidth = el.offsetHeight - el.clientHeight
  el.style.height = 0
  el.style.height = `${el.scrollHeight + elBorderWidth}px`
})
</script>

<template>
  <div>
    <div v-if="slots.title" class="tw-mb-1.5 tw-flex tw-items-center tw-font-medium">
      <slot name="title"></slot
      ><span v-if="required" class="color-primary">*</span>&nbsp;<HintPopover :text="info" />
    </div>
    <textarea
      ref="input"
      class="form-field is-contained on-hover form-element tw-min-h-[6rem] tw-w-full tw-resize-none tw-py-3"
      :class="{
        'is-focused': isFocused,
        'is-invalid': isInvalid,
      }"
      :placeholder="placeholder"
      :value="value"
      :required="required"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
    />
  </div>
</template>

<style lang="scss" scoped>
@import 'src/css/form';
</style>
