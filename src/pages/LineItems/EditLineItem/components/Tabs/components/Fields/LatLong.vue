<script setup>
import { ref, computed } from 'vue'
import UInput from 'components/ui/UInput.vue'
import UAccordion from 'src/components/ui/UAccordion.vue'
import UButton from 'components/ui/UButton.vue'

const props = defineProps({
  module: {
    type: String,
    required: true,
  },
})

const modelValue = defineModel({ type: Array, required: true })

const fieldGet = ($key) => modelValue.value.find(({ key }) => key === $key)?.value

const fieldsValues = ref({
  lat: fieldGet('lat') ?? '',
  long: fieldGet('long') ?? '',
  radius: fieldGet('radius') ?? '',
})

const hasSomeFieldValue = computed(() =>
  Object.values(fieldsValues.value).some((value) => value.length > 0)
)
const hasAllFieldsValue = computed(() =>
  Object.values(fieldsValues.value).every((value) => value.length > 0)
)
const isSomeFieldEmpty = computed(() =>
  Object.values(fieldsValues.value).some((value) => value.length === 0)
)
const isEditing = ref(isSomeFieldEmpty.value)
const getCleanedModelValue = () =>
  modelValue.value.filter(({ key }) => !Object.keys(fieldsValues.value).includes(key))
const apply = () => {
  const newModelValue = getCleanedModelValue()
  for (const [key, value] of Object.entries(fieldsValues.value)) {
    if (value.length > 0) {
      newModelValue.push({
        value,
        key,
        operator: 'include',
        comparator: 'equals',
        module: props.module,
        entity_id: null,
        name: null,
      })
    }
  }
  modelValue.value = newModelValue

  isEditing.value = !isEditing.value
}
const reset = () => {
  for (const key of Object.keys(fieldsValues.value)) {
    fieldsValues.value[key] = ''
  }
  modelValue.value = getCleanedModelValue()
  isEditing.value = true
}

const latMask = {
  mask: Number,
  min: -90,
  max: 90,
  radix: '.',
  scale: 8,
}
const longMask = {
  mask: Number,
  min: -180,
  max: 180,
  radix: '.',
  scale: 8,
}
const radiusMask = {
  mask: Number,
  min: 0,
  radix: '.',
  scale: 8,
}
</script>

<template>
  <UAccordion class="tw-w-full" expanded>
    Lat Long
    <template #body>
      <form class="tw-flex tw-items-end tw-gap-2.5" @submit.prevent="apply">
        <UInput
          v-model="fieldsValues.lat"
          :disabled="!isEditing"
          :required="hasSomeFieldValue"
          :mask="latMask"
          placeholder="Latitude"
        >
          <template #title>Latitude</template>
        </UInput>
        <UInput
          v-model="fieldsValues.long"
          :disabled="!isEditing"
          :required="hasSomeFieldValue"
          :mask="longMask"
          placeholder="Longitude"
        >
          <template #title>Longitude</template>
        </UInput>
        <UInput
          v-model="fieldsValues.radius"
          :disabled="!isEditing"
          :required="hasSomeFieldValue"
          :mask="radiusMask"
          placeholder="Radius(miles)"
        >
          <template #title>Radius(miles)</template>
        </UInput>
        <UButton
          v-ripple
          type="submit"
          bg="light-gray"
          :icon="isEditing ? 'sign' : 'edit'"
          square
          :disabled="hasSomeFieldValue && !hasAllFieldsValue"
        />
        <UButton bg="light-gray" icon="cross" square @click="reset" />
      </form>
    </template>
  </UAccordion>
</template>
