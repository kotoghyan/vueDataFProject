<script setup>
import { inject } from 'vue'
import Deal from 'src/pages/LineItems/EditLineItem/components/Tabs/components/Fields/Deal.vue'
import DealList from 'src/pages/LineItems/EditLineItem/components/Tabs/components/Fields/DealList.vue'
import Apps from 'pages/LineItems/EditLineItem/components/Tabs/components/Fields/Apps/index.vue'
import AppBundleList from 'pages/LineItems/EditLineItem/components/Tabs/components/Fields/AppBundleList.vue'
import Domains from 'pages/LineItems/EditLineItem/components/Tabs/components/Fields/Domains/index.vue'
import DomainList from 'pages/LineItems/EditLineItem/components/Tabs/components/Fields/DomainList.vue'

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
