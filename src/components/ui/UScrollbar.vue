<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { isNil } from 'lodash-es'

const props = defineProps({
  target: {
    type: [String, Element],
    default: null,
  },
})

const getTarget = (target = props.target) =>
  typeof target === 'string' ? document.querySelector(target) : target

const hasTargetXScrollbar = ref(false)
const checkTargetXScrollbar = () => {
  const target = getTarget()
  if (!isNil(target)) {
    hasTargetXScrollbar.value = target.scrollWidth > target.clientWidth
  }
}

const track = ref(null)
const setScrollbarInnerWidth = () => {
  if (!hasTargetXScrollbar.value) {
    return
  }

  const target = getTarget()
  if (!isNil(target)) {
    track.value.style.width = `${target.scrollWidth}px`
  }
}

const isTargetScrolling = ref(false)

const isScrollbarScrolling = ref(false)
const handleScrollbarScroll = ({ target: eTarget }) => {
  if (!isTargetScrolling.value) {
    isScrollbarScrolling.value = true

    const target = getTarget()
    const scrollingPercentage = eTarget.scrollLeft / (eTarget.scrollWidth - eTarget.clientWidth)
    target.scrollLeft = (target.scrollWidth - target.clientWidth) * scrollingPercentage
  }

  isTargetScrolling.value = false
}

const scrollbar = ref(null)
const isHorizontalScrollStarted = ref(false)
const isHorizontalScrolledToEnd = ref(false)
const updateScrollbarXPosition = () => {
  if (hasTargetXScrollbar.value) {
    const target = getTarget()

    isHorizontalScrollStarted.value = target.scrollLeft > 0
    isHorizontalScrolledToEnd.value =
      target.scrollWidth - (target.offsetWidth + target.scrollLeft) < 5

    if (!isScrollbarScrolling.value) {
      isTargetScrolling.value = true

      const targetScrollingPercent =
        (100 * target.scrollLeft) / (target.scrollWidth - target.clientWidth)
      scrollbar.value.scrollLeft =
        (scrollbar.value.scrollWidth - scrollbar.value.clientWidth) * (targetScrollingPercent / 100)
    }

    isScrollbarScrolling.value = false
  }
}
const updateScrollbarPosition = () => {
  updateScrollbarXPosition()
}

const resizeObserver = ref(null)
const init = () => {
  const target = getTarget()

  if (!isNil(target)) {
    checkTargetXScrollbar()
    setScrollbarInnerWidth()
    target.addEventListener('scroll', updateScrollbarPosition)
    resizeObserver.value = new ResizeObserver(() => {
      checkTargetXScrollbar()
      setScrollbarInnerWidth()
    })
    resizeObserver.value.observe(target)
  }
}
const resetListeners = (_target) => {
  const target = getTarget(_target)
  if (!isNil(target)) {
    target.removeEventListener('scroll', updateScrollbarPosition)
    resizeObserver.value?.disconnect()
  }
}
watch(
  () => props.target,
  (_, oldValue) => {
    resetListeners(getTarget(oldValue))
    init()
  },
  { immediate: true }
)
onMounted(init)
onUnmounted(resetListeners)

const wrapper = ref(null)
const isSticky = ref(false)
const intersectionObserver = ref(null)
onMounted(() => {
  intersectionObserver.value = new IntersectionObserver(
    ([e]) => {
      isSticky.value = e.intersectionRatio < 1
    },
    { threshold: [1] }
  )
  intersectionObserver.value.observe(wrapper.value)
})
onUnmounted(() => {
  intersectionObserver.value?.disconnect()
})
</script>

<template>
  <div
    v-show="hasTargetXScrollbar"
    ref="wrapper"
    class="tw-sticky -tw-bottom-[0.0625rem] tw-left-0 tw-right-0 tw-z-[2] tw-border-black-16 tw-bg-white tw-py-2"
    :class="{
      'tw-border-t': isSticky,
    }"
  >
    <div ref="scrollbar" class="scrollbar" @scroll="handleScrollbarScroll">
      <div ref="track" class="tw-h-[inherit]" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.scrollbar {
  @apply tw-h-4 tw-overflow-x-auto tw-overflow-y-hidden;

  &::-webkit-scrollbar {
    @apply tw-h-[inherit] tw-bg-white;
  }

  &::-webkit-scrollbar-thumb {
    @apply tw-rounded-full tw-bg-black-16;
  }
}
</style>
