<script setup>
import { computed, ref, useSlots, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: null,
    default: false,
  },
  val: {
    type: null,
    default: true,
  },
  required: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:modelValue'])
const slots = useSlots()

const value = ref(false)

const isChecked = computed(() => value.value === props.val)

const select = () => {
  value.value = props.val
  emit('update:modelValue', value.value)
}

watch(
  () => props.modelValue,
  (newValue) => {
    value.value = newValue
  },
  { immediate: true }
)
</script>

<template>
  <div class="radio tw-inline-flex tw-cursor-pointer tw-gap-3 tw-py-1" @click="select">
    <div
      class="checkmark tw-relative tw-flex tw-size-6 tw-items-center tw-justify-center tw-rounded-full"
      :class="[isChecked ? 'tw-border-[0.375rem] tw-border-primary' : 'tw-bg-ultralight-primary']"
    >
      <div class="focus-helper"></div>
      <input
        class="native tw-absolute tw-z-[-1] tw-size-full tw-opacity-0"
        type="radio"
        :checked="isChecked"
        :required="required"
      />
    </div>
    <div v-if="slots.default">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.radio:hover,
.native:hover ~ {
  .checkmark .focus-helper {
    @include focus-helper-active;
  }
}
</style>
