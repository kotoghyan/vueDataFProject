<script setup>
import { computed, inject, ref } from 'vue'
import DateInput from 'src/components/shared/Inputs/DateInput.vue'
import UInput from 'src/components/ui/UInput.vue'
import UTextarea from 'src/components/ui/UTextarea.vue'
import UAccordion from 'src/components/ui/UAccordion.vue'
import USelect from 'src/components/ui/USelect.vue'
import moment from 'moment'
import UCheckbox from 'components/ui/UCheckbox.vue'

const fieldsOptions = {
  budget_type: [
    {
      label: 'Spend',
      value: 0,
    },
    {
      label: 'Impression',
      value: 1,
    },
  ],
}

const { lineItemValues, setDefaultLineItemValues } = inject('lineItemValues')
setDefaultLineItemValues({
  end_date: moment().set({ hour: 23, minute: 59, second: 59 }).format('YYYY-MM-DD HH:mm:ss'),
})

const isBudgetType = computed(() => {
  const { budget_type } = lineItemValues.value
  return {
    spend: budget_type === 0,
    impression: budget_type === 1,
  }
})
const budgetTypeModel = computed({
  get() {
    return lineItemValues.value.budget_type
  },
  set(value) {
    lineItemValues.value.budget_type = value

    if (evenPacing.value) {
      autoCalcDailyBudget()
    }
  },
})

const budgetModel = computed({
  get() {
    return isBudgetType.value.spend
      ? lineItemValues.value.spend_budget_lifetime
      : lineItemValues.value.impressions_budget_lifetime
  },
  set(value) {
    if (isBudgetType.value.spend) {
      lineItemValues.value.spend_budget_lifetime = value
    } else {
      lineItemValues.value.impressions_budget_lifetime = value
    }

    if (evenPacing.value) {
      autoCalcDailyBudget()
    }
  },
})
const dailyBudgetModel = computed({
  get() {
    return isBudgetType.value.spend
      ? lineItemValues.value.spend_budget_daily
      : lineItemValues.value.impressions_budget_daily
  },
  set(value) {
    if (isBudgetType.value.spend) {
      lineItemValues.value.spend_budget_daily = value
    } else {
      lineItemValues.value.impressions_budget_daily = value
    }
  },
})
const autoCalcDailyBudget = () => {
  const lifeTimeBudget =
    lineItemValues.value.metrics[isBudgetType.value.spend ? 'spend' : 'impressions'].lifetime
  const dailyBudget =
    (budgetModel.value - lifeTimeBudget) / Math.ceil(lineItemValues.value.days_remaining)
  dailyBudgetModel.value = Math.round(dailyBudget)
}

const evenPacing = ref(false)
const evenPacingModel = computed({
  get() {
    return evenPacing.value
  },
  set(value) {
    evenPacing.value = value
    if (value) {
      autoCalcDailyBudget()
    }
  },
})
evenPacingModel.value = true
</script>

<template>
  <UAccordion class="tw-w-full" expanded>
    Essential Settings
    <template #body>
      <div class="tw-grid tw-grid-cols-6 tw-items-end tw-gap-2.5">
        <UInput
          v-model="lineItemValues.name"
          class="tw-col-span-2"
          placeholder="Type Name"
          required
        >
          <template #title>Name</template>
        </UInput>
        <DateInput
          v-model="lineItemValues.start_date"
          with-time
          with-seconds
          class="tw-col-span-2"
          required
        >
          <template #title>Start date</template>
        </DateInput>
        <DateInput
          v-model="lineItemValues.end_date"
          with-time
          with-seconds
          class="tw-col-span-2"
          required
        >
          <template #title>End date</template>
        </DateInput>
        <USelect
          v-model="budgetTypeModel"
          class="tw-col-span-2 tw-row-start-2"
          :options="fieldsOptions.budget_type"
          placeholder="Select Budget Type"
          info="Budget types at the Line Item level can be of type “Spend” (dollar amount) or “Impressions” (number of impressions). Line Item budget types do not have to be the same as Campaign budget types"
          emit-value
          required
        >
          <template #title>Budget Type</template>
        </USelect>
        <UInput
          v-model="budgetModel"
          :mask="{
            mask: Number,
            thousandsSeparator: ',',
            radix: '.',
          }"
          class="tw-row-start-2"
          placeholder="0"
          info="Overall budget of the Line Item. The budget of an individual Line Item cannot exceed the Campaign budget."
          unmasked-model
          required
        >
          <template #title>Budget</template>
          <template v-if="isBudgetType.spend" #prepend>$</template>
        </UInput>
        <UInput
          v-model="dailyBudgetModel"
          :mask="{
            mask: Number,
            thousandsSeparator: ',',
            radix: '.',
          }"
          class="tw-row-start-2"
          placeholder="0"
          info="Daily budget cap of the Line Item. Daily budget must be high enough to allow entire budget to spend over the dates of the Line Item."
          unmasked-model
          :disabled="evenPacing"
        >
          <template #title>Daily Budget Cap</template>
          <template v-if="isBudgetType.spend" #prepend>$</template>
        </UInput>
        <div class="tw-row-start-2 tw-flex tw-h-12 tw-items-center">
          <UCheckbox v-model="evenPacingModel">Even Pacing</UCheckbox>
        </div>
        <UInput
          v-model="lineItemValues.cpm_bid"
          class="tw-col-span-2 tw-row-start-3"
          :mask="{
            mask: Number,
            thousandsSeparator: ',',
            radix: '.',
          }"
          placeholder="0.00"
          info="This is the bid amount for your Line Item."
          unmasked-model
          required
        >
          <template #title>CPM Bid</template>
          <template #prepend>$</template>
        </UInput>
        <UTextarea
          v-model="lineItemValues.notes"
          class="tw-col-span-2 tw-row-start-4"
          placeholder="Type Notes"
        >
          <template #title>Notes</template>
        </UTextarea>
      </div>
    </template>
  </UAccordion>
</template>

<style lang="scss" scoped></style>
