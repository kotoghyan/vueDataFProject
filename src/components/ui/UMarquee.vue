<script setup>
import { ref } from 'vue'

const isAnimated = ref(false)
const truncated = ref(null)

const startAnimation = () => {
  if (isAnimated.value) {
    return
  }

  const el = truncated.value
  if (el.offsetWidth < el.scrollWidth) {
    isAnimated.value = true
    el.title = el.innerText
  }
}

const stopAnimation = () => {
  if (!isAnimated.value) {
    return
  }

  const el = truncated.value
  isAnimated.value = false
  el.title = ''
}
</script>

<template>
  <div
    class="tw-grid tw-min-w-0 tw-max-w-full tw-overflow-hidden"
    @mouseenter="startAnimation"
    @mouseleave="stopAnimation"
  >
    <div
      ref="truncated"
      class="tw-min-w-0 tw-max-w-full tw-overflow-hidden tw-text-ellipsis tw-whitespace-nowrap"
      :class="{ 'tw-animate-marquee tw-overflow-visible': isAnimated }"
    >
      <slot></slot>
    </div>
  </div>
</template>
