<script setup>
import { computed, ref, useAttrs, useSlots, watch } from 'vue'
import UIcon from 'src/components/ui/UIcon.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  transitionShow: {
    type: String,
    default: 'fade',
  },
  transitionHide: {
    type: String,
    default: 'fade',
  },
  transitionDuration: {
    type: Number,
    default: 200,
  },
  closeButton: {
    type: Boolean,
    default: false,
  },
  width: {
    type: String,
    validator(value) {
      return [undefined, 'lg', 'xl'].includes(value)
    },
  },
  noPadding: {
    type: Boolean,
    default: false,
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
  fullHeight: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:modelValue', 'show', 'hide', 'escape-key'])
const attrs = useAttrs()
const slots = useSlots()

const className = {
  width: {
    lg: 'tw-w-[31.875rem]',
    xl: 'tw-w-[72rem]',
  },
}

const isVisible = ref(false)

const isHeaderVisible = computed(() => slots.title || props.closeButton)
const isFooterVisible = computed(() => slots.footer)

const show = () => {
  isVisible.value = true
}
const hide = () => {
  isVisible.value = false
  emit('update:modelValue', false)
}

watch(
  () => props.modelValue,
  (newValue) => {
    isVisible.value = newValue
  },
  { immediate: true }
)

defineExpose({ hide })
</script>

<template>
  <div v-bind="attrs" @click="show">
    <slot name="trigger"></slot>
  </div>
  <q-dialog
    v-model="isVisible"
    :transition-show="transitionShow"
    :transition-hide="transitionHide"
    :transition-duration="transitionDuration"
    :full-width="fullWidth"
    :full-height="fullHeight"
    @escape-key="emit('escape-key')"
    @show="emit('show')"
    @hide="emit('hide')"
  >
    <div
      class="tw-relative tw-overflow-hidden !tw-rounded-xl tw-bg-white"
      :class="[className.width[width], { 'tw-p-10': !noPadding }]"
    >
      <template v-if="isHeaderVisible">
        <div class="tw-text-center tw-text-2.5xl tw-font-semibold">
          <slot name="title"></slot>
        </div>
        <UIcon
          v-if="closeButton"
          class="tw-absolute tw-right-[1.25rem] tw-top-[1.25rem] tw-cursor-pointer tw-text-[1.5rem] tw-transition-[color] hover:tw-text-primary"
          name="cross"
          @click="hide"
        />
      </template>
      <div
        :class="{
          'tw-pt-7.5': !noPadding && isHeaderVisible,
          'tw-pb-7.5': !noPadding && isFooterVisible,
        }"
      >
        <slot></slot>
      </div>
      <div>
        <slot name="footer"></slot>
      </div>
    </div>
  </q-dialog>
</template>

<style lang="scss">
.q-dialog__inner--minimized > div {
  max-width: 100%;
}

.q-dialog__inner--minimized {
  padding: 1.5rem;
}
</style>
