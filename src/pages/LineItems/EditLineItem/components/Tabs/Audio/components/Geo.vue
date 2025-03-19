<script setup>
import { inject } from 'vue'
import Country from 'src/pages/LineItems/EditLineItem/components/Tabs/components/Fields/Country.vue'
import RegionState from 'src/pages/LineItems/EditLineItem/components/Tabs/components/Fields/RegionState.vue'
import Metro from 'src/pages/LineItems/EditLineItem/components/Tabs/components/Fields/Metro.vue'
import City from 'src/pages/LineItems/EditLineItem/components/Tabs/components/Fields/City.vue'
import LatLong from 'src/pages/LineItems/EditLineItem/components/Tabs/components/Fields/LatLong.vue'
import LatLongList from 'src/pages/LineItems/EditLineItem/components/Tabs/components/Fields/LatLongList.vue'
import LocationType from 'src/pages/LineItems/EditLineItem/components/Tabs/components/Fields/LocationType.vue'
import ZIPCode from 'src/pages/LineItems/EditLineItem/components/Tabs/components/Fields/ZIPCode.vue'
import ZIPCodeList from 'src/pages/LineItems/EditLineItem/components/Tabs/components/Fields/ZIPCodeList.vue'

const module = 'geo'

const targetingValues = inject('targetingValues')
</script>

<template>
  <Country v-model="targetingValues" :module="module" />
  <RegionState v-model="targetingValues" :module="module" />
  <Metro v-model="targetingValues" :module="module" />
  <City v-model="targetingValues" :module="module" />
  <LatLong v-model="targetingValues" :module="module" />
  <LatLongList :module="module" />
  <LocationType :module="module" />
  <ZIPCode v-model="targetingValues" :module="module" />
  <ZIPCodeList :module="module" />
</template>

<style lang="scss" scoped></style>
