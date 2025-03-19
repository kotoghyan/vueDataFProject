<script setup>
import { Dropdown } from 'floating-vue'
import { computed } from 'vue'
import { generatePadding } from 'src/utils'

const props = defineProps({
  placement: {
    type: String,
    default: 'bottom-start',
  },
  distance: {
    type: Number,
    default: 8,
  },
  triggers: {
    type: [String, Array],
    validator(value) {
      return Array.isArray(value) || ['hover', 'click', 'focus', 'touch'].includes(value)
    },
  },
  autoSize: {
    type: [Boolean, String],
    validator(value) {
      return [true, false, 'min', 'max'].includes(value)
    },
  },
  autoHide: {
    type: Boolean,
    default: true,
  },
  positioningDisabled: {
    type: Boolean,
    default: false,
  },
  maxHeight: {
    type: String,
    default: '65vh',
  },
  width: {
    type: String,
    validator(value) {
      return ['lg', 'sm'].includes(value)
    },
  },
  padding: {
    type: [Object, Array, Number],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const className = {
  width: {
    lg: 'tw-w-[20rem]',
    sm: 'tw-w-[10rem]',
  },
}

const popperStyle = computed(() => {
  let style = { ...generatePadding(['var(--popover-padding)', 'var(--popover-padding)']) }

  if (props.maxHeight !== 'none') {
    style.maxHeight = props.maxHeight
  }

  if (props.padding !== undefined) {
    style = {
      ...style,
      ...generatePadding(
        props.padding === 0 ? { top: 0, bottom: 0, left: 0, right: 0 } : props.padding
      ),
    }
  }

  return style
})
</script>

<template>
  <Dropdown
    :popper-class="['_popover', className.width[width]]"
    :placement="placement"
    :distance="distance"
    :auto-size="autoSize"
    :triggers="triggers"
    :auto-hide="autoHide"
    :positioning-disabled="positioningDisabled"
    :dispose-timeout="0"
    :disabled="disabled"
    shift-cross-axis
  >
    <template #default="{ shown }">
      <slot :shown="shown"></slot>
    </template>
    <template #popper>
      <div class="popper" :style="popperStyle">
        <slot name="popover"></slot>
      </div>
    </template>
  </Dropdown>
</template>

<style lang="scss" scoped>
.popper {
  @apply tw-overflow-y-auto tw-rounded-xl tw-bg-white;

  box-shadow: 0 4px 24px 0 rgb(209 209 226 / 60%);
}
</style>

<style lang="scss">
@import 'floating-vue/dist/style.css';

._popover {
  --popover-padding: 1rem;

  z-index: 6000 !important;

  .v-popper__inner {
    background-color: transparent !important;
    color: inherit !important;
    border: none !important;
    overflow: visible !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }

  .v-popper__arrow-container {
    display: none !important;
  }
}
</style>
