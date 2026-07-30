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

/** Validate registration form fields */
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

/** Submit the registration form */
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
    const authStore = useAuthStore()
    $toast.success('Account created successfully!')
    await navigateTo(authStore.postLoginRoute)
  } catch (error: unknown) {
    const { getErrorMessage } = await import('~/utils/error-handler')
    const err = error as { response?: { status: number; data?: { message?: string } } }

    if (err.response?.status === 422 && err.response?.data) {
      const data = err.response.data as { errors?: Record<string, string[]> }
      if (data.errors) {
        for (const [field, messages] of Object.entries(data.errors)) {
          errors.value[field] = Array.isArray(messages) ? (messages[0] ?? '') : String(messages)
        }
        return
      }
    }

    errors.value.general = err.response?.data?.message || getErrorMessage(error)
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
        Create your account
      </h1>
      <p class="mt-1.5 text-sm text-muted-foreground">
        Start analyzing your job fit in under a minute.
      </p>
    </div>

    <form class="space-y-5" @submit.prevent="handleRegister">
      <!-- Global error -->
      <div
        v-if="errors.general"
        class="flex items-start gap-2.5 rounded-lg border border-danger/20 bg-danger/10 p-3 text-sm text-danger"
      >
        <Icon name="lucide:alert-circle" class="mt-0.5 size-4 shrink-0" />
        <span>{{ errors.general }}</span>
      </div>

      <!-- Full Name -->
      <div class="form-group">
        <label for="name" class="label label-required">Full Name</label>
        <div class="relative">
          <input
            id="name"
            v-model="name"
            type="text"
            class="input pl-10"
            :class="{ 'input-error': errors.name }"
            placeholder="John Doe"
            autocomplete="name"
            autofocus
          >
          <Icon
            name="lucide:user"
            class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
        </div>
        <p v-if="errors.name" class="form-error">{{ errors.name }}</p>
      </div>

      <!-- Email -->
      <div class="form-group">
        <label for="email" class="label label-required">Email address</label>
        <div class="relative">
          <input
            id="email"
            v-model="email"
            type="email"
            class="input pl-10"
            :class="{ 'input-error': errors.email }"
            placeholder="you@example.com"
            autocomplete="email"
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
        <label for="password" class="label label-required">Password</label>
        <div class="relative">
          <input
            id="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            class="input px-10"
            :class="{ 'input-error': errors.password }"
            placeholder="••••••••"
            autocomplete="new-password"
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
        <p class="form-hint">Must be at least 8 characters</p>
        <p v-if="errors.password" class="form-error">{{ errors.password }}</p>
      </div>

      <!-- Confirm Password -->
      <div class="form-group">
        <label for="confirm-password" class="label label-required">Confirm Password</label>
        <div class="relative">
          <input
            id="confirm-password"
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            class="input px-10"
            :class="{ 'input-error': errors.confirmPassword }"
            placeholder="••••••••"
            autocomplete="new-password"
          >
          <Icon
            name="lucide:lock"
            class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
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

      <!-- Terms -->
      <div class="flex items-start gap-2">
        <input
          id="terms"
          type="checkbox"
          class="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary"
          required
        >
        <label for="terms" class="text-sm leading-relaxed text-surface-600">
          I agree to the
          <a href="#" class="font-medium text-primary hover:text-primary-500 transition-colors">
            Terms of Service
          </a>
          and
          <a href="#" class="font-medium text-primary hover:text-primary-500 transition-colors">
            Privacy Policy
          </a>
        </label>
      </div>

      <!-- Submit -->
      <button
        type="submit"
        class="btn btn-primary w-full gap-2 shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/30"
        :disabled="loading"
      >
        <Icon v-if="loading" name="lucide:loader-circle" class="size-4 animate-spin" />
        <Icon v-else name="lucide:user-plus" class="size-4" />
        <span>{{ loading ? 'Creating account...' : 'Create Account' }}</span>
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
        <button type="button" class="btn btn-outline gap-2 hover:bg-surface-100">
          <Icon name="lucide:github" class="size-4" />
          <span class="text-sm">GitHub</span>
        </button>
        <button type="button" class="btn btn-outline gap-2 hover:bg-surface-100">
          <Icon name="lucide:chrome" class="size-4" />
          <span class="text-sm">Google</span>
        </button>
      </div>
    </form>

    <!-- Footer link -->
    <p class="mt-8 text-center text-sm text-muted-foreground">
      Already have an account?
      <NuxtLink
        to="/auth/login"
        class="font-semibold text-primary hover:text-primary-500 transition-colors"
      >
        Sign in
      </NuxtLink>
    </p>
  </div>
</template>
