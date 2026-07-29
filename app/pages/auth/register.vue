<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})

useSeoMeta({
  title: 'Create Account — Job Eligibility Checker',
})

const name = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const confirmPassword = ref('')
const showConfirmPassword = ref(false)
const loading = ref(false)
const errors = ref<Record<string, string>>({})

const { $toast } = useNuxtApp()

function validate() {
  errors.value = {}
  if (!name.value) errors.value.name = 'Full name is required'
  if (!email.value) errors.value.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))
    errors.value.email = 'Enter a valid email'
  if (!password.value) errors.value.password = 'Password is required'
  else if (password.value.length < 8) errors.value.password = 'At least 8 characters'
  if (password.value !== confirmPassword.value)
    errors.value.confirmPassword = 'Passwords do not match'
  return Object.keys(errors.value).length === 0
}

async function handleRegister() {
  if (!validate()) return

  loading.value = true

  try {
    const { authService } = await import('~/services/auth.service')
    await authService.register({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: confirmPassword.value,
    })
    $toast.success('Account created successfully!')
    await navigateTo('/dashboard')
  } catch (error: unknown) {
    const { getValidationErrors, isValidationError, getErrorMessage } =
      await import('~/utils/error-handler')
    const axiosError = error as { response?: { status: number } }

    if (isValidationError(axiosError as never)) {
      errors.value = getValidationErrors(axiosError as never)
    } else {
      errors.value.general = getErrorMessage(error)
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-surface-900">Create your account</h1>
      <p class="mt-1 text-sm text-muted-foreground">
        Start analyzing your job fit in under a minute.
      </p>
    </div>

    <form class="space-y-5" @submit.prevent="handleRegister">
      <div v-if="errors.general" class="rounded-md bg-danger/10 p-3 text-sm text-danger">
        {{ errors.general }}
      </div>

      <div class="form-group">
        <label for="name" class="label label-required">Full Name</label>
        <input
          id="name"
          v-model="name"
          type="text"
          class="input"
          :class="{ 'input-error': errors.name }"
          placeholder="John Doe"
          autocomplete="name"
          autofocus
        >
        <p v-if="errors.name" class="form-error">{{ errors.name }}</p>
      </div>

      <div class="form-group">
        <label for="email" class="label label-required">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          class="input"
          :class="{ 'input-error': errors.email }"
          placeholder="you@example.com"
          autocomplete="email"
        >
        <p v-if="errors.email" class="form-error">{{ errors.email }}</p>
      </div>

      <div class="form-group">
        <label for="password" class="label label-required">Password</label>
        <div class="relative">
          <input
            id="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            class="input pr-10"
            :class="{ 'input-error': errors.password }"
            placeholder="••••••••"
            autocomplete="new-password"
          >
          <button
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            @click="showPassword = !showPassword"
          >
            <Icon :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'" class="size-4" />
          </button>
        </div>
        <p v-if="errors.password" class="form-error">{{ errors.password }}</p>
      </div>

      <div class="form-group">
        <label for="confirm-password" class="label label-required">Confirm Password</label>
        <div class="relative">
          <input
            id="confirm-password"
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            class="input pr-10"
            :class="{ 'input-error': errors.confirmPassword }"
            placeholder="••••••••"
            autocomplete="new-password"
          >
          <button
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            @click="showConfirmPassword = !showConfirmPassword"
          >
            <Icon :name="showConfirmPassword ? 'lucide:eye-off' : 'lucide:eye'" class="size-4" />
          </button>
        </div>
        <p v-if="errors.confirmPassword" class="form-error">{{ errors.confirmPassword }}</p>
      </div>

      <div class="flex items-start gap-2">
        <input
          id="terms"
          type="checkbox"
          class="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary"
          required
        >
        <label for="terms" class="text-sm text-surface-600">
          I agree to the
          <a
href="#"
class="text-primary hover:text-primary-500 transition-colors"
            >Terms of Service</a
          >
          and
          <a
href="#"
class="text-primary hover:text-primary-500 transition-colors"
            >Privacy Policy</a
          >
        </label>
      </div>

      <button type="submit" class="btn btn-primary w-full" :disabled="loading">
        <Icon v-if="loading" name="lucide:loader-circle" class="size-4 animate-spin" />
        {{ loading ? 'Creating account...' : 'Create Account' }}
      </button>

      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-border" />
        </div>
        <div class="relative flex justify-center text-xs">
          <span class="bg-bright-snow px-2 text-muted-foreground">or continue with</span>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <button type="button" class="btn btn-outline">
          <Icon name="lucide:github" class="size-4" />
          GitHub
        </button>
        <button type="button" class="btn btn-outline">
          <Icon name="lucide:chrome" class="size-4" />
          Google
        </button>
      </div>
    </form>

    <p class="mt-6 text-center text-sm text-muted-foreground">
      Already have an account?
      <NuxtLink
        to="/auth/login"
        class="font-medium text-primary hover:text-primary-500 transition-colors"
      >
        Sign in
      </NuxtLink>
    </p>
  </div>
</template>
