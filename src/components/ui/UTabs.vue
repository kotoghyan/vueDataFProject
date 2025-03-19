<script setup>
const props = defineProps({
  modelValue: [String, Number],
  tabs: {
    type: Array,
    default: () => [],
  },
  tabLabel: {
    type: String,
    default: 'label',
  },
  tabValue: {
    type: String,
    default: 'value',
  },
  pills: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  align: {
    type: String,
    default: 'left',
  },
  vertical: {
    type: Boolean,
    default: false,
  },
  activeColor: {
    type: String,
    default: 'var(--primary)',
  },
})
const emit = defineEmits(['update:modelValue'])

const getTabLabel = (tab) => tab[props.tabLabel]
const getTabValue = (tab) => tab[props.tabValue]
</script>

<template>
  <q-tabs
    class="tabs"
    :class="{
      'is-pills': pills,
      'is-vertical': vertical,
    }"
    :model-value="modelValue"
    :vertical="vertical"
    :align="align"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <q-tab
      v-for="item in tabs"
      :key="getTabValue(item)"
      :name="getTabValue(item)"
      :disable="item.disabled || disabled"
    >
      <slot :tab="item">{{ getTabLabel(item) }}</slot>
    </q-tab>
  </q-tabs>
</template>

<style lang="scss" scoped>
.tabs {
  :deep .q-tab {
    color: var(--dark-primary);
    text-transform: unset;

    &--inactive {
      opacity: 1;
    }
  }

  &.is-pills {
    background-color: var(--ultralight-primary);
    border-radius: 0.75rem;
    padding: 0.25rem;

    :deep {
      .q-tabs__content {
        @apply tw-space-y-1;
      }

      .q-tab {
        min-height: 1.875rem;
        padding: 0.625rem;
        border-radius: 0.375rem;
        font-weight: 500;

        &--active {
          color: #fff;
        }

        &__content {
          position: relative;
          z-index: 1;
          min-width: unset;
          padding: 0;
        }

        &__indicator {
          width: 100%;
          height: 100%;
          background-color: v-bind('activeColor');
          border-radius: inherit;
        }
      }
    }

    &.q-tabs--vertical :deep .q-tab {
      min-height: 4.375rem;
    }
  }

  &:not(.is-pills) :deep {
    .q-tabs__content {
      gap: 2.5rem;
    }

    .q-tab {
      text-transform: unset;
      padding: 0;
      min-height: unset;

      &--active {
        color: v-bind('activeColor');
      }

      &__content {
        flex-direction: row;
        min-width: unset;
        padding-top: 0;
        padding-bottom: 0.625rem;
        font-weight: bold;
      }

      &__indicator {
        height: 0.125rem;
        background-color: v-bind('activeColor');
      }
    }
  }
}
</style>
