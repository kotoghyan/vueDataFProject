<script setup>
import { inject } from 'vue'
import InventorySource from 'src/pages/LineItems/EditLineItem/components/Tabs/components/Fields/InventorySource.vue'
import AuctionType from 'src/pages/LineItems/EditLineItem/components/Tabs/components/Fields/AuctionType.vue'

const module = 'exchange'

const targetingValues = inject('targetingValues')
</script>

<template>
  <InventorySource v-model="targetingValues" :module="module" />
  <AuctionType v-model="targetingValues" :module="module" />
</template>

<style lang="scss" scoped></style>
