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
    v-model="modelValue.attributes.lat"
    placeholder="Latitude"
    required
    :disabled="!modelValue.canEdit"
  >
    <template v-if="!index" #title>Latitude</template>
  </UInput>
  <UInput
    v-model="modelValue.attributes.long"
    placeholder="Longitude"
    required
    :disabled="!modelValue.canEdit"
  >
    <template v-if="!index" #title>Longitude</template>
  </UInput>
  <UInput
    v-model="modelValue.attributes.radius"
    placeholder="Radius(miles)"
    required
    :disabled="!modelValue.canEdit"
  >
    <template v-if="!index" #title>Radius(miles)</template>
  </UInput>
  <UInput v-model="modelValue.name" placeholder="List Item Name" :disabled="!modelValue.canEdit">
    <template v-if="!index" #title>List Item Name</template>
  </UInput>
</template>

<style scoped lang="scss"></style>
