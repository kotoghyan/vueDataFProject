<script setup>
defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <q-virtual-scroll v-slot="{ item, index }" :items="items">
    <slot :key="index" :item="item" />
  </q-virtual-scroll>
</template>
