<script setup>
import { ref, useSlots, watch } from 'vue'
import UIcon from 'src/components/ui/UIcon.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  required: {
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

const isChecked = ref(false)

const toggle = () => {
  if (props.disabled) {
    return
  }

  isChecked.value = !isChecked.value
  emit('update:modelValue', isChecked.value)
}

watch(
  () => props.modelValue,
  (newValue) => {
    isChecked.value = newValue
  },
  { immediate: true }
)
</script>

<template>
  <div
    class="checkbox tw-inline-flex tw-cursor-pointer tw-gap-2.5 tw-py-2"
    :class="{
      '!tw-cursor-not-allowed !tw-opacity-60': disabled,
    }"
    @click="toggle"
  >
    <div
      class="checkmark tw-relative tw-flex tw-size-6 tw-items-center tw-justify-center tw-rounded-md tw-bg-ultralight-primary tw-transition-[background-color]"
      :class="{
        '!tw-bg-primary !tw-text-white': isChecked,
      }"
    >
      <div class="focus-helper"></div>
      <UIcon v-if="isChecked" class="tw-absolute tw-text-[1rem] tw-text-white" name="sign" />
      <input
        class="native tw-absolute tw-z-[-1] tw-h-full tw-w-full tw-opacity-0"
        type="checkbox"
        :checked="isChecked"
        :disabled="disabled"
        :required="required"
      />
    </div>
    <div v-if="slots.default">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.checkbox:hover,
.native:hover ~ {
  .checkmark .focus-helper {
    @include focus-helper-active;
  }
}
</style>
