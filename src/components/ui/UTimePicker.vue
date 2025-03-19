<script setup>
defineProps({
  modelValue: {
    type: String,
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  format24h: {
    type: Boolean,
    default: false,
  },
  mask: {
    type: String,
    default: 'HH:mm',
  },
  withSeconds: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const updateModelValue = (value) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <q-time
    :model-value="modelValue"
    :disable="disabled"
    :mask="mask"
    :format24h="format24h"
    :with-seconds="withSeconds"
    @update:model-value="updateModelValue"
  />
</template>
