<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useSeoMeta({
  title: 'Dashboard — Job Eligibility Checker',
})
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-surface-900">Dashboard</h1>
      <p class="mt-1 text-sm text-muted-foreground">
        Welcome back! Here's an overview of your activity.
      </p>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-lg border border-border bg-bright-snow p-5">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Icon name="lucide:search-check" class="size-5 text-primary" />
          </div>
          <div>
            <p class="text-2xl font-bold text-surface-900">0</p>
            <p class="text-xs text-muted-foreground">Jobs Analyzed</p>
          </div>
        </div>
      </div>

      <div class="rounded-lg border border-border bg-bright-snow p-5">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
            <Icon name="lucide:check-circle" class="size-5 text-blue-500" />
          </div>
          <div>
            <p class="text-2xl font-bold text-surface-900">0</p>
            <p class="text-xs text-muted-foreground">High Matches</p>
          </div>
        </div>
      </div>

      <div class="rounded-lg border border-border bg-bright-snow p-5">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
            <Icon name="lucide:clock" class="size-5 text-amber-500" />
          </div>
          <div>
            <p class="text-2xl font-bold text-surface-900">0</p>
            <p class="text-xs text-muted-foreground">Pending</p>
          </div>
        </div>
      </div>

      <div class="rounded-lg border border-border bg-bright-snow p-5">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
            <Icon name="lucide:trending-up" class="size-5 text-emerald-500" />
          </div>
          <div>
            <p class="text-2xl font-bold text-surface-900">0%</p>
            <p class="text-xs text-muted-foreground">Overall Score</p>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 rounded-lg border border-border bg-bright-snow p-6">
      <h2 class="text-lg font-semibold text-surface-900">Recent Analyses</h2>
      <p class="mt-3 text-sm text-muted-foreground">
        No job analyses yet.
        <NuxtLink to="/dashboard/analyze" class="font-medium text-primary hover:text-primary-500">
          Analyze your first job
        </NuxtLink>
        to see your eligibility.
      </p>
    </div>
  </div>
</template>
