<script setup lang="ts">
import { api } from '~/services/api'
import type { Job } from '~/services/api'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useSeoMeta({
  title: 'Analyze Job — Job Eligibility Checker',
})

const { $toast } = useNuxtApp()

/** Analysis input mode */
type InputMode = 'url' | 'description'
const mode = ref<InputMode>('description')

/** Form state */
const jobUrl = ref('')
const jobDescription = ref('')
const jobTitle = ref('')
const company = ref('')
const loading = ref(false)
const errors = ref<Record<string, string>>({})

/** Analysis result */
const result = ref<Job | null>(null)

/** Validate form before submitting */
function validate(): boolean {
  errors.value = {}

  if (mode.value === 'url') {
    if (!jobUrl.value.trim()) {
      errors.value.jobUrl = 'Please enter a job URL'
      return false
    }
    if (!/^https?:\/\/.+/.test(jobUrl.value)) {
      errors.value.jobUrl = 'Enter a valid URL starting with http:// or https://'
      return false
    }
  } else {
    const desc = jobDescription.value.trim()
    if (!desc) {
      errors.value.jobDescription = 'Please paste a job description'
      return false
    }
    if (desc.length < 50) {
      errors.value.jobDescription = `Description is too short (${desc.length} chars). Need at least 50 characters.`
      return false
    }
  }

  return true
}

/** Watch the description and try to extract title / company from the first line */
watch(jobDescription, (text) => {
  if (jobTitle.value || !text) return
  const lines = text.split('\n')
  const firstLine = lines[0]?.trim() ?? ''
  if (!firstLine) return
  // Patterns like "Senior Dev at TechCorp" or "Senior Dev - TechCorp"
  const match = firstLine.match(/^(.+?)\s+(?:at|@|[-–—])\s+(.+)$/i)
  if (match && match[1] && match[2]) {
    jobTitle.value = match[1].trim()
    company.value = match[2].trim()
  } else if (firstLine.length < 60) {
    jobTitle.value = firstLine
  }
})

/** Submit the job for analysis.
 *  Description flow: create company (if needed) → create job → trigger analyze → fetch results
 *  URL flow        : import via URL → trigger analyze → fetch results */
async function handleAnalyze() {
  console.log('[Analyze] button clicked')

  if (!validate()) {
    console.log('[Analyze] validation failed', errors.value)
    return
  }

  loading.value = true
  result.value = null

  try {
    let jobId: number

    if (mode.value === 'url') {
      console.log('[Analyze] importing from URL:', jobUrl.value.trim())
      // Step 1: Import job from URL (backend auto-extracts title / description)
      const { data: importData } = await api.jobs.import({ url: jobUrl.value.trim() })
      jobId = importData.data.id
      console.log('[Analyze] imported job id:', jobId)
    } else {
      // Step 0: Resolve company name → company_id (backend requires this)
      const companyName = company.value.trim() || 'Unspecified'
      console.log('[Analyze] resolving company:', companyName)
      // Try to find an existing company by name
      const { data: listData } = await api.companies.list({ name: companyName, per_page: 1 })
      const existingCompany = listData.data[0]
      let companyId: number
      if (existingCompany) {
        companyId = existingCompany.id
        console.log('[Analyze] found existing company id:', companyId)
      } else {
        // Create a new company
        console.log('[Analyze] creating new company:', companyName)
        const { data: createCompanyData } = await api.companies.create({ name: companyName })
        companyId = createCompanyData.data.id
        console.log('[Analyze] created company id:', companyId)
      }

      // Step 1: Create job with backend field names
      const payload: Record<string, string | number> = {
        title: jobTitle.value.trim() || 'Untitled Job',
        job_description: jobDescription.value.trim(),
      }
      if (companyId) payload.company_id = companyId

      console.log('[Analyze] creating job with payload:', payload)
      const { data: createData } = await api.jobs.create(payload as never)
      jobId = createData.data.id
      console.log('[Analyze] created job id:', jobId)
    }

    // Step 2: Trigger AI analysis
    console.log('[Analyze] triggering analysis for job', jobId)
    await api.jobs.analyze(jobId)

    // Step 3: Fetch the updated job with analysis results
    console.log('[Analyze] fetching results...')
    const { data: jobData } = await api.jobs.get(jobId)
    result.value = jobData.data
    console.log('[Analyze] got result:', result.value)

    $toast.success('Analysis complete!')
  } catch (error: unknown) {
    console.error('[Analyze] error:', error)

    const { isValidationError, getValidationErrors, getErrorMessage } =
      await import('~/utils/error-handler')

    const axiosError = error as { response?: { status: number } }

    // On 422, map server field errors to form fields so the user sees exactly
    // which inputs failed validation (e.g. "The job description field is required.").
    if (isValidationError(axiosError as never)) {
      errors.value = getValidationErrors(axiosError as never)
      console.log('[Analyze] 422 validation errors:', errors.value)
    } else {
      errors.value.general = getErrorMessage(error)
    }
  } finally {
    loading.value = false
  }
}

/** Reset the form to analyze another job */
function handleReset() {
  result.value = null
  jobUrl.value = ''
  jobDescription.value = ''
  jobTitle.value = ''
  company.value = ''
  errors.value = {}
}

/** Get score color based on eligibility percentage */
function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-500'
  if (score >= 60) return 'text-amber-500'
  if (score >= 40) return 'text-orange-500'
  return 'text-danger'
}

/** Get score background color */
function getScoreBg(score: number): string {
  if (score >= 80) return 'bg-emerald-500'
  if (score >= 60) return 'bg-amber-500'
  if (score >= 40) return 'bg-orange-500'
  return 'bg-danger'
}

/** Get score label */
function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent Match'
  if (score >= 60) return 'Good Match'
  if (score >= 40) return 'Fair Match'
  return 'Low Match'
}

/** Example job descriptions for inspiration */
interface ExampleJob {
  title: string
  company: string
  snippet: string
}

const examples: ExampleJob[] = [
  {
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    snippet: 'We are looking for an experienced Frontend Developer with 5+ years of experience in Vue.js, TypeScript, and Tailwind CSS...',
  },
  {
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    snippet: 'Join our growing team as a Full Stack Engineer. You will work with React, Node.js, PostgreSQL, and AWS...',
  },
]

/** Fill an example into the form */
function useExample(index: number) {
  const ex = examples[index]
  if (!ex) return
  jobTitle.value = ex.title
  company.value = ex.company
  jobDescription.value = `${ex.title} at ${ex.company}\n\n${ex.snippet}\n\nRequirements:\n- 5+ years of relevant experience\n- Strong knowledge of modern JavaScript frameworks\n- Experience with REST APIs and GraphQL\n- Familiarity with CI/CD pipelines\n- Excellent problem-solving skills`
  mode.value = 'description'
  errors.value = {}
}

/** Animated loading messages */
const loadingMessages = [
  'Reading job description...',
  'Analyzing required skills...',
  'Comparing with your profile...',
  'Generating recommendations...',
]
const loadingMessageIndex = ref(0)

let loadingInterval: ReturnType<typeof setInterval> | null = null

watch(loading, (isLoading) => {
  if (isLoading) {
    loadingMessageIndex.value = 0
    loadingInterval = setInterval(() => {
      loadingMessageIndex.value = (loadingMessageIndex.value + 1) % loadingMessages.length
    }, 2000)
  } else {
    if (loadingInterval) {
      clearInterval(loadingInterval)
      loadingInterval = null
    }
  }
})

onUnmounted(() => {
  if (loadingInterval) clearInterval(loadingInterval)
})
</script>

<template>
  <div>
    <!-- ========================================== -->
    <!-- Hero Banner                                -->
    <!-- ========================================== -->
    <div
      class="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-primary-100/70 via-primary-50/40 to-bright-snow p-8"
    >
      <!-- Decorative elements -->
      <div class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      <div class="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

      <div class="relative flex items-center gap-5">
        <div
          class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm"
        >
          <Icon name="lucide:scan-search" class="size-8" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-surface-900">
            Analyze Job Eligibility
          </h1>
          <p class="mt-1 max-w-lg text-sm text-muted-foreground">
            Paste any job description or URL and our AI will instantly compare it against your
            profile — showing your match score, skill gaps, and personalized recommendations.
          </p>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- Loading State                              -->
    <!-- ========================================== -->
    <div
      v-if="loading"
      class="flex flex-col items-center justify-center rounded-2xl border border-border bg-bright-snow py-20"
    >
      <div class="relative mb-6">
        <div class="h-16 w-16 animate-spin rounded-full border-4 border-surface-200 border-t-primary" />
        <div class="absolute inset-0 flex items-center justify-center">
          <Icon name="lucide:loader-circle" class="size-5 text-primary" />
        </div>
      </div>
      <p class="text-lg font-semibold text-surface-900">Analyzing...</p>
      <p class="mt-2 text-sm text-muted-foreground transition-opacity duration-500">
        {{ loadingMessages[loadingMessageIndex] }}
      </p>
    </div>

    <!-- ========================================== -->
    <!-- Results State                              -->
    <!-- ========================================== -->
    <div v-else-if="result" class="space-y-6">
      <!-- Top action bar -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-bold text-surface-900">Analysis Results</h2>
          <p class="text-sm text-muted-foreground">
            {{ result.title || 'Job Analysis' }}
            <span v-if="result.company"> at {{ result.company.name }}</span>
          </p>
        </div>
        <button
          type="button"
          class="btn btn-outline btn-sm gap-2"
          @click="handleReset"
        >
          <Icon name="lucide:plus" class="size-3.5" />
          Analyze Another
        </button>
      </div>

      <!-- Score Card -->
      <div class="card overflow-hidden">
        <div class="card-content flex flex-col items-center gap-6 py-8 sm:flex-row sm:gap-10">
          <!-- Circular score indicator -->
          <div class="relative flex h-36 w-36 shrink-0 items-center justify-center">
            <svg class="h-full w-full -rotate-90" viewBox="0 0 100 100">
              <!-- Background circle -->
              <circle
                cx="50" cy="50" r="42" fill="none" stroke="currentColor" stroke-width="8"
                class="text-surface-200"
              />
              <!-- Progress circle -->
              <circle
                cx="50" cy="50" r="42" fill="none" stroke="currentColor" stroke-width="8"
                stroke-linecap="round"
                stroke-dasharray="264"
                :stroke-dashoffset="264 - (264 * (result.eligibility_score ?? 0)) / 100"
                class="transition-all duration-1000 ease-out"
                :class="getScoreColor(result.eligibility_score ?? 0)"
              />
            </svg>
            <div class="absolute flex flex-col items-center">
              <span class="text-3xl font-bold" :class="getScoreColor(result.eligibility_score ?? 0)">
                {{ result.eligibility_score ?? 0 }}%
              </span>
              <span class="text-xs font-medium text-muted-foreground">
                {{ getScoreLabel(result.eligibility_score ?? 0) }}
              </span>
            </div>
          </div>

          <!-- Score breakdown text -->
          <div class="flex-1 text-center sm:text-left">
            <h3 class="text-lg font-semibold text-surface-900">
              {{ getScoreLabel(result.eligibility_score ?? 0) }}
            </h3>
            <p class="mt-1 text-sm text-muted-foreground">
              Based on your profile, you
              <span v-if="(result.eligibility_score ?? 0) >= 60" class="font-medium text-emerald-600">
                are well positioned
              </span>
              <span v-else-if="(result.eligibility_score ?? 0) >= 40" class="font-medium text-amber-600">
                meet some requirements
              </span>
              <span v-else class="font-medium text-danger">
                have significant skill gaps
              </span>
              for this role.
            </p>

            <!-- Mini stats -->
            <div class="mt-4 flex flex-wrap justify-center gap-3 sm:justify-start">
              <div class="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                <Icon name="lucide:check-circle" class="size-3.5" />
                {{ result.matched_skills.length }} skills matched
              </div>
              <div class="flex items-center gap-1.5 rounded-full bg-danger/10 px-3 py-1 text-xs font-medium text-danger">
                <Icon name="lucide:alert-circle" class="size-3.5" />
                {{ result.missing_skills.length }} skills missing
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Skills Grid -->
      <div class="grid gap-6 lg:grid-cols-2">
        <!-- Matched Skills -->
        <div class="card">
          <div class="card-header pb-3">
            <div class="flex items-center gap-2">
              <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                <Icon name="lucide:check-circle" class="size-4" />
              </div>
              <h3 class="card-title text-base">Matched Skills</h3>
              <span class="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
                {{ result.matched_skills.length }}
              </span>
            </div>
          </div>
          <div class="card-content">
            <div v-if="result.matched_skills.length" class="flex flex-wrap gap-2">
              <span
                v-for="skill in result.matched_skills"
                :key="skill.id"
                class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200"
              >
                <Icon name="lucide:check" class="size-3" />
                {{ skill.name }}
              </span>
            </div>
            <p v-else class="text-sm italic text-muted-foreground">
              No direct skill matches found. Consider updating your profile.
            </p>
          </div>
        </div>

        <!-- Missing Skills -->
        <div class="card">
          <div class="card-header pb-3">
            <div class="flex items-center gap-2">
              <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-danger/10 text-danger">
                <Icon name="lucide:alert-circle" class="size-4" />
              </div>
              <h3 class="card-title text-base">Missing Skills</h3>
              <span class="ml-auto rounded-full bg-danger/10 px-2 py-0.5 text-xs font-bold text-danger">
                {{ result.missing_skills.length }}
              </span>
            </div>
          </div>
          <div class="card-content">
            <div v-if="result.missing_skills.length" class="flex flex-wrap gap-2">
              <span
                v-for="skill in result.missing_skills"
                :key="skill.id"
                class="inline-flex items-center gap-1 rounded-full bg-danger/5 px-3 py-1 text-xs font-medium text-danger ring-1 ring-danger/20"
              >
                <Icon name="lucide:plus" class="size-3" />
                {{ skill.name }}
              </span>
            </div>
            <p v-else class="text-sm italic text-muted-foreground">
              Great news — no missing skills detected!
            </p>
          </div>
        </div>
      </div>

      <!-- Recommendations -->
      <div v-if="result.recommendations.length" class="card">
        <div class="card-header pb-3">
          <div class="flex items-center gap-2">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon name="lucide:lightbulb" class="size-4" />
            </div>
            <h3 class="card-title text-base">Recommendations</h3>
          </div>
        </div>
        <div class="card-content">
          <ul class="space-y-3">
            <li
              v-for="(rec, i) in result.recommendations"
              :key="i"
              class="flex items-start gap-3 rounded-lg border border-border bg-bright-snow p-4 text-sm"
            >
              <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {{ i + 1 }}
              </div>
              <p class="text-surface-700">{{ rec }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- Input Form                                 -->
    <!-- ========================================== -->
    <div v-else class="space-y-6">
      <!-- Mode toggle -->
      <div class="inline-flex rounded-lg border border-border bg-bright-snow p-1">
        <button
          type="button"
          class="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors"
          :class="mode === 'description'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-surface-700'"
          @click="mode = 'description'"
        >
          <Icon name="lucide:file-text" class="size-4" />
          Paste Description
        </button>
        <button
          type="button"
          class="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors"
          :class="mode === 'url'
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-surface-700'"
          @click="mode = 'url'"
        >
          <Icon name="lucide:link" class="size-4" />
          Job URL
        </button>
      </div>

      <!-- Error banner -->
      <div
        v-if="errors.general"
        class="flex items-start gap-3 rounded-lg border border-danger/20 bg-danger/10 p-4 text-sm text-danger"
      >
        <Icon name="lucide:alert-circle" class="mt-0.5 size-4 shrink-0" />
        <span>{{ errors.general }}</span>
      </div>

      <!-- URL Input -->
      <form v-if="mode === 'url'" class="card" @submit.prevent="handleAnalyze">
        <div class="card-header">
          <h2 class="card-title text-base">Job URL</h2>
          <p class="card-description text-xs">
            Paste a link to a job posting (LinkedIn, Indeed, company careers page, etc.)
          </p>
        </div>
        <div class="card-content space-y-5">
          <!-- Primary input: URL at the top -->
          <div class="form-group">
            <label for="job-url" class="label">URL</label>
            <div class="relative">
              <input
                id="job-url"
                v-model="jobUrl"
                type="url"
                class="input pl-10"
                :class="{ 'input-error': errors.jobUrl }"
                placeholder="https://linkedin.com/jobs/view/..."
              >
              <Icon name="lucide:link" class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            <p v-if="errors.jobUrl" class="form-error">{{ errors.jobUrl }}</p>
            <p class="form-hint">The backend will auto-extract the title and description.</p>
          </div>

          <!-- Optional overrides: title / company below -->
          <div class="rounded-lg border border-border/60 bg-surface-50/50 p-4">
            <p class="mb-3 text-xs font-medium text-muted-foreground">Optional overrides</p>
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="form-group">
                <label for="url-job-title" class="label text-xs">Job Title</label>
                <input
                  id="url-job-title"
                  v-model="jobTitle"
                  type="text"
                  class="input input-sm"
                  placeholder="Override auto-detected title"
                >
              </div>
              <div class="form-group">
                <label for="url-company" class="label text-xs">Company</label>
                <input
                  id="url-company"
                  v-model="company"
                  type="text"
                  class="input input-sm"
                  placeholder="Override auto-detected company"
                >
              </div>
            </div>
          </div>

          <button
            type="submit"
            class="btn btn-primary w-full gap-2 shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/30"
            :disabled="loading"
          >
            <Icon v-if="loading" name="lucide:loader-circle" class="size-4 animate-spin" />
            <Icon v-else name="lucide:scan-search" class="size-4" />
            <span>Analyze Job</span>
          </button>
        </div>
      </form>

      <!-- Description Input -->
      <form v-else class="card" @submit.prevent="handleAnalyze">
        <div class="card-header">
          <h2 class="card-title text-base">Job Description</h2>
          <p class="card-description text-xs">
            Copy and paste the full job description for the most accurate analysis.
          </p>
        </div>
        <div class="card-content space-y-5">
          <!-- Primary input: big textarea at the top -->
          <div class="form-group">
            <label for="job-description" class="label">Description</label>
            <textarea
              id="job-description"
              v-model="jobDescription"
              class="input min-h-56 resize-y font-mono text-xs leading-relaxed"
              :class="{ 'input-error': errors.jobDescription }"
              placeholder="Paste the job description here..."
              rows="14"
            />
            <div class="flex items-center justify-between">
              <p v-if="errors.jobDescription" class="form-error">{{ errors.jobDescription }}</p>
              <p v-else class="form-hint">
                {{ jobDescription.trim().length }} characters
                <span v-if="jobDescription.trim().length > 0 && jobDescription.trim().length < 50" class="text-danger">
                  (minimum 50)
                </span>
              </p>
            </div>
          </div>

          <!-- Optional details: title / company below -->
          <div class="rounded-lg border border-border/60 bg-surface-50/50 p-4">
            <p class="mb-3 text-xs font-medium text-muted-foreground">
              Optional details — auto-detected from description
            </p>
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="form-group">
                <label for="desc-job-title" class="label text-xs">Job Title</label>
                <input
                  id="desc-job-title"
                  v-model="jobTitle"
                  type="text"
                  class="input input-sm"
                  placeholder="e.g. Senior Frontend Developer"
                >
              </div>
              <div class="form-group">
                <label for="desc-company" class="label text-xs">Company</label>
                <input
                  id="desc-company"
                  v-model="company"
                  type="text"
                  class="input input-sm"
                  placeholder="e.g. TechCorp"
                >
              </div>
            </div>
          </div>

          <button
            type="submit"
            class="btn btn-primary w-full gap-2 shadow-sm shadow-primary/20 hover:shadow-md hover:shadow-primary/30"
            :disabled="loading"
          >
            <Icon v-if="loading" name="lucide:loader-circle" class="size-4 animate-spin" />
            <Icon v-else name="lucide:scan-search" class="size-4" />
            <span>Analyze Job</span>
          </button>
        </div>
      </form>

      <!-- Quick Examples -->
      <div class="card">
        <div class="card-header pb-3">
          <div class="flex items-center gap-2">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
              <Icon name="lucide:zap" class="size-4" />
            </div>
            <h3 class="card-title text-base">Quick Examples</h3>
          </div>
          <p class="card-description text-xs">Click an example to pre-fill the form.</p>
        </div>
        <div class="card-content grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            class="group flex flex-col gap-2 rounded-lg border border-border bg-bright-snow p-4 text-left transition-colors hover:border-primary/30 hover:bg-primary/5"
            @click="useExample(0)"
          >
            <div class="flex items-center gap-2">
              <Icon name="lucide:file-text" class="size-4 text-muted-foreground group-hover:text-primary" />
              <span class="text-sm font-semibold text-surface-900">Senior Frontend Developer</span>
            </div>
            <p class="text-xs text-muted-foreground line-clamp-2">
              We are looking for an experienced Frontend Developer with 5+ years of experience in Vue.js, TypeScript, and Tailwind CSS...
            </p>
            <div class="mt-1 flex items-center gap-1 text-xs font-medium text-primary">
              <span>Use example</span>
              <Icon name="lucide:arrow-right" class="size-3" />
            </div>
          </button>

          <button
            type="button"
            class="group flex flex-col gap-2 rounded-lg border border-border bg-bright-snow p-4 text-left transition-colors hover:border-primary/30 hover:bg-primary/5"
            @click="useExample(1)"
          >
            <div class="flex items-center gap-2">
              <Icon name="lucide:file-text" class="size-4 text-muted-foreground group-hover:text-primary" />
              <span class="text-sm font-semibold text-surface-900">Full Stack Engineer</span>
            </div>
            <p class="text-xs text-muted-foreground line-clamp-2">
              Join our growing team as a Full Stack Engineer. You will work with React, Node.js, PostgreSQL, and AWS...
            </p>
            <div class="mt-1 flex items-center gap-1 text-xs font-medium text-primary">
              <span>Use example</span>
              <Icon name="lucide:arrow-right" class="size-3" />
            </div>
          </button>
        </div>
      </div>

      <!-- Tips -->
      <div class="grid gap-4 sm:grid-cols-3">
        <div class="flex items-start gap-3 rounded-lg border border-border bg-bright-snow p-4">
          <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Icon name="lucide:file-text" class="size-4 text-primary" />
          </div>
          <div>
            <p class="text-sm font-medium text-surface-900">Full Description</p>
            <p class="text-xs text-muted-foreground">Paste the complete job post for the best results.</p>
          </div>
        </div>

        <div class="flex items-start gap-3 rounded-lg border border-border bg-bright-snow p-4">
          <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/10">
            <Icon name="lucide:user-check" class="size-4 text-blue-500" />
          </div>
          <div>
            <p class="text-sm font-medium text-surface-900">Update Profile</p>
            <p class="text-xs text-muted-foreground">Keep your skills current for accurate matching.</p>
          </div>
        </div>

        <div class="flex items-start gap-3 rounded-lg border border-border bg-bright-snow p-4">
          <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
            <Icon name="lucide:history" class="size-4 text-emerald-500" />
          </div>
          <div>
            <p class="text-sm font-medium text-surface-900">Track History</p>
            <p class="text-xs text-muted-foreground">All your analyses are saved for future reference.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
