<script setup>
import ToggleField from './ToggleField.vue'

const props = defineProps({
  module: {
    type: String,
    required: true,
  },
})

const options = [
  {
    id: '0',
    name: 'G (General Audiences)',
    value: 'G (General Audiences)',
  },
  {
    id: '1',
    name: 'PG (Parental Guidance)',
    value: 'PG (Parental Guidance)',
  },
  {
    id: '2',
    name: 'PG-13 (Parents Strongly Cautioned)',
    value: 'PG-13 (Parents Strongly Cautioned)',
  },
  {
    id: '3',
    name: 'R (Restricted)',
    value: 'R (Restricted)',
  },
  {
    id: '4',
    name: 'NC-17 (Adults Only)',
    value: 'NC-17 (Adults Only)',
  },
]

const modelValue = defineModel('modelValue', { type: Array, default: () => [] })
</script>

<template>
  <ToggleField
    v-model="modelValue"
    field-key="content_rating"
    title="Content Rating"
    :list="options"
    info="Content rating of the page"
    :module="props.module"
  />
</template>
