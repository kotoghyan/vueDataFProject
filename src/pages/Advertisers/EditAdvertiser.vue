<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AdvertisersAPI, UploadAPI } from 'src/api'
import { cloneDeep } from 'lodash-es'
import UButton from 'src/components/ui/UButton.vue'
import UIcon from 'src/components/ui/UIcon.vue'
import CreateForm from './components/CreateForm.vue'

const router = useRouter()
const route = useRoute()

const fieldsValues = ref({})

const isLoading = ref(false)
const advertiser = ref({})
const getAdvertiser = async () => {
  isLoading.value = true
  const { id } = route.params
  const data = await AdvertisersAPI.get({ id })
  fieldsValues.value = { ...cloneDeep(data), default_image: data.default_image?.original_url }
  advertiser.value = cloneDeep(data)
  isLoading.value = false
}
getAdvertiser()

const isUpdating = ref(false)
const update = async () => {
  isUpdating.value = true
  try {
    const params = { ...fieldsValues.value }
    if (params.default_image instanceof File) {
      const uploadedFile = await UploadAPI.uploadFile({ file: params.default_image })
      params.default_image = uploadedFile.id
    } else {
      params.default_image = advertiser.value.default_image?.id
    }

    await AdvertisersAPI.update(params)
    router.push({ name: 'advertisers' })
  } catch (error) {}
  isUpdating.value = false
}
</script>

<template>
  <form @submit.prevent="update">
    <div class="tw-mb-7.5 tw-flex tw-items-center tw-justify-between">
      <h1 class="page-title">Edit Advertiser</h1>
      <div class="tw-flex tw-gap-2.5">
        <UButton
          :to="{ name: 'advertisers', query: { page: route.query.page } }"
          icon="cross"
          variant="outlined"
        >
          Cancel
        </UButton>
        <UButton type="submit" icon="sign" variant="outlined" :loading="isUpdating">Save</UButton>
      </div>
    </div>
    <div v-if="isLoading" class="tw-flex tw-justify-center">
      <UIcon name="spinner" class="tw-animate-spin tw-text-[3rem] tw-text-primary" />
    </div>
    <CreateForm v-else v-model="fieldsValues" />
  </form>
</template>
