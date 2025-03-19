<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Object],
    default: null,
  },
  range: {
    type: Boolean,
    default: false,
  },
  mask: {
    type: String,
    default: 'YYYY-MM-DD',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const handleChange = (value) => {
  let newValue = value
  const isFromAndToSame = typeof newValue === 'string'

  if (props.range && !isFromAndToSame) {
    newValue = {
      from: newValue,
      to: newValue,
    }
  }

  emit('update:modelValue', newValue)
}
</script>

<template>
  <q-date
    :model-value="modelValue"
    :mask="mask"
    :range="range"
    :disable="disabled"
    @update:model-value="handleChange"
  />
</template>
