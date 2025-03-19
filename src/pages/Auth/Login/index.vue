<script setup>
import { ref } from 'vue'
import { AuthAPI } from 'src/api'
import { AuthService } from 'src/services'
import { useRouter } from 'vue-router'
import UInput from 'src/components/ui/UInput.vue'
import UCheckbox from 'src/components/ui/UCheckbox.vue'
import UButton from 'src/components/ui/UButton.vue'

const router = useRouter()

const fieldsValues = ref({})

const isSubmitting = ref(false)
const submit = async () => {
  isSubmitting.value = true
  try {
    const { email, password } = fieldsValues.value
    const data = await AuthAPI.login({ email, password })
    AuthService.setTokens(data)
    router.replace({ name: 'home' })
  } catch (error) {}
  isSubmitting.value = false
}
</script>

<template>
  <form
    class="tw-mx-auto tw-flex tw-h-full tw-w-[26.25rem] tw-flex-col tw-justify-center"
    @submit.prevent="submit"
  >
    <h1 class="page-title">Sign In</h1>
    <p class="tw-mb-7.5 tw-mt-5 tw-text-dark-primary">Get started by logging in to your account.</p>
    <div class="tw-space-y-2.5">
      <UInput v-model="fieldsValues.email" type="email" placeholder="Email" required>
        <template #title>Email</template>
      </UInput>
      <UInput v-model="fieldsValues.password" type="password" placeholder="Password" required>
        <template #title>Password</template>
      </UInput>
    </div>
    <UCheckbox class="tw-mb-7.5 tw-mt-5"> Keep me logged in </UCheckbox>
    <UButton type="submit" class="tw-w-full" :loading="isSubmitting" rounded> Sign In </UButton>
    <p class="tw-my-7.5">
      Not registered yet?
      <router-link :to="{ name: 'register' }" class="underlined-link">
        Create an Account
      </router-link>
    </p>
    <p>
      <a
        class="underlined-link"
        href="https://cdn.prod.website-files.com/65e1bc1d4a342801c6df8e37/6706a10d68a03fcd695e8744_Data%20Fusion%20-%20Terms%20of%20Service%2010.03.2024%20LIVE.pdf"
        >Terms of Service</a
      >
      and
      <a class="underlined-link" href="https://www.data-fusion.io/privacy">Privacy Policy</a>
    </p>
  </form>
</template>

<style lang="scss" scoped>
.underlined-link {
  @apply tw-text-primary tw-underline tw-decoration-primary tw-underline-offset-2 tw-transition-[text-decoration-color] hover:tw-decoration-transparent;
}
</style>
