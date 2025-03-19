<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AdvertisersAPI, UploadAPI } from 'src/api'
import UButton from 'src/components/ui/UButton.vue'
import CreateForm from './components/CreateForm.vue'

const route = useRoute()
const router = useRouter()

const fieldsValues = ref({})

const isCreating = ref(false)
const create = async () => {
  isCreating.value = true
  try {
    const params = { ...fieldsValues.value }
    if (params.default_image instanceof File) {
      const uploadedFile = await UploadAPI.uploadFile({ file: params.default_image })
      params.default_image = uploadedFile.id
    }
    await AdvertisersAPI.create(params)
    router.push({ name: 'advertisers' })
  } catch (error) {}
  isCreating.value = false
}
</script>

<template>
  <form @submit.prevent="create">
    <div class="tw-mb-7.5 tw-flex tw-items-center tw-justify-between">
      <h1 class="page-title">Create Advertiser</h1>
      <div class="tw-flex tw-gap-2.5">
        <UButton
          :to="{ name: 'advertisers', query: { page: route.query.page } }"
          icon="cross"
          variant="outlined"
        >
          Cancel
        </UButton>
        <UButton type="submit" icon="add" variant="outlined" :loading="isCreating">Create</UButton>
      </div>
    </div>
    <CreateForm v-model="fieldsValues" />
  </form>
</template>
