<script setup lang="ts">
import { api } from '~/services/api'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useSeoMeta({
  title: 'My Profile — Job Eligibility Checker',
})

const authStore = useAuthStore()

/** Fetch fresh profile data when the page loads */
const { data: freshUser, error } = await useAsyncData('profile-me', async () => {
  const { data } = await api.user.me()
  return data.data
})

// Update the auth store with the freshest data
if (freshUser.value) {
  authStore.setUser(freshUser.value)
}

/** Convenience computed for the current user */
const user = computed(() => authStore.currentUser)
const profile = computed(() => user.value?.profile)

/** User initials for the avatar */
const initials = computed(() => {
  const name = user.value?.name ?? ''
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

/** Format a ISO date string into a human-readable date */
function fmtDate(iso: string | null | undefined): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/** Human-readable qualification labels */
const qualificationLabels: Record<string, string> = {
  high_school: 'High School',
  associate: 'Associate Degree',
  bachelor: "Bachelor's Degree",
  master: "Master's Degree",
  doctorate: 'Doctorate',
  other: 'Other',
}

/** Human-readable remote preference labels */
const remoteLabels: Record<string, string> = {
  remote: 'Remote Only',
  hybrid: 'Hybrid',
  onsite: 'On-site',
  flexible: 'Flexible',
}
</script>

<template>
  <div>
    <!-- Page header -->
    <div class="mb-6 flex items-end justify-between">
      <div>
        <h1 class="text-2xl font-bold text-surface-900">My Profile</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          View and manage your personal and professional information.
        </p>
      </div>
      <NuxtLink
        to="/dashboard/profile/setup"
        class="btn btn-outline btn-sm gap-2"
      >
        <Icon name="lucide:pencil" class="size-3.5" />
        Edit Profile
      </NuxtLink>
    </div>

    <!-- ========================== -->
    <!-- Hero / Identity Card       -->
    <!-- ========================== -->
    <div class="card mb-6 overflow-hidden">
      <!-- Top banner with subtle gradient -->
      <div class="h-24 bg-gradient-to-r from-primary-100/60 via-primary-50/40 to-bright-snow" />

      <div class="card-content relative -mt-12 flex flex-col gap-5 pb-6 sm:flex-row sm:items-end">
        <!-- Avatar -->
        <div
          class="flex h-24 w-24 items-center justify-center rounded-full border-4 border-bright-snow bg-primary/10 text-3xl font-bold text-primary shadow-sm"
        >
          {{ initials }}
        </div>

        <!-- Name + Headline -->
        <div class="flex-1">
          <h2 class="text-xl font-bold text-surface-900">{{ user?.name }}</h2>
          <p class="text-sm text-muted-foreground">{{ user?.email }}</p>
          <div class="mt-2 flex flex-wrap items-center gap-2">
            <span
              v-if="profile?.headline"
              class="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
            >
              {{ profile.headline }}
            </span>
            <span
              v-if="profile?.current_job_title"
              class="inline-flex items-center rounded-full bg-surface-200 px-2.5 py-0.5 text-xs font-medium text-surface-700"
            >
              <Icon name="lucide:briefcase" class="mr-1 size-3" />
              {{ profile.current_job_title }}
            </span>
            <span
              v-if="profile?.current_company"
              class="inline-flex items-center rounded-full bg-surface-200 px-2.5 py-0.5 text-xs font-medium text-surface-700"
            >
              <Icon name="lucide:building-2" class="mr-1 size-3" />
              {{ profile.current_company }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================== -->
    <!-- Two-column detail grid     -->
    <!-- ========================== -->
    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Left column -->
      <div class="space-y-6">
        <!-- About / Bio -->
        <div class="card">
          <div class="card-header pb-3">
            <div class="flex items-center gap-2">
              <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon name="lucide:user" class="size-4" />
              </div>
              <h3 class="card-title text-base">About</h3>
            </div>
          </div>
          <div class="card-content">
            <p v-if="profile?.bio" class="text-sm leading-relaxed text-surface-700">
              {{ profile.bio }}
            </p>
            <p v-else class="text-sm italic text-muted-foreground">
              No bio added yet.
              <NuxtLink to="/dashboard/profile/setup" class="font-medium text-primary hover:underline">
                Add one
              </NuxtLink>
            </p>
          </div>
        </div>

        <!-- Personal Details -->
        <div class="card">
          <div class="card-header pb-3">
            <div class="flex items-center gap-2">
              <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                <Icon name="lucide:contact-2" class="size-4" />
              </div>
              <h3 class="card-title text-base">Personal Details</h3>
            </div>
          </div>
          <div class="card-content">
            <dl class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <dt class="text-xs font-medium text-muted-foreground">City</dt>
                <dd class="mt-0.5 text-sm font-medium text-surface-900">
                  {{ profile?.city || '—' }}
                </dd>
              </div>
              <div>
                <dt class="text-xs font-medium text-muted-foreground">Phone</dt>
                <dd class="mt-0.5 text-sm font-medium text-surface-900">
                  {{ profile?.phone || '—' }}
                </dd>
              </div>
              <div>
                <dt class="text-xs font-medium text-muted-foreground">Date of Birth</dt>
                <dd class="mt-0.5 text-sm font-medium text-surface-900">
                  {{ fmtDate(profile?.date_of_birth) || '—' }}
                </dd>
              </div>
              <div>
                <dt class="text-xs font-medium text-muted-foreground">Member Since</dt>
                <dd class="mt-0.5 text-sm font-medium text-surface-900">
                  {{ fmtDate(user?.created_at) || '—' }}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Experience & Education -->
        <div class="card">
          <div class="card-header pb-3">
            <div class="flex items-center gap-2">
              <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                <Icon name="lucide:graduation-cap" class="size-4" />
              </div>
              <h3 class="card-title text-base">Experience & Education</h3>
            </div>
          </div>
          <div class="card-content">
            <dl class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <dt class="text-xs font-medium text-muted-foreground">Years of Experience</dt>
                <dd class="mt-0.5 text-sm font-medium text-surface-900">
                  {{ profile?.years_experience != null ? `${profile.years_experience} years` : '—' }}
                </dd>
              </div>
              <div>
                <dt class="text-xs font-medium text-muted-foreground">Highest Qualification</dt>
                <dd class="mt-0.5 text-sm font-medium text-surface-900">
                  {{ qualificationLabels[profile?.highest_qualification ?? ''] || '—' }}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <!-- Right column -->
      <div class="space-y-6">
        <!-- Online Presence -->
        <div class="card">
          <div class="card-header pb-3">
            <div class="flex items-center gap-2">
              <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                <Icon name="lucide:globe" class="size-4" />
              </div>
              <h3 class="card-title text-base">Online Presence</h3>
            </div>
          </div>
          <div class="card-content space-y-3">
            <a
              v-if="profile?.linkedin_url"
              :href="profile.linkedin_url"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-3 rounded-md border border-border bg-bright-snow p-3 text-sm transition-colors hover:border-primary/30 hover:bg-primary/5"
            >
              <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0077b5]/10">
                <Icon name="lucide:linkedin" class="size-4 text-[#0077b5]" />
              </div>
              <div class="min-w-0">
                <p class="font-medium text-surface-900">LinkedIn</p>
                <p class="truncate text-xs text-muted-foreground">{{ profile.linkedin_url }}</p>
              </div>
              <Icon name="lucide:external-link" class="ml-auto size-3.5 shrink-0 text-muted-foreground" />
            </a>

            <a
              v-if="profile?.github_url"
              :href="profile.github_url"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-3 rounded-md border border-border bg-bright-snow p-3 text-sm transition-colors hover:border-primary/30 hover:bg-primary/5"
            >
              <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-800/10">
                <Icon name="lucide:github" class="size-4 text-surface-800" />
              </div>
              <div class="min-w-0">
                <p class="font-medium text-surface-900">GitHub</p>
                <p class="truncate text-xs text-muted-foreground">{{ profile.github_url }}</p>
              </div>
              <Icon name="lucide:external-link" class="ml-auto size-3.5 shrink-0 text-muted-foreground" />
            </a>

            <a
              v-if="profile?.portfolio_url"
              :href="profile.portfolio_url"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-3 rounded-md border border-border bg-bright-snow p-3 text-sm transition-colors hover:border-primary/30 hover:bg-primary/5"
            >
              <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Icon name="lucide:globe" class="size-4 text-primary" />
              </div>
              <div class="min-w-0">
                <p class="font-medium text-surface-900">Portfolio</p>
                <p class="truncate text-xs text-muted-foreground">{{ profile.portfolio_url }}</p>
              </div>
              <Icon name="lucide:external-link" class="ml-auto size-3.5 shrink-0 text-muted-foreground" />
            </a>

            <p
              v-if="!profile?.linkedin_url && !profile?.github_url && !profile?.portfolio_url"
              class="text-sm italic text-muted-foreground"
            >
              No links added yet.
              <NuxtLink to="/dashboard/profile/setup" class="font-medium text-primary hover:underline">
                Add links
              </NuxtLink>
            </p>
          </div>
        </div>

        <!-- Work Preferences -->
        <div class="card">
          <div class="card-header pb-3">
            <div class="flex items-center gap-2">
              <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-200 text-surface-700">
                <Icon name="lucide:sliders-horizontal" class="size-4" />
              </div>
              <h3 class="card-title text-base">Work Preferences</h3>
            </div>
          </div>
          <div class="card-content">
            <dl class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <dt class="text-xs font-medium text-muted-foreground">Visa / Work Status</dt>
                <dd class="mt-0.5 text-sm font-medium text-surface-900">
                  {{ profile?.visa_status || '—' }}
                </dd>
              </div>
              <div>
                <dt class="text-xs font-medium text-muted-foreground">Work Authorization</dt>
                <dd class="mt-0.5 text-sm font-medium text-surface-900">
                  {{ profile?.work_authorization || '—' }}
                </dd>
              </div>
              <div>
                <dt class="text-xs font-medium text-muted-foreground">Remote Preference</dt>
                <dd class="mt-0.5 text-sm font-medium text-surface-900">
                  {{ remoteLabels[profile?.remote_preference ?? ''] || '—' }}
                </dd>
              </div>
              <div>
                <dt class="text-xs font-medium text-muted-foreground">Preferred Currency</dt>
                <dd class="mt-0.5 text-sm font-medium text-surface-900">
                  {{ profile?.currency || '—' }}
                </dd>
              </div>
              <div class="sm:col-span-2">
                <dt class="text-xs font-medium text-muted-foreground">Salary Expectation</dt>
                <dd class="mt-0.5 text-sm font-medium text-surface-900">
                  {{ profile?.salary_expectation || '—' }}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
