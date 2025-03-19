<script setup>
import { computed, onBeforeUnmount, provide, ref, watch } from 'vue'
import Icon from 'src/components/ui/UIcon.vue'
import ButtonToggle from 'src/components/ui/UButtonToggle.vue'
import Overview from './components/Overview/index.vue'
import { LineItemsAPI, TargetingExpressionsAPI } from 'src/api'
import { useRoute, useRouter } from 'vue-router'
import { cloneDeep, isNil } from 'lodash-es'
import Button from 'src/components/ui/UButton.vue'
import ConfirmModal from 'src/components/shared/Modals/ConfirmModal.vue'
import { BusService, NotifyService } from 'src/services'
import { useBannerTabs } from 'pages/LineItems/EditLineItem/components/Tabs/Banner/useBannerTabs'
import { useAudioTabs } from 'pages/LineItems/EditLineItem/components/Tabs/Audio/useAudioTabs'
import { useVideoTabs } from 'pages/LineItems/EditLineItem/components/Tabs/Video/useVideoTabs'
import { useCtvTabs } from 'pages/LineItems/EditLineItem/components/Tabs/Ctv/useCtvTabs'
import { useDoohTabs } from 'pages/LineItems/EditLineItem/components/Tabs/Dooh/useDoohTabs'
import General from 'pages/LineItems/EditLineItem/components/Tabs/General/index.vue'
import Creative from 'pages/LineItems/EditLineItem/components/Tabs/Creative/index.vue'
import Segments from 'pages/LineItems/EditLineItem/components/Tabs/Segments/index.vue'
import UTabs from 'components/ui/UTabs.vue'

const router = useRouter()
const route = useRoute()

const lineItemValues = ref({})
const updateLineItemValues = (fields) => {
  lineItemValues.value = { ...lineItemValues.value, ...fields }
}
const setDefaultLineItemValues = (fields) => {
  const newFieldsValues = { ...lineItemValues.value }
  for (const key in fields) {
    if (fields.hasOwnProperty.call(fields, key)) {
      if (isNil(newFieldsValues[key])) {
        newFieldsValues[key] = fields[key]
      }
    }
  }
  lineItemValues.value = newFieldsValues
}
provide('lineItemValues', { lineItemValues, updateLineItemValues, setDefaultLineItemValues })

const activeOptions = [
  {
    label: 'Active',
    value: true,
  },
  {
    label: 'Inactive',
    value: false,
  },
]
const activeConfirmModalValue = ref(false)
const activeModel = computed({
  get: () => lineItemValues.value.active,
  set: (val) => {
    if (val) {
      activeConfirmModalValue.value = true
    } else {
      lineItemValues.value.active = val
    }
  },
})
const setActiveValue = (value) => {
  lineItemValues.value.active = value
}

const isLineItemLoading = ref(false)
const lineItem = ref({})
const { id: lineItemId } = route.params
provide('lineItem', lineItem)
const getLineItem = async () => {
  isLineItemLoading.value = true
  try {
    const { id } = route.params
    const data = await LineItemsAPI.get({ id })
    updateLineItemValues(cloneDeep(data))
    lineItem.value = cloneDeep(data)
  } catch (error) {}
  isLineItemLoading.value = false
}
getLineItem().then(() => getTargetingExpression())

const isSubmitting = ref(false)
const submit = () => {
  isSubmitting.value = true
  BusService.emit('lineItemSubmit')
}

const completedRequests = ref({})
const isAllRequestsCompleted = computed(() =>
  Object.values(completedRequests.value).every((bool) => bool)
)
watch(
  completedRequests,
  async () => {
    try {
      if (!isAllRequestsCompleted.value) {
        return
      }

      if (lineItemValues.value.active) {
        await LineItemsAPI.start({ id: lineItemValues.value.id })
        NotifyService.create({
          type: 'positive',
          message: 'Ad started successfully',
        })
      } else {
        const ads = await LineItemsAPI.getAds({ id: lineItemValues.value.id })
        if (ads.data.length > 0) {
          await LineItemsAPI.stop({ id: lineItemValues.value.id })
          NotifyService.create({
            type: 'positive',
            message: 'Ad stopped successfully',
          })
        }
      }
      isSubmitting.value = false
      router.push({ name: 'lineItems', query: route.query })
    } catch (error) {}
  },
  { deep: true }
)
const handleWaitRequestError = (key) => {
  completedRequests.value[key] = false
  isSubmitting.value = false
}
const setRequestToWait = (key) => {
  completedRequests.value[key] = false
}
const setCompletedRequest = (key) => {
  completedRequests.value[key] = true
  if (isAllRequestsCompleted.value) {
    isSubmitting.value = false
  }
}
BusService.on('lineItemWaitRequest', setRequestToWait)
onBeforeUnmount(() => BusService.off('lineItemWaitRequest', setRequestToWait))
BusService.on('lineItemCompletedRequest', setCompletedRequest)
onBeforeUnmount(() => BusService.off('lineItemCompletedRequest', setCompletedRequest))
BusService.on('lineItemWaitRequestError', handleWaitRequestError)
onBeforeUnmount(() => BusService.off('lineItemWaitRequestError', handleWaitRequestError))

const isType = computed(() => ({
  banner: lineItem.value.type === 0,
  video: lineItem.value.type === 1,
  ctv: lineItem.value.type === 3,
  dooh: lineItem.value.type === 4,
  audio: lineItem.value.audio === 5,
}))
provide('isType', isType)
const typeName = computed(() => {
  if (isType.value.banner) {
    return 'Banner'
  }

  if (isType.value.video) {
    return 'Video'
  }

  if (isType.value.ctv) {
    return 'CTV'
  }

  if (isType.value.dooh) {
    return 'DOOH'
  }

  if (isType.value.audio) {
    return 'Audio'
  }

  return ''
})

const selectedCreatives = ref([])
const lineItemCreatives = ref({})
provide('lineItemCreatives', { selectedCreatives, lineItemCreatives })
const isLineItemCreativesLoading = ref(false)
const hasLineItemCreatives = computed(() => selectedCreatives.value.length > 0)
const getLineItemCreatives = async () => {
  isLineItemCreativesLoading.value = true
  lineItemCreatives.value = await LineItemsAPI.getCreatives({ line_item_id: lineItemId })
  selectedCreatives.value = lineItemCreatives.value.data.map(({ creative_id }) => creative_id)
  isLineItemCreativesLoading.value = false
}
getLineItemCreatives()

const isCreativeTabDisabled = computed(() => lineItemValues.value.tag_id?.length > 0)
const isTagTabDisabled = computed(
  () => hasLineItemCreatives.value || isLineItemCreativesLoading.value
)
const typeTabsMap = computed(() => ({
  0: () => useBannerTabs(isTagTabDisabled.value),
  1: () => useVideoTabs(isTagTabDisabled.value),
  3: () => useCtvTabs(isTagTabDisabled.value),
  4: () => useDoohTabs(isTagTabDisabled.value),
  5: () => useAudioTabs(isTagTabDisabled.value),
}))
const typeTabs = computed(() => typeTabsMap.value[lineItem.value.type]?.().tabs)
const tabs = computed(() => [
  {
    label: 'General',
    value: 'general',
    component: General,
  },
  ...typeTabs.value,
  {
    label: 'Segments',
    value: 'segments',
    component: Segments,
  },
  {
    label: 'Creative',
    value: 'creative',
    component: Creative,
    disabled: isCreativeTabDisabled.value,
  },
])
const tab = ref('general')
const tabData = computed(() => tabs.value.find(({ value }) => value === tab.value))

const targetingValues = ref([])
const hasTargetingValues = computed(() => targetingValues.value.length > 0)
provide('targetingValues', targetingValues)

const getTargetingExpression = async () => {
  const { targeting_expression_id } = lineItem.value
  if (!isNil(targeting_expression_id)) {
    const { modules } = await TargetingExpressionsAPI.get({ id: targeting_expression_id })
    targetingValues.value = modules
  }
}
const createOrUpdateTargetingExpressions = async () => {
  try {
    const hasTargetingExpressionId = !isNil(lineItem.value.targeting_expression_id)
    if (hasTargetingExpressionId) {
      await TargetingExpressionsAPI.update({
        targeting_expression_id: lineItem.value.targeting_expression_id,
        line_item_id: lineItem.value.id,
        modules: targetingValues.value,
      })
    } else if (hasTargetingValues.value) {
      await TargetingExpressionsAPI.create({
        line_item_id: lineItem.value.id,
        modules: targetingValues.value,
      })
    }
    BusService.emit('lineItemCompletedRequest', 'targeting')
  } catch (error) {
    BusService.emit('lineItemWaitRequestError', 'targeting')
  }
}
BusService.emit('lineItemWaitRequest', 'targeting')
BusService.on('lineItemSubmit', createOrUpdateTargetingExpressions)
onBeforeUnmount(() => BusService.off('lineItemSubmit', createOrUpdateTargetingExpressions))

const update = async () => {
  try {
    if (lineItemValues.value.tag_id?.length === 0) {
      lineItemValues.value.tag_id = null
    }
    await LineItemsAPI.update(lineItemValues.value)
    BusService.emit('lineItemCompletedRequest', 'update')
  } catch (error) {
    BusService.emit('lineItemWaitRequestError', 'update')
  }
}
BusService.emit('lineItemWaitRequest', 'update')
BusService.on('lineItemSubmit', update)
onBeforeUnmount(() => BusService.off('lineItemSubmit', update))
</script>

<template>
  <div v-if="isLineItemLoading" class="tw-flex tw-w-full tw-justify-center">
    <Icon name="spinner" class="tw-animate-spin tw-text-[3rem] tw-text-primary" />
  </div>
  <form v-else @submit.prevent="submit">
    <div class="tw-mb-7.5 tw-flex tw-items-center tw-gap-2.5">
      <h1 class="page-title">{{ lineItem.name }}</h1>
      <div
        class="tw-mr-auto tw-flex tw-h-[1.5625rem] tw-items-center tw-rounded-md tw-bg-ultralight-primary tw-px-2.5 tw-text-xs tw-font-semibold tw-text-primary"
      >
        {{ typeName }}
      </div>
      <ButtonToggle v-model="activeModel" :options="activeOptions" />
      <ConfirmModal v-model="activeConfirmModalValue" @confirm="setActiveValue(true)">
        <template #content>
          <p>
            Active line items are used for bidding. Ensure all targeting parameters are set before
            activation. Confirm activation?
          </p>
        </template>
      </ConfirmModal>
      <Button
        :to="{
          name: 'lineItems',
          query: route.query,
        }"
        icon="cross"
        variant="outlined"
      >
        Cancel
      </Button>
      <Button type="submit" icon="sign" variant="outlined" :loading="isSubmitting">Save</Button>
    </div>
    <div class="tw-flex tw-items-start tw-gap-2.5">
      <div class="tw-sticky tw-top-0 tw-rounded-xl tw-bg-white tw-p-6">
        <UTabs v-model="tab" :tabs="tabs" pills vertical class="tw-min-w-[8.125rem]" />
      </div>
      <div class="tw-w-full tw-space-y-2.5">
        <Overview />
        <KeepAlive>
          <component :is="tabData.component" />
        </KeepAlive>
      </div>
    </div>
  </form>
</template>

<style lang="scss" scoped></style>
