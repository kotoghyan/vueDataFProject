<script setup>
import UInput from 'components/ui/UInput.vue'

defineProps({
  index: {
    type: Number,
    required: true,
  },
})

const model = defineModel({ type: Object, required: true })
</script>

<template>
  <UInput
    v-model="model.attributes.deal_id"
    placeholder="Deal ID"
    required
    :disabled="!model.canEdit"
  >
    <template v-if="!index" #title>Deal ID</template>
  </UInput>
  <UInput v-model="model.name" placeholder="List Item Name" :disabled="!model.canEdit">
    <template v-if="!index" #title>List Item Name</template>
  </UInput>
</template>

<style scoped lang="scss"></style>
