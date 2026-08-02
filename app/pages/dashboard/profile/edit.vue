<script setup lang="ts">
import { api, type UserProfile, type UserSkill, type Education, type Experience, type UserLanguage, type ReferenceSkill, type ReferenceLanguage } from '~/services/api'

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

const existing = authStore.currentUser?.profile

const form = ref<Partial<UserProfile>>({
  years_experience: existing?.years_experience ?? undefined,
  highest_qualification: existing?.highest_qualification ?? '',
  work_authorization: existing?.work_authorization ?? '',
  salary_expectation: existing?.salary_expectation ?? '',
  currency: existing?.currency ?? '',
})

const saving = ref(false)
const errors = ref<Record<string, string>>({})

/** Qualification options for the scoring form */
const qualificationOptions = [
  { value: '', label: 'Select qualification…' },
  { value: 'High School', label: 'High School' },
  { value: 'Diploma', label: 'Diploma' },
  { value: 'Associate', label: 'Associate' },
  { value: 'Bachelor', label: 'Bachelor' },
  { value: 'Master', label: 'Master' },
  { value: 'PhD', label: 'PhD' },
]

const workAuthOptions = [
  { value: '', label: 'Select authorization…' },
  { value: 'Citizen', label: 'Citizen' },
  { value: 'Permanent Resident', label: 'Permanent Resident' },
  { value: 'PR', label: 'PR' },
]

const skillLevelOptions = ['Beginner', 'Intermediate', 'Advanced', 'Expert']
const proficiencyOptions = ['Native', 'Fluent', 'Intermediate', 'Basic', 'B2', 'C1', 'C2']

/** Save the profile scoring fields */
async function saveProfile() {
  saving.value = true
  errors.value = {}

  try {
    const payload = Object.fromEntries(
      Object.entries(form.value).filter(([, v]) => v !== '' && v !== undefined),
    ) as Partial<UserProfile>

    const { data } = await api.profile.update(payload)

    authStore.setUser({
      ...authStore.currentUser!,
      profile: data.data,
    })

    $toast.success('Profile saved!')
  } catch (error: unknown) {
    const { isValidationError, getValidationErrors, getErrorMessage } =
      await import('~/utils/error-handler')

    if (isValidationError(error as never)) {
      errors.value = getValidationErrors(error as never)
    } else {
      errors.value.general = getErrorMessage(error)
    }
  } finally {
    saving.value = false
  }
}

// ======================================
// Skills
// ======================================
const skillsLoading = ref(false)
const userSkillsList = ref<UserSkill[]>([])
const referenceSkills = ref<ReferenceSkill[]>([])

const newSkill = ref({ skill_id: 0, level: 'Intermediate', years_experience: 1 })
const skillErrors = ref<Record<string, string>>({})
const addingSkill = ref(false)

async function loadSkills() {
  skillsLoading.value = true
  try {
    const [userRes, refRes] = await Promise.all([
      client().get<{ success: boolean; data: UserSkill[] }>('/skills'),
      client().get<{ success: boolean; data: ReferenceSkill[] }>('/skills'),
    ])
    userSkillsList.value = userRes.data.data ?? []
    referenceSkills.value = refRes.data.data ?? []
  } catch {
    userSkillsList.value = []
    referenceSkills.value = []
  } finally {
    skillsLoading.value = false
  }
}

const availableSkills = computed(() =>
  referenceSkills.value.filter(
    (rs) => !userSkillsList.value.some((us) => us.skill_id === rs.id),
  ),
)

async function addSkill() {
  if (!newSkill.value.skill_id) return
  skillErrors.value = {}
  addingSkill.value = true

  try {
    const { data } = await api.skills.create({
      skill_id: newSkill.value.skill_id,
      level: newSkill.value.level,
      years_experience: newSkill.value.years_experience,
    })
    userSkillsList.value.push(data.data)
    newSkill.value = { skill_id: 0, level: 'Intermediate', years_experience: 1 }
    $toast.success('Skill added!')
  } catch (error: unknown) {
    const { isValidationError, getValidationErrors, getErrorMessage } =
      await import('~/utils/error-handler')
    if (isValidationError(error as never)) {
      skillErrors.value = getValidationErrors(error as never)
    } else {
      skillErrors.value.general = getErrorMessage(error)
    }
  } finally {
    addingSkill.value = false
  }
}

async function removeSkill(id: number) {
  try {
    await api.skills.destroy(id)
    userSkillsList.value = userSkillsList.value.filter((s) => s.id !== id)
    $toast.success('Skill removed.')
  } catch {
    $toast.error('Failed to remove skill.')
  }
}

// ======================================
// Education
// ======================================
const educationLoading = ref(false)
const educationList = ref<Education[]>([])

const newEducation = ref<Partial<Education>>({
  institution: '',
  qualification: '',
  field_of_study: '',
  start_date: '',
  end_date: '',
  grade: '',
})
const educationErrors = ref<Record<string, string>>({})
const addingEducation = ref(false)

async function loadEducation() {
  educationLoading.value = true
  try {
    const { data } = await api.education.list()
    educationList.value = data.data ?? []
  } catch {
    educationList.value = []
  } finally {
    educationLoading.value = false
  }
}

async function addEducation() {
  if (!newEducation.value.institution?.trim() || !newEducation.value.qualification?.trim()) {
    educationErrors.value = { general: 'Institution and qualification are required.' }
    return
  }
  educationErrors.value = {}
  addingEducation.value = true

  try {
    const payload = Object.fromEntries(
      Object.entries(newEducation.value).filter(([, v]) => v !== '' && v !== undefined),
    ) as Partial<Education>
    const { data } = await api.education.create(payload)
    educationList.value.push(data.data)
    newEducation.value = { institution: '', qualification: '', field_of_study: '', start_date: '', end_date: '', grade: '' }
    $toast.success('Education added!')
  } catch (error: unknown) {
    const { isValidationError, getValidationErrors, getErrorMessage } =
      await import('~/utils/error-handler')
    if (isValidationError(error as never)) {
      educationErrors.value = getValidationErrors(error as never)
    } else {
      educationErrors.value.general = getErrorMessage(error)
    }
  } finally {
    addingEducation.value = false
  }
}

async function removeEducation(id: number) {
  try {
    await api.education.destroy(id)
    educationList.value = educationList.value.filter((e) => e.id !== id)
    $toast.success('Education removed.')
  } catch {
    $toast.error('Failed to remove education.')
  }
}

// ======================================
// Experience
// ======================================
const experienceLoading = ref(false)
const experienceList = ref<Experience[]>([])

const newExperience = ref<Partial<Experience>>({
  company: '',
  position: '',
  employment_type: '',
  start_date: '',
  end_date: '',
  currently_working: false,
  description: '',
})
const experienceErrors = ref<Record<string, string>>({})
const addingExperience = ref(false)

async function loadExperience() {
  experienceLoading.value = true
  try {
    const { data } = await api.experience.list()
    experienceList.value = data.data ?? []
  } catch {
    experienceList.value = []
  } finally {
    experienceLoading.value = false
  }
}

async function addExperience() {
  if (!newExperience.value.company?.trim() || !newExperience.value.position?.trim()) {
    experienceErrors.value = { general: 'Company and position are required.' }
    return
  }
  experienceErrors.value = {}
  addingExperience.value = true

  try {
    const payload = Object.fromEntries(
      Object.entries(newExperience.value).filter(([, v]) => v !== '' && v !== undefined),
    ) as Partial<Experience>
    const { data } = await api.experience.create(payload)
    experienceList.value.push(data.data)
    newExperience.value = { company: '', position: '', employment_type: '', start_date: '', end_date: '', currently_working: false, description: '' }
    $toast.success('Experience added!')
  } catch (error: unknown) {
    const { isValidationError, getValidationErrors, getErrorMessage } =
      await import('~/utils/error-handler')
    if (isValidationError(error as never)) {
      experienceErrors.value = getValidationErrors(error as never)
    } else {
      experienceErrors.value.general = getErrorMessage(error)
    }
  } finally {
    addingExperience.value = false
  }
}

async function removeExperience(id: number) {
  try {
    await api.experience.destroy(id)
    experienceList.value = experienceList.value.filter((e) => e.id !== id)
    $toast.success('Experience removed.')
  } catch {
    $toast.error('Failed to remove experience.')
  }
}

// ======================================
// Languages
// ======================================
const languagesLoading = ref(false)
const userLanguagesList = ref<UserLanguage[]>([])
const referenceLanguages = ref<ReferenceLanguage[]>([])

const newLanguage = ref({ language_id: 0, proficiency: 'Fluent' })
const languageErrors = ref<Record<string, string>>({})
const addingLanguage = ref(false)

async function loadLanguages() {
  languagesLoading.value = true
  try {
    const [userRes, refRes] = await Promise.all([
      client().get<{ success: boolean; data: UserLanguage[] }>('/languages'),
      client().get<{ success: boolean; data: ReferenceLanguage[] }>('/languages'),
    ])
    userLanguagesList.value = userRes.data.data ?? []
    referenceLanguages.value = refRes.data.data ?? []
  } catch {
    userLanguagesList.value = []
    referenceLanguages.value = []
  } finally {
    languagesLoading.value = false
  }
}

const availableLanguages = computed(() =>
  referenceLanguages.value.filter(
    (rl) => !userLanguagesList.value.some((ul) => ul.language_id === rl.id),
  ),
)

async function addLanguage() {
  if (!newLanguage.value.language_id) return
  languageErrors.value = {}
  addingLanguage.value = true

  try {
    const { data } = await api.languages.create({
      language_id: newLanguage.value.language_id,
      proficiency: newLanguage.value.proficiency,
    })
    userLanguagesList.value.push(data.data)
    newLanguage.value = { language_id: 0, proficiency: 'Fluent' }
    $toast.success('Language added!')
  } catch (error: unknown) {
    const { isValidationError, getValidationErrors, getErrorMessage } =
      await import('~/utils/error-handler')
    if (isValidationError(error as never)) {
      languageErrors.value = getValidationErrors(error as never)
    } else {
      languageErrors.value.general = getErrorMessage(error)
    }
  } finally {
    addingLanguage.value = false
  }
}

async function removeLanguage(id: number) {
  try {
    await api.languages.destroy(id)
    userLanguagesList.value = userLanguagesList.value.filter((l) => l.id !== id)
    $toast.success('Language removed.')
  } catch {
    $toast.error('Failed to remove language.')
  }
}

function client() {
  return useNuxtApp().$api as import('axios').AxiosInstance
}

function fmtDateShort(iso: string | null | undefined): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
  })
}

/** Load section data on mount */
await Promise.all([loadSkills(), loadEducation(), loadExperience(), loadLanguages()])

const initials = computed(() => {
  const name = authStore.currentUser?.name ?? ''
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

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
    <div class="mb-6 flex items-center gap-4">
      <div
        class="flex h-14 w-14 items-center justify-center rounded-full border-2 border-bright-snow bg-primary/10 text-lg font-bold text-primary shadow-sm"
      >
        {{ initials }}
      </div>
      <div>
        <h1 class="text-2xl font-bold text-surface-900">Edit Profile</h1>
        <p class="text-sm text-muted-foreground">
          Update your profile, skills, education, experience, and languages.
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

    <!-- ========================== -->
    <!-- 1. Profile (scoring)       -->
    <!-- ========================== -->
    <div class="card mb-6">
      <div class="card-header">
        <div class="flex items-center gap-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon name="lucide:user-cog" class="size-5" />
          </div>
          <div>
            <h2 class="card-title text-base">Profile Details</h2>
            <p class="card-description text-xs">These fields affect your job eligibility score.</p>
          </div>
        </div>
      </div>
      <div class="card-content grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div class="form-group">
          <label for="years_experience" class="label">Years of Experience</label>
          <input
            id="years_experience"
            v-model.number="form.years_experience"
            type="number"
            class="input"
            min="0"
            max="60"
            placeholder="e.g. 7"
          >
          <p v-if="errors.years_experience" class="form-error">{{ errors.years_experience }}</p>
        </div>

        <div class="form-group">
          <label for="highest_qualification" class="label">Highest Qualification</label>
          <select id="highest_qualification" v-model="form.highest_qualification" class="input">
            <option v-for="o in qualificationOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
          </select>
          <p v-if="errors.highest_qualification" class="form-error">{{ errors.highest_qualification }}</p>
        </div>

        <div class="form-group">
          <label for="work_authorization" class="label">Work Authorization</label>
          <select id="work_authorization" v-model="form.work_authorization" class="input">
            <option v-for="o in workAuthOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
          </select>
          <p v-if="errors.work_authorization" class="form-error">{{ errors.work_authorization }}</p>
        </div>

        <div class="form-group">
          <label for="salary_expectation" class="label">Salary Expectation</label>
          <input
            id="salary_expectation"
            v-model.number="form.salary_expectation"
            type="number"
            class="input"
            min="0"
            step="0.01"
            placeholder="e.g. 95000.00"
          >
          <p v-if="errors.salary_expectation" class="form-error">{{ errors.salary_expectation }}</p>
        </div>

        <div class="form-group">
          <label for="currency" class="label">Currency</label>
          <input
            id="currency"
            v-model="form.currency"
            type="text"
            class="input"
            maxlength="3"
            placeholder="USD"
          >
          <p v-if="errors.currency" class="form-error">{{ errors.currency }}</p>
        </div>

        <div class="form-group !justify-end">
          <button type="button" class="btn btn-primary btn-sm gap-2" :disabled="saving" @click="saveProfile">
            <Icon v-if="saving" name="lucide:loader-circle" class="size-3.5 animate-spin" />
            <Icon v-else name="lucide:save" class="size-3.5" />
            {{ saving ? 'Saving...' : 'Save Profile' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ========================== -->
    <!-- 2. Skills                  -->
    <!-- ========================== -->
    <div class="card mb-6">
      <div class="card-header">
        <div class="flex items-center gap-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
            <Icon name="lucide:zap" class="size-5" />
          </div>
          <div>
            <h2 class="card-title text-base">Skills</h2>
            <p class="card-description text-xs">Select from available skills and set your proficiency level.</p>
          </div>
        </div>
      </div>
      <div class="card-content space-y-4">
        <div v-if="skillsLoading" class="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon name="lucide:loader-circle" class="size-4 animate-spin" />
          Loading skills…
        </div>

        <template v-else>
          <!-- Existing skills -->
          <div v-if="userSkillsList.length > 0" class="space-y-2">
            <div
              v-for="skill in userSkillsList"
              :key="skill.id"
              class="flex items-center justify-between rounded-md border border-border bg-surface-50 p-3"
            >
              <div class="flex items-center gap-3">
                <span class="text-sm font-semibold text-surface-900">
                  {{ skill.skill?.name ?? `Skill #${skill.skill_id}` }}
                </span>
                <span class="rounded-full px-2 py-0.5 text-xs font-medium" :class="skillLevelColor(skill.level)">
                  {{ skill.level }}
                </span>
                <span class="text-xs text-muted-foreground">{{ skill.years_experience }} {{ skill.years_experience === 1 ? 'yr' : 'yrs' }}</span>
              </div>
              <button
                type="button"
                class="btn btn-ghost btn-icon-sm text-muted-foreground hover:text-danger"
                @click="removeSkill(skill.id)"
              >
                <Icon name="lucide:trash-2" class="size-3.5" />
              </button>
            </div>
          </div>
          <p v-else class="text-sm text-muted-foreground">No skills added yet.</p>

          <!-- Add skill form -->
          <div v-if="availableSkills.length > 0" class="rounded-md border border-dashed border-border bg-surface-50/50 p-4">
            <p v-if="skillErrors.general" class="form-error mb-3">{{ skillErrors.general }}</p>
            <div class="flex flex-wrap items-end gap-3">
              <div class="form-group w-44">
                <label class="text-xs font-medium text-muted-foreground">Skill</label>
                <select v-model.number="newSkill.skill_id" class="input input-sm text-xs">
                  <option :value="0" disabled>Select skill…</option>
                  <option v-for="rs in availableSkills" :key="rs.id" :value="rs.id">{{ rs.name }}</option>
                </select>
              </div>
              <div class="form-group w-32">
                <label class="text-xs font-medium text-muted-foreground">Level</label>
                <select v-model="newSkill.level" class="input input-sm text-xs">
                  <option v-for="lvl in skillLevelOptions" :key="lvl" :value="lvl">{{ lvl }}</option>
                </select>
              </div>
              <div class="form-group w-20">
                <label class="text-xs font-medium text-muted-foreground">Years</label>
                <input v-model.number="newSkill.years_experience" type="number" min="0" max="60" class="input input-sm text-xs">
              </div>
              <button type="button" class="btn btn-primary btn-sm gap-1.5" :disabled="addingSkill || !newSkill.skill_id" @click="addSkill">
                <Icon v-if="addingSkill" name="lucide:loader-circle" class="size-3 animate-spin" />
                <Icon v-else name="lucide:plus" class="size-3" />
                Add
              </button>
            </div>
          </div>
          <p v-else class="text-xs text-muted-foreground">All available skills have been added.</p>
        </template>
      </div>
    </div>

    <!-- ========================== -->
    <!-- 3. Experience              -->
    <!-- ========================== -->
    <div class="card mb-6">
      <div class="card-header">
        <div class="flex items-center gap-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
            <Icon name="lucide:briefcase" class="size-5" />
          </div>
          <div>
            <h2 class="card-title text-base">Experience</h2>
            <p class="card-description text-xs">List your work history (not used for scoring, but good for completeness).</p>
          </div>
        </div>
      </div>
      <div class="card-content space-y-4">
        <div v-if="experienceLoading" class="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon name="lucide:loader-circle" class="size-4 animate-spin" />
          Loading experience…
        </div>

        <template v-else>
          <div v-if="experienceList.length > 0" class="space-y-2">
            <div
              v-for="exp in experienceList"
              :key="exp.id"
              class="flex items-start justify-between gap-4 rounded-md border border-border bg-surface-50 p-3"
            >
              <div class="min-w-0">
                <p class="text-sm font-semibold text-surface-900">{{ exp.position }}</p>
                <p class="text-sm text-surface-700">{{ exp.company }}</p>
                <p class="text-xs text-muted-foreground">
                  {{ fmtDateShort(exp.start_date) }} — {{ exp.currently_working ? 'Present' : fmtDateShort(exp.end_date) }}
                  <span v-if="exp.employment_type" class="ml-2">· {{ exp.employment_type }}</span>
                </p>
              </div>
              <button
                type="button"
                class="btn btn-ghost btn-icon-sm shrink-0 text-muted-foreground hover:text-danger"
                @click="removeExperience(exp.id)"
              >
                <Icon name="lucide:trash-2" class="size-3.5" />
              </button>
            </div>
          </div>
          <p v-else class="text-sm text-muted-foreground">No experience added yet.</p>

          <!-- Add experience form -->
          <div class="rounded-md border border-dashed border-border bg-surface-50/50 p-4">
            <p class="mb-3 text-xs font-medium text-surface-700">Add experience</p>
            <p v-if="experienceErrors.general" class="form-error mb-3">{{ experienceErrors.general }}</p>
            <div class="grid gap-3 sm:grid-cols-2">
              <div class="form-group">
                <label class="text-xs font-medium text-muted-foreground">Company *</label>
                <input v-model="newExperience.company" type="text" class="input input-sm text-xs" placeholder="e.g. Google">
                <p v-if="experienceErrors.company" class="form-error">{{ experienceErrors.company }}</p>
              </div>
              <div class="form-group">
                <label class="text-xs font-medium text-muted-foreground">Position *</label>
                <input v-model="newExperience.position" type="text" class="input input-sm text-xs" placeholder="e.g. Senior Software Engineer">
                <p v-if="experienceErrors.position" class="form-error">{{ experienceErrors.position }}</p>
              </div>
              <div class="form-group">
                <label class="text-xs font-medium text-muted-foreground">Employment Type</label>
                <input v-model="newExperience.employment_type" type="text" class="input input-sm text-xs" placeholder="e.g. full_time">
              </div>
              <div class="form-group">
                <label class="text-xs font-medium text-muted-foreground">Start Date</label>
                <input v-model="newExperience.start_date" type="date" class="input input-sm text-xs">
              </div>
              <div class="form-group">
                <label class="text-xs font-medium text-muted-foreground">End Date</label>
                <input v-model="newExperience.end_date" type="date" class="input input-sm text-xs" :disabled="newExperience.currently_working">
              </div>
              <div class="form-group !justify-end">
                <label class="flex items-center gap-2 pt-5">
                  <input v-model="newExperience.currently_working" type="checkbox" class="size-3.5 rounded border-surface-300">
                  <span class="text-xs text-surface-700">Currently working here</span>
                </label>
              </div>
              <div class="form-group sm:col-span-2">
                <label class="text-xs font-medium text-muted-foreground">Description</label>
                <textarea v-model="newExperience.description" class="input input-sm min-h-16 resize-y text-xs" rows="2" placeholder="Brief description of your role…" />
              </div>
              <div class="sm:col-span-2">
                <button type="button" class="btn btn-primary btn-sm gap-1.5" :disabled="addingExperience" @click="addExperience">
                  <Icon v-if="addingExperience" name="lucide:loader-circle" class="size-3 animate-spin" />
                  <Icon v-else name="lucide:plus" class="size-3" />
                  Add Experience
                </button>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- ========================== -->
    <!-- 4. Education               -->
    <!-- ========================== -->
    <div class="card mb-6">
      <div class="card-header">
        <div class="flex items-center gap-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600">
            <Icon name="lucide:graduation-cap" class="size-5" />
          </div>
          <div>
            <h2 class="card-title text-base">Education</h2>
            <p class="card-description text-xs">Add your academic qualifications.</p>
          </div>
        </div>
      </div>
      <div class="card-content space-y-4">
        <div v-if="educationLoading" class="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon name="lucide:loader-circle" class="size-4 animate-spin" />
          Loading education…
        </div>

        <template v-else>
          <div v-if="educationList.length > 0" class="space-y-2">
            <div
              v-for="edu in educationList"
              :key="edu.id"
              class="flex items-start justify-between gap-4 rounded-md border border-border bg-surface-50 p-3"
            >
              <div class="min-w-0">
                <p class="text-sm font-semibold text-surface-900">{{ edu.qualification }}</p>
                <p class="text-sm text-surface-700">{{ edu.institution }}</p>
                <p class="text-xs text-muted-foreground">
                  <template v-if="edu.start_date || edu.end_date">
                    {{ fmtDateShort(edu.start_date) }} — {{ fmtDateShort(edu.end_date) }}
                  </template>
                  <span v-if="edu.field_of_study" class="ml-2">· {{ edu.field_of_study }}</span>
                  <span v-if="edu.grade" class="ml-2">· {{ edu.grade }}</span>
                </p>
              </div>
              <button
                type="button"
                class="btn btn-ghost btn-icon-sm shrink-0 text-muted-foreground hover:text-danger"
                @click="removeEducation(edu.id)"
              >
                <Icon name="lucide:trash-2" class="size-3.5" />
              </button>
            </div>
          </div>
          <p v-else class="text-sm text-muted-foreground">No education added yet.</p>

          <!-- Add education form -->
          <div class="rounded-md border border-dashed border-border bg-surface-50/50 p-4">
            <p class="mb-3 text-xs font-medium text-surface-700">Add education</p>
            <p v-if="educationErrors.general" class="form-error mb-3">{{ educationErrors.general }}</p>
            <div class="grid gap-3 sm:grid-cols-2">
              <div class="form-group">
                <label class="text-xs font-medium text-muted-foreground">Institution *</label>
                <input v-model="newEducation.institution" type="text" class="input input-sm text-xs" placeholder="e.g. Stanford University">
                <p v-if="educationErrors.institution" class="form-error">{{ educationErrors.institution }}</p>
              </div>
              <div class="form-group">
                <label class="text-xs font-medium text-muted-foreground">Qualification *</label>
                <input v-model="newEducation.qualification" type="text" class="input input-sm text-xs" placeholder="e.g. Bachelor of Science">
                <p v-if="educationErrors.qualification" class="form-error">{{ educationErrors.qualification }}</p>
              </div>
              <div class="form-group">
                <label class="text-xs font-medium text-muted-foreground">Field of Study</label>
                <input v-model="newEducation.field_of_study" type="text" class="input input-sm text-xs" placeholder="e.g. Computer Science">
              </div>
              <div class="form-group">
                <label class="text-xs font-medium text-muted-foreground">Grade</label>
                <input v-model="newEducation.grade" type="text" class="input input-sm text-xs" placeholder="e.g. 3.8 GPA">
              </div>
              <div class="form-group">
                <label class="text-xs font-medium text-muted-foreground">Start Date</label>
                <input v-model="newEducation.start_date" type="date" class="input input-sm text-xs">
              </div>
              <div class="form-group">
                <label class="text-xs font-medium text-muted-foreground">End Date</label>
                <input v-model="newEducation.end_date" type="date" class="input input-sm text-xs">
              </div>
              <div class="sm:col-span-2">
                <button type="button" class="btn btn-primary btn-sm gap-1.5" :disabled="addingEducation" @click="addEducation">
                  <Icon v-if="addingEducation" name="lucide:loader-circle" class="size-3 animate-spin" />
                  <Icon v-else name="lucide:plus" class="size-3" />
                  Add Education
                </button>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- ========================== -->
    <!-- 5. Languages               -->
    <!-- ========================== -->
    <div class="card mb-6">
      <div class="card-header">
        <div class="flex items-center gap-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
            <Icon name="lucide:languages" class="size-5" />
          </div>
          <div>
            <h2 class="card-title text-base">Languages</h2>
            <p class="card-description text-xs">Add languages you speak (checked if job posts list required languages).</p>
          </div>
        </div>
      </div>
      <div class="card-content space-y-4">
        <div v-if="languagesLoading" class="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon name="lucide:loader-circle" class="size-4 animate-spin" />
          Loading languages…
        </div>

        <template v-else>
          <div v-if="userLanguagesList.length > 0" class="space-y-2">
            <div
              v-for="lang in userLanguagesList"
              :key="lang.id"
              class="flex items-center justify-between rounded-md border border-border bg-surface-50 p-3"
            >
              <div class="flex items-center gap-3">
                <span class="text-sm font-semibold text-surface-900">
                  {{ lang.language?.name ?? `Language #${lang.language_id}` }}
                </span>
                <span class="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-700">
                  {{ lang.proficiency }}
                </span>
              </div>
              <button
                type="button"
                class="btn btn-ghost btn-icon-sm text-muted-foreground hover:text-danger"
                @click="removeLanguage(lang.id)"
              >
                <Icon name="lucide:trash-2" class="size-3.5" />
              </button>
            </div>
          </div>
          <p v-else class="text-sm text-muted-foreground">No languages added yet.</p>

          <!-- Add language form -->
          <div v-if="availableLanguages.length > 0" class="rounded-md border border-dashed border-border bg-surface-50/50 p-4">
            <p v-if="languageErrors.general" class="form-error mb-3">{{ languageErrors.general }}</p>
            <div class="flex flex-wrap items-end gap-3">
              <div class="form-group w-52">
                <label class="text-xs font-medium text-muted-foreground">Language</label>
                <select v-model.number="newLanguage.language_id" class="input input-sm text-xs">
                  <option :value="0" disabled>Select language…</option>
                  <option v-for="rl in availableLanguages" :key="rl.id" :value="rl.id">{{ rl.name }}</option>
                </select>
              </div>
              <div class="form-group w-36">
                <label class="text-xs font-medium text-muted-foreground">Proficiency</label>
                <select v-model="newLanguage.proficiency" class="input input-sm text-xs">
                  <option v-for="prof in proficiencyOptions" :key="prof" :value="prof">{{ prof }}</option>
                </select>
              </div>
              <button type="button" class="btn btn-primary btn-sm gap-1.5" :disabled="addingLanguage || !newLanguage.language_id" @click="addLanguage">
                <Icon v-if="addingLanguage" name="lucide:loader-circle" class="size-3 animate-spin" />
                <Icon v-else name="lucide:plus" class="size-3" />
                Add
              </button>
            </div>
          </div>
          <p v-else class="text-xs text-muted-foreground">All available languages have been added.</p>
        </template>
      </div>
    </div>

    <!-- ========================== -->
    <!-- Bottom actions             -->
    <!-- ========================== -->
    <div class="flex items-center justify-between py-4">
      <button type="button" class="btn btn-ghost text-sm" @click="router.push('/dashboard/profile')">
        <Icon name="lucide:arrow-left" class="size-4" />
        Back to Profile
      </button>
    </div>
  </div>
</template>
