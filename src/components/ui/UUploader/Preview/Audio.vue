<script setup>
import UAudioPlayer from '../../UAudioPlayer.vue'

defineProps({
  src: { type: String, default: () => '' },
  label: { type: String },
})
</script>

<template>
  <UAudioPlayer :src="src" :label="label" class="tw-mr-auto tw-max-w-[60%]" />
</template>
