<script setup>
import { inject } from 'vue'
import AdPosition from 'src/pages/LineItems/EditLineItem/components/Tabs/components/Fields/AdPosition.vue'
import AdsTxt from 'src/pages/LineItems/EditLineItem/components/Tabs/components/Fields/AdsTxt.vue'

const module = 'environment'

const targetingValues = inject('targetingValues')
</script>

<template>
  <AdPosition v-model="targetingValues" :module="module" />
  <AdsTxt v-model="targetingValues" :module="module" />
</template>

<style lang="scss" scoped></style>
