<script setup>
defineProps({
  name: {
    type: String,
    required: true,
  },
})

const sprite = new URL('../../assets/icon-sprite.svg', import.meta.url).href
</script>

<template>
  <svg
    class="tw-inline-block tw-size-[1em] tw-flex-shrink-0 tw-fill-current tw-stroke-current tw-stroke-0"
    xmlns="http://www.w3.org/2000/svg"
  >
    <use :href="`${sprite}#${name}`" />
  </svg>
</template>
