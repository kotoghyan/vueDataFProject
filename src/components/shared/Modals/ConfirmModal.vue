<script setup>
import UModal from 'src/components/ui/UModal.vue'
import UButton from 'src/components/ui/UButton.vue'

defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['confirm', 'deny', 'hide', 'update:modelValue'])

const handleHide = () => {
  emit('update:modelValue', false)
  emit('hide')
}
</script>

<template>
  <UModal :model-value="modelValue" width="lg" close-button @hide="handleHide">
    <template #trigger>
      <slot name="trigger"></slot>
    </template>
    <template #title>
      <slot name="title">Are you sure?</slot>
    </template>
    <div>
      <p class="tw-text-center">
        <slot name="content"></slot>
      </p>
    </div>
    <template #footer>
      <slot name="footer">
        <div class="tw-flex tw-justify-center tw-gap-2.5">
          <UButton v-close-popup icon="cross" variant="outlined" @click="emit('deny')">No</UButton>
          <UButton v-close-popup icon="sign" @click="emit('confirm')">Yes</UButton>
        </div>
      </slot>
    </template>
  </UModal>
</template>
