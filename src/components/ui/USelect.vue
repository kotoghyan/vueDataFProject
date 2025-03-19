<script setup>
import { computed, ref, useSlots, watch } from 'vue'
import HintPopover from 'src/components/shared/Popovers/HintPopover.vue'
import Popover from 'src/components/ui/UPopover.vue'
import Marquee from 'src/components/ui/UMarquee.vue'
import Icon from 'src/components/ui/UIcon.vue'
import Checkbox from 'src/components/ui/UCheckbox.vue'

const props = defineProps({
  modelValue: [String, Number, Array],
  placeholder: {
    type: String,
    default: 'Select',
  },
  options: {
    type: Array,
    default: () => [],
  },
  optionLabel: {
    type: String,
    default: 'label',
  },
  optionValue: {
    type: String,
    default: 'value',
  },
  emitValue: {
    type: Boolean,
    default: false,
  },
  info: String,
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  autoSize: {
    type: [Boolean, String],
    default: true,
  },
})
const emit = defineEmits(['update:modelValue'])
const slots = useSlots()

const value = ref()

const hasOptions = computed(() => props.options.length > 0)
const usedOptions = computed(() => {
  const values = value.value.map((opt) => getOptionValue(opt))
  return props.options.filter((opt) => values.includes(getOptionValue(opt)))
})
const usedOptionsValues = computed(() => usedOptions.value.map((opt) => getOptionValue(opt)))
const hasUsedOptions = computed(() => usedOptions.value.length > 0)

function getOptionLabel(opt) {
  const label = opt?.[props.optionLabel]
  if (label !== undefined) {
    return label
  }

  return opt
}
function getOptionValue(opt) {
  const value = opt?.[props.optionValue]
  if (value !== undefined) {
    return value
  }

  return opt
}
const handleOption = (opt, shouldRemove) => {
  if (opt.disabled) {
    return
  }

  const optValue = getOptionValue(opt)

  if (shouldRemove) {
    value.value = value.value.filter((item) => item !== optValue)
  } else {
    const emitValue = props.emitValue ? optValue : opt
    if (props.multiple) {
      value.value.push(emitValue)
    } else {
      value.value = [emitValue]
    }
  }
  emit('update:modelValue', props.multiple ? value.value : value.value[0])
}

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue === undefined) {
      value.value = []
    } else {
      value.value = Array.isArray(newValue) ? newValue : [newValue]
    }
  },
  { immediate: true }
)
</script>

<template>
  <div>
    <div v-if="slots.title" class="tw-mb-1.5 tw-flex tw-items-center tw-font-medium">
      <slot name="title"></slot
      ><span v-if="required" class="tw-text-primary">*</span>&nbsp;<HintPopover :text="info" />
    </div>
    <Popover max-height="none" :auto-size="autoSize" :disabled="disabled">
      <template #default="{ shown }">
        <div
          class="form-field is-contained tw-relative tw-cursor-pointer tw-justify-between"
          :class="[
            disabled ? 'is-disabled' : 'on-hover',
            {
              'is-focused': shown,
            },
          ]"
        >
          <Marquee v-if="hasUsedOptions">
            <template v-for="(opt, optIndex) in usedOptions" :key="getOptionValue(opt)">
              <template v-if="optIndex > 0">,</template>
              <slot name="option" :opt="opt">{{ getOptionLabel(opt) }}</slot>
            </template>
          </Marquee>
          <div v-else class="tw-text-gray">
            {{ placeholder }}
          </div>
          <Icon
            class="tw-text-[1.5rem] tw-transition-[transform]"
            :class="{ 'tw-rotate-180 tw-text-primary': shown }"
            name="angle-down"
          />
          <select
            class="tw-absolute tw-z-[-1] tw-max-h-full tw-w-full tw-overflow-hidden tw-opacity-0"
            :value="value"
            :multiple="multiple"
            :required="required"
          >
            <option v-for="opt in options" :key="getOptionValue(opt)" :value="getOptionValue(opt)">
              {{ getOptionLabel(opt) }}
            </option>
          </select>
        </div>
      </template>
      <template #popover>
        <div v-if="loading" class="tw-text-center">
          <Icon class="tw-animate-spin tw-text-[1.5rem] tw-text-primary" name="spinner" />
        </div>
        <q-virtual-scroll
          v-else-if="hasOptions"
          v-slot="{ item }"
          class="tw-max-h-[65vh]"
          :items="options"
        >
          <Checkbox
            v-if="multiple"
            :key="`checkbox-${getOptionValue(item)}`"
            class="tw-w-full"
            :model-value="usedOptionsValues.includes(getOptionValue(item))"
            :disabled="item.disabled"
            @update:model-value="handleOption(item, !$event)"
          >
            <slot name="option" :opt="item">{{ getOptionLabel(item) }}</slot>
          </Checkbox>
          <div
            v-else
            :key="`btn-${getOptionValue(item)}`"
            v-close-popover="!item.disabled"
            class="tw-cursor-pointer tw-leading-6"
            :class="{
              '!tw-cursor-not-allowed !tw-opacity-60': item.disabled,
              'tw-transition-[color] hover:tw-text-primary': !item.disabled,
              '!tw-text-primary': usedOptionsValues.includes(getOptionValue(item)),
            }"
            @click="handleOption(item)"
          >
            <slot name="option" :opt="item">{{ getOptionLabel(item) }}</slot>
          </div>
        </q-virtual-scroll>
        <p v-else class="tw-text-center">No options found</p>
      </template>
    </Popover>
  </div>
</template>

<style lang="scss" scoped>
@import 'src/css/form';
</style>
