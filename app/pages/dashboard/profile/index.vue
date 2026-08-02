<script setup lang="ts">
import { api, type UserSkill, type Education, type Experience, type UserLanguage } from '~/services/api'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useSeoMeta({
  title: 'My Profile — Job Eligibility Checker',
})

const authStore = useAuthStore()

function client() {
  return useNuxtApp().$api as import('axios').AxiosInstance
}

const { data: freshUser } = await useAsyncData('profile-me', async () => {
  const { data } = await api.user.me()
  return data.data
})

const { data: skillsData } = await useAsyncData('profile-skills', async () => {
  try {
    const { data } = await client().get<{ success: boolean; data: UserSkill[] }>('/skills')
    return data.data ?? []
  } catch {
    return []
  }
})

const { data: educationData } = await useAsyncData('profile-education', async () => {
  try {
    const { data } = await api.education.list()
    return data.data ?? []
  } catch {
    return []
  }
})

const { data: experienceData } = await useAsyncData('profile-experience', async () => {
  try {
    const { data } = await api.experience.list()
    return data.data ?? []
  } catch {
    return []
  }
})

const { data: languagesData } = await useAsyncData('profile-languages', async () => {
  try {
    const { data } = await client().get<{ success: boolean; data: UserLanguage[] }>('/languages')
    return data.data ?? []
  } catch {
    return []
  }
})

if (freshUser.value) {
  authStore.setUser(freshUser.value)
}

const user = computed(() => authStore.currentUser)
const profile = computed(() => user.value?.profile)
const skills = computed(() => skillsData.value ?? [])
const education = computed(() => educationData.value ?? [])
const experience = computed(() => experienceData.value ?? [])
const languages = computed(() => languagesData.value ?? [])

const initials = computed(() => {
  const name = user.value?.name ?? ''
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function fmtDateShort(iso: string | null | undefined): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
  })
}

const qualificationLabels: Record<string, string> = {
  high_school: 'High School',
  associate: 'Associate Degree',
  bachelor: "Bachelor's Degree",
  master: "Master's Degree",
  doctorate: 'Doctorate',
  diploma: 'Diploma',
  phd: 'PhD',
  other: 'Other',
  'High School': 'High School',
  Diploma: 'Diploma',
  Associate: 'Associate',
  Bachelor: 'Bachelor',
  Master: 'Master',
  PhD: 'PhD',
}

const workAuthLabels: Record<string, string> = {
  Citizen: 'Citizen',
  'Permanent Resident': 'Permanent Resident',
  PR: 'Permanent Resident',
}

const remoteLabels: Record<string, string> = {
  remote: 'Remote Only',
  hybrid: 'Hybrid',
  onsite: 'On-site',
  flexible: 'Flexible',
}

function label(value: string | undefined | null, map: Record<string, string>): string {
  if (!value) return '—'
  return map[value] || value
}

function skillLevelColor(level: string): string {
  const map: Record<string, string> = {
    Expert: 'bg-emerald-500/10 text-emerald-700',
    Advanced: 'bg-blue-500/10 text-blue-700',
    Intermediate: 'bg-amber-500/10 text-amber-700',
    Beginner: 'bg-surface-200 text-surface-700',
  }
  return map[level] ?? 'bg-surface-200 text-surface-700'
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
        to="/dashboard/profile/edit"
        class="btn btn-outline btn-sm gap-2"
      >
        <Icon name="lucide:pencil" class="size-3.5" />
        Edit Profile
      </NuxtLink>
    </div>

    <!-- Hero / Identity Card -->
    <div class="card mb-8 overflow-hidden">
      <div class="h-24 bg-gradient-to-r from-primary-100/60 via-primary-50/40 to-bright-snow" />
      <div class="card-content relative -mt-12 flex flex-col gap-5 pb-6 sm:flex-row sm:items-end">
        <div
          class="flex h-24 w-24 items-center justify-center rounded-full border-4 border-bright-snow bg-primary/10 text-3xl font-bold text-primary shadow-sm"
        >
          {{ initials }}
        </div>
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

    <!-- Profile scoring fields -->
    <div class="mb-8">
      <div class="mb-4 flex items-center gap-2">
        <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon name="lucide:user-cog" class="size-3.5" />
        </div>
        <h2 class="text-lg font-semibold text-surface-900">Profile Details</h2>
      </div>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <div class="card">
          <div class="card-header py-3">
            <p class="text-xs font-medium text-muted-foreground">Years of Experience</p>
          </div>
          <div class="card-content pb-4">
            <p class="text-lg font-bold text-surface-900">
              {{ profile?.years_experience != null ? `${profile.years_experience}` : '—' }}
            </p>
          </div>
        </div>
        <div class="card">
          <div class="card-header py-3">
            <p class="text-xs font-medium text-muted-foreground">Highest Qualification</p>
          </div>
          <div class="card-content pb-4">
            <p class="text-lg font-bold text-surface-900">
              {{ label(profile?.highest_qualification, qualificationLabels) }}
            </p>
          </div>
        </div>
        <div class="card">
          <div class="card-header py-3">
            <p class="text-xs font-medium text-muted-foreground">Work Authorization</p>
          </div>
          <div class="card-content pb-4">
            <p class="text-lg font-bold text-surface-900">
              {{ label(profile?.work_authorization, workAuthLabels) }}
            </p>
          </div>
        </div>
        <div class="card">
          <div class="card-header py-3">
            <p class="text-xs font-medium text-muted-foreground">Salary Expectation</p>
          </div>
          <div class="card-content pb-4">
            <p class="text-lg font-bold text-surface-900">
              {{ profile?.salary_expectation != null ? `${profile.salary_expectation}` : '—' }}
            </p>
          </div>
        </div>
        <div class="card">
          <div class="card-header py-3">
            <p class="text-xs font-medium text-muted-foreground">Currency</p>
          </div>
          <div class="card-content pb-4">
            <p class="text-lg font-bold text-surface-900">
              {{ profile?.currency || '—' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Skills -->
    <div class="mb-8">
      <div class="mb-4 flex items-center gap-2">
        <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
          <Icon name="lucide:zap" class="size-3.5" />
        </div>
        <h2 class="text-lg font-semibold text-surface-900">Skills</h2>
        <span class="text-xs text-muted-foreground">({{ skills.length }})</span>
      </div>

      <div v-if="skills.length > 0" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="skill in skills" :key="skill.id" class="card p-4">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="text-sm font-semibold text-surface-900">
                {{ skill.skill?.name ?? `Skill #${skill.skill_id}` }}
              </p>
              <p class="text-xs text-muted-foreground">
                {{ skill.years_experience }} {{ skill.years_experience === 1 ? 'year' : 'years' }} experience
              </p>
            </div>
            <span class="inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium" :class="skillLevelColor(skill.level)">
              {{ skill.level }}
            </span>
          </div>
        </div>
      </div>

      <div v-else class="card p-6 text-center">
        <Icon name="lucide:zap" class="mx-auto size-8 text-surface-300" />
        <p class="mt-2 text-sm text-muted-foreground">No skills added yet.</p>
        <NuxtLink to="/dashboard/profile/edit" class="mt-2 inline-block text-sm font-medium text-primary hover:underline">
          Add your skills
        </NuxtLink>
      </div>
    </div>

    <!-- Experience -->
    <div class="mb-8">
      <div class="mb-4 flex items-center gap-2">
        <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
          <Icon name="lucide:briefcase" class="size-3.5" />
        </div>
        <h2 class="text-lg font-semibold text-surface-900">Experience</h2>
        <span class="text-xs text-muted-foreground">({{ experience.length }})</span>
      </div>

      <div v-if="experience.length > 0" class="space-y-3">
        <div v-for="exp in experience" :key="exp.id" class="card p-4">
          <div class="flex items-start gap-3">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-200 text-surface-600">
              <Icon name="lucide:building-2" class="size-5" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold text-surface-900">{{ exp.position }}</p>
              <p class="text-sm text-surface-700">{{ exp.company }}</p>
              <div class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span class="inline-flex items-center gap-1">
                  <Icon name="lucide:calendar" class="size-3" />
                  {{ fmtDateShort(exp.start_date) }} — {{ exp.currently_working ? 'Present' : fmtDateShort(exp.end_date) }}
                </span>
                <span v-if="exp.employment_type" class="inline-flex items-center rounded-full bg-surface-100 px-2 py-0.5 text-xs">
                  {{ exp.employment_type }}
                </span>
              </div>
              <p v-if="exp.description" class="mt-2 text-sm leading-relaxed text-surface-600">
                {{ exp.description }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="card p-6 text-center">
        <Icon name="lucide:briefcase" class="mx-auto size-8 text-surface-300" />
        <p class="mt-2 text-sm text-muted-foreground">No experience added yet.</p>
        <NuxtLink to="/dashboard/profile/edit" class="mt-2 inline-block text-sm font-medium text-primary hover:underline">
          Add experience
        </NuxtLink>
      </div>
    </div>

    <!-- Education -->
    <div class="mb-8">
      <div class="mb-4 flex items-center gap-2">
        <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600">
          <Icon name="lucide:graduation-cap" class="size-3.5" />
        </div>
        <h2 class="text-lg font-semibold text-surface-900">Education</h2>
        <span class="text-xs text-muted-foreground">({{ education.length }})</span>
      </div>

      <div v-if="education.length > 0" class="space-y-3">
        <div v-for="edu in education" :key="edu.id" class="card p-4">
          <div class="flex items-start gap-3">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600">
              <Icon name="lucide:graduation-cap" class="size-5" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold text-surface-900">{{ edu.qualification }}</p>
              <p class="text-sm text-surface-700">{{ edu.institution }}</p>
              <div class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span v-if="edu.start_date || edu.end_date" class="inline-flex items-center gap-1">
                  <Icon name="lucide:calendar" class="size-3" />
                  {{ fmtDateShort(edu.start_date) }} — {{ fmtDateShort(edu.end_date) }}
                </span>
                <span v-if="edu.field_of_study" class="inline-flex items-center rounded-full bg-surface-100 px-2 py-0.5 text-xs">
                  {{ edu.field_of_study }}
                </span>
                <span v-if="edu.grade" class="text-xs font-medium text-surface-600">
                  {{ edu.grade }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="card p-6 text-center">
        <Icon name="lucide:graduation-cap" class="mx-auto size-8 text-surface-300" />
        <p class="mt-2 text-sm text-muted-foreground">No education added yet.</p>
        <NuxtLink to="/dashboard/profile/edit" class="mt-2 inline-block text-sm font-medium text-primary hover:underline">
          Add education
        </NuxtLink>
      </div>
    </div>

    <!-- Languages -->
    <div class="mb-8">
      <div class="mb-4 flex items-center gap-2">
        <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
          <Icon name="lucide:languages" class="size-3.5" />
        </div>
        <h2 class="text-lg font-semibold text-surface-900">Languages</h2>
        <span class="text-xs text-muted-foreground">({{ languages.length }})</span>
      </div>

      <div v-if="languages.length > 0" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="lang in languages" :key="lang.id" class="card p-4">
          <div class="flex items-center justify-between gap-3">
            <p class="text-sm font-semibold text-surface-900">
              {{ lang.language?.name ?? `Language #${lang.language_id}` }}
            </p>
            <span class="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-700">
              {{ lang.proficiency }}
            </span>
          </div>
        </div>
      </div>

      <div v-else class="card p-6 text-center">
        <Icon name="lucide:languages" class="mx-auto size-8 text-surface-300" />
        <p class="mt-2 text-sm text-muted-foreground">No languages added yet.</p>
        <NuxtLink to="/dashboard/profile/edit" class="mt-2 inline-block text-sm font-medium text-primary hover:underline">
          Add languages
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
