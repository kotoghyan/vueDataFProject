<script setup>
import Content from './components/Content.vue'

const data = [
  { label: 'OSI', value: '-' },
  { label: 'Today Spend', value: '-' },
  { label: 'Today Impressions', value: '-' },
  { label: 'Lifetime Spend', value: '-' },
  { label: 'Lifetime Impressions', value: '-' },
  { label: 'Lifetime Clicks', value: '-' },
  { label: 'CPM', value: '-' },
  { label: 'Total Reach', value: '-' },
  { label: 'Audience Penetration', value: '-' },
  { label: 'Frequency', value: '-' },
]
</script>

<template>
  <Content :data="data" />
</template>
