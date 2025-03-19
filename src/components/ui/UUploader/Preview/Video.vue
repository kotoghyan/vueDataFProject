<script setup>
import Video from 'src/components/ui/UVideo.vue'

defineProps({
  src: {
    type: String,
    default: () => '',
  },
})
</script>

<template>
  <Video :src="src" class="tw-max-h-full tw-max-w-full" type="video/mp4"></Video>
</template>
