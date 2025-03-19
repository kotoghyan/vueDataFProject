import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useUserStore = defineStore('auth', () => {
  const isUserLoading = ref(false)
  const user = ref({})

  const userFullName = computed(() => `${user.value.first_name} ${user.value.last_name}`)
  const isUserRole = computed(() => ({
    superAdmin: user.value.roles?.includes('super_admin'),
  }))

  return { isUserLoading, user, userFullName, isUserRole }
})
