<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})

useSeoMeta({
  title: 'Log In — Job Eligibility Checker',
})

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const remember = ref(false)
const loading = ref(false)
const errors = ref<Record<string, string>>({})

const { $toast } = useNuxtApp()

async function handleLogin() {
  errors.value = {}
  if (!email.value) {
    errors.value.email = 'Email is required'
    return
  }
  if (!password.value) {
    errors.value.password = 'Password is required'
    return
  }

  loading.value = true

  try {
    const { authService } = await import('~/services/auth.service')
    await authService.login({
      email: email.value,
      password: password.value,
      remember: remember.value,
    })
    $toast.success('Welcome back!')
    await navigateTo('/dashboard')
  } catch (error: unknown) {
    const { isValidationError, getValidationErrors, getErrorMessage } =
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
      <h1 class="text-2xl font-bold text-surface-900">Welcome back</h1>
      <p class="mt-1 text-sm text-muted-foreground">Sign in to your account to continue.</p>
    </div>

    <form class="space-y-5" @submit.prevent="handleLogin">
      <div v-if="errors.general" class="rounded-md bg-danger/10 p-3 text-sm text-danger">
        {{ errors.general }}
      </div>

      <div class="form-group">
        <label for="email" class="label">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          class="input"
          :class="{ 'input-error': errors.email }"
          placeholder="you@example.com"
          autocomplete="email"
          autofocus
        >
        <p v-if="errors.email" class="form-error">{{ errors.email }}</p>
      </div>

      <div class="form-group">
        <div class="flex items-center justify-between">
          <label for="password" class="label">Password</label>
          <NuxtLink
            to="/auth/forgot-password"
            class="text-xs text-primary hover:text-primary-500 transition-colors"
          >
            Forgot password?
          </NuxtLink>
        </div>
        <div class="relative">
          <input
            id="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            class="input pr-10"
            :class="{ 'input-error': errors.password }"
            placeholder="••••••••"
            autocomplete="current-password"
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

      <div class="flex items-center gap-2">
        <input
          id="remember"
          v-model="remember"
          type="checkbox"
          class="h-4 w-4 rounded border-border text-primary focus:ring-primary"
        >
        <label for="remember" class="text-sm text-surface-600">Remember me</label>
      </div>

      <button type="submit" class="btn btn-primary w-full" :disabled="loading">
        <Icon v-if="loading" name="lucide:loader-circle" class="size-4 animate-spin" />
        {{ loading ? 'Signing in...' : 'Sign In' }}
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
      Don't have an account?
      <NuxtLink
        to="/auth/register"
        class="font-medium text-primary hover:text-primary-500 transition-colors"
      >
        Create one
      </NuxtLink>
    </p>
  </div>
</template>
