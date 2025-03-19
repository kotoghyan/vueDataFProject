<script setup>
import { ref, computed } from 'vue'
import Performance from './components/Tabs/Performance.vue'
import Summary from './components/Tabs/Summary.vue'
import UTabs from 'components/ui/UTabs.vue'

const tabs = [
  {
    label: 'PERFORMANCE',
    value: 'performance',
    component: Performance,
  },
  {
    label: 'DETAIL SUMMARY',
    value: 'summary',
    component: Summary,
  },
]
const tab = ref(tabs[0].value)
const tabData = computed(() => tabs.find(({ value }) => value === tab.value))
</script>

<template>
  <div class="tw-w-full tw-rounded-xl tw-bg-ultralight-primary tw-p-6">
    <UTabs v-model="tab" :tabs="tabs" active-color="var(--dark-blue)" class="tw-mb-5" />
    <component :is="tabData.component" />
  </div>
</template>
