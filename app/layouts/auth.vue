<template>
  <div class="flex min-h-screen items-center justify-center bg-surface px-4 py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-md">
      <div class="mb-8 text-center">
        <NuxtLink to="/" class="inline-flex items-center gap-2 font-bold text-2xl text-primary">
          <Icon name="lucide:scan-search" size="28" />
          <span>JEC</span>
        </NuxtLink>
        <p class="mt-2 text-sm text-muted-foreground">Job Eligibility Checker</p>
      </div>

      <div class="card">
        <div class="card-content pt-6">
          <slot />
        </div>
      </div>

      <p class="mt-6 text-center text-xs text-muted-foreground">
        &copy; {{ new Date().getFullYear() }} JEC. All rights reserved.
      </p>
    </div>
  </div>
</template>
