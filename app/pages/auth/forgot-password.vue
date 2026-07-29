<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})

useSeoMeta({
  title: 'Forgot Password — Job Eligibility Checker',
})

const email = ref('')
const loading = ref(false)
const sent = ref(false)
const errors = ref<Record<string, string>>({})

async function handleSubmit() {
  errors.value = {}
  if (!email.value) {
    errors.value.email = 'Email is required'
    return
  }

  loading.value = true
  try {
    const { authService } = await import('~/services/auth.service')
    await authService.forgotPassword(email.value)
    sent.value = true
  } catch (error: unknown) {
    const { getErrorMessage } = await import('~/utils/error-handler')
    errors.value.general = getErrorMessage(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-surface-900">Forgot your password?</h1>
      <p class="mt-1 text-sm text-muted-foreground">
        Enter your email and we'll send you a reset link.
      </p>
    </div>

    <div v-if="sent" class="rounded-md bg-emerald-50 p-4 text-sm text-emerald-700">
      <p class="font-medium">Check your email</p>
      <p class="mt-1">
        If an account exists for {{ email }}, you'll receive a password reset link shortly.
      </p>
    </div>

    <form v-else class="space-y-5" @submit.prevent="handleSubmit">
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

      <button type="submit" class="btn btn-primary w-full" :disabled="loading">
        <Icon v-if="loading" name="lucide:loader-circle" class="size-4 animate-spin" />
        {{ loading ? 'Sending...' : 'Send Reset Link' }}
      </button>
    </form>

    <p class="mt-6 text-center text-sm text-muted-foreground">
      <NuxtLink
        to="/auth/login"
        class="font-medium text-primary hover:text-primary-500 transition-colors"
      >
        Back to sign in
      </NuxtLink>
    </p>
  </div>
</template>
