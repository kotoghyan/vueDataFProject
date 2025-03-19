<script setup>
import { computed, ref, watch, provide } from 'vue'
import UIcon from 'src/components/ui/UIcon.vue'
import Preview from './Preview/index.vue'

const props = defineProps({
  modelValue: {
    type: [FileList, String, Array, File],
    default: () => [],
  },
  accept: {
    type: Array,
    default: () => [],
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const value = ref(null)
const hasValue = computed(() =>
  Array.isArray(value.value) ? value.value.length > 0 : value.value !== null
)
watch(
  () => props.modelValue,
  (newValue) => {
    value.value = Array.isArray(newValue) ? newValue : [newValue]
  },
  { immediate: true }
)

const hasAccept = computed(() => props.accept.length > 0)
const isAcceptMultipleType = computed(() => props.accept.length > 1)
const supportedFilesStr = computed(() =>
  props.accept.reduce((acc, item, currentIndex, array) => {
    const isNotFirstItem = currentIndex > 0
    const isLastItem = array.length === currentIndex + 1
    return (
      acc + (isNotFirstItem && isLastItem ? ` and ${item}` : `${isNotFirstItem ? ', ' : ''}${item}`)
    )
  }, '')
)

const fileInput = ref(null)

const updateModelValue = () => {
  emit('update:modelValue', props.multiple ? value.value : value.value[0])
}

const handleChange = async (event) => {
  if (event.target.files.length === 0) {
    return
  }

  value.value = event.target.files
  updateModelValue()
}

const removeAll = () => {
  value.value = []
  fileInput.value.value = null
  updateModelValue()
}

const dragEntered = ref(false)

const getFileType = (file) => {
  const name = file instanceof Blob ? file.name : file
  const extension = name?.split('.').pop().toLowerCase()
  return {
    image: ['gif', 'jpeg', 'jpg', 'png'].includes(extension),
    video: ['mp4', 'mov'].includes(extension),
    audio: ['mp3', 'aac', 'ogg', 'wav'].includes(extension),
  }
}
provide('getFileType', getFileType)

const isAudio = computed(() => hasValue.value && getFileType(value.value[0]).audio)
</script>

<template>
  <div
    class="form-field is-contained tw-relative tw-w-[50%] tw-justify-center tw-overflow-hidden focus-within:!tw-border-primary focus:!tw-border-primary"
    :class="{
      'on-hover tw-cursor-pointer': !hasValue,
      '!tw-border-primary': dragEntered,
      '!tw-h-[18.75rem]': !isAudio,
      '!tw-h-[5.625rem]': isAudio,
    }"
    @dragenter="dragEntered = true"
    @dragleave="dragEntered = false"
    @drop="dragEntered = false"
  >
    <template v-if="hasValue">
      <Preview v-for="(file, index) in value" :key="index" :file="file" />
      <div
        class="tw-absolute tw-right-4 tw-top-4 tw-z-30 tw-flex tw-gap-2.5 *:tw-relative *:tw-flex *:tw-size-12 *:tw-cursor-pointer *:tw-items-center *:tw-justify-center *:tw-rounded-xl *:tw-border *:tw-border-primary *:tw-bg-primary-8 *:tw-text-[1.5rem] *:tw-text-primary"
      >
        <div v-ripple @click.prevent="fileInput.click">
          <UIcon name="upload" />
        </div>
        <div v-ripple @click.prevent="removeAll">
          <UIcon name="delete" />
        </div>
      </div>
    </template>
    <template v-else>
      <div
        class="tw-absolute tw-left-2/4 tw-top-1/2 tw-flex -tw-translate-x-2/4 -tw-translate-y-2/4 tw-items-center tw-gap-2.5"
      >
        <UIcon class="tw-text-[3rem] tw-text-primary" name="upload" />
        <div>
          <p class="tw-text-lg tw-font-medium">Upload your file</p>
          <p>
            <span class="tw-text-primary tw-underline tw-decoration-primary tw-underline-offset-2">
              Choose
            </span>
            or drag and drop
          </p>
        </div>
      </div>
      <div class="tw-mx-auto tw-mb-4 tw-mt-auto">
        <p v-if="hasAccept" class="tw-text-center tw-text-dark-primary">
          Supported {{ isAcceptMultipleType ? 'files are' : 'file is' }} {{ supportedFilesStr }}.
        </p>
      </div>
    </template>
    <input
      ref="fileInput"
      class="tw-absolute tw-size-full tw-opacity-0"
      :class="{ 'tw-hidden': hasValue }"
      type="file"
      :accept="accept"
      :multiple="multiple"
      :required="required"
      @change="handleChange"
    />
  </div>
</template>

<style lang="scss" scoped>
@import 'src/css/form';
</style>
