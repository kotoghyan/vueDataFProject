<script setup>
import Popover from 'src/components/ui/UPopover.vue'
import Icon from 'src/components/ui/UIcon.vue'
import { computed } from 'vue'

const props = defineProps({
  text: {
    type: String,
  },
})

const hasText = computed(() => props.text !== undefined)
</script>

<template>
  <Popover v-if="hasText" :triggers="['hover']" width="lg">
    <sup class="!-tw-top-[0.2em] !tw-text-[length:inherit]">
      <Icon class="tw-text-primary" name="question" />
    </sup>
    <template #popover>
      <p class="fz-small">{{ text }}</p>
    </template>
  </Popover>
</template>

<style lang="scss" scoped></style>
