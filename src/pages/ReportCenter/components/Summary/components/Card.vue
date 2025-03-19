<script setup>
defineProps({
  data: {
    type: Object,
    required: true,
  },
})

const customData = [
  {
    label: 'Spend',
    value: 'spend',
    dataType: 'money',
  },
  {
    label: 'Clicks',
    value: 'clicks',
    dataType: 'int',
  },
  {
    label: 'Impressions',
    value: 'impressions',
    dataType: 'int',
  },
  {
    label: 'CTR',
    value: 'ctr',
    dataType: 'pcnt',
  },
]
</script>

<template>
  <div class="tw-relative tw-rounded-xl tw-bg-white tw-p-8">
    <p class="tw-mb-5 tw-text-lg tw-font-medium tw-text-primary">
      <slot name="title" />
    </p>
    <div class="tw-grid tw-grid-cols-2 tw-gap-2">
      <div v-for="item in customData" :key="item.value">
        <p class="tw-mb-1 tw-font-medium tw-text-gray">{{ item.label }}:</p>
        <p class="tw-text-xl tw-font-medium">
          <template v-if="item.dataType === 'money'">$</template
          >{{ data[item.value].toLocaleString('en')
          }}<template v-if="item.dataType === 'pcnt'">%</template>
        </p>
      </div>
    </div>
  </div>
</template>
