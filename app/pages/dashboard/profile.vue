<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

useSeoMeta({
  title: 'My Profile — Job Eligibility Checker',
})
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-surface-900">My Profile</h1>
      <p class="mt-1 text-sm text-muted-foreground">
        Manage your personal and professional information.
      </p>
    </div>

    <div class="rounded-lg border border-border bg-bright-snow p-6">
      <p class="text-sm text-muted-foreground">Profile page coming soon.</p>
    </div>
  </div>
</template>
