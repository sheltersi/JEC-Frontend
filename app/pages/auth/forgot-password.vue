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

/** Submit forgot-password request */
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
    <!-- Header -->
    <div class="mb-8 text-center">
      <h1 class="text-2xl font-bold tracking-tight text-surface-900">
        Forgot your password?
      </h1>
      <p class="mt-1.5 text-sm text-muted-foreground">
        Enter your email and we'll send you a reset link.
      </p>
    </div>

    <!-- Success state -->
    <div
      v-if="sent"
      class="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm"
    >
      <Icon name="lucide:check-circle" class="mt-0.5 size-5 shrink-0 text-emerald-600" />
      <div class="text-emerald-800">
        <p class="font-semibold">Check your email</p>
        <p class="mt-1">
          If an account exists for <span class="font-medium">{{ email }}</span>, you'll receive a
          password reset link shortly.
        </p>
      </div>
    </div>

    <!-- Form -->
    <form v-else class="space-y-5" @submit.prevent="handleSubmit">
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

      <!-- Submit -->
      <button
        type="submit"
        class="btn btn-primary w-full gap-2 shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/30"
        :disabled="loading"
      >
        <Icon v-if="loading" name="lucide:loader-circle" class="size-4 animate-spin" />
        <Icon v-else name="lucide:send" class="size-4" />
        <span>{{ loading ? 'Sending...' : 'Send Reset Link' }}</span>
      </button>
    </form>

    <!-- Footer link -->
    <p class="mt-8 text-center text-sm text-muted-foreground">
      <NuxtLink
        to="/auth/login"
        class="font-semibold text-primary hover:text-primary-500 transition-colors"
      >
        Back to sign in
      </NuxtLink>
    </p>
  </div>
</template>
