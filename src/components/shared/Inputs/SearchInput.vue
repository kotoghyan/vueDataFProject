<script setup>
import Input from 'src/components/ui/UInput.vue'
import Icon from 'src/components/ui/UIcon.vue'

defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Search here...',
  },
  debounce: Number,
})
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <Input
    class="tw-w-full tw-max-w-[16.875rem]"
    :model-value="modelValue"
    :placeholder="placeholder"
    :debounce="debounce"
    variant="outlined"
    rounded
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #prepend>
      <Icon class="tw-text-[1.5rem]" name="search" />
    </template>
  </Input>
</template>
