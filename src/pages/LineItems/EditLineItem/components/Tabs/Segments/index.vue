<script setup>
import { computed, ref } from 'vue'
import SearchInput from 'src/components/shared/Inputs/SearchInput.vue'
import UVirtualScroll from 'src/components/ui/UVirtualScroll.vue'
import UMarquee from 'src/components/ui/UMarquee.vue'
import UCheckbox from 'src/components/ui/UCheckbox.vue'
import UToggle from 'src/components/ui/UToggle.vue'
import UButton from 'src/components/ui/UButton.vue'
import UIcon from 'src/components/ui/UIcon.vue'
import { segments as _segments } from './segmentsData'

const getRandomInteger = (min, max) => Math.floor(Math.random() * (max - min)) + min
const priceList = ['0.50', '0.75', '1', '1.25', '1.50']

const searchValue = ref('')
const hasSearchValue = computed(() => searchValue.value.length > 0)

const selected = ref([])
const hasSelected = computed(() => selected.value.length > 0)
const select = (segmentId) => {
  selected.value.push(segmentId)
}
const unselect = (segmentId) => {
  selected.value = selected.value.filter((id) => id !== segmentId)
}

const segments = ref(
  _segments.map((segment) => ({
    ...segment,
    include: false,
    id: segment['LiveRamp Segment ID'],
    price: priceList[getRandomInteger(0, priceList.length)],
  }))
)
const filteredSegments = computed(() =>
  segments.value.filter((segment) =>
    segment['Segment Name'].toLowerCase().includes(searchValue.value.toLowerCase())
  )
)
const hasFilteredSegments = computed(() => filteredSegments.value.length > 0)
const selectedSegments = computed(() =>
  segments.value.filter(({ id }) => selected.value.includes(id))
)
</script>

<template>
  <div class="tw-w-full tw-rounded-xl tw-bg-white tw-p-6">
    <div class="tw-mb-6 tw-flex tw-items-center tw-gap-14">
      <p class="tw-text-lg tw-font-medium">Segment</p>
      <SearchInput v-model="searchValue" variant="outlined" />
    </div>
    <UVirtualScroll
      v-if="hasSearchValue && hasFilteredSegments"
      :items="filteredSegments"
      class="tw-mb-12 tw-max-h-[50vh]"
    >
      <template #default="{ item }">
        <div
          class="tw-flex tw-h-16 tw-items-center tw-gap-4 tw-border-black-16 tw-pr-10 tw-font-medium [&:not(:last-child)]:tw-border-b"
        >
          <UCheckbox
            :model-value="selected.includes(item.id)"
            @update:model-value="$event ? select(item.id) : unselect(item.id)"
          />
          <UMarquee>
            {{ item['Segment Name'] }}
            <span
              :class="[
                selected.includes(item.id) ? '!tw-text-primary' : 'tw-text-lightness-primary',
              ]"
            >
              {{
                `${item['Provider Name']}-${item['LiveRamp Field ID']} | ${item['LiveRamp Value ID']}`
              }}
            </span>
          </UMarquee>
          <p class="tw-ml-auto tw-flex-shrink-0">$ {{ item.price.toLocaleString('en') }}</p>
        </div>
      </template>
    </UVirtualScroll>
    <UVirtualScroll v-if="hasSelected" :items="selectedSegments" class="tw-mb-12 tw-max-h-[50vh]">
      <template #default="{ item }">
        <div
          class="tw-flex tw-items-center tw-gap-4 tw-border-black-16 tw-font-medium [&:not(:first-child)]:tw-mt-2"
        >
          <div class="tw-flex tw-items-center tw-gap-2">
            <UToggle v-model="item.include" />
            <p class="tw-text-base">{{ item.include ? 'Exclude' : 'Include' }}</p>
          </div>
          <div
            class="tw-flex tw-h-12 tw-w-full tw-cursor-pointer tw-items-center tw-gap-4 tw-rounded tw-border tw-border-black-16 tw-px-3 tw-transition-[color] hover:tw-text-primary"
            @click="unselect(item.id)"
          >
            <UMarquee>
              {{ item['Segment Name'] }}
              <span class="tw-text-lightness-primary">
                {{
                  `${item['Provider Name']}-${item['LiveRamp Field ID']} | ${item['LiveRamp Value ID']}`
                }}
              </span>
            </UMarquee>
            <p class="tw-ml-auto tw-flex-shrink-0">$ {{ item.price.toLocaleString('en') }}</p>
            <UIcon class="tw-text-[0.75rem]" name="cross" />
          </div>
        </div>
      </template>
    </UVirtualScroll>
    <p class="tw-mb-6 tw-text-lg tw-font-medium">Add 1st Party Data List</p>
    <UButton variant="outlined">Upload List</UButton>
  </div>
</template>
