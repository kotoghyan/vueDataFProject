<script setup>
import { useMeta, useQuasar } from 'quasar'
import { useRoute } from 'vue-router'

const $q = useQuasar()
const route = useRoute()

useMeta(() => {
  const meta = {
    title: 'DataFusion',
  }

  if (route.meta?.title !== undefined) {
    meta.title = `${route.meta.title} | ${meta.title}`
  }

  return meta
})

$q.screen.setSizes({ sm: 768, md: 1140 })
</script>

<template>
  <router-view />
</template>
