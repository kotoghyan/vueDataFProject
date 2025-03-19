<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import Icon from 'src/components/ui/UIcon.vue'

const props = defineProps({
  expanded: {
    type: Boolean,
    default: false,
  },
  reverse: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['expand', 'collapse'])

const body = ref(null)
const bodyInner = ref(null)
const isExpanded = ref(false)
const mutationObserver = ref(null)
const resizeObserver = ref(null)

const expand = () => {
  if (isExpanded.value || props.disabled) {
    return
  }

  const setBodyHeight = () => {
    const hasBody = body.value !== null
    const hasBodyInner = bodyInner.value !== null
    if (!hasBody || !hasBodyInner) {
      return
    }

    body.value.style.height = `${bodyInner.value.scrollHeight}px`
  }

  isExpanded.value = true
  setBodyHeight()
  mutationObserver.value = new MutationObserver(setBodyHeight)
  mutationObserver.value.observe(bodyInner.value, {
    childList: true,
    subtree: true,
    characterData: true,
  })
  resizeObserver.value = new ResizeObserver(setBodyHeight)
  resizeObserver.value.observe(bodyInner.value)
  emit('expand')
}
const collapse = () => {
  if (!isExpanded.value) {
    return
  }

  isExpanded.value = false
  body.value.style.height = 0
  mutationObserver.value?.disconnect()
  resizeObserver.value?.disconnect()
  emit('collapse')
}
const toggleExpansion = () => {
  if (isExpanded.value) {
    collapse()
  } else {
    expand()
  }
}

onMounted(() => {
  if (props.expanded) {
    expand()
  } else {
    collapse()
  }
})

onUnmounted(() => {
  mutationObserver.value?.disconnect()
  resizeObserver.value?.disconnect()
})

watch(
  () => props.expanded,
  (newValue) => {
    if (newValue) {
      expand()
    } else {
      collapse()
    }
  }
)
watch(
  () => props.disabled,
  (newValue) => {
    if (newValue) {
      collapse()
    }
  }
)
</script>

<template>
  <div class="tw-rounded-xl tw-bg-white">
    <div
      class="tw-flex tw-cursor-pointer tw-items-center tw-gap-2.5 tw-p-6 tw-text-lg tw-font-medium tw-transition-[color,padding] hover:tw-text-primary"
      :class="[
        reverse ? 'tw-flex-row-reverse tw-justify-end' : 'tw-justify-between',
        { '!tw-pb-5': isExpanded },
      ]"
      @click="toggleExpansion"
    >
      <div class="tw-flex tw-w-full">
        <slot></slot>
      </div>
      <Icon
        class="tw-text-[1.5rem] tw-transition-[transform]"
        :class="{ 'tw-rotate-180': isExpanded }"
        name="angle-down"
      />
    </div>
    <div ref="body" className="tw-h-0 tw-overflow-hidden tw-transition-[height]">
      <div ref="bodyInner" class="tw-px-6 tw-pb-10">
        <slot name="body"></slot>
      </div>
    </div>
  </div>
</template>
