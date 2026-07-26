<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

useSeoMeta({
  title: 'Create Account — Job Eligibility Checker',
})

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const errors = ref<Record<string, string>>({})

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
  // TODO: Implement auth API call
  await new Promise((r) => setTimeout(r, 1000))
  navigateTo('/dashboard')
  loading.value = false
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
        <input
          id="password"
          v-model="password"
          type="password"
          class="input"
          :class="{ 'input-error': errors.password }"
          placeholder="••••••••"
          autocomplete="new-password"
        >
        <p v-if="errors.password" class="form-error">{{ errors.password }}</p>
      </div>

      <div class="form-group">
        <label for="confirm-password" class="label label-required">Confirm Password</label>
        <input
          id="confirm-password"
          v-model="confirmPassword"
          type="password"
          class="input"
          :class="{ 'input-error': errors.confirmPassword }"
          placeholder="••••••••"
          autocomplete="new-password"
        >
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
