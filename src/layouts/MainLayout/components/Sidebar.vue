<script setup>
import { ref } from 'vue'
import UIcon from 'src/components/ui/UIcon.vue'

const menu = [
  {
    id: 'trafficking',
    label: 'Trafficking',
    icon: 'users-group',
    sub: [
      {
        id: 'advertisers',
        label: 'Advertisers',
        routeName: 'advertisers',
      },
      {
        id: 'campaigns',
        label: 'Campaigns',
        routeName: 'campaigns',
      },
      {
        id: 'creatives',
        label: 'Creatives',
        routeName: 'creatives',
      },
      {
        id: 'lineItems',
        label: 'Line Items',
        routeName: 'lineItems',
      },
      {
        id: 'lists',
        label: 'Lists',
        routeName: 'lists',
      },
      {
        id: 'events',
        label: 'Events',
        routeName: 'events',
      },
      // {
      //   id: 'modifiers',
      //   label: 'Modifiers',
      //   routeName: 'modifiers',
      // },
    ],
  },
  {
    id: 'reporting',
    label: 'Reporting',
    icon: 'clipboard',
    sub: [
      //   {
      //     id: 'dashboard',
      //     label: 'Performance',
      //     routeName: 'dashboard',
      //   },
      {
        id: 'reportCenter',
        label: 'Report Center',
        routeName: 'reportCenter',
      },
    ],
  },
  // {
  //   id: 'setting',
  //   label: 'Setting',
  //   icon: 'setting',
  //   routeName: 'setting',
  // },
]

const expandedLinks = ref([])
const toggleLinkExpansion = (link) => {
  if (link.sub === undefined) {
    return
  }

  const isExpanded = expandedLinks.value.includes(link.id)
  if (isExpanded) {
    expandedLinks.value = expandedLinks.value.filter((id) => id !== link.id)
  } else {
    expandedLinks.value.push(link.id)
  }
}

const isHostCleartrust = window.location.hostname === 'cleartrust.data-fusion.io'
</script>

<template>
  <div class="sidebar tw-group">
    <img
      v-if="isHostCleartrust"
      src="~assets/cleartrust-logo.png"
      class="-tw-ml-[0.625rem] tw-h-[2.5rem]"
      alt="Cleartrust Media"
    />
    <div v-else style="width: 245px; height: 60px">
    <img
      src="~assets/template-logo.png"
      alt="Data Fusion"
      style="width: 245px;
      height: 60px;"
    />
    </div>
    <div class="tw-mt-[6.25rem] tw-space-y-7.5">
      <div v-for="link in menu" :key="link.id">
        <component
          :is="link.sub !== undefined ? 'div' : 'router-link'"
          class="item tw-flex tw-cursor-pointer tw-items-center tw-rounded-full tw-transition-[background-color] hover:tw-bg-strong-primary"
          :class="{ 'group-hover:tw-bg-strong-primary': expandedLinks.includes(link.id) }"
          :to="{ name: link.routeName }"
          @click="toggleLinkExpansion(link)"
        >
          <div class="icon-wrap">
            <UIcon class="tw-text-[2rem]" :name="link.icon" />
          </div>
          <p class="tw-ml-[--label-pl] tw-mr-[2.625rem]">{{ link.label }}</p>
          <UIcon
            v-if="link.sub !== undefined"
            class="tw-ml-auto tw-mr-[0.875rem] tw-text-[1.5rem] tw-transition-[transform]"
            :class="{ 'tw-rotate-180': expandedLinks.includes(link.id) }"
            name="angle-down"
          />
        </component>
        <div v-if="expandedLinks.includes(link.id)" class="links">
          <router-link
            v-for="sublink in link.sub"
            :key="sublink.id"
            :to="{ name: sublink.routeName }"
            class="link"
          >
            {{ sublink.label }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sidebar {
  --padding: 1rem;
  --label-pl: 0.625rem;
  --icon-wrap-size: 3.75rem;

  @apply tw-fixed tw-bottom-2.5 tw-left-2.5 tw-top-2.5 tw-z-[999] tw-flex tw-flex-col tw-items-start tw-overflow-x-hidden tw-rounded-[1.5rem] tw-bg-primary tw-p-[--padding] tw-font-bold tw-uppercase tw-text-white tw-transition-[max-width] hover:tw-max-w-[100vw] hover:tw-overflow-x-visible;

  max-width: calc(var(--icon-wrap-size) + var(--padding) * 2);

  &:not(:hover) {
    .logo-label,
    .item > *:not(.icon-wrap) {
      opacity: 0;
    }

    .links {
      display: none;
    }
  }
}

.icon-wrap {
  @apply tw-flex tw-size-[--icon-wrap-size] tw-flex-shrink-0 tw-items-center tw-justify-center tw-rounded-full tw-bg-light-primary;
}

.links {
  margin-left: calc(var(--icon-wrap-size) + var(--label-pl));
}

.link {
  --gap: 0.625rem;
  --dot-size: 0.375rem;
  --p: 0.625rem;

  @apply tw-mt-2.5 tw-flex tw-items-center tw-gap-[--gap] tw-rounded-full tw-p-[--p] tw-leading-none tw-transition-[background-color] before:tw-size-[--dot-size] before:tw-rounded-full before:tw-bg-white before:tw-opacity-0 before:tw-transition-opacity before:tw-content-[''] hover:tw-bg-light-primary hover:before:tw-opacity-100;

  margin-left: calc((var(--gap) + var(--p) + var(--dot-size)) * -1);
}
</style>
