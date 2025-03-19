<script setup>
import { inject } from 'vue'
import ContentCategory from 'src/pages/LineItems/EditLineItem/components/Tabs/components/Fields/ContentCategory.vue'
import ContentRating from 'src/pages/LineItems/EditLineItem/components/Tabs/components/Fields/ContentRating.vue'
import Language from 'src/pages/LineItems/EditLineItem/components/Tabs/components/Fields/Language.vue'

const module = 'content'

const targetingValues = inject('targetingValues')
</script>

<template>
  <ContentCategory v-model="targetingValues" :module="module" />
  <ContentRating v-model="targetingValues" :module="module" />
  <Language v-model="targetingValues" :module="module" />
</template>

<style lang="scss" scoped></style>
