<script setup>
defineProps({
  src: {
    type: String,
    required: true,
  },
  controls: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
  },
})
</script>

<template>
  <video v-if="src" :controls="controls">
    <source :src="src" :type="type" />
  </video>
</template>
