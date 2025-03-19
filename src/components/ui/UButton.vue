<script setup>
import { computed, useSlots } from 'vue'
import UIcon from 'src/components/ui/UIcon.vue'

const props = defineProps({
  type: {
    type: String,
    default: 'button',
  },
  to: [Object, String],
  size: {
    type: String,
    default: 'lg',
  },
  variant: {
    type: String,
    default: 'contained',
    validator(value) {
      return ['contained', 'outlined'].includes(value)
    },
  },
  bg: {
    type: String,
    default: 'primary',
  },
  color: {
    type: String,
  },
  icon: String,
  rounded: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  square: {
    type: Boolean,
    default: false,
  },
})

const slots = useSlots()

const isStyle = computed(() => ({
  variant: {
    contained: props.variant === 'contained',
    outlined: props.variant === 'outlined',
  },
}))

const className = {
  bg: {
    primary: isStyle.value.variant.contained
      ? 'tw-bg-primary tw-text-white'
      : 'tw-text-primary tw-border tw-border-primary',
    'ultralight-primary': isStyle.value.variant.contained
      ? 'tw-bg-ultralight-primary'
      : 'tw-text-ultralight-primary tw-border tw-border-ultralight-primary',
    'light-gray': isStyle.value.variant.contained
      ? 'tw-bg-light-gray'
      : 'tw-text-light-gray tw-border tw-border-light-gray',
  },
  color: {
    primary: '!tw-text-primary',
    white: '!tw-text-white',
  },
  size: {
    lg: 'tw-size-12 tw-rounded-lg',
    '2xs': 'tw-size-6 tw-rounded',
  },
  iconSize: {
    lg: 'tw-text-[1.5rem]',
    '2xs': 'tw-text-[1rem]',
  },
}

const hasIcon = props.icon !== undefined
</script>

<template>
  <component
    :is="to !== undefined ? 'router-link' : 'button'"
    v-ripple
    class="q-hoverable tw-relative tw-flex tw-items-center tw-justify-center tw-font-medium"
    :class="[
      className.size[size],
      className.bg[bg],
      className.color[color],
      {
        'rounded-lg': rounded,
        'tw-w-[unset] tw-px-7.5': !square,
        'tw-flex-shrink-0': square,
      },
    ]"
    :type="type"
    :to="to"
    :disabled="loading || disabled || undefined"
  >
    <div class="q-focus-helper"></div>
    <UIcon
      v-if="loading"
      name="spinner"
      class="tw-animate-spin"
      :class="className.iconSize[size]"
    />
    <template v-else>
      <UIcon
        v-if="hasIcon"
        :name="icon"
        :class="[
          className.iconSize[size],
          {
            'tw-mr-1': slots.default,
          },
        ]"
      />
      <slot></slot>
    </template>
  </component>
</template>
