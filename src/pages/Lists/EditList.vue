<script setup>
import { ListsAPI } from 'src/api'
import CreateAndEditForm from './CreateAndEditForm/index.vue'
import { useRoute } from 'vue-router'
import { ref } from 'vue'

const route = useRoute()

const list = ref({})
const getList = async () => {
  list.value = await ListsAPI.get({ id: route.params.id })
}
getList()

const isListItemsLoading = ref(false)
const listItems = ref([])
const getListItems = async () => {
  isListItemsLoading.value = true
  try {
    listItems.value = await ListsAPI.getListItems({ id: route.params.id })
  } catch (e) {}
  isListItemsLoading.value = false
}
getListItems()

const editList = async (list) => {
  await ListsAPI.update(list.value)
}
</script>

<template>
  <CreateAndEditForm
    :list="list"
    :list-items="{ isListItemsLoading, listItems }"
    :handle-submit="editList"
  >
    <template #title> Edit List </template>
  </CreateAndEditForm>
</template>

<style lang="scss" scoped></style>
