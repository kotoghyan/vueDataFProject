<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { cloneDeep } from 'lodash-es'
import { CampaignsAPI } from 'src/api'
import UButton from 'src/components/ui/UButton.vue'
import UIcon from 'src/components/ui/UIcon.vue'
import CreateAndEditForm from './components/CreateAndEditForm.vue'

const fieldsValues = ref({})

const route = useRoute()
const router = useRouter()

const isLoading = ref(false)
const campaign = ref({})
const getCampaign = async () => {
  isLoading.value = true
  const { id } = route.params
  const data = await CampaignsAPI.get({ id })
  fieldsValues.value = cloneDeep(data)
  campaign.value = cloneDeep(data)
  isLoading.value = false
}
getCampaign()

const isUpdating = ref(false)
const update = async () => {
  isUpdating.value = true
  try {
    await CampaignsAPI.update(fieldsValues.value)
    router.push({ name: 'campaigns' })
  } catch (error) {}
  isUpdating.value = false
}
</script>

<template>
  <form @submit.prevent="update">
    <div class="tw-mb-7.5 tw-flex tw-items-center tw-justify-between">
      <h1 class="page-title">Edit Campaign</h1>
      <div class="tw-flex tw-gap-2.5">
        <UButton
          :to="{
            name: 'campaigns',
            query: route.query,
          }"
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
    <div v-else class="tw-rounded-xl tw-bg-white tw-p-6">
      <CreateAndEditForm v-model="fieldsValues" />
    </div>
  </form>
</template>
