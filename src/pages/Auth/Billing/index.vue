<script setup>
import UButton from 'src/components/ui/UButton.vue'
</script>

<template>
  <div class="tw-mx-auto tw-flex tw-h-full tw-w-[26.25rem] tw-flex-col tw-justify-center">
    <h1 class="page-title">Sign Up: Billing</h1>
    <p class="tw-mb-7.5 tw-mt-5 tw-text-dark-primary">Select your payment type below</p>
    <div class="tw-space-y-7.5">
      <UButton :to="{ name: 'creditApplicationBilling' }" class="tw-w-full" rounded>
        Credit Application
      </UButton>
      <UButton :to="{ name: 'achBilling' }" class="tw-w-full" variant="outlined" rounded
        >ACH</UButton
      >
      <UButton :to="{ name: 'creditCardBilling' }" class="tw-w-full" variant="outlined" rounded>
        Credit Card
      </UButton>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
