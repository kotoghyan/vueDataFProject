<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import UInput from 'src/components/ui/UInput.vue'
import UButton from 'src/components/ui/UButton.vue'
import UIcon from 'src/components/ui/UIcon.vue'

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
    <h1 class="page-title tw-mt-7.5">Billing: ACH</h1>
    <p class="tw-mt-5 tw-text-dark-primary">Please add your payment details below:</p>
    <div class="tw-my-7.5 tw-grid tw-grid-cols-2 tw-gap-2.5">
      <UInput v-model="fieldsValues.name" placeholder="Type Name of Business" required>
        <template #title>Name of Business</template>
      </UInput>
      <UInput v-model="fieldsValues.address" placeholder="Type Address" required>
        <template #title>Address</template>
      </UInput>
      <UInput v-model="fieldsValues.appSuite" placeholder="Type Apt/Suite" required>
        <template #title>Apt/Suite</template>
      </UInput>
      <UInput v-model="fieldsValues.city" placeholder="Type City" required>
        <template #title>City</template>
      </UInput>
      <UInput v-model="fieldsValues.state" placeholder="Type State" required>
        <template #title>State</template>
      </UInput>
      <UInput v-model="fieldsValues.zipCode" placeholder="Type ZIP Code" required>
        <template #title>ZIP Code</template>
      </UInput>
      <UInput v-model="fieldsValues.bankName" placeholder="Type Bank Name" required>
        <template #title>Bank Name</template>
      </UInput>
      <UInput v-model="fieldsValues.accountNumber" placeholder="Type Account Number" required>
        <template #title>Account Number</template>
      </UInput>
      <UInput v-model="fieldsValues.routingNumber" placeholder="Type Routing Number" required>
        <template #title>Routing Number</template>
      </UInput>
    </div>
    <UButton type="submit" class="tw-w-full" :loading="isSubmitting" rounded>Confirm</UButton>
  </form>
</template>

<style lang="scss" scoped></style>
