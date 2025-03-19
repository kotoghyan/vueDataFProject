<script setup>
import { inject } from 'vue'
import AppBundleList from 'src/pages/LineItems/EditLineItem/components/Tabs/components/Fields/AppBundleList.vue'
import Apps from 'src/pages/LineItems/EditLineItem/components/Tabs/components/Fields/Apps/index.vue'
import Deal from 'src/pages/LineItems/EditLineItem/components/Tabs/components/Fields/Deal.vue'
import DealList from 'src/pages/LineItems/EditLineItem/components/Tabs/components/Fields/DealList.vue'
import DomainList from 'src/pages/LineItems/EditLineItem/components/Tabs/components/Fields/DomainList.vue'
import Domains from 'src/pages/LineItems/EditLineItem/components/Tabs/components/Fields/Domains/index.vue'

const module = 'app_site'

const targetingValues = inject('targetingValues')
</script>

<template>
  <AppBundleList v-model="targetingValues" :module="module" />
  <Apps v-model="targetingValues" :module="module" />
  <Deal v-model="targetingValues" :module="module" />
  <DealList v-model="targetingValues" :module="module" />
  <Domains v-model="targetingValues" :module="module" />
  <DomainList v-model="targetingValues" :module="module" />
</template>

<style lang="scss" scoped></style>
