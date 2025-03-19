<script setup>
import { inject } from 'vue'
import DeviceType from 'src/pages/LineItems/EditLineItem/components/Tabs/components/Fields/DeviceType.vue'

const module = 'platform'

const targetingValues = inject('targetingValues')
</script>

<template>
  <DeviceType v-model="targetingValues" :module="module" />
</template>

<style lang="scss" scoped></style>
