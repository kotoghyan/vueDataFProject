<script setup>
import { onMounted, ref, computed } from 'vue'
import { useMediaControls } from '@vueuse/core'
import UButton from './UButton.vue'

const props = defineProps({
  src: { type: String, default: () => '' },
  label: { type: String, default: () => 'Record' },
})

const hasFileName = computed(() => props.label.length > 0)

const audio = ref(null)
const { playing, volume, currentTime, duration } = useMediaControls(audio, {
  src: 'video.mp4',
})

const format = (value) => String(value).padStart(2, '0')
const getMinutes = (value) => Math.floor(value / 60)
const getSeconds = (value) => Math.floor(value % 60)
const formattedDuration = computed(
  () => `${format(getMinutes(duration.value))}:${format(getSeconds(duration.value))}`
)
const formattedCurrentTime = computed(
  () => `${format(getMinutes(currentTime.value))}:${format(getSeconds(currentTime.value))}`
)

onMounted(() => {
  volume.value = 0.5
})
</script>

<template>
  <div class="tw-relative tw-z-10 tw-flex tw-w-full tw-items-center tw-gap-x-2.5">
    <UButton
      rounded
      square
      :icon="playing ? 'stop' : 'play'"
      type="button"
      @click="playing = !playing"
    />
    <div class="tw-flex-grow">
      <div class="tw-mb-1 tw-text-lg tw-font-medium tw-text-dark">
        {{ hasFileName ? label : 'Record' }}
      </div>
      <div class="tw-flex tw-items-center tw-gap-2.5 tw-text-sm tw-text-dark-primary">
        <q-slider v-model="currentTime" :max="duration" />
        <div class="tw-flex tw-items-center tw-gap-x-1">
          <p>
            {{ formattedCurrentTime }}
          </p>
          <span class="tw-text-base tw-font-medium">/</span>
          <p>{{ formattedDuration }}</p>
        </div>
      </div>
    </div>
    <audio ref="audio" :src="src" />
  </div>
</template>
