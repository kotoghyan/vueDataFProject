<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { CreativeAddonsAPI, AdvertisersAPI } from 'src/api'
import UButton from 'src/components/ui/UButton.vue'
import UButtonToggle from 'src/components/ui/UButtonToggle.vue'
import UInput from 'src/components/ui/UInput.vue'
import USelect from 'src/components/ui/USelect.vue'
import Uploader from 'src/components/ui/UUploader/UUploader.vue'
import UAccordion from 'src/components/ui/UAccordion.vue'

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
  type: [
    {
      label: 'Banner',
      value: 0,
    },
    {
      label: 'Video',
      value: 1,
    },
    {
      label: 'Audio',
      value: 4,
    },
  ],
}
const fieldsValues = reactive({
  active: true,
  pixels: [],
  scripts: [],
  type: 0,
  ...props.modelValue,
})
watch(
  fieldsValues,
  (newValue) => {
    emit('update:modelValue', newValue)
  },
  { immediate: true, deep: true }
)

const hasPixels = computed(() => fieldsValues.pixels.length > 0)
const hasScripts = computed(() => fieldsValues.scripts.length > 0)

const isType = computed(() => ({
  banner: fieldsValues.type === 0,
  video: fieldsValues.type === 1,
  audio: fieldsValues.type === 4,
}))
const accepttedTypes = computed(() => {
  if (isType.value.banner) {
    return ['.gif', '.jpeg', '.jpg', '.png']
  }

  if (isType.value.video) {
    return ['.mp4', '.mov']
  }

  if (isType.value.audio) {
    return ['.mp3', '.aac', '.ogg', '.wav']
  }

  return []
})

const typeModel = computed({
  get: () => fieldsValues.type,
  set: (val) => {
    fieldsValues.type = val
    delete fieldsValues.media
  },
})

const mediaModel = computed({
  get() {
    return fieldsValues.media
  },
  set(value) {
    fieldsValues.media = value
    if (!fieldsValues.name) {
      fieldsValues.name = value.name.slice(0, value.name.lastIndexOf('.'))
    }
  },
})

const isAdvertisersLoading = ref(false)
const advertisers = ref([])
const getAdvertisers = async () => {
  isAdvertisersLoading.value = true
  const data = await AdvertisersAPI.getNames()
  advertisers.value = data
  isAdvertisersLoading.value = false
}
getAdvertisers()

const isCreativeAddonsLoading = ref(false)
const creativeAddons = ref([])
const getCreativeAddons = async () => {
  isCreativeAddonsLoading.value = true
  try {
    const data = await CreativeAddonsAPI.getAll()
    creativeAddons.value = data
  } catch (error) {}
  isCreativeAddonsLoading.value = false
}
getCreativeAddons()

const addPixel = () => {
  fieldsValues.pixels.push('')
}
const removePixel = (index) => {
  fieldsValues.pixels.splice(index, 1)
}
const addScript = () => {
  fieldsValues.scripts.push('')
}
const removeScript = (index) => {
  fieldsValues.scripts.splice(index, 1)
}
</script>

<template>
  <div class="tw-space-y-2.5">
    <div class="tw-rounded-xl tw-bg-white tw-p-6">
      <div class="tw-grid tw-grid-cols-4 tw-items-end tw-gap-2.5">
        <UInput v-model="fieldsValues.name" placeholder="Creative Name" required>
          <template #title>Creative Name</template>
        </UInput>
        <div class="tw-flex tw-items-end tw-gap-[inherit]">
          <UButtonToggle
            v-model="typeModel"
            :options="fieldsOptions.type"
            info="Line item type can be either “banner” or “video”. Line items of type “banner” can only have banner creative associated to them. Line items of type “video” can only have video creatives associated to them. Mobile campaigns can be set up as either “video” or “banner” depending on the creative format being used."
          >
            <template #title>Creative Type</template>
          </UButtonToggle>
          <UButtonToggle v-model="fieldsValues.active" :options="fieldsOptions.active">
            <template #title>Active</template>
          </UButtonToggle>
        </div>
      </div>
    </div>
    <UAccordion reverse>
      Advertiser
      <template #body>
        <div class="tw-grid tw-grid-cols-4">
          <USelect
            v-model="fieldsValues.advertiser_id"
            :options="advertisers"
            :loading="isAdvertisersLoading"
            placeholder="Select Advertiser"
            option-label="name"
            option-value="id"
            emit-value
            required
          >
            <template #title>Advertiser</template>
          </USelect>
        </div>
      </template>
    </UAccordion>
    <UAccordion reverse>
      Add Content
      <template #body>
        <div class="tw-grid tw-grid-cols-4 tw-gap-2.5">
          <Uploader v-model="mediaModel" class="tw-col-span-4" :accept="accepttedTypes" required />
          <UInput
            v-model="fieldsValues.click_url"
            class="tw-row-start-2"
            placeholder="Click URL"
            info="This is the URL triggered when someone clicks on your banner ad."
            required
          >
            <template #title>Click URL</template>
          </UInput>
        </div>
      </template>
    </UAccordion>
    <UAccordion reverse>
      Pixels and Scripts
      <template #body>
        <div class="tw-grid tw-grid-cols-4 tw-gap-2.5">
          <USelect
            v-model="fieldsValues.creative_addons"
            :options="creativeAddons"
            :loading="isCreativeAddonsLoading"
            placeholder="Select Creative Add-ons"
            option-label="name"
            option-value="id"
            emit-value
            multiple
          >
            <template #title>Creative Add-ons</template>
          </USelect>
          <div>
            <p class="tw-mb-1.5 tw-font-medium">Pixels</p>
            <div class="tw-space-y-1">
              <div v-for="(_, index) in fieldsValues.pixels" :key="index" class="tw-flex tw-gap-1">
                <UInput
                  v-model="fieldsValues.pixels[index]"
                  class="tw-w-full"
                  placeholder="https://"
                />
                <UButton icon="delete" bg="light-gray" square @click="removePixel(index)" />
              </div>
              <UButton :class="{ 'tw-w-full': !hasPixels }" variant="outlined" @click="addPixel">
                + Add 3rd Party Impression Pixel
              </UButton>
            </div>
          </div>
          <div>
            <p class="tw-mb-1.5 tw-font-medium">Scripts</p>
            <div class="tw-space-y-1">
              <div v-for="(_, index) in fieldsValues.scripts" :key="index" class="tw-flex tw-gap-1">
                <UInput
                  v-model="fieldsValues.scripts[index]"
                  class="tw-w-full"
                  placeholder="https://"
                />
                <UButton icon="delete" bg="light-gray" square @click="removeScript(index)" />
              </div>
              <UButton :class="{ 'tw-w-full': !hasScripts }" variant="outlined" @click="addScript">
                + Add 3rd Party JavaScript
              </UButton>
            </div>
          </div>
        </div>
      </template>
    </UAccordion>
  </div>
</template>
