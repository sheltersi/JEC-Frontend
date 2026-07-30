<template>
  <div class="flex min-h-screen bg-surface">
    <!--
      Left panel — branding, tagline, and decorative visuals.
      Hidden on mobile; shown as a rich split-screen on md+.
    -->
    <div
      class="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-primary-50 via-primary-100/40 to-bright-snow p-10 md:flex lg:p-14"
    >
      <!-- Decorative blurred orb -->
      <div class="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div class="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <!-- Top branding -->
      <div class="relative z-10">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2.5 font-bold text-xl text-primary"
        >
          <Icon name="lucide:scan-search" size="24" />
          <span>JEC</span>
        </NuxtLink>
      </div>

      <!-- Middle content -->
      <div class="relative z-10 max-w-sm">
        <h2 class="text-3xl font-bold leading-tight text-surface-900 lg:text-4xl">
          Analyze your job fit in
          <span class="text-primary">seconds</span>.
        </h2>
        <p class="mt-4 text-base leading-relaxed text-muted-foreground">
          Paste any job description and instantly see how well you match — with
          skill gaps, recommendations, and an overall eligibility score.
        </p>

        <!-- Feature bullets -->
        <div class="mt-8 space-y-3">
          <div class="flex items-center gap-3 text-sm text-surface-700">
            <div
              class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10"
            >
              <Icon name="lucide:check" class="size-4 text-primary" />
            </div>
            AI-powered eligibility scoring
          </div>
          <div class="flex items-center gap-3 text-sm text-surface-700">
            <div
              class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10"
            >
              <Icon name="lucide:check" class="size-4 text-primary" />
            </div>
            Skill gap analysis & recommendations
          </div>
          <div class="flex items-center gap-3 text-sm text-surface-700">
            <div
              class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10"
            >
              <Icon name="lucide:check" class="size-4 text-primary" />
            </div>
            Track your application history
          </div>
        </div>
      </div>

      <!-- Bottom -->
      <div class="relative z-10 text-xs text-muted-foreground">
        &copy; {{ new Date().getFullYear() }} JEC. All rights reserved.
      </div>
    </div>

    <!--
      Right panel — the authentication form card.
      Full width on mobile; constrained on desktop.
    -->
    <div class="flex w-full flex-col items-center justify-center px-4 py-12 sm:px-6 md:w-1/2 lg:px-8">
      <!-- Mobile-only logo (shown when left panel is hidden) -->
      <div class="mb-8 text-center md:hidden">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 font-bold text-2xl text-primary"
        >
          <Icon name="lucide:scan-search" size="28" />
          <span>JEC</span>
        </NuxtLink>
        <p class="mt-1 text-sm text-muted-foreground">Job Eligibility Checker</p>
      </div>

      <div class="w-full max-w-sm">
        <slot />
      </div>

      <!-- Mobile-only footer -->
      <p class="mt-6 text-center text-xs text-muted-foreground md:hidden">
        &copy; {{ new Date().getFullYear() }} JEC. All rights reserved.
      </p>
    </div>
  </div>
</template>
