<template>
  <div class="flex min-h-screen flex-col bg-surface">
    <!-- Minimal top bar — no sidebar -->
    <header class="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-bright-snow/80 backdrop-blur-sm px-6">
      <NuxtLink to="/" class="flex items-center gap-2 font-bold text-lg text-primary">
        <Icon name="lucide:scan-search" size="20" />
        <span>JEC</span>
      </NuxtLink>
    </header>

    <!-- Centered content area for onboarding steps -->
    <main class="flex flex-1 items-start justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div class="w-full max-w-3xl">
        <slot />
      </div>
    </main>
  </div>
</template>
