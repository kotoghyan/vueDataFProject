<script setup>
import { inject } from 'vue'
import TimeZone from 'src/pages/LineItems/EditLineItem/components/Tabs/components/Fields/TimeZone.vue'

const module = 'time'

const targetingValues = inject('targetingValues')
</script>

<template>
  <TimeZone v-model="targetingValues" :module="module" />
</template>

<style lang="scss" scoped></style>
