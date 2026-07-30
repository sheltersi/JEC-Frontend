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

/** Pre-populate form with any existing profile data from the auth store */
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

/** Compute the user's initials from their name */
const userInitials = computed(() => {
  const name = authStore.currentUser?.name ?? ''
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

/** Track how many of the core required-ish fields have a value for a completion bar */
const completionPercentage = computed(() => {
  const coreFields = [
    form.value.headline,
    form.value.current_job_title,
    form.value.current_company,
    form.value.city,
    form.value.highest_qualification,
    form.value.years_experience,
    form.value.linkedin_url,
  ]
  const filled = coreFields.filter(Boolean).length
  return Math.round((filled / coreFields.length) * 100)
})

/** Section config for rendering cards consistently */
const sections = [
  {
    id: 'professional',
    icon: 'lucide:briefcase',
    title: 'Professional Identity',
    description: 'Who you are at work. Provide at least a headline or your current job title.',
  },
  {
    id: 'personal',
    icon: 'lucide:user',
    title: 'Personal Details',
    description: 'Basic contact and location information.',
  },
  {
    id: 'experience',
    icon: 'lucide:graduation-cap',
    title: 'Experience & Education',
    description: 'Your professional background helps us assess job fit.',
  },
  {
    id: 'online',
    icon: 'lucide:globe',
    title: 'Online Presence',
    description: 'Links to your professional profiles and portfolio.',
  },
  {
    id: 'preferences',
    icon: 'lucide:sliders-horizontal',
    title: 'Work Preferences',
    description: 'Help us match you with relevant opportunities.',
  },
] as const
</script>

<template>
  <div class="mx-auto max-w-3xl pb-20">
    <!-- Hero / Welcome Banner -->
    <div class="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-bright-snow p-8">
      <!-- Decorative blurred circle -->
      <div class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

      <div class="relative flex items-center gap-5">
        <!-- Avatar -->
        <div
          class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary ring-2 ring-primary/20"
        >
          {{ userInitials }}
        </div>

        <div>
          <h1 class="text-2xl font-bold text-surface-900">
            Welcome, {{ authStore.currentUser?.name?.split(' ')[0] ?? 'there' }}!
          </h1>
          <p class="mt-1 max-w-lg text-sm text-muted-foreground">
            Let's set up your profile so we can give you accurate job eligibility insights.
          </p>
        </div>
      </div>

      <!-- Completion progress -->
      <div class="mt-6">
        <div class="mb-1.5 flex items-center justify-between text-xs">
          <span class="font-medium text-surface-700">Profile completion</span>
          <span class="font-semibold text-primary">{{ completionPercentage }}%</span>
        </div>
        <div class="h-2 w-full overflow-hidden rounded-full bg-surface-200">
          <div
            class="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            :style="{ width: completionPercentage + '%' }"
          />
        </div>
      </div>
    </div>

    <!-- General error banner (global) -->
    <div
      v-if="errors.general"
      class="mb-6 flex items-start gap-3 rounded-lg border border-danger/20 bg-danger/10 p-4 text-sm text-danger"
    >
      <Icon name="lucide:alert-circle" class="mt-0.5 size-4 shrink-0" />
      <span>{{ errors.general }}</span>
    </div>

    <!-- ============================ -->
    <!-- Section: Professional Identity -->
    <!-- ============================ -->
    <div class="card mb-6">
      <div class="card-header">
        <div class="flex items-center gap-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon name="lucide:briefcase" class="size-5" />
          </div>
          <div>
            <h2 class="card-title text-base">Professional Identity</h2>
            <p class="card-description text-xs">
              Who you are at work. At minimum, provide a headline or your current job title.
            </p>
          </div>
        </div>
      </div>
      <div class="card-content space-y-4">
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
          <p class="form-hint">A short tagline that describes your expertise.</p>
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
            class="input min-h-24 resize-y"
            placeholder="A brief summary of your background and what you're looking for..."
            rows="3"
          />
        </div>
      </div>
    </div>

    <!-- ========================== -->
    <!-- Section: Personal Details -->
    <!-- ========================== -->
    <div class="card mb-6">
      <div class="card-header">
        <div class="flex items-center gap-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
            <Icon name="lucide:user" class="size-5" />
          </div>
          <div>
            <h2 class="card-title text-base">Personal Details</h2>
            <p class="card-description text-xs">Basic contact and location information.</p>
          </div>
        </div>
      </div>
      <div class="card-content grid gap-4 sm:grid-cols-2">
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

        <div class="form-group sm:col-span-2 lg:col-span-1">
          <label for="date_of_birth" class="label">Date of Birth</label>
          <input
            id="date_of_birth"
            v-model="form.date_of_birth"
            type="date"
            class="input"
          >
        </div>
      </div>
    </div>

    <!-- ================================ -->
    <!-- Section: Experience & Education -->
    <!-- ================================ -->
    <div class="card mb-6">
      <div class="card-header">
        <div class="flex items-center gap-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
            <Icon name="lucide:graduation-cap" class="size-5" />
          </div>
          <div>
            <h2 class="card-title text-base">Experience & Education</h2>
            <p class="card-description text-xs">Your professional background helps us assess job fit.</p>
          </div>
        </div>
      </div>
      <div class="card-content grid gap-4 sm:grid-cols-2">
        <div class="form-group">
          <label for="years_experience" class="label">Years of Experience</label>
          <div class="relative">
            <input
              id="years_experience"
              v-model.number="form.years_experience"
              type="number"
              class="input pl-10"
              min="0"
              max="60"
              placeholder="e.g. 5"
            >
            <Icon name="lucide:calendar" class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div class="form-group">
          <label for="highest_qualification" class="label">Highest Qualification</label>
          <select id="highest_qualification" v-model="form.highest_qualification" class="input">
            <option v-for="o in qualificationOptions" :key="o.value" :value="o.value">
              {{ o.label }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- ========================= -->
    <!-- Section: Online Presence -->
    <!-- ========================= -->
    <div class="card mb-6">
      <div class="card-header">
        <div class="flex items-center gap-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
            <Icon name="lucide:globe" class="size-5" />
          </div>
          <div>
            <h2 class="card-title text-base">Online Presence</h2>
            <p class="card-description text-xs">Links to your professional profiles and portfolio.</p>
          </div>
        </div>
      </div>
      <div class="card-content space-y-4">
        <div class="form-group">
          <label for="linkedin_url" class="label">LinkedIn URL</label>
          <div class="relative">
            <input
              id="linkedin_url"
              v-model="form.linkedin_url"
              type="url"
              class="input pl-10"
              placeholder="https://linkedin.com/in/yourprofile"
            >
            <Icon name="lucide:link" class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div class="form-group">
            <label for="github_url" class="label">GitHub URL</label>
            <div class="relative">
              <input
                id="github_url"
                v-model="form.github_url"
                type="url"
                class="input pl-10"
                placeholder="https://github.com/yourhandle"
              >
              <Icon name="lucide:link" class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div class="form-group">
            <label for="portfolio_url" class="label">Portfolio URL</label>
            <div class="relative">
              <input
                id="portfolio_url"
                v-model="form.portfolio_url"
                type="url"
                class="input pl-10"
                placeholder="https://yourportfolio.com"
              >
              <Icon name="lucide:link" class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- =========================== -->
    <!-- Section: Work Preferences -->
    <!-- =========================== -->
    <div class="card mb-8">
      <div class="card-header">
        <div class="flex items-center gap-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-200 text-surface-700">
            <Icon name="lucide:sliders-horizontal" class="size-5" />
          </div>
          <div>
            <h2 class="card-title text-base">Work Preferences</h2>
            <p class="card-description text-xs">Help us match you with relevant opportunities.</p>
          </div>
        </div>
      </div>
      <div class="card-content grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          <select id="remote_preference" v-model="form.remote_preference" class="input">
            <option v-for="o in remoteOptions" :key="o.value" :value="o.value">
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

        <div class="form-group sm:col-span-2 lg:col-span-2">
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
    </div>

    <!-- ========================== -->
    <!-- Sticky Bottom Action Bar -->
    <!-- ========================== -->
    <div
      class="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bright-snow/90 px-4 py-4 backdrop-blur-sm sm:px-6"
    >
      <div class="mx-auto flex max-w-3xl items-center justify-between">
        <button
          type="button"
          class="btn btn-ghost text-sm"
          @click="handleSkip"
        >
          Skip for now
        </button>

        <button
          type="button"
          class="btn btn-primary gap-2 px-6"
          :disabled="loading"
          @click="handleSubmit"
        >
          <Icon v-if="loading" name="lucide:loader-circle" class="size-4 animate-spin" />
          <Icon v-else name="lucide:check" class="size-4" />
          <span>{{ loading ? 'Saving...' : 'Save Profile' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
