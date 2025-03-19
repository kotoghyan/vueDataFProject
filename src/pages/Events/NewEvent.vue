<script setup>
import { ref } from 'vue'
import { AdvertisersAPI, EventsAPI } from 'src/api'
import { useRouter } from 'vue-router'
import UButton from 'src/components/ui/UButton.vue'
import UInput from 'src/components/ui/UInput.vue'
import USelect from 'src/components/ui/USelect.vue'
import UButtonToggle from 'src/components/ui/UButtonToggle.vue'
import UTextarea from 'src/components/ui/UTextarea.vue'
import UIcon from 'components/ui/UIcon.vue'
import { copyToClipboard } from 'quasar'
import { NotifyService } from 'src/services'

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
  event_type: [
    {
      label: 'Purchase',
      value: 'Purchase',
    },
    {
      label: 'Landing page',
      value: 'Landing page',
    },
    {
      label: 'Sign-Up',
      value: 'Sign-Up',
    },
    {
      label: 'Lead',
      value: 'Lead',
    },
  ],
}

const router = useRouter()

const fieldsValues = ref({ active: true })

const isAdvertisersLoading = ref(false)
const advertisers = ref([])
const getAdvertisers = async () => {
  isAdvertisersLoading.value = true
  const data = await AdvertisersAPI.getNames()
  advertisers.value = data
  isAdvertisersLoading.value = false
}
getAdvertisers()

const isCreating = ref(false)
const create = async () => {
  isCreating.value = true
  try {
    await EventsAPI.create(fieldsValues.value)
    router.push({ name: 'events' })
  } catch (error) {}
  isCreating.value = false
}

const shouldGenerateTag = ref(false)
const tag = `onClick="_gaq.push(['_trackEvent', 'Product page', 'Purchased', 'Complete Product Purchase', 20, false]);"`
const copyTag = async () => {
  await copyToClipboard(tag)
  NotifyService.create({
    type: 'positive',
    message: 'Tag copied successfully',
  })
}
</script>

<template>
  <form @submit.prevent="create">
    <div class="tw-mb-7.5 tw-flex tw-items-center tw-justify-between">
      <h1 class="page-title">Create Event</h1>
      <div class="tw-flex tw-gap-2.5">
        <UButton :to="{ name: 'events' }" icon="cross" variant="outlined">Cancel</UButton>
        <UButton type="submit" icon="add" variant="outlined">Create</UButton>
      </div>
    </div>
    <div class="tw-rounded-xl tw-bg-white tw-p-6">
      <div class="tw-grid tw-grid-cols-4 tw-items-end tw-gap-2.5">
        <UInput v-model="fieldsValues.name" placeholder="Type Event Name" required>
          <template #title>Event Name</template>
        </UInput>
        <USelect
          v-model="fieldsValues.advertiser_id"
          :options="advertisers"
          :loading="isAdvertisersLoading"
          option-label="name"
          option-value="id"
          placeholder="Select Advertiser"
          emit-value
          required
        >
          <template #title>Advertiser</template>
        </USelect>
        <USelect
          v-model="fieldsValues.event_type"
          :options="fieldsOptions.event_type"
          placeholder="Select Event Type"
          info="Event type is used to categorize the type of event you are creating. The event type is only used for organizational purposes."
          emit-value
          required
        >
          <template #title>Event Type</template>
        </USelect>
        <UInput
          v-model="fieldsValues.default_value"
          placeholder="1"
          info="This is the default value (in U.S. dollars) that a conversion event is worth to you. The value will only be used if a value is not present in the event tag."
          required
        >
          <template #title>Default Value</template>
          <template #prepend>$</template>
        </UInput>
        <UInput
          v-model="fieldsValues.click_window_days"
          placeholder="0"
          info="The look back window (in days) for click conversion attribution."
        >
          <template #title>Click Window in Days (Max 30)</template>
        </UInput>
        <UInput
          v-model="fieldsValues.view_window_days"
          placeholder="0"
          info="The look back window (in days) for view conversion attribution."
        >
          <template #title>View Window in Days (Max 30)</template>
        </UInput>
        <UButtonToggle v-model="fieldsValues.active" :options="fieldsOptions.active" />
        <UTextarea v-model="fieldsValues.notes" class="tw-col-span-2" placeholder="Type Notes">
          <template #title>Notes</template>
        </UTextarea>
      </div>
      <UButton class="tw-mt-2.5" variant="outlined" @click="shouldGenerateTag = true">
        Save and Generate Tag
      </UButton>
      <div
        v-if="shouldGenerateTag"
        class="tw-mt-2.5 tw-w-max tw-rounded-xl tw-bg-ultralight-primary tw-p-5"
      >
        {{ tag }}
        <UIcon
          class="tw-ml-2 tw-cursor-pointer tw-text-[1.5rem] tw-transition-[color] hover:tw-text-primary"
          name="copy"
          @click="copyTag"
        />
      </div>
    </div>
  </form>
</template>
