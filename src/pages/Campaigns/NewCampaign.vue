<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CampaignsAPI } from 'src/api'
import UButton from 'src/components/ui/UButton.vue'
import CreateAndEditForm from './components/CreateAndEditForm.vue'

const fieldsValues = ref({})

const route = useRoute()
const router = useRouter()

const isCreating = ref(false)
const create = async () => {
  isCreating.value = true
  try {
    const data = await CampaignsAPI.create(fieldsValues.value)
    router.push({
      name: 'newLineItem',
      query: {
        advertiser_id: fieldsValues.value.advertiser_id,
        campaign_id: data.id,
        campaign_type: fieldsValues.value.type,
      },
    })
  } catch (error) {}
  isCreating.value = false
}
</script>

<template>
  <form @submit.prevent="create">
    <div class="tw-mb-7.5 tw-flex tw-items-center tw-justify-between">
      <h1 class="page-title">Create Campaign</h1>
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
        <UButton type="submit" icon="add" variant="outlined" :loading="isCreating">Next</UButton>
      </div>
    </div>
    <div class="tw-rounded-xl tw-bg-white tw-p-6">
      <CreateAndEditForm v-model="fieldsValues" />
    </div>
  </form>
</template>
