<script setup>
import { inject } from 'vue'
import UInput from 'components/ui/UInput.vue'
import USelect from 'components/ui/USelect.vue'
import UButton from 'components/ui/UButton.vue'
import UButtonToggle from 'components/ui/UButtonToggle.vue'

const emit = defineEmits(['handleSubmit'])

const list = inject('list')
const isListCreated = inject('isListCreated')

const fieldsOptions = {
  active: [
    {
      label: 'Active',
      value: true,
    },
    {
      label: 'Inactive',
      value: false,
    },
  ],
  type: [
    {
      label: 'Lat/Long',
      value: 'lat_long',
    },
    {
      label: 'Zip Code',
      value: 'zip_code',
    },
    {
      label: 'Deal ID',
      value: 'deal_id',
    },
  ],
}

const handleSubmit = (event) => {
  emit('handleSubmit', event.submitter.name)
}
</script>

<template>
  <form
    id="createLineItemForm"
    class="tw-mt-4 tw-w-2/4 tw-space-y-2.5"
    @submit.prevent="handleSubmit"
  >
    <UInput v-model="list.id" placeholder="List Id" disabled>
      <template #title>List Id</template>
    </UInput>
    <USelect
      v-model="list.type"
      :options="fieldsOptions.type"
      :disabled="isListCreated"
      placeholder="List Type"
      emit-value
      required
    >
      <template #title>List Type</template>
    </USelect>
    <UInput v-model="list.name" placeholder="List Name" required>
      <template #title>List Name</template>
    </UInput>
    <UButtonToggle v-model="list.active" :options="fieldsOptions.active">
      <template #title>Active</template>
    </UButtonToggle>
    <div class="tw-flex tw-justify-start tw-gap-2.5">
      <UButton type="submit" name="close" variant="outlined">Save and Close</UButton>
      <UButton type="submit" name="continue" variant="outlined"> Save and Continue </UButton>
    </div>
  </form>
</template>

<style lang="scss" scoped></style>
