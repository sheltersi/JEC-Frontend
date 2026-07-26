<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

useSeoMeta({
  title: 'Log In — Job Eligibility Checker',
})

const email = ref('')
const password = ref('')
const loading = ref(false)
const errors = ref<Record<string, string>>({})

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
  // TODO: Implement auth API call
  await new Promise((r) => setTimeout(r, 1000))
  navigateTo('/dashboard')
  loading.value = false
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-surface-900">Welcome back</h1>
      <p class="mt-1 text-sm text-muted-foreground">Sign in to your account to continue.</p>
    </div>

    <form class="space-y-5" @submit.prevent="handleLogin">
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
        <input
          id="password"
          v-model="password"
          type="password"
          class="input"
          :class="{ 'input-error': errors.password }"
          placeholder="••••••••"
          autocomplete="current-password"
        >
        <p v-if="errors.password" class="form-error">{{ errors.password }}</p>
      </div>

      <div class="flex items-center gap-2">
        <input
          id="remember"
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
