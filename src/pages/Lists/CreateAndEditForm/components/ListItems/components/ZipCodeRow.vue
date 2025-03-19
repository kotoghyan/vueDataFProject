<script setup>
import UInput from 'components/ui/UInput.vue'

defineProps({
  index: {
    type: Number,
    required: true,
  },
})

const modelValue = defineModel('modelValue', { type: Object, required: true })
</script>

<template>
  <UInput
    v-model="modelValue.attributes.zip_code"
    placeholder="Zip code"
    required
    :disabled="!modelValue.canEdit"
  >
    <template v-if="!index" #title>Zip code</template>
  </UInput>
  <UInput v-model="modelValue.name" placeholder="List Item Name" :disabled="!modelValue.canEdit">
    <template v-if="!index" #title>List Item Name</template>
  </UInput>
</template>

<style scoped lang="scss"></style>
