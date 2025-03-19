<script setup>
import { ref } from 'vue'
import { CreativesAPI, UploadAPI } from 'src/api'
import { useRoute, useRouter } from 'vue-router'
import Button from 'src/components/ui/UButton.vue'
import CreateForm from './components/CreateForm.vue'

const route = useRoute()
const router = useRouter()

const fieldsValues = ref({})

const isCreating = ref(false)
const create = async () => {
  isCreating.value = true
  try {
    const params = { ...fieldsValues.value }
    if (params.media instanceof File) {
      const uploadedFile = await UploadAPI.uploadFile({ file: params.media })
      params.media_id = uploadedFile.id
    }
    await CreativesAPI.create(params)
    router.push({ name: 'creatives' })
  } catch (error) {}
  isCreating.value = false
}
</script>

<template>
  <form @submit.prevent="create">
    <div class="tw-mb-7.5 tw-flex tw-items-center tw-justify-between">
      <h1 class="page-title">New Creative</h1>
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
        <Button type="submit" icon="add" variant="outlined" :loading="isCreating">Create</Button>
      </div>
    </div>
    <CreateForm v-model="fieldsValues" />
  </form>
</template>
