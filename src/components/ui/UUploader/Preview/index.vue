<script setup>
import Image from './Image.vue'
import Video from './Video.vue'
import Audio from './Audio.vue'
import { computed, ref, watch, inject } from 'vue'

const props = defineProps({
  file: {
    type: [String, File],
    default: () => '',
  },
})

const filename = computed(() => props.file.name)

const getFileType = inject('getFileType')

const isFileType = computed(() => getFileType(props.file))
const selectedFile = ref('')
watch(
  () => props.file,
  (newValue) => {
    if (!newValue) {
      return
    }

    if (newValue instanceof Blob) {
      if (getFileType(props.file).audio) {
        selectedFile.value = URL.createObjectURL(props.file)
      } else {
        const fileReader = new FileReader()
        fileReader.onload = (event) => {
          selectedFile.value = event.target.result
        }
        fileReader.readAsDataURL(newValue)
      }
    } else {
      selectedFile.value = newValue
    }
  },
  { immediate: true }
)
</script>

<template>
  <Image v-if="isFileType.image" :src="selectedFile" />
  <Video v-else-if="isFileType.video" :src="selectedFile" />
  <Audio v-else-if="isFileType.audio" :src="selectedFile" :label="filename" />
</template>
