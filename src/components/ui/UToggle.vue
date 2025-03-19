<script setup>
import { useSlots } from 'vue'

const modelValue = defineModel({
  type: Boolean,
  default: false,
})

const slots = useSlots()

const toggle = () => {
  modelValue.value = !modelValue.value
}
</script>

<template>
  <div
    class="toggle tw-inline-flex tw-cursor-pointer tw-items-center tw-gap-3"
    :class="{ 'is-checked': modelValue }"
    @click="toggle"
  >
    <input class="native" type="text" :default-value="modelValue" hidden />
    <div v-if="slots.default">
      <slot></slot>
    </div>
    <div
      class="checkmark tw-relative tw-h-[1.875rem] tw-w-[3.75rem] tw-rounded-full tw-bg-ultralight-primary tw-transition-[background-color]"
      :class="{ '!tw-bg-primary !tw-text-white': modelValue }"
    >
      <div class="focus-helper"></div>
      <div
        class="circle tw-absolute tw-top-2/4 -tw-translate-y-2/4 tw-rounded-full tw-bg-light-gray tw-transition-[left]"
      ></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.toggle.is-checked .circle {
  left: calc(100% - (var(--horizontal-offset) + var(--size)));
}

.circle {
  --size: 1.25rem;
  --horizontal-offset: 0.3125rem;

  width: var(--size);
  height: var(--size);
  left: var(--horizontal-offset);
}

.toggle:hover,
.native:hover ~ {
  .checkmark .focus-helper {
    @include focus-helper-active;
  }
}
</style>
