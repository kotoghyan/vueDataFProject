<script setup>
import { ref } from 'vue'
import { CreativesAPI, UploadAPI } from 'src/api'
import { useRouter, useRoute } from 'vue-router'
import Button from 'src/components/ui/UButton.vue'
import Icon from 'src/components/ui/UIcon.vue'
import CreateForm from './components/CreateForm.vue'
import { cloneDeep } from 'lodash-es'
import { useUserStore } from 'src/stores'

const userStore = useUserStore()

const route = useRoute()
const router = useRouter()

const fieldsValues = ref({})

const isLoading = ref(false)
const creatives = ref({})
const getCreative = async () => {
  isLoading.value = true
  const { id } = route.params
  const data = await CreativesAPI.get({ id })
  fieldsValues.value = {
    ...cloneDeep(data),
    creative_addons: data.creative_addons.map(({ id }) => id),
    media: data.thumbnail_url,
  }
  creatives.value = cloneDeep(data)
  isLoading.value = false
}
getCreative()

const isUpdating = ref(false)
const update = async () => {
  isUpdating.value = true
  try {
    const params = { ...fieldsValues.value, user_id: userStore.user.id }
    if (params.media instanceof File) {
      const uploadedFile = await UploadAPI.uploadFile({ file: params.media })
      params.media_id = uploadedFile.id
    }

    await CreativesAPI.update(params)
    router.push({ name: 'creatives' })
  } catch (error) {}
  isUpdating.value = false
}
</script>

<template>
  <form @submit.prevent="update">
    <div class="tw-mb-7.5 tw-flex tw-items-center tw-justify-between">
      <h1 class="page-title">Edit Creative</h1>
      <div class="tw-flex tw-gap-2.5">
        <Button
          :to="{
            name: 'creatives',
            query: route.query,
          }"
          icon="cross"
          variant="outlined"
        >
          Cancel
        </Button>
        <Button type="submit" icon="sign" variant="outlined" :loading="isUpdating">Save</Button>
      </div>
    </div>
    <div v-if="isLoading" class="tw-flex tw-justify-center">
      <Icon name="spinner" class="tw-animate-spin tw-text-[3rem] tw-text-primary" />
    </div>
    <CreateForm v-else v-model="fieldsValues" />
  </form>
</template>
