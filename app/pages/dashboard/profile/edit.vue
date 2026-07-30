<script setup lang="ts">
import { api, type UserProfile } from '~/services/api'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useSeoMeta({
  title: 'Edit Profile — Job Eligibility Checker',
})

const { $toast } = useNuxtApp()
const authStore = useAuthStore()
const router = useRouter()

/** Pre-populate form with existing profile data */
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
const saving = ref(false)
const errors = ref<Record<string, string>>({})

/** Qualification dropdown options */
const qualificationOptions = [
  { value: '', label: 'Select qualification…' },
  { value: 'high_school', label: 'High School' },
  { value: 'associate', label: 'Associate Degree' },
  { value: 'bachelor', label: "Bachelor's Degree" },
  { value: 'master', label: "Master's Degree" },
  { value: 'doctorate', label: 'Doctorate' },
  { value: 'other', label: 'Other' },
]

/** Remote preference dropdown options */
const remoteOptions = [
  { value: '', label: 'Select preference…' },
  { value: 'remote', label: 'Remote Only' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'On-site' },
  { value: 'flexible', label: 'Flexible' },
]

/** Simple client-side validation */
function validate(): boolean {
  errors.value = {}

  if (!form.value.headline?.trim() && !form.value.current_job_title?.trim()) {
    errors.value.headline = 'Provide at least a headline or current job title'
    errors.value.current_job_title = 'Provide at least a headline or current job title'
  }

  return Object.keys(errors.value).length === 0
}

/** Submit the updated profile */
async function handleSubmit() {
  if (!validate()) return

  saving.value = true

  try {
    // Strip empty strings so the backend receives null / omitted values
    const payload = Object.fromEntries(
      Object.entries(form.value).filter(([, v]) => v !== '' && v !== undefined),
    ) as Partial<UserProfile>

    const { data } = await api.profile.update(payload)

    // Refresh auth store with the updated profile
    authStore.setUser({
      ...authStore.currentUser!,
      profile: data.data,
    })

    $toast.success('Profile updated!')
    await router.push('/dashboard/profile')
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
    saving.value = false
  }
}

/** Go back to the profile view without saving */
function handleCancel() {
  router.push('/dashboard/profile')
}

/** Compute user initials from their name */
const initials = computed(() => {
  const name = authStore.currentUser?.name ?? ''
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

/** Active tab for the segmented form */
const activeTab = ref<'professional' | 'personal' | 'preferences'>('professional')

const tabs = [
  { id: 'professional' as const, label: 'Professional', icon: 'lucide:briefcase' },
  { id: 'personal' as const, label: 'Personal', icon: 'lucide:user' },
  { id: 'preferences' as const, label: 'Preferences', icon: 'lucide:sliders-horizontal' },
] as const
</script>

<template>
  <div>
    <!-- Page header with avatar -->
    <div class="mb-6 flex items-center gap-4">
      <div
        class="flex h-14 w-14 items-center justify-center rounded-full border-2 border-bright-snow bg-primary/10 text-lg font-bold text-primary shadow-sm"
      >
        {{ initials }}
      </div>
      <div>
        <h1 class="text-2xl font-bold text-surface-900">Edit Profile</h1>
        <p class="text-sm text-muted-foreground">
          Update your information to keep your job insights accurate.
        </p>
      </div>
    </div>

    <!-- Global error -->
    <div
      v-if="errors.general"
      class="mb-6 flex items-start gap-3 rounded-lg border border-danger/20 bg-danger/10 p-4 text-sm text-danger"
    >
      <Icon name="lucide:alert-circle" class="mt-0.5 size-4 shrink-0" />
      <span>{{ errors.general }}</span>
    </div>

    <!-- Tab navigation -->
    <div class="mb-6 border-b border-border">
      <nav class="flex gap-1" aria-label="Profile sections">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          class="relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors"
          :class="activeTab === tab.id
            ? 'text-primary'
            : 'text-muted-foreground hover:text-surface-700'"
          @click="activeTab = tab.id"
        >
          <Icon :name="tab.icon" class="size-4" />
          {{ tab.label }}
          <span
            v-if="activeTab === tab.id"
            class="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary"
          />
        </button>
      </nav>
    </div>

    <!-- ============================== -->
    <!-- Tab: Professional              -->
    <!-- ============================== -->
    <div v-if="activeTab === 'professional'" class="card">
      <div class="card-header">
        <h2 class="card-title text-base">Professional Identity</h2>
        <p class="card-description text-xs">
          Tell us who you are at work. At minimum, provide a headline or your current job title.
        </p>
      </div>
      <div class="card-content space-y-5">
        <div class="form-group">
          <label for="headline" class="label label-required">Headline</label>
          <div class="relative">
            <input
              id="headline"
              v-model="form.headline"
              type="text"
              class="input pl-10"
              :class="{ 'input-error': errors.headline }"
              placeholder="e.g. Senior Frontend Developer"
              autofocus
            >
            <Icon name="lucide:sparkles" class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          <p class="form-hint">A short tagline that describes your expertise.</p>
          <p v-if="errors.headline" class="form-error">{{ errors.headline }}</p>
        </div>

        <div class="grid gap-5 sm:grid-cols-2">
          <div class="form-group">
            <label for="current_job_title" class="label label-required">Current Job Title</label>
            <div class="relative">
              <input
                id="current_job_title"
                v-model="form.current_job_title"
                type="text"
                class="input pl-10"
                :class="{ 'input-error': errors.current_job_title }"
                placeholder="e.g. Software Engineer"
              >
              <Icon name="lucide:briefcase" class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            <p v-if="errors.current_job_title" class="form-error">{{ errors.current_job_title }}</p>
          </div>

          <div class="form-group">
            <label for="current_company" class="label">Current Company</label>
            <div class="relative">
              <input
                id="current_company"
                v-model="form.current_company"
                type="text"
                class="input pl-10"
                placeholder="e.g. Acme Corp"
              >
              <Icon name="lucide:building-2" class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="bio" class="label">Bio</label>
          <textarea
            id="bio"
            v-model="form.bio"
            class="input min-h-28 resize-y"
            placeholder="A brief summary of your background and what you're looking for..."
            rows="4"
          />
        </div>

        <div class="grid gap-5 sm:grid-cols-2">
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
              <Icon name="lucide:calendar" class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
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
    </div>

    <!-- ============================== -->
    <!-- Tab: Personal                -->
    <!-- ============================== -->
    <div v-if="activeTab === 'personal'" class="card">
      <div class="card-header">
        <h2 class="card-title text-base">Personal Details</h2>
        <p class="card-description text-xs">Basic contact and location information.</p>
      </div>
      <div class="card-content grid gap-5 sm:grid-cols-2">
        <div class="form-group">
          <label for="city" class="label">City</label>
          <div class="relative">
            <input
              id="city"
              v-model="form.city"
              type="text"
              class="input pl-10"
              placeholder="e.g. San Francisco"
            >
            <Icon name="lucide:map-pin" class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div class="form-group">
          <label for="phone" class="label">Phone</label>
          <div class="relative">
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              class="input pl-10"
              placeholder="e.g. +1 555-0123"
            >
            <Icon name="lucide:phone" class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
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
    </div>

    <!-- ============================== -->
    <!-- Tab: Preferences             -->
    <!-- ============================== -->
    <div v-if="activeTab === 'preferences'" class="space-y-6">
      <!-- Online Presence -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title text-base">Online Presence</h2>
          <p class="card-description text-xs">Links to your professional profiles and portfolio.</p>
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
              <Icon name="lucide:linkedin" class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div class="grid gap-5 sm:grid-cols-2">
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
                <Icon name="lucide:github" class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
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
                <Icon name="lucide:globe" class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Work Preferences -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title text-base">Work Preferences</h2>
          <p class="card-description text-xs">Help us match you with relevant opportunities.</p>
        </div>
        <div class="card-content grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div class="form-group">
            <label for="visa_status" class="label">Visa / Work Status</label>
            <div class="relative">
              <input
                id="visa_status"
                v-model="form.visa_status"
                type="text"
                class="input pl-10"
                placeholder="e.g. H1-B, Citizen, PR"
              >
              <Icon name="lucide:shield" class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div class="form-group">
            <label for="work_authorization" class="label">Work Authorization</label>
            <div class="relative">
              <input
                id="work_authorization"
                v-model="form.work_authorization"
                type="text"
                class="input pl-10"
                placeholder="e.g. Eligible to work in the US"
              >
              <Icon name="lucide:check-circle" class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
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
            <div class="relative">
              <input
                id="currency"
                v-model="form.currency"
                type="text"
                class="input pl-10"
                maxlength="3"
                placeholder="e.g. USD"
              >
              <Icon name="lucide:banknote" class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div class="form-group lg:col-span-2">
            <label for="salary_expectation" class="label">Salary Expectation</label>
            <div class="relative">
              <input
                id="salary_expectation"
                v-model="form.salary_expectation"
                type="text"
                class="input pl-10"
                placeholder="e.g. 120,000 annually"
              >
              <Icon name="lucide:tag" class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================== -->
    <!-- Sticky bottom action bar     -->
    <!-- ============================== -->
    <div
      class="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bright-snow/90 px-4 py-4 backdrop-blur-sm sm:px-6 lg:left-64 lg:px-8"
    >
      <div class="mx-auto flex max-w-4xl items-center justify-between">
        <button
          type="button"
          class="btn btn-ghost text-sm"
          @click="handleCancel"
        >
          Cancel
        </button>

        <div class="flex items-center gap-3">
          <button
            type="button"
            class="btn btn-outline btn-sm gap-2"
            @click="handleCancel"
          >
            Discard Changes
          </button>
          <button
            type="button"
            class="btn btn-primary gap-2 px-6 shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/30"
            :disabled="saving"
            @click="handleSubmit"
          >
            <Icon v-if="saving" name="lucide:loader-circle" class="size-4 animate-spin" />
            <Icon v-else name="lucide:save" class="size-4" />
            <span>{{ saving ? 'Saving...' : 'Save Changes' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Spacer so content isn't hidden behind sticky bar -->
    <div class="h-20" />
  </div>
</template>
