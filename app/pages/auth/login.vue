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

/** Handle the login form submission */
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
    const authStore = useAuthStore()
    $toast.success('Welcome back!')
    await navigateTo(authStore.postLoginRoute)
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
    <!-- Header -->
    <div class="mb-8 text-center">
      <h1 class="text-2xl font-bold tracking-tight text-surface-900">
        Welcome back
      </h1>
      <p class="mt-1.5 text-sm text-muted-foreground">
        Sign in to continue analyzing your job fit.
      </p>
    </div>

    <form class="space-y-5" @submit.prevent="handleLogin">
      <!-- Global error -->
      <div
        v-if="errors.general"
        class="flex items-start gap-2.5 rounded-lg border border-danger/20 bg-danger/10 p-3 text-sm text-danger"
      >
        <Icon name="lucide:alert-circle" class="mt-0.5 size-4 shrink-0" />
        <span>{{ errors.general }}</span>
      </div>

      <!-- Email -->
      <div class="form-group">
        <label for="email" class="label">Email address</label>
        <div class="relative">
          <input
            id="email"
            v-model="email"
            type="email"
            class="input pl-10"
            :class="{ 'input-error': errors.email }"
            placeholder="you@example.com"
            autocomplete="email"
            autofocus
          >
          <Icon
            name="lucide:mail"
            class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
        </div>
        <p v-if="errors.email" class="form-error">{{ errors.email }}</p>
      </div>

      <!-- Password -->
      <div class="form-group">
        <div class="flex items-center justify-between">
          <label for="password" class="label">Password</label>
          <NuxtLink
            to="/auth/forgot-password"
            class="text-xs font-medium text-primary hover:text-primary-500 transition-colors"
          >
            Forgot password?
          </NuxtLink>
        </div>
        <div class="relative">
          <input
            id="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            class="input px-10"
            :class="{ 'input-error': errors.password }"
            placeholder="••••••••"
            autocomplete="current-password"
          >
          <Icon
            name="lucide:lock"
            class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
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

      <!-- Remember me -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <input
            id="remember"
            v-model="remember"
            type="checkbox"
            class="h-4 w-4 rounded border-border text-primary focus:ring-primary"
          >
          <label for="remember" class="text-sm text-surface-600">Remember me</label>
        </div>
      </div>

      <!-- Submit -->
      <button
        type="submit"
        class="btn btn-primary w-full gap-2 shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/30"
        :disabled="loading"
      >
        <Icon v-if="loading" name="lucide:loader-circle" class="size-4 animate-spin" />
        <Icon v-else name="lucide:arrow-right" class="size-4" />
        <span>{{ loading ? 'Signing in...' : 'Sign In' }}</span>
      </button>

      <!-- Divider -->
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-border" />
        </div>
        <div class="relative flex justify-center text-xs">
          <span class="bg-surface px-3 text-muted-foreground">or continue with</span>
        </div>
      </div>

      <!-- Social login -->
      <div class="grid grid-cols-2 gap-3">
        <button
          type="button"
          class="btn btn-outline gap-2 hover:bg-surface-100"
        >
          <Icon name="lucide:github" class="size-4" />
          <span class="text-sm">GitHub</span>
        </button>
        <button
          type="button"
          class="btn btn-outline gap-2 hover:bg-surface-100"
        >
          <Icon name="lucide:chrome" class="size-4" />
          <span class="text-sm">Google</span>
        </button>
      </div>
    </form>

    <!-- Footer link -->
    <p class="mt-8 text-center text-sm text-muted-foreground">
      Don't have an account?
      <NuxtLink
        to="/auth/register"
        class="font-semibold text-primary hover:text-primary-500 transition-colors"
      >
        Create one
      </NuxtLink>
    </p>
  </div>
</template>
