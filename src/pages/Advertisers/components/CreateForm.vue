<script setup>
import { reactive, ref, watch } from 'vue'
import { ContinentsAPI, CurrenciesAPI, AdvertiserCategoriesAPI } from 'src/api'
import UAccordion from 'src/components/ui/UAccordion.vue'
import UInput from 'src/components/ui/UInput.vue'
import UTextarea from 'src/components/ui/UTextarea.vue'
import UButtonToggle from 'src/components/ui/UButtonToggle.vue'
import USelect from 'src/components/ui/USelect.vue'
import UUploader from 'src/components/ui/UUploader/UUploader.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
})
const emit = defineEmits(['update:modelValue'])

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
}
const fieldsValues = reactive({ active: true, ...props.modelValue })
watch(
  fieldsValues,
  (newValue) => {
    emit('update:modelValue', newValue)
  },
  { immediate: true, deep: true }
)

const isCategoriesLoading = ref(false)
const categories = ref([])
const getCategories = async () => {
  isCategoriesLoading.value = true
  const data = await AdvertiserCategoriesAPI.getAll({ sort: { value: 'name', direction: 'asc' } })
  categories.value = data
  isCategoriesLoading.value = false
}
getCategories()

const isContinentsLoading = ref(false)
const continents = ref([])
const getContinents = async () => {
  isContinentsLoading.value = true
  const data = await ContinentsAPI.getAll({ sort: { value: 'name', direction: 'asc' } })
  continents.value = data
  isContinentsLoading.value = false
}
getContinents()

const isCurrenciesLoading = ref(false)
const currencies = ref([])
const getCurrencies = async () => {
  isCurrenciesLoading.value = true
  const data = await CurrenciesAPI.getAll({ sort: { value: 'name', direction: 'asc' } })
  currencies.value = data
  isCurrenciesLoading.value = false
}
getCurrencies()
</script>

<template>
  <div class="tw-space-y-2.5">
    <UAccordion expanded reverse>
      Essential Settings<span class="tw-text-red">*</span>
      <template #body>
        <div class="tw-grid tw-grid-cols-4 tw-gap-2.5">
          <UInput v-model="fieldsValues.name" placeholder="Type Advertiser Name" required>
            <template #title>Advertiser Name</template>
          </UInput>
          <UInput
            v-model="fieldsValues.domain"
            placeholder="https://"
            info="The Advertiser’s primary domain (e.g. myadvertiser.com). This is required by many exchanges."
            required
          >
            <template #title>Advertiser Domain</template>
          </UInput>
          <USelect
            v-model="fieldsValues.category_id"
            :options="categories"
            option-label="name"
            option-value="id"
            :loading="isCategoriesLoading"
            placeholder="Select Advertiser Category"
            info="Category of the advertiser’s product or services"
            emit-value
            required
          >
            <template #title>Advertiser Category</template>
          </USelect>
          <UButtonToggle v-model="fieldsValues.active" :options="fieldsOptions.active">
            <template #title>Status</template>
          </UButtonToggle>
          <UTextarea v-model="fieldsValues.notes" class="tw-col-span-2" placeholder="Type Notes">
            <template #title>Notes</template>
          </UTextarea>
        </div>
      </template>
    </UAccordion>
    <UAccordion expanded reverse>
      Defaults<span class="tw-text-red">*</span>
      <template #body>
        <div class="tw-grid tw-grid-cols-4 tw-gap-2.5">
          <USelect
            v-model="fieldsValues.default_continent"
            :options="continents"
            option-label="name"
            option-value="id"
            :loading="isContinentsLoading"
            placeholder="Select Continent"
            emit-value
          >
            <template #title>Default Continent</template>
          </USelect>
          <USelect
            v-model="fieldsValues.default_currency"
            :options="currencies"
            option-label="name"
            option-value="id"
            :loading="isCurrenciesLoading"
            placeholder="Select Currency"
            emit-value
          >
            <template #title>Default Currency</template>
            <template #option="{ opt }"> {{ opt.name }} ({{ opt.glyph }}) </template>
          </USelect>
          <UInput
            v-model="fieldsValues.default_click_url"
            placeholder="https://"
            info="Default Click Through URL will be used in creatives that are missing a Click Through URL"
          >
            <template #title>Default Click URL</template>
          </UInput>
        </div>
        <div class="tw-my-5 tw-h-px tw-w-full tw-bg-ultralight-primary"></div>
        <p class="tw-font-medium">Default Creative Thumbnail</p>
        <UUploader
          v-model="fieldsValues.default_image"
          class="tw-mt-4"
          :accept="['.gif', '.jpeg', '.jpg', '.png']"
        />
      </template>
    </UAccordion>
  </div>
</template>
