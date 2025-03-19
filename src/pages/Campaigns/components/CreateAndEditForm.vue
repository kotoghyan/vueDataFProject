<script setup>
import { reactive, ref, watch } from 'vue'
import { AdvertisersAPI } from 'src/api'
import UInput from 'src/components/ui/UInput.vue'
import UTextarea from 'src/components/ui/UTextarea.vue'
import UButtonToggle from 'src/components/ui/UButtonToggle.vue'
import USelect from 'src/components/ui/USelect.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
})
const emit = defineEmits(['update:modelValue'])

const fieldsOptions = {
  type: [
    { label: 'Banner', value: 0 },
    { label: 'Video', value: 1 },
    { label: 'CTV', value: 3 },
    { label: 'DOOH', value: 4 },
    { label: 'Audio', value: 5 },
  ],
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
}
const fieldsValues = reactive({ active: true, ...props.modelValue })
watch(
  fieldsValues,
  (newValue) => {
    emit('update:modelValue', newValue)
  },
  { immediate: true, deep: true }
)

const isAdvertisersLoading = ref(false)
const advertisers = ref([])
const getAdvertisers = async () => {
  isAdvertisersLoading.value = true
  const data = await AdvertisersAPI.getNames()
  advertisers.value = data
  isAdvertisersLoading.value = false
}
getAdvertisers()
</script>

<template>
  <div class="tw-grid tw-grid-flow-row tw-grid-cols-4 tw-gap-2.5">
    <USelect
      v-model="fieldsValues.advertiser_id"
      :options="advertisers"
      option-label="name"
      option-value="id"
      :loading="isAdvertisersLoading"
      placeholder="Select Advertiser"
      emit-value
      required
    >
      <template #title>Advertiser</template>
    </USelect>
    <UInput v-model="fieldsValues.name" placeholder="Type Campaign Name" required>
      <template #title>Campaign Name</template>
    </UInput>
    <!--    <USelect-->
    <!--      v-model="fieldsValues.type"-->
    <!--      :options="fieldsOptions.type"-->
    <!--      placeholder="Select Campaign Type"-->
    <!--      emit-value-->
    <!--      required-->
    <!--    >-->
    <!--      <template #title>Campaign Type</template>-->
    <!--    </USelect>-->
    <UButtonToggle v-model="fieldsValues.active" :options="fieldsOptions.active">
      <template #title>Active</template>
    </UButtonToggle>
    <UTextarea
      v-model="fieldsValues.notes"
      class="tw-col-span-2 tw-row-start-2"
      placeholder="Notes"
    >
      <template #title>Notes</template>
    </UTextarea>
  </div>
</template>
