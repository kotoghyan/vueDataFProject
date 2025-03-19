<script setup>
import Icon from 'src/components/ui/UIcon.vue'
import Marquee from 'src/components/ui/UMarquee.vue'

const props = defineProps({
  modelValue: {
    type: Array,
  },
  removable: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:modelValue'])

const remove = (value) => {
  const newModelValue = props.modelValue.filter((item) => item !== value)
  emit('update:modelValue', newModelValue)
}
</script>

<template>
  <div
    class="tw-flex tw-min-h-12 tw-flex-wrap tw-gap-1 tw-rounded-xl tw-bg-ultralight-primary tw-p-1"
  >
    <div
      v-for="(value, index) in modelValue"
      :key="index"
      class="tw-flex tw-w-max tw-items-center tw-gap-1.5 tw-rounded-[inherit] tw-bg-white tw-px-3"
      :class="{ 'tw-cursor-pointer tw-transition-[color] hover:tw-text-primary': removable }"
      @click="remove(value)"
    >
      <Marquee>{{ value }}</Marquee>
      <Icon v-if="removable" class="tw-text-[1rem]" name="cross" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
