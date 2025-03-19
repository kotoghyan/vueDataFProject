<script setup>
defineProps({
  data: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <div
    class="tw-grid tw-grid-cols-[repeat(auto-fit,minmax(11.375rem,auto))] tw-gap-x-10 tw-gap-y-5"
  >
    <div v-for="item in data" :key="item.label" class="tw-font-semibold">
      <p class="tw-mb-2.5 tw-text-base tw-text-dark-blue">{{ item.label }}</p>
      <p>{{ item.value }}</p>
    </div>
  </div>
</template>
