import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useReportCenterStore = defineStore('reportCenter', () => {
  const settings = ref({})

  const isGeneralLoading = ref(false)
  const general = ref(null)
  const hasGeneral = computed(() => general.value !== null)

  return { settings, isGeneralLoading, general, hasGeneral }
})
