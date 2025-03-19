<script setup>
defineProps({
  breadcrumbs: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <div
    v-if="breadcrumbs.length > 0"
    class="tw-flex tw-flex-wrap tw-items-center tw-gap-2 tw-font-semibold tw-text-lightness-primary"
  >
    <template v-for="(item, index) in breadcrumbs" :key="index">
      <div v-if="index > 0">></div>
      <div
        v-if="item.loading"
        class="tw-h-2.5 tw-w-16 tw-animate-pulse tw-rounded-full tw-bg-black-16"
      ></div>
      <router-link
        v-else-if="item.to"
        class="tw-transition-[color] hover:tw-text-primary"
        :to="item.to"
      >
        {{ item.name }}
      </router-link>
      <div v-else :class="{ 'tw-text-primary': index === breadcrumbs.length - 1 }">
        {{ item.name ?? item }}
      </div>
    </template>
  </div>
</template>
