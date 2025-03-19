<script setup>
import { ref, computed } from 'vue'
import ToggleField from '../ToggleField.vue'
import { useDomains } from './useDomains'

const props = defineProps({
  module: {
    type: String,
    required: true,
  },
})

const options = useDomains()

const domainsSearchValue = ref('')
const domains = ref()
const domainsSearchModel = computed({
  get() {
    return domainsSearchValue.value
  },
  set(val) {
    domainsSearchValue.value = val
    if (domainsSearchValue.value !== '') {
      domains.value = options.filter((option) =>
        option.name.toLowerCase().includes(val.toLowerCase())
      )
    } else {
      domains.value = []
    }
  },
})

const modelValue = defineModel({ type: Array, default: () => [] })
</script>

<template>
  <ToggleField
    v-model="modelValue"
    v-model:search="domainsSearchModel"
    field-key="domains"
    title="Domains"
    :list="domains"
    :fields="['search']"
    :module="props.module"
  />
</template>
