<script setup>
import { computed, ref, useSlots, watch } from 'vue'
import HintPopover from 'components/shared/Popovers/HintPopover.vue'
import Input from 'components/ui/UInput.vue'
import Icon from 'src/components/ui/UIcon.vue'
import Textarea from 'src/components/ui/UTextarea.vue'
import Marquee from 'src/components/ui/UMarquee.vue'
import Toggle from 'src/components/ui/UToggle.vue'
import Tags from 'src/components/ui/UTags.vue'
import UAccordion from 'src/components/ui/UAccordion.vue'
import UButton from 'components/ui/UButton.vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  info: {
    type: String,
  },
  list: {
    type: Array,
    default: () => [],
  },
  fields: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: Array,
    default: () => [],
  },
  search: {
    type: String,
    default: '',
  },
  module: {
    type: String,
    required: true,
  },
  fieldKey: {
    type: String,
    required: false,
  },
  textareaKey: {
    type: String,
    required: false,
  },
  defaultField: {
    type: String,
  },
})
const emit = defineEmits(['update:modelValue', 'update:search'])

const slots = useSlots()

const searchValue = ref('')
watch(
  () => props.search,
  (newValue) => {
    searchValue.value = newValue
  },
  { immediate: true }
)
const searchValueModel = computed({
  get() {
    return searchValue.value
  },
  set(value) {
    searchValue.value = value
    emit('update:search', value)
  },
})
const hasSearchValue = computed(() => searchValue.value !== '')

const isFieldsMultiple = props.fields.length > 1
const hasFields = {
  search: props.fields.includes('search'),
  textarea: props.fields.includes('textarea'),
}
const fieldsOptions = computed(() => {
  const options = []

  if (hasFields.search) {
    options.push({ value: 'search', icon: 'align-left' })
  }
  if (hasFields.textarea) {
    options.push({ value: 'textarea', icon: 'apostrophe' })
  }

  return options
})

const filteredList = computed(() => {
  if (hasSearchValue.value) {
    return props.list.filter((item) =>
      item.name.toLowerCase().includes(searchValue.value.toLowerCase())
    )
  }

  return props.list
})
const hasFilteredList = computed(() => filteredList.value.length > 0)
const getListItem = (id) => props.list.find((item) => item.id === id)

const isEqualKeys = (key) => key === props.fieldKey || key === props.textareaKey

const fieldModelValue = computed(() => {
  const fields = props.modelValue.filter(({ key }) => {
    if (props.textareaKey) {
      return isEqualKeys(key)
    }
    return key === props.fieldKey
  })

  return [
    ...fields.filter(({ key }) => key === props.textareaKey),
    ...fields.filter(({ key }) => key === props.fieldKey),
  ]
})

const notFieldModelValue = computed(() => props.modelValue.filter(({ key }) => !isEqualKeys(key)))
const hasModelValue = computed(() => fieldModelValue.value.length > 0)
const resetModelValue = () => {
  emit('update:modelValue', notFieldModelValue.value)
}
const getModelValueItem = (id) => fieldModelValue.value.find(({ entity_id }) => entity_id === id)
const toggleModelValueItem = (item, operator) => {
  let modelValue = [...props.modelValue]
  const modelValueItem = modelValue.find(
    ({ key, entity_id }) => key === props.fieldKey && entity_id === item.id
  )

  if (modelValueItem === undefined) {
    modelValue.push({
      key: props.fieldKey,
      entity_id: item.id,
      value: item.value,
      operator,
      comparator: 'equals',
      name: item.name,
      module: props.module,
    })
  } else if (modelValueItem.operator === operator) {
    modelValue = modelValue.filter(
      ({ key, entity_id }) => key !== props.fieldKey || entity_id !== item.id
    )
  } else {
    modelValueItem.operator = operator
  }

  emit('update:modelValue', modelValue)
}
const toggleModelValueItemType = (id, operator) => {
  const modelValue = [...props.modelValue]
  const foundItem = modelValue.find(({ key, entity_id }) => isEqualKeys(key) && entity_id === id)
  foundItem.operator = operator ? 'include' : 'exclude'
  emit('update:modelValue', modelValue)
}
const removeModelValueItem = (id) => {
  const newValue = props.modelValue.filter(
    ({ key, entity_id }) => !isEqualKeys(key) || entity_id !== id
  )
  emit('update:modelValue', newValue)
}

const textareaValue = ref('')
watch(
  fieldModelValue,
  (newValue) => {
    textareaValue.value = newValue
      .filter(({ key }) => key === props.textareaKey)
      .map(({ value }) => value)
      .join(',')
  },
  { immediate: true }
)
const submitTextareaValue = () => {
  const newItems = [
    ...new Set(
      textareaValue.value
        .split(/[,;]/)
        .filter((item) => item.length > 0)
        .map((item) => item.trim())
    ),
  ]
  const searchFieldValues = fieldModelValue.value.filter(({ key }) => key === props.fieldKey)
  const newModelValue = [
    ...searchFieldValues,
    ...newItems.reduce((acc, value) => {
      const oldValue = fieldModelValue.value.find((item) => item.entity_id === value)
      return [
        ...acc,
        {
          entity_id: value,
          value,
          key: props.textareaKey,
          operator: oldValue?.operator ?? 'include',
          comparator: 'equals',
          name: value,
          module: props.module,
        },
      ]
    }, notFieldModelValue.value),
  ]
  emit('update:modelValue', newModelValue)
}

const usedField = ref(props.defaultField ?? props.fields[0])
const isUsedField = computed(() => ({
  search: usedField.value === 'search',
  textarea: usedField.value === 'textarea',
}))
const usedFieldModel = computed({
  get() {
    return usedField.value
  },
  set(value) {
    usedField.value = value
    if (isUsedField.value.textarea) {
      textareaValue.value = fieldModelValue.value
        .filter(({ key }) => key === props.textareaKey)
        .map(({ value }) => value)
        .join(',')
    }
  },
})
</script>

<template>
  <UAccordion class="tw-w-full" expanded>
    {{ title }}&nbsp;<HintPopover :text="info" />
    <template #body>
      <div
        v-if="isFieldsMultiple || hasModelValue"
        class="tw-mb-2.5 tw-grid tw-grid-cols-2 tw-gap-4"
      >
        <div>
          <div v-if="isFieldsMultiple" class="tw-flex tw-justify-end tw-gap-2.5">
            <div
              v-for="opt in fieldsOptions"
              :key="opt.value"
              v-ripple
              class="tw-relative tw-flex tw-h-6 tw-w-6 tw-cursor-pointer tw-items-center tw-justify-center tw-rounded tw-bg-ultralight-primary tw-text-primary tw-transition-[background-color,color] hover:tw-bg-primary hover:tw-text-white"
              :class="{ '!tw-bg-primary !tw-text-white': opt.value === usedField }"
              @click="usedFieldModel = opt.value"
            >
              <Icon class="tw-text-[0.75rem]" :name="opt.icon" />
            </div>
          </div>
        </div>
        <div>
          <button
            v-if="hasModelValue"
            class="tw-ml-auto tw-block tw-text-primary"
            type="button"
            @click="resetModelValue"
          >
            Remove All
          </button>
        </div>
      </div>
      <div class="tw-grid tw-grid-cols-2 tw-gap-2.5">
        <div>
          <slot>
            <Textarea
              v-if="isUsedField.textarea"
              v-model="textareaValue"
              :placeholder="`Enter ${title} as a comma-separated list`"
              @keydown.enter.prevent="submitTextareaValue"
            />
            <div v-else>
              <div class="tw-space-y-1.5">
                <Input
                  v-if="isUsedField.search"
                  v-model="searchValueModel"
                  :placeholder="`Search ${title}`"
                  :debounce="300"
                >
                  <template #append>
                    <Icon name="search" class="tw-text-[1.5rem]" />
                  </template>
                </Input>
                <div
                  v-if="loading || hasFilteredList || !isUsedField.search || hasSearchValue"
                  class="tw-rounded-xl tw-border tw-border-ultralight-primary"
                >
                  <div v-if="loading" class="value tw-justify-center">
                    <Icon class="tw-animate-spin tw-text-[1.5rem] tw-text-primary" name="spinner" />
                  </div>
                  <q-virtual-scroll
                    v-else-if="hasFilteredList"
                    v-slot="{ item }"
                    class="tw-max-h-[18rem] tw-px-3"
                    :items="filteredList"
                  >
                    <div :key="item.id" class="value tw-gap-1">
                      <UButton
                        icon="sign"
                        :bg="
                          getModelValueItem(item.id)?.operator === 'include'
                            ? 'primary'
                            : 'ultralight-primary'
                        "
                        :color="
                          getModelValueItem(item.id)?.operator === 'include' ? 'white' : 'primary'
                        "
                        size="2xs"
                        square
                        @click="toggleModelValueItem(item, 'include')"
                      />
                      <UButton
                        icon="ban"
                        :bg="
                          getModelValueItem(item.id)?.operator === 'exclude'
                            ? 'primary'
                            : 'ultralight-primary'
                        "
                        :color="
                          getModelValueItem(item.id)?.operator === 'exclude' ? 'white' : 'primary'
                        "
                        size="2xs"
                        square
                        @click="toggleModelValueItem(item, 'exclude')"
                      />
                      <Marquee>{{ item.name }}</Marquee>
                    </div>
                  </q-virtual-scroll>
                  <p v-else class="tw-my-3 tw-text-center">No results</p>
                </div>
              </div>
              <div v-if="slots.searchHint" class="tw-mt-3">
                <slot name="search-hint"></slot>
              </div>
            </div>
          </slot>
        </div>
        <div v-if="!loading" class="tw-space-y-1.5">
          <template v-if="hasModelValue">
            <div
              v-for="item in fieldModelValue"
              :key="item.entity_id"
              class="tw-flex tw-items-start tw-gap-2.5"
            >
              <Toggle
                class="tw-h-12"
                :model-value="item.operator === 'include'"
                @update:model-value="toggleModelValueItemType(item.entity_id, $event)"
              >
                {{ item.operator === 'include' ? 'Include' : 'Exclude' }}
              </Toggle>
              <Tags
                :model-value="[item.name ?? getListItem(item.entity_id)?.name ?? item.value]"
                class="tw-w-full"
                removable
                @update:model-value="removeModelValueItem(item.entity_id)"
              />
            </div>
          </template>
          <div
            v-else
            class="tw-flex tw-h-12 tw-w-full tw-items-center tw-justify-center tw-rounded-xl tw-bg-ultralight-primary tw-text-dark-primary"
          >
            No {{ title }} targeted
          </div>
        </div>
      </div>
    </template>
  </UAccordion>
</template>

<style lang="scss" scoped>
.value {
  display: flex;
  align-items: center;
  min-height: 3rem;

  &:not(:first-child) {
    border-top: 0.0625rem solid var(--ultralight-primary);
  }
}
</style>
