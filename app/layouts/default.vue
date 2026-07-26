<template>
  <div class="flex min-h-screen flex-col bg-surface">
    <header class="sticky top-0 z-50 border-b border-border bg-bright-snow/80 backdrop-blur-sm">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <NuxtLink to="/" class="flex items-center gap-2 font-bold text-lg text-primary">
          <Icon name="lucide:scan-search" size="24" />
          <span>JEC</span>
        </NuxtLink>

        <nav class="hidden items-center gap-8 md:flex">
          <NuxtLink
            to="/#features"
            class="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </NuxtLink>
          <NuxtLink
            to="/#how-it-works"
            class="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            How It Works
          </NuxtLink>
          <NuxtLink
            to="/#pricing"
            class="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </NuxtLink>
        </nav>

        <div class="flex items-center gap-3">
          <NuxtLink to="/auth/login" class="btn btn-ghost btn-sm"> Log in </NuxtLink>
          <NuxtLink to="/auth/register" class="btn btn-primary btn-sm"> Get Started </NuxtLink>
        </div>
      </div>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="border-t border-border bg-bright-snow">
      <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div class="md:col-span-1">
            <NuxtLink to="/" class="flex items-center gap-2 font-bold text-lg text-primary">
              <Icon name="lucide:scan-search" size="24" />
              <span>JEC</span>
            </NuxtLink>
            <p class="mt-3 text-sm text-muted-foreground">
              AI-powered job eligibility analysis. Know your fit before you apply.
            </p>
          </div>

          <div>
            <h3 class="text-sm font-semibold text-foreground">Product</h3>
            <ul class="mt-3 space-y-2">
              <li>
                <NuxtLink
                  to="/#features"
                  class="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >Features</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="/#how-it-works"
                  class="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >How It Works</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  to="/#pricing"
                  class="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >Pricing</NuxtLink
                >
              </li>
            </ul>
          </div>

          <div>
            <h3 class="text-sm font-semibold text-foreground">Resources</h3>
            <ul class="mt-3 space-y-2">
              <li>
                <a
                  href="#"
                  class="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >Blog</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >Documentation</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >Support</a
                >
              </li>
            </ul>
          </div>

          <div>
            <h3 class="text-sm font-semibold text-foreground">Company</h3>
            <ul class="mt-3 space-y-2">
              <li>
                <a
                  href="#"
                  class="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >About</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >Privacy</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >Terms</a
                >
              </li>
            </ul>
          </div>
        </div>

        <div class="mt-10 border-t border-border pt-6">
          <p class="text-center text-xs text-muted-foreground">
            &copy; {{ new Date().getFullYear() }} Job Eligibility Checker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>
