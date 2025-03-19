<script setup>
defineProps({
  data: {
    type: Object,
    requited: true,
  },
})
</script>

<template>
  <div class="tw-flex-grow tw-rounded-xl tw-bg-white tw-p-8">
    <table class="tw-w-full">
      <tr>
        <td
          v-for="(column, columnIndex) in data.columns"
          :key="columnIndex"
          class="tw-text-primary"
        >
          {{ column }}
        </td>
      </tr>
      <tr v-for="(row, rowIndex) in data.rows" :key="rowIndex">
        <td
          v-for="(item, itemIndex) in row"
          :key="itemIndex"
          class="tw-pt-5 tw-font-medium"
          :class="{
            'tw-border-b tw-border-black-16 tw-pb-5': rowIndex !== data.rows.length - 1,
          }"
        >
          <template v-if="item.dataType === 'money'">$</template>{{ item.value.toLocaleString('en')
          }}<template v-if="item.dataType === 'pcnt'">%</template>
        </td>
      </tr>
    </table>
  </div>
</template>
