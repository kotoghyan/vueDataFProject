<script setup>
const isHostCleartrust = window.location.hostname === 'cleartrust.data-fusion.io'
</script>

<template>
  <div class="tw-flex tw-min-h-screen tw-bg-white">
    <div class="tw-w-full tw-py-[3.75rem] md:tw-w-1/2">
      <router-view />
    </div>
    <div
      class="tw-fixed tw-left-2/4 tw-h-full tw-w-1/2 tw-overflow-hidden tw-rounded-l-[7.5rem] *:tw-size-full *:tw-object-cover -md:!tw-hidden"
    >
      <img v-if="isHostCleartrust" src="~assets/cleartrust-blank-promo.jpg" alt="" />
      <img v-else src="~assets/datafusion-blank-promo.jpg" alt="" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
