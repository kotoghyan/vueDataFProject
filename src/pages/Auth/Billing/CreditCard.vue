<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import UInput from 'src/components/ui/UInput.vue'
import UButton from 'src/components/ui/UButton.vue'
import UIcon from 'components/ui/UIcon.vue'

const router = useRouter()

const fieldsValues = ref({})

const isSubmitting = ref(false)
const submit = async () => {
  isSubmitting.value = true
  router.replace({ name: 'login' })
  isSubmitting.value = false
}
</script>

<template>
  <form
    class="tw-mx-auto tw-flex tw-h-full tw-w-[38.125rem] tw-flex-col tw-justify-center"
    @submit.prevent="submit"
  >
    <router-link
      :to="{ name: 'billing' }"
      class="tw-flex tw-items-center tw-gap-2.5 tw-text-primary"
    >
      <UIcon name="angle-left" class="tw-text-[1.5rem]" />
      Back
    </router-link>
    <h1 class="page-title tw-mt-7.5">Billing: Credit Card</h1>
    <p class="tw-mt-5 tw-text-dark-primary">Please add your card details below:</p>
    <div class="tw-my-7.5 tw-grid tw-grid-cols-4 tw-gap-2.5">
      <UInput
        v-model="fieldsValues.name"
        class="tw-col-span-2"
        placeholder="Type Name on Card"
        required
      >
        <template #title>Name on Card</template>
      </UInput>
      <UInput
        v-model="fieldsValues.businessName"
        class="tw-col-span-2"
        placeholder="Type Business Name"
        required
      >
        <template #title>Business Name</template>
      </UInput>
      <UInput
        v-model="fieldsValues.card"
        class="tw-col-span-2"
        placeholder="Type Card Number"
        required
      >
        <template #title>Card Number</template>
      </UInput>
      <UInput
        v-model="fieldsValues.monthYear"
        :mask="{ mask: '00/0000' }"
        placeholder="Month / Year"
        required
      >
        <template #title>Month / Year</template>
      </UInput>
      <UInput v-model="fieldsValues.cvv" placeholder="Type CVV" required>
        <template #title>CVV</template>
      </UInput>
      <UInput v-model="fieldsValues.zipCode" class="tw-col-span-2" placeholder="ZIP Code" required>
        <template #title>ZIP Code</template>
      </UInput>
    </div>
    <UButton type="submit" class="tw-w-full" :loading="isSubmitting" rounded> Confirm </UButton>
  </form>
</template>

<style lang="scss" scoped></style>
