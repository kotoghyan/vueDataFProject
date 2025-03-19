<script setup>
import { ListsAPI } from 'src/api'
import CreateAndEditForm from './CreateAndEditForm/index.vue'

const handleSubmit = async (list) => {
  if (list.value.id === undefined) {
    const data = await ListsAPI.create(list.value)
    list.value.id = data.id
  } else {
    await ListsAPI.update(list.value)
  }
}
</script>

<template>
  <CreateAndEditForm :handle-submit="handleSubmit">
    <template #title> Create List </template>
  </CreateAndEditForm>
</template>

<style lang="scss" scoped></style>
