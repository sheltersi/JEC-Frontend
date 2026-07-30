<script setup lang="ts">
import { api, type UserProfile } from '~/services/api'

definePageMeta({
  layout: 'onboarding',
  middleware: 'auth',
})

useSeoMeta({
  title: 'Set Up Your Profile — Job Eligibility Checker',
})

const { $toast } = useNuxtApp()
const authStore = useAuthStore()

// Pre-populate form with any existing profile data from the auth store
const existing = authStore.currentUser?.profile

const form = ref<Partial<UserProfile>>({
  headline: existing?.headline ?? '',
  bio: existing?.bio ?? '',
  city: existing?.city ?? '',
  phone: existing?.phone ?? '',
  date_of_birth: existing?.date_of_birth ?? '',
  years_experience: existing?.years_experience ?? undefined,
  highest_qualification: existing?.highest_qualification ?? '',
  current_job_title: existing?.current_job_title ?? '',
  current_company: existing?.current_company ?? '',
  linkedin_url: existing?.linkedin_url ?? '',
  github_url: existing?.github_url ?? '',
  portfolio_url: existing?.portfolio_url ?? '',
  visa_status: existing?.visa_status ?? '',
  work_authorization: existing?.work_authorization ?? '',
  remote_preference: existing?.remote_preference ?? '',
  salary_expectation: existing?.salary_expectation ?? '',
  currency: existing?.currency ?? '',
})

const loading = ref(false)
const errors = ref<Record<string, string>>({})

/** Qualification options for the dropdown */
const qualificationOptions = [
  { value: '', label: 'Select...' },
  { value: 'high_school', label: 'High School' },
  { value: 'associate', label: 'Associate Degree' },
  { value: 'bachelor', label: "Bachelor's Degree" },
  { value: 'master', label: "Master's Degree" },
  { value: 'doctorate', label: 'Doctorate' },
  { value: 'other', label: 'Other' },
]

/** Remote work preference options */
const remoteOptions = [
  { value: '', label: 'Select...' },
  { value: 'remote', label: 'Remote Only' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'On-site' },
  { value: 'flexible', label: 'Flexible' },
]

/** Minimal validation: ensure at least headline or current job title is provided */
function validate(): boolean {
  errors.value = {}

  if (!form.value.headline?.trim() && !form.value.current_job_title?.trim()) {
    errors.value.headline = 'Provide at least a headline or current job title'
    errors.value.current_job_title = 'Provide at least a headline or current job title'
  }

  return Object.keys(errors.value).length === 0
}

/** Persist the profile to the backend and refresh the auth store */
async function handleSubmit() {
  if (!validate()) return

  loading.value = true

  try {
    // Strip empty strings so the backend doesn't receive them as values
    const payload = Object.fromEntries(
      Object.entries(form.value).filter(([, v]) => v !== '' && v !== undefined),
    ) as Partial<UserProfile>

    const { data } = await api.profile.update(payload)

    // Refresh the user in the auth store so isProfileComplete reflects the update
    authStore.setUser({
      ...authStore.currentUser!,
      profile: data.data,
    })

    $toast.success('Profile saved!')
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

/** Allow users to skip profile setup if they want to come back later */
function handleSkip() {
  navigateTo('/dashboard')
}
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-surface-900">Set Up Your Profile</h1>
      <p class="mt-1 text-sm text-muted-foreground">
        Help us understand your background so we can give you better job eligibility insights.
      </p>
    </div>

    <form class="space-y-8" @submit.prevent="handleSubmit">
      <!-- General error banner -->
      <div v-if="errors.general" class="rounded-md bg-danger/10 p-3 text-sm text-danger">
        {{ errors.general }}
      </div>

      <!-- Section: Professional Identity -->
      <fieldset class="rounded-lg border border-border bg-bright-snow p-6">
        <legend class="text-base font-semibold text-surface-900">Professional Identity</legend>
        <p class="mb-4 text-xs text-muted-foreground">
          Tell us who you are professionally. At minimum, provide a headline or your current job title.
        </p>

        <div class="space-y-4">
          <div class="form-group">
            <label for="headline" class="label label-required">Headline</label>
            <input
              id="headline"
              v-model="form.headline"
              type="text"
              class="input"
              :class="{ 'input-error': errors.headline }"
              placeholder="e.g. Senior Frontend Developer"
              autofocus
            >
            <p v-if="errors.headline" class="form-error">{{ errors.headline }}</p>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div class="form-group">
              <label for="current_job_title" class="label label-required">Current Job Title</label>
              <input
                id="current_job_title"
                v-model="form.current_job_title"
                type="text"
                class="input"
                :class="{ 'input-error': errors.current_job_title }"
                placeholder="e.g. Software Engineer"
              >
              <p v-if="errors.current_job_title" class="form-error">{{ errors.current_job_title }}</p>
            </div>

            <div class="form-group">
              <label for="current_company" class="label">Current Company</label>
              <input
                id="current_company"
                v-model="form.current_company"
                type="text"
                class="input"
                placeholder="e.g. Acme Corp"
              >
            </div>
          </div>

          <div class="form-group">
            <label for="bio" class="label">Bio</label>
            <textarea
              id="bio"
              v-model="form.bio"
              class="input min-h-24"
              placeholder="A brief summary of your background and what you're looking for..."
              rows="3"
            />
          </div>
        </div>
      </fieldset>

      <!-- Section: Personal Details -->
      <fieldset class="rounded-lg border border-border bg-bright-snow p-6">
        <legend class="text-base font-semibold text-surface-900">Personal Details</legend>
        <p class="mb-4 text-xs text-muted-foreground">
          Basic contact and location information.
        </p>

        <div class="grid gap-4 sm:grid-cols-2">
          <div class="form-group">
            <label for="city" class="label">City</label>
            <input
              id="city"
              v-model="form.city"
              type="text"
              class="input"
              placeholder="e.g. San Francisco"
            >
          </div>

          <div class="form-group">
            <label for="phone" class="label">Phone</label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              class="input"
              placeholder="e.g. +1 555-0123"
            >
          </div>

          <div class="form-group">
            <label for="date_of_birth" class="label">Date of Birth</label>
            <input
              id="date_of_birth"
              v-model="form.date_of_birth"
              type="date"
              class="input"
            >
          </div>
        </div>
      </fieldset>

      <!-- Section: Experience & Education -->
      <fieldset class="rounded-lg border border-border bg-bright-snow p-6">
        <legend class="text-base font-semibold text-surface-900">Experience &amp; Education</legend>
        <p class="mb-4 text-xs text-muted-foreground">
          Your professional background helps us assess job fit.
        </p>

        <div class="grid gap-4 sm:grid-cols-2">
          <div class="form-group">
            <label for="years_experience" class="label">Years of Experience</label>
            <input
              id="years_experience"
              v-model.number="form.years_experience"
              type="number"
              class="input"
              min="0"
              max="60"
              placeholder="e.g. 5"
            >
          </div>

          <div class="form-group">
            <label for="highest_qualification" class="label">Highest Qualification</label>
            <select
              id="highest_qualification"
              v-model="form.highest_qualification"
              class="input"
            >
              <option
                v-for="o in qualificationOptions"
                :key="o.value"
                :value="o.value"
              >
                {{ o.label }}
              </option>
            </select>
          </div>
        </div>
      </fieldset>

      <!-- Section: Online Presence -->
      <fieldset class="rounded-lg border border-border bg-bright-snow p-6">
        <legend class="text-base font-semibold text-surface-900">Online Presence</legend>
        <p class="mb-4 text-xs text-muted-foreground">
          Links to your professional profiles and portfolio.
        </p>

        <div class="space-y-4">
          <div class="form-group">
            <label for="linkedin_url" class="label">LinkedIn URL</label>
            <input
              id="linkedin_url"
              v-model="form.linkedin_url"
              type="url"
              class="input"
              placeholder="https://linkedin.com/in/yourprofile"
            >
          </div>

          <div class="form-group">
            <label for="github_url" class="label">GitHub URL</label>
            <input
              id="github_url"
              v-model="form.github_url"
              type="url"
              class="input"
              placeholder="https://github.com/yourhandle"
            >
          </div>

          <div class="form-group">
            <label for="portfolio_url" class="label">Portfolio URL</label>
            <input
              id="portfolio_url"
              v-model="form.portfolio_url"
              type="url"
              class="input"
              placeholder="https://yourportfolio.com"
            >
          </div>
        </div>
      </fieldset>

      <!-- Section: Work Preferences -->
      <fieldset class="rounded-lg border border-border bg-bright-snow p-6">
        <legend class="text-base font-semibold text-surface-900">Work Preferences</legend>
        <p class="mb-4 text-xs text-muted-foreground">
          Help us match you with relevant opportunities.
        </p>

        <div class="grid gap-4 sm:grid-cols-2">
          <div class="form-group">
            <label for="visa_status" class="label">Visa / Work Status</label>
            <input
              id="visa_status"
              v-model="form.visa_status"
              type="text"
              class="input"
              placeholder="e.g. H1-B, Citizen, PR"
            >
          </div>

          <div class="form-group">
            <label for="work_authorization" class="label">Work Authorization</label>
            <input
              id="work_authorization"
              v-model="form.work_authorization"
              type="text"
              class="input"
              placeholder="e.g. Eligible to work in the US"
            >
          </div>

          <div class="form-group">
            <label for="remote_preference" class="label">Remote Preference</label>
            <select
              id="remote_preference"
              v-model="form.remote_preference"
              class="input"
            >
              <option
                v-for="o in remoteOptions"
                :key="o.value"
                :value="o.value"
              >
                {{ o.label }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="currency" class="label">Preferred Currency</label>
            <input
              id="currency"
              v-model="form.currency"
              type="text"
              class="input"
              maxlength="3"
              placeholder="e.g. USD"
            >
          </div>

          <div class="form-group sm:col-span-2">
            <label for="salary_expectation" class="label">Salary Expectation</label>
            <input
              id="salary_expectation"
              v-model="form.salary_expectation"
              type="text"
              class="input"
              placeholder="e.g. 120,000 annually"
            >
          </div>
        </div>
      </fieldset>

      <!-- Actions -->
      <div class="flex items-center justify-between">
        <button
          type="button"
          class="btn btn-outline text-sm"
          @click="handleSkip"
        >
          Skip for now
        </button>

        <button
          type="submit"
          class="btn btn-primary"
          :disabled="loading"
        >
          <Icon v-if="loading" name="lucide:loader-circle" class="size-4 animate-spin" />
          {{ loading ? 'Saving...' : 'Save Profile' }}
        </button>
      </div>
    </form>
  </div>
</template>
