<script setup>
defineProps({
  src: {
    type: String,
    default: () => '',
  },
})
</script>

<template>
  <img :src="src" class="tw-max-h-full tw-max-w-full tw-object-cover" />
</template>
