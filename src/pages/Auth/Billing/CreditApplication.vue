<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import UInput from 'src/components/ui/UInput.vue'
import URadio from 'src/components/ui/URadio.vue'
import UButton from 'src/components/ui/UButton.vue'
import UIcon from 'components/ui/UIcon.vue'

const fieldsOptions = {
  umbrellaed: [
    {
      label: 'Yes',
      value: 'yes',
    },
    {
      label: 'No',
      value: 'no',
    },
  ],
  role: [
    {
      label: 'Individual Ownership',
      value: 'individual_ownership',
    },
    {
      label: 'Partnership',
      value: 'partnership',
    },
    {
      label: 'Corporation',
      value: 'corporation',
    },
  ],
}

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
    <h1 class="page-title tw-mt-7.5">Billing: Credit Application</h1>
    <p class="tw-mt-5 tw-text-dark-primary">Please complete the credit application below:</p>
    <div class="tw-my-7.5 tw-space-y-7.5">
      <div class="tw-grid tw-grid-cols-2">
        <UInput placeholder="Type Name of Business" required>
          <template #title>Name of Business</template>
        </UInput>
      </div>
      <div class="tw-flex tw-items-center tw-gap-5">
        <URadio
          v-for="role in fieldsOptions.role"
          :key="role.value"
          v-model="fieldsValues.role"
          :val="role.value"
        >
          {{ role.label }}
        </URadio>
      </div>
      <div class="tw-grid tw-grid-cols-2 tw-gap-2.5">
        <div class="tw-space-y-2.5">
          <p class="subtitle">Physical Location</p>
          <UInput placeholder="Type Attn" required>
            <template #title>Attn</template>
          </UInput>
          <UInput placeholder="Type Address" required>
            <template #title>Address</template>
          </UInput>
          <UInput placeholder="Type City" required>
            <template #title>City</template>
          </UInput>
          <UInput placeholder="Type State" required>
            <template #title>State</template>
          </UInput>
          <UInput placeholder="Type Zip" required>
            <template #title>Zip</template>
          </UInput>
        </div>
        <div class="tw-space-y-2.5">
          <p class="subtitle">Bill to Location</p>
          <UInput placeholder="Type Bill to Location" required>
            <template #title>Bill to Location</template>
          </UInput>
        </div>
      </div>
      <div class="tw-grid tw-grid-cols-2 tw-gap-2.5">
        <UInput placeholder="Type Phone Number" required>
          <template #title>Phone Number</template>
        </UInput>
        <UInput placeholder="Type E-mail" required>
          <template #title>E-mail</template>
        </UInput>
        <UInput placeholder="Type Duns Number" required>
          <template #title>Duns Number</template>
        </UInput>
        <UInput placeholder="Type Sales Volume" required>
          <template #title>Sales Volume</template>
        </UInput>
        <UInput placeholder="Type Years in Business under Name" required>
          <template #title>Years in Business under Name</template>
        </UInput>
        <UInput placeholder="Type Years at this Location" required>
          <template #title>Years at this Location</template>
        </UInput>
        <UInput placeholder="Type SIC Code" required>
          <template #title>SIC Code</template>
        </UInput>
        <UInput placeholder="Type Type of Business" required>
          <template #title>Type of Business</template>
        </UInput>
      </div>
      <div>
        <p class="subtitle">Person Requesting Credit</p>
        <div class="tw-mt-2.5 tw-grid tw-grid-cols-2 tw-gap-2.5">
          <UInput placeholder="Type Name" required>
            <template #title>Name</template>
          </UInput>
          <UInput placeholder="Type Title" required>
            <template #title>Title</template>
          </UInput>
          <UInput placeholder="Type Amount of Credit Requested" required>
            <template #title>Amount of Credit Requested</template>
          </UInput>
          <UInput placeholder="Type Billing Contact Person" required>
            <template #title>Billing Contact Person</template>
          </UInput>
          <UInput placeholder="Type Phone Number" required>
            <template #title>Phone Number</template>
          </UInput>
        </div>
      </div>
      <div>
        <p class="subtitle">Owner/Principals Complete Name</p>
        <div class="tw-mt-2.5 tw-grid tw-grid-cols-2 tw-gap-2.5">
          <UInput placeholder="Type Name" required>
            <template #title>Name</template>
          </UInput>
          <UInput placeholder="Type Title" required>
            <template #title>Title</template>
          </UInput>
          <UInput placeholder="Type Home Address" required>
            <template #title>Home Address</template>
          </UInput>
          <UInput placeholder="Type City" required>
            <template #title>City</template>
          </UInput>
          <UInput placeholder="Type State" required>
            <template #title>State</template>
          </UInput>
          <UInput placeholder="Type Zip" required>
            <template #title>Zip</template>
          </UInput>
          <UInput placeholder="Type Home Phone Number" required>
            <template #title>Home Phone Number</template>
          </UInput>
          <UInput placeholder="Type Social Security Number" required>
            <template #title>Social Security Number</template>
          </UInput>
          <UInput placeholder="Type Employer EIN Number" required>
            <template #title>Employer EIN Number</template>
          </UInput>
        </div>
      </div>
      <div class="tw-space-y-2.5">
        <p class="subtitle">Credit References: Including (2) Media References</p>
        <p>Reference 1</p>
        <div class="tw-grid tw-grid-cols-2 tw-gap-2.5">
          <UInput placeholder="Type Name of Supplier" required>
            <template #title>Name of Supplier</template>
          </UInput>
          <UInput placeholder="Type Address" required>
            <template #title>Address</template>
          </UInput>
          <UInput placeholder="Type City" required>
            <template #title>City</template>
          </UInput>
          <UInput placeholder="Type State" required>
            <template #title>State</template>
          </UInput>
          <UInput placeholder="Type Zip" required>
            <template #title>Zip</template>
          </UInput>
          <UInput placeholder="Type Account Number" required>
            <template #title>Account Number</template>
          </UInput>
          <UInput placeholder="Type Phone Number" required>
            <template #title>Phone Number</template>
          </UInput>
        </div>
        <p class="!tw-mt-5">Reference 2</p>
        <div class="tw-grid tw-grid-cols-2 tw-gap-2.5">
          <UInput placeholder="Type Name of Supplier" required>
            <template #title>Name of Supplier</template>
          </UInput>
          <UInput placeholder="Type Address" required>
            <template #title>Address</template>
          </UInput>
          <UInput placeholder="Type City" required>
            <template #title>City</template>
          </UInput>
          <UInput placeholder="Type State" required>
            <template #title>State</template>
          </UInput>
          <UInput placeholder="Type Zip" required>
            <template #title>Zip</template>
          </UInput>
          <UInput placeholder="Type Account Number" required>
            <template #title>Account Number</template>
          </UInput>
          <UInput placeholder="Type Phone Number" required>
            <template #title>Phone Number</template>
          </UInput>
        </div>
      </div>
      <div>
        <p class="subtitle">Bank References</p>
        <div class="tw-grid tw-grid-cols-2 tw-gap-2.5">
          <UInput placeholder="Type Account Number" required>
            <template #title>Account Number</template>
          </UInput>
          <UInput placeholder="Type Phone Number" required>
            <template #title>Phone Number</template>
          </UInput>
          <p class="tw-col-span-2 tw-text-dark-primary">
            The above information is for the purpose of obtaining credit and is warranted to be
            true. I/We authorize the firm to whom this application is made to investigate the
            references listed above pertaining to my/our credit history. Applications signature
            attest financial responsibility, ability and willingness to pay our invoice. All orders
            must be prepaid until credit is established.
          </p>
          <UInput placeholder="Type Business Name" required>
            <template #title>Business Name</template>
          </UInput>
          <UInput placeholder="Type Date" required>
            <template #title>Date</template>
          </UInput>
          <UInput placeholder="Type Advertising Type" required>
            <template #title>Advertising Type</template>
          </UInput>
          <UInput placeholder="Digital Signature" required>
            <template #title>Digital Signature</template>
          </UInput>
          <div>
            <p class="tw-font-medium">Should account be UMBRELLAED with another account?</p>
            <div class="tw-flex tw-gap-5">
              <URadio
                v-for="item in fieldsOptions.umbrellaed"
                :key="item.value"
                v-model="fieldsValues.umbrellaed"
                :val="item.value"
              >
                {{ item.label }}
              </URadio>
            </div>
          </div>
          <UInput placeholder="Type Account Number" required>
            <template #title>Account Number</template>
          </UInput>
        </div>
      </div>
    </div>
    <UButton type="submit" class="tw-mt-6 tw-w-full" :loading="isSubmitting">Confirm</UButton>
  </form>
</template>

<style lang="scss" scoped>
.subtitle {
  @apply tw-text-lg tw-font-medium;
}
</style>
