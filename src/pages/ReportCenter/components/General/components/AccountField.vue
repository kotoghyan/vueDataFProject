<script setup>
import USelect from 'components/ui/USelect.vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from 'src/stores'
import { ref } from 'vue'
import { UserNamesAPI } from 'src/api'
import { useReportCenterStore } from 'pages/ReportCenter/store'

const { isUserRole } = storeToRefs(useUserStore())
const { settings } = storeToRefs(useReportCenterStore())

const isUserNamesLoading = ref(false)
const userNames = ref([])
const getUserNames = async () => {
  isUserNamesLoading.value = true
  userNames.value = await UserNamesAPI.get()
  isUserNamesLoading.value = false
}
if (isUserRole.value.superAdmin) {
  getUserNames()
}
</script>

<template>
  <USelect
    v-if="isUserRole.superAdmin"
    v-model="settings.account"
    :options="userNames"
    option-value="id"
    :loading="isUserNamesLoading"
    placeholder="Select Account"
    auto-size="min"
    emit-value
  >
    <template #title>Account</template>
    <template #option="{ opt }">
      {{ opt.first_name }} {{ opt.last_name }} <span class="tw-text-gray">({{ opt.email }})</span>
    </template>
  </USelect>
</template>

<style scoped lang="scss"></style>
