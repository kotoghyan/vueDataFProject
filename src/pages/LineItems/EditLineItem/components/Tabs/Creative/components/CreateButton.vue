<script setup>
import { inject, ref, computed } from 'vue'
import UButton from 'components/ui/UButton.vue'
import UModal from 'components/ui/UModal.vue'
import UInput from 'components/ui/UInput.vue'
import { CreativesAPI, UploadAPI } from 'src/api'
import UUploader from 'components/ui/UUploader/UUploader.vue'
import { NotifyService } from 'src/services'

const emit = defineEmits(['hide'])

const lineItem = inject('lineItem')

const modal = ref(null)

const typeOptions = {
  0: 0,
  1: 1,
  3: 1,
  4: 1,
  5: 4,
}
const isType = computed(() => ({
  banner: typeOptions[lineItem.value.type] === 0,
  video: typeOptions[lineItem.value.type] === 1,
  audio: typeOptions[lineItem.value.type] === 4,
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

const getDefaultFieldsValues = () => ({
  active: true,
  advertiser_id: lineItem.value.advertiser_id,
})
const fieldsValues = ref(getDefaultFieldsValues())

const isCreating = ref(false)
const create = async () => {
  isCreating.value = true
  try {
    const params = {
      ...fieldsValues.value,
      type: typeOptions[lineItem.value.type],
    }
    if (params.media instanceof File) {
      const uploadedFile = await UploadAPI.uploadFile({ file: params.media })
      params.media_id = uploadedFile.id
    }
    await CreativesAPI.create(params)
    NotifyService.create({
      type: 'positive',
      message: 'Creative added successfully',
    })
    modal.value?.hide()
    fieldsValues.value = getDefaultFieldsValues()
  } catch (error) {}
  isCreating.value = false
}
</script>

<template>
  <UModal ref="modal" width="xl" close-button @hide="emit('hide')">
    <template #trigger>
      <UButton class="tw-ml-auto" icon="add" variant="outlined">Upload New </UButton>
    </template>
    <template #title> New Creative </template>
    <form @submit.prevent="create">
      <div class="tw-grid tw-grid-cols-4 tw-gap-2.5">
        <UInput v-model="fieldsValues.name" placeholder="Creative Name" required>
          <template #title>Creative Name</template>
        </UInput>
        <UUploader
          v-model="fieldsValues.media"
          class="tw-col-span-4 tw-row-start-2"
          :accept="accepttedTypes"
          required
        />
        <UInput
          v-model="fieldsValues.click_url"
          class="tw-row-start-3"
          placeholder="Click URL"
          info="This is the URL triggered when someone clicks on your banner ad."
          required
        >
          <template #title>Click URL</template>
        </UInput>
      </div>
      <div class="tw-ml-auto tw-mt-6 tw-flex tw-w-max tw-gap-2.5">
        <UButton v-close-popup variant="outlined">Cancel</UButton>
        <UButton type="submit" variant="outlined" :loading="isCreating"> Create </UButton>
      </div>
    </form>
  </UModal>
</template>

<style scoped lang="scss"></style>
