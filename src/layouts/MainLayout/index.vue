<script setup>
import { ref } from 'vue'
import { AuthAPI } from 'src/api'
import { useUserStore } from 'src/stores'
import { AuthService } from 'src/services'
import UPopover from 'src/components/ui/UPopover.vue'
import UButton from 'src/components/ui/UButton.vue'
import SearchInput from 'src/components/shared/Inputs/SearchInput.vue'
import UIcon from 'src/components/ui/UIcon.vue'
import Sidebar from './components/Sidebar.vue'
import { storeToRefs } from 'pinia'

const { isUserLoading, user, userFullName } = storeToRefs(useUserStore())

const searchValue = ref('')

const createOptions = [
  { name: 'newAdvertiser', label: 'Advertiser' },
  { name: 'newCampaign', label: 'Campaign' },
  { name: 'newCreative', label: 'Creative' },
  { name: 'newLineItem', label: 'Line Item' },
  //   { name: 'newCreativeBulkUpload', label: 'Creative Bulk Upload' },
  { name: 'newDeal', label: 'First Party Deal' },
  { name: 'newEvent', label: 'Event' },
  //   { name: 'newDeliveryModifier', label: 'Delivery Modifier' },
  //   { name: 'newBidModifier', label: 'Bid Modifier' },
  { name: 'newList', label: 'List' },
]

const getMe = async () => {
  isUserLoading.value = true
  user.value = await AuthAPI.getMe()
  isUserLoading.value = false
}
getMe()
</script>

<template>
  <template v-if="!isUserLoading">
    <Sidebar />
    <div class="layout">
      <header class="tw-flex tw-items-center tw-justify-bettwin tw-gap-5 tw-text-dark">
        <SearchInput v-model="searchValue" variant="outlined" class="tw-mr-auto" />
        <UPopover auto-size="min">
          <UButton icon="add" rounded>Create</UButton>
          <template #popover>
            <router-link
              v-for="opt in createOptions"
              :key="opt.name"
              v-close-popover
              class="tw-block tw-leading-6 tw-transition-[color] hover:tw-text-primary"
              :to="{ name: opt.name }"
            >
              {{ opt.label }}
            </router-link>
          </template>
        </UPopover>
        <div class="tw-flex tw-gap-2.5">
<!--          <UButton icon="info" bg="ultralight-primary" square />-->
<!--          <UButton icon="notification" bg="ultralight-primary" square />-->
        </div>
        <UPopover placement="bottom-end" auto-size="min" :disabled="isUserLoading">
          <template #default="{ shown }">
            <div
              class="tw-relative tw-flex tw-cursor-pointer tw-items-center tw-transition-[color]"
              :class="{ 'tw-text-primary': shown }"
            >
              <div class="tw-relative tw-size-12 tw-overflow-hidden tw-rounded-full">
                <div class="tw-absolute tw-size-full tw-animate-pulse tw-bg-black-16"></div>
                <img
                  v-if="!isUserLoading"
                  class="tw-relative tw-z-[1] tw-size-full tw-object-cover"
                  :src="user.profile_photo ?? '/avatar.avif'"
                  alt=""
                />
              </div>
              <div class="tw-ml-2.5 tw-font-medium">
                <div
                  v-if="isUserLoading"
                  class="tw-h-2.5 tw-w-16 tw-animate-pulse tw-rounded-full tw-bg-black-16"
                ></div>
                <template v-else>{{ userFullName }}</template>
              </div>
              <UIcon
                class="tw-ml-0.5 tw-text-[1.5rem] tw-transition-[transform]"
                :class="{ 'tw-rotate-180': shown }"
                name="angle-down"
              />
            </div>
          </template>
          <template #popover>
            <div class="tw-leading-6">
              <p>
                {{ userFullName }}
              </p>
              <p>
                {{ user.email }}
              </p>
              <div class="tw-my-2.5 tw-h-px tw-bg-ultralight-primary"></div>
              <p
                class="tw-flex tw-cursor-pointer tw-items-center tw-gap-1 tw-text-primary"
                @click="AuthService.logout"
              >
                <UIcon class="tw-text-[1.5rem]" name="exit" /> Logout
              </p>
            </div>
          </template>
        </UPopover>
      </header>
      <div class="tw-mt-7.5">
        <router-view />
      </div>
    </div>
  </template>
</template>

<style lang="scss" scoped>
.layout {
  --horizontal-padding: 1.875rem;
  --vertical-padding: 0.625rem;

  padding: var(--vertical-padding) var(--horizontal-padding) var(--vertical-padding)
    calc(6.375rem + var(--horizontal-padding));
}
</style>
