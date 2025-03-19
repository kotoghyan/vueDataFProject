<script setup>
defineProps({
  color: {
    type: String,
    validator(value) {
      return ['green', 'red'].includes(value)
    },
    required: true,
  },
})

const className = {
  color: { green: 'tw-text-green tw-bg-light-green', red: 'tw-text-red tw-bg-light-red' },
}
</script>

<template>
  <div
    class="tw-inline-flex tw-h-[1.5625rem] tw-w-max tw-items-center tw-justify-center tw-rounded-md tw-px-2.5 tw-text-xs tw-font-semibold tw-uppercase"
    :class="[className.color[color]]"
  >
    <slot></slot>
  </div>
</template>
