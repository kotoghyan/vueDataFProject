<script setup>
import { inject } from 'vue'
import Input from 'components/ui/UInput.vue'

const { lineItemValues } = inject('lineItemValues')
</script>

<template>
  <Input v-model="lineItemValues.tag_id" variant="outlined" rounded />
</template>

<style lang="scss" scoped></style>
