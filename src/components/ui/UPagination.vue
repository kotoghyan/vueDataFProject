<script setup>
defineProps({
  max: {
    type: [Number, String],
    required: true,
  },
  maxPages: {
    type: [Number, String],
  },
  directionLinks: {
    type: Boolean,
    default: false,
  },
})

const model = defineModel({ type: Number, required: true })
</script>

<template>
  <q-pagination
    v-model="model"
    :class="{
      directionLinks,
    }"
    :max="max"
    :max-pages="maxPages"
    :direction-links="directionLinks"
  />
</template>

<style scoped lang="scss">
.q-pagination :deep {
  .q-pagination__content {
    --q-pagination-gutter-parent: -0.25rem;
    --q-pagination-gutter-child: 0.25rem;
  }

  .q-btn {
    min-width: 3rem !important;
    height: 3rem !important;
    border-radius: 0.75rem !important;
    font: inherit !important;
    color: inherit !important;
    padding: 0 1rem !important;
    background-color: var(--light-gray);

    &::before {
      box-shadow: none !important;
    }

    &[aria-current='true'] {
      color: white !important;
      font-weight: 500 !important;
    }
  }

  &.directionLinks .q-btn {
    &:first-child,
    &:last-child {
      padding: 0 !important;
    }
  }
}
</style>
