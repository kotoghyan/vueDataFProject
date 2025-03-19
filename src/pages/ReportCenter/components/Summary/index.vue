<script setup>
import { storeToRefs } from 'pinia'
import { useReportCenterStore } from '../../store'
import UIcon from 'components/ui/UIcon.vue'
import Card from './components/Card.vue'
import Tables from './components/Tables/index.vue'

const { isGeneralLoading, general, hasGeneral } = storeToRefs(useReportCenterStore())
</script>

<template>
  <div v-if="isGeneralLoading" class="tw-flex tw-justify-center">
    <UIcon name="spinner" class="tw-animate-spin tw-text-[3rem] tw-text-primary" />
  </div>
  <template v-else-if="hasGeneral">
    <div class="tw-grid tw-grid-cols-3 tw-gap-2">
      <Card :data="general.total">
        <template #title> Total </template>
      </Card>
    </div>
    <Tables />
  </template>
</template>
