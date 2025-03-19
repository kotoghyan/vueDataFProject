<script setup>
import Icon from 'src/components/ui/UIcon.vue'

defineProps({
  data: {
    type: Object,
    required: true,
  },
  variant: {
    type: String,
    default: 'contained',
    validator(value) {
      return ['contained', 'outlined'].includes(value)
    },
  },
})

const className = {
  variant: {
    outlined: '!tw-border-primary',
  },
}
</script>

<template>
  <div
    class="tw-relative tw-inline-flex tw-flex-col tw-rounded-xl tw-border tw-border-transparent tw-bg-white tw-p-6"
    :class="className.variant[variant]"
  >
    <Icon
      name="ellipsis-vertical"
      class="tw-absolute tw-right-[0.5rem] tw-top-[0.75rem] tw-cursor-pointer tw-text-[1.5rem] tw-transition-[color] hover:tw-text-primary"
    />
    <div class="tw-mt-auto">
      <p class="tw-text-2.5xl tw-font-semibold">
        {{ data.dataType === 'money' ? '$' : '' }}{{ data.value.toLocaleString('en')
        }}{{ data.dataType === 'pcnt' ? '%' : '' }}
      </p>
      <p class="tw-mt-2.5 tw-text-gray">{{ data.name }}</p>
    </div>
  </div>
</template>
