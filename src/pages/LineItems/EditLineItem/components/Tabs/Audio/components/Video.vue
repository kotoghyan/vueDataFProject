<script setup>
import { inject } from 'vue'
import AdPositionVideo from 'src/pages/LineItems/EditLineItem/components/Tabs/components/Fields/AdPositionVideo.vue'
import VideoPlacementType from 'src/pages/LineItems/EditLineItem/components/Tabs/components/Fields/VideoPlacementType.vue'

const module = 'video'

const targetingValues = inject('targetingValues')
</script>

<template>
  <AdPositionVideo v-model="targetingValues" :module="module" />
  <VideoPlacementType v-model="targetingValues" :module="module" />
</template>

<style lang="scss" scoped></style>
