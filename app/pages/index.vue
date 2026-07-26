<template>
  <div class="overflow-x-hidden">
    <!-- Hero -->
    <section
      class="relative overflow-hidden bg-gradient-to-b from-surface-50 via-surface-50 to-white pb-24 pt-16 sm:pb-32 sm:pt-24"
    >
      <!-- Background patterns -->
      <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10">
        <div
          class="absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl"
        />
        <div
          class="absolute -bottom-40 left-0 h-[500px] w-[500px] rounded-full bg-secondary/5 blur-3xl"
        />
        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,75,78,0.03)_0%,transparent_70%)]"
        />
        <div
          class="absolute inset-0 opacity-[0.015]"
          style="
            background-image: radial-gradient(circle, #3e000c 1px, transparent 1px);
            background-size: 24px 24px;
          "
        />
      </div>

      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <!-- Left content -->
          <div class="max-w-2xl">
            <div
              class="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary"
            >
              <span class="relative flex h-2 w-2">
                <span
                  class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"
                />
                <span class="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              AI-Powered Job Analysis
            </div>

            <h1 class="text-4xl font-bold tracking-tight text-surface-900 sm:text-5xl lg:text-6xl">
              Know your
              <span class="relative inline-block">
                <span
                  class="relative z-10 bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent"
                  >fit</span
                >
                <svg
                  class="absolute -bottom-1 left-0 h-3 w-full text-primary/20 sm:h-4"
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M0 6 Q 50 12, 100 6 T 200 6"
                    stroke="currentColor"
                    stroke-width="4"
                    fill="none"
                    class="text-primary/30"
                  />
                </svg>
              </span>
              before you apply
            </h1>

            <p class="mt-6 text-lg leading-relaxed text-surface-600 sm:text-xl">
              Stop guessing whether you qualify. Paste any job description and get an instant,
              AI-powered eligibility report with a detailed breakdown of matches, gaps, and
              recommendations.
            </p>

            <div class="mt-8 flex flex-col gap-4 sm:flex-row">
              <NuxtLink
                to="/auth/register"
                class="btn btn-primary btn-lg group relative overflow-hidden"
              >
                <span class="relative z-10 flex items-center gap-2">
                  Start Analyzing Free
                  <Icon
                    name="lucide:arrow-right"
                    class="size-5 transition-transform group-hover:translate-x-1"
                  />
                </span>
                <div
                  class="absolute inset-0 -z-0 bg-gradient-to-r from-primary-500 to-primary-400 opacity-0 transition-opacity group-hover:opacity-100"
                />
              </NuxtLink>
              <a href="#how-it-works" class="btn btn-outline btn-lg">
                <Icon name="lucide:play-circle" class="size-5" />
                See How It Works
              </a>
            </div>

            <div class="mt-10 flex flex-wrap items-center gap-6 sm:gap-8">
              <div class="flex -space-x-3">
                <div
                  v-for="i in 4"
                  :key="i"
                  class="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-surface-200 text-xs font-medium text-surface-600"
                  :style="{ zIndex: 4 - i }"
                >
                  <Icon name="lucide:user" class="size-4" />
                </div>
              </div>
              <div>
                <div class="flex items-center gap-1">
                  <Icon
                    v-for="i in 5"
                    :key="i"
                    name="lucide:star"
                    class="size-4 fill-amber-400 text-amber-400"
                  />
                  <span class="ml-1 text-sm font-semibold text-surface-900">4.9</span>
                </div>
                <p class="text-xs text-surface-500">from 2,000+ job seekers</p>
              </div>
            </div>
          </div>

          <!-- Right visual -->
          <div class="relative hidden lg:block">
            <div class="relative mx-auto w-full max-w-lg">
              <!-- Dashboard mockup -->
              <div
                class="relative rounded-2xl border border-border/60 bg-white shadow-xl shadow-surface-900/5"
              >
                <!-- Mock header -->
                <div class="flex items-center gap-2 border-b border-border/60 px-4 py-3">
                  <div class="flex gap-1.5">
                    <div class="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <div class="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <div class="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <span class="ml-2 text-[10px] font-medium text-surface-400"
                    >Eligibility Report</span
                  >
                </div>
                <!-- Mock content -->
                <div class="space-y-4 p-5">
                  <!-- Score ring -->
                  <div class="flex items-center gap-4">
                    <div class="relative flex h-20 w-20 items-center justify-center">
                      <svg
                        class="absolute inset-0 h-full w-full -rotate-90"
                        viewBox="0 0 80 80"
                        aria-hidden="true"
                      >
                        <circle
                          cx="40"
                          cy="40"
                          r="34"
                          fill="none"
                          stroke="#e2e8f0"
                          stroke-width="6"
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r="34"
                          fill="none"
                          stroke="#fb4b4e"
                          stroke-width="6"
                          stroke-linecap="round"
                          stroke-dasharray="213.6"
                          stroke-dashoffset="46"
                          class="transition-all duration-1000"
                        />
                      </svg>
                      <span class="relative text-xl font-bold text-surface-900"
                        >78<small class="text-xs text-surface-500">%</small></span
                      >
                    </div>
                    <div>
                      <p class="font-semibold text-surface-900">Senior Backend Dev</p>
                      <p class="text-xs text-surface-500">at TechCorp Inc.</p>
                      <span
                        class="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700"
                      >
                        <Icon name="lucide:check-circle" class="size-3" /> Strong Match
                      </span>
                    </div>
                  </div>

                  <!-- Skill bars -->
                  <div class="space-y-3">
                    <div v-for="skill in skills" :key="skill.name">
                      <div class="mb-1 flex justify-between text-[11px]">
                        <span class="font-medium text-surface-700">{{ skill.name }}</span>
                        <span :class="skill.match ? 'text-emerald-600' : 'text-red-500'">{{
                          skill.match ? 'Matched' : 'Missing'
                        }}</span>
                      </div>
                      <div class="h-1.5 overflow-hidden rounded-full bg-surface-100">
                        <div
                          class="h-full rounded-full transition-all duration-700"
                          :class="skill.match ? 'bg-emerald-400' : 'bg-red-300'"
                          :style="{ width: `${skill.value}%` }"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Recommendations -->
                  <div class="rounded-xl bg-amber-50 p-3">
                    <p class="text-[11px] font-semibold text-amber-800">Recommendations</p>
                    <ul class="mt-1.5 space-y-1">
                      <li
                        v-for="rec in recommendations"
                        :key="rec"
                        class="flex items-start gap-1.5 text-[11px] text-amber-700"
                      >
                        <Icon name="lucide:lightbulb" class="mt-0.5 size-3 shrink-0" /> {{ rec }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Floating elements -->
              <div
                class="absolute -right-4 -top-4 animate-float rounded-xl border border-border/60 bg-white p-3 shadow-lg"
              >
                <div class="flex items-center gap-2">
                  <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                    <Icon name="lucide:trending-up" class="size-4 text-emerald-600" />
                  </div>
                  <div>
                    <p class="text-[11px] font-semibold text-surface-900">85%</p>
                    <p class="text-[10px] text-surface-500">Avg. Accuracy</p>
                  </div>
                </div>
              </div>

              <div
                class="absolute -bottom-3 -left-3 animate-float-delayed rounded-xl border border-border/60 bg-white p-3 shadow-lg"
              >
                <div class="flex items-center gap-2">
                  <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Icon name="lucide:zap" class="size-4 text-primary" />
                  </div>
                  <div>
                    <p class="text-[11px] font-semibold text-surface-900">&lt; 30s</p>
                    <p class="text-[10px] text-surface-500">Per Analysis</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Bar -->
    <section class="relative -mt-12 pb-8 sm:pb-12">
      <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div
          class="grid grid-cols-2 gap-4 rounded-2xl border border-border/60 bg-white px-6 py-8 shadow-lg shadow-surface-900/5 sm:grid-cols-4 sm:gap-8 sm:px-10"
        >
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <p class="text-2xl font-bold text-surface-900 sm:text-3xl">{{ stat.value }}</p>
            <p class="mt-1 text-xs text-surface-500 sm:text-sm">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="py-20 sm:py-28">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <p class="text-sm font-semibold tracking-wide text-primary uppercase">Features</p>
          <h2 class="mt-3 text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl">
            Everything you need to
            <span
              class="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent"
              >job hunt smarter</span
            >
          </h2>
          <p class="mt-4 text-lg text-surface-600">
            Powerful tools that give you clarity before every application.
          </p>
        </div>

        <div class="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="group relative rounded-2xl border border-border/60 bg-white p-8 transition-shadow hover:shadow-lg hover:shadow-surface-900/5"
          >
            <div
              class="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-sm"
              :class="feature.gradient"
            >
              <Icon :name="feature.icon" class="size-6 text-white" />
            </div>
            <h3 class="text-lg font-semibold text-surface-900">{{ feature.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-surface-600">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section id="how-it-works" class="relative overflow-hidden bg-surface-100/50 py-20 sm:py-28">
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(251,75,78,0.04)_0%,transparent_50%)]"
      />
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <p class="text-sm font-semibold tracking-wide text-primary uppercase">How It Works</p>
          <h2 class="mt-3 text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl">
            From job post to
            <span
              class="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent"
              >insight</span
            >
            in minutes
          </h2>
        </div>

        <div class="mt-16">
          <!-- Desktop steps -->
          <div class="relative hidden lg:block">
            <!-- Connecting line -->
            <div
              class="absolute left-0 right-0 top-16 h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/60"
            />

            <div class="grid grid-cols-5 gap-6">
              <div v-for="(step, i) in steps" :key="i" class="relative text-center">
                <div
                  class="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-2xl border-2 shadow-lg transition-transform hover:scale-105"
                  :class="[step.color.border, step.color.bg]"
                >
                  <Icon :name="step.icon" class="size-10" :class="step.color.icon" />
                </div>
                <span
                  class="inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
                  :class="[step.color.badge]"
                  >{{ i + 1 }}</span
                >
                <h3 class="mt-3 font-semibold text-surface-900">{{ step.title }}</h3>
                <p class="mt-2 text-sm text-surface-500">{{ step.description }}</p>
              </div>
            </div>
          </div>

          <!-- Mobile steps -->
          <div class="space-y-8 lg:hidden">
            <div v-for="(step, i) in steps" :key="i" class="flex gap-4">
              <div class="flex shrink-0 flex-col items-center">
                <div
                  class="flex h-14 w-14 items-center justify-center rounded-xl border-2 shadow-md"
                  :class="[step.color.border, step.color.bg]"
                >
                  <Icon :name="step.icon" class="size-6" :class="step.color.icon" />
                </div>
                <div
                  v-if="i < steps.length - 1"
                  class="mt-2 h-full w-0.5 bg-gradient-to-b from-primary/30 to-primary/10"
                />
              </div>
              <div class="pb-8">
                <span
                  class="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
                  :class="[step.color.badge]"
                  >{{ i + 1 }}</span
                >
                <h3 class="mt-1 font-semibold text-surface-900">{{ step.title }}</h3>
                <p class="mt-1 text-sm text-surface-500">{{ step.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonial -->
    <section class="py-20 sm:py-28">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-3xl text-center">
          <div class="relative">
            <Icon name="lucide:quote" class="mx-auto size-10 text-primary/20" />
            <p class="mt-6 text-xl leading-relaxed font-medium text-surface-700 sm:text-2xl">
              "JEC completely changed my job search. Instead of blindly applying, I now know exactly
              where I stand and what skills to improve. Landed my dream role in 3 weeks."
            </p>
          </div>
          <div class="mt-8 flex items-center justify-center gap-4">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-300 to-primary-500 text-lg font-bold text-white"
            >
              SM
            </div>
            <div class="text-left">
              <p class="font-semibold text-surface-900">Sarah Mitchell</p>
              <p class="text-sm text-surface-500">Senior Frontend Engineer at Vercel</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section id="pricing" class="bg-surface-100/50 py-20 sm:py-28">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <p class="text-sm font-semibold tracking-wide text-primary uppercase">Pricing</p>
          <h2 class="mt-3 text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl">
            Start free,
            <span
              class="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent"
              >upgrade</span
            >
            when you're ready
          </h2>
        </div>

        <div class="mt-16 grid gap-8 lg:grid-cols-3">
          <div
            v-for="plan in plans"
            :key="plan.name"
            class="relative flex flex-col rounded-2xl border p-8 transition-shadow hover:shadow-lg"
            :class="
              plan.featured
                ? 'border-primary/40 bg-white shadow-xl shadow-primary/5 scale-[1.02]'
                : 'border-border/60 bg-white'
            "
          >
            <div
              v-if="plan.featured"
              class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-white"
            >
              Most Popular
            </div>
            <div>
              <h3 class="text-lg font-semibold text-surface-900">{{ plan.name }}</h3>
              <p class="mt-1 text-sm text-surface-500">{{ plan.description }}</p>
            </div>
            <div class="mt-6">
              <p class="flex items-baseline gap-1">
                <span class="text-4xl font-bold text-surface-900">{{ plan.price }}</span>
                <span v-if="plan.price !== 'Free'" class="text-surface-500">/mo</span>
              </p>
            </div>
            <ul class="mt-8 flex-1 space-y-3">
              <li
                v-for="feature in plan.features"
                :key="feature"
                class="flex items-start gap-2.5 text-sm text-surface-600"
              >
                <Icon name="lucide:check-circle" class="mt-0.5 size-4 shrink-0 text-emerald-500" />
                {{ feature }}
              </li>
            </ul>
            <NuxtLink
              :to="plan.ctaLink"
              class="btn mt-8 w-full"
              :class="plan.featured ? 'btn-primary btn-lg' : 'btn-outline btn-lg'"
            >
              {{ plan.cta }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="relative overflow-hidden py-20 sm:py-28">
      <div class="absolute inset-0 -z-10">
        <div
          class="absolute inset-0 bg-gradient-to-br from-dark-500 via-dark-600 to-secondary-800"
        />
        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(251,75,78,0.15)_0%,transparent_70%)]"
        />
        <div
          class="absolute inset-0 opacity-[0.03]"
          style="
            background-image: radial-gradient(circle, white 1px, transparent 1px);
            background-size: 32px 32px;
          "
        />
      </div>

      <div class="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Stop guessing. Start
          <span
            class="bg-gradient-to-r from-primary-300 to-primary-100 bg-clip-text text-transparent"
            >knowing</span
          >.
        </h2>
        <p class="mx-auto mt-4 max-w-xl text-lg text-surface-300">
          Join thousands of job seekers who analyze their fit before every application. Free to
          start, no credit card required.
        </p>
        <div class="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <NuxtLink
            to="/auth/register"
            class="btn btn-primary btn-lg group relative overflow-hidden shadow-lg shadow-primary/25"
          >
            <span class="relative z-10 flex items-center gap-2">
              Get Started Free
              <Icon
                name="lucide:arrow-right"
                class="size-5 transition-transform group-hover:translate-x-1"
              />
            </span>
          </NuxtLink>
          <a
            href="#features"
            class="btn btn-ghost btn-lg text-white/80 hover:text-white hover:bg-white/10"
          >
            <Icon name="lucide:sparkles" class="size-5" />
            Explore Features
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Job Eligibility Checker — Know Your Fit Before You Apply',
  description:
    'AI-powered job eligibility analysis. Paste any job description and get an instant report showing matches, gaps, and personalized recommendations.',
})

const stats = [
  { value: '50K+', label: 'Jobs Analyzed' },
  { value: '85%', label: 'Accuracy Rate' },
  { value: '< 30s', label: 'Per Analysis' },
  { value: '4.9', label: 'User Rating' },
]

const features = [
  {
    icon: 'lucide:scan-search',
    title: 'Smart Job Parsing',
    description:
      'Paste any job URL or description. Our AI extracts all requirements — skills, experience, education, and more — automatically.',
    gradient: 'from-primary-400 to-primary-600',
  },
  {
    icon: 'lucide:user-round-check',
    title: 'Profile Comparison',
    description:
      'Your skills, experience, and qualifications are matched against job requirements using intelligent matching algorithms.',
    gradient: 'from-emerald-400 to-emerald-600',
  },
  {
    icon: 'lucide:bar-chart-4',
    title: 'Eligibility Scoring',
    description:
      'Get a clear percentage score with a transparent breakdown. Understand exactly why you match — or where you fall short.',
    gradient: 'from-violet-400 to-violet-600',
  },
  {
    icon: 'lucide:lightbulb',
    title: 'Actionable Insights',
    description:
      'Receive personalized recommendations on skills to learn, certifications to pursue, and experience to gain for each role.',
    gradient: 'from-amber-400 to-amber-600',
  },
  {
    icon: 'lucide:history',
    title: 'Analysis History',
    description:
      'Every analysis is saved. Track your progress over time, compare results, and re-analyze jobs after updating your profile.',
    gradient: 'from-sky-400 to-sky-600',
  },
  {
    icon: 'lucide:shield-check',
    title: 'Privacy First',
    description:
      'Your profile and job analyses are private. We never share your data with employers or third parties. You are in control.',
    gradient: 'from-rose-400 to-rose-600',
  },
]

const steps = [
  {
    title: 'Create Profile',
    description: 'Build your professional profile with skills, experience, and education.',
    icon: 'lucide:user-round-plus',
    color: {
      border: 'border-primary/20',
      bg: 'bg-primary/5',
      icon: 'text-primary-500',
      badge: 'bg-primary text-white',
    },
  },
  {
    title: 'Paste Job',
    description: 'Submit any job URL or description for instant analysis.',
    icon: 'lucide:file-text',
    color: {
      border: 'border-sky/20',
      bg: 'bg-sky-50',
      icon: 'text-sky-500',
      badge: 'bg-sky-500 text-white',
    },
  },
  {
    title: 'AI Analysis',
    description: 'AI extracts requirements and compares them against your profile.',
    icon: 'lucide:brain-circuit',
    color: {
      border: 'border-violet/20',
      bg: 'bg-violet-50',
      icon: 'text-violet-500',
      badge: 'bg-violet-500 text-white',
    },
  },
  {
    title: 'Get Score',
    description: 'Receive a detailed eligibility score with match breakdown.',
    icon: 'lucide:target',
    color: {
      border: 'border-emerald/20',
      bg: 'bg-emerald-50',
      icon: 'text-emerald-500',
      badge: 'bg-emerald-500 text-white',
    },
  },
  {
    title: 'Improve & Apply',
    description: 'Follow recommendations to close gaps and land the job.',
    icon: 'lucide:rocket',
    color: {
      border: 'border-primary/20',
      bg: 'bg-primary/5',
      icon: 'text-primary-500',
      badge: 'bg-primary text-white',
    },
  },
]

const plans = [
  {
    name: 'Free',
    description: 'Get started with basic analysis.',
    price: 'Free',
    featured: false,
    features: [
      '5 job analyses per month',
      'Basic eligibility scoring',
      'Skills matching',
      'Save analysis history',
      'Public job board URLs',
    ],
    cta: 'Get Started',
    ctaLink: '/auth/register',
  },
  {
    name: 'Pro',
    description: 'For serious job seekers.',
    price: '$12',
    featured: true,
    features: [
      'Unlimited job analyses',
      'Advanced eligibility breakdown',
      'Gap analysis & recommendations',
      'Full analysis history',
      'Any job description format',
      'Priority AI processing',
      'Export reports as PDF',
    ],
    cta: 'Start Pro Trial',
    ctaLink: '/auth/register?plan=pro',
  },
  {
    name: 'Enterprise',
    description: 'For career coaches & teams.',
    price: '$49',
    featured: false,
    features: [
      'Everything in Pro',
      'Unlimited team members',
      'Bulk job analysis',
      'Custom scoring rules',
      'API access',
      'Dedicated support',
      'SSO & SAML',
    ],
    cta: 'Contact Sales',
    ctaLink: 'mailto:sales@jec.app',
  },
]

const skills = [
  { name: 'Laravel', value: 92, match: true },
  { name: 'PHP', value: 88, match: true },
  { name: 'MySQL', value: 75, match: true },
  { name: 'Docker', value: 30, match: false },
]

const recommendations = [
  'Learn Docker basics & containers',
  'Build 2-3 projects with Docker',
  'Gain 1 more year of experience',
]
</script>

<style scoped>
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes float-delayed {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 5s ease-in-out infinite 0.5s;
}
</style>
