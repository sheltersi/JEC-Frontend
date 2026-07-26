<template>
  <div class="flex min-h-screen bg-surface">
    <aside
      class="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-bright-snow"
    >
      <div class="flex h-16 items-center gap-2 border-b border-border px-6">
        <NuxtLink to="/dashboard" class="flex items-center gap-2 font-bold text-lg text-primary">
          <Icon name="lucide:scan-search" size="22" />
          <span>JEC</span>
        </NuxtLink>
      </div>

      <nav class="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <NuxtLink
          to="/dashboard"
          class="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          active-class="bg-primary/10 text-primary"
          exact-active-class="bg-primary/10 text-primary"
        >
          <Icon name="lucide:layout-dashboard" size="18" />
          Dashboard
        </NuxtLink>

        <NuxtLink
          to="/dashboard/profile"
          class="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          active-class="bg-primary/10 text-primary"
        >
          <Icon name="lucide:user-circle" size="18" />
          My Profile
        </NuxtLink>

        <NuxtLink
          to="/dashboard/analyze"
          class="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          active-class="bg-primary/10 text-primary"
        >
          <Icon name="lucide:search-check" size="18" />
          Analyze Job
        </NuxtLink>

        <NuxtLink
          to="/dashboard/history"
          class="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          active-class="bg-primary/10 text-primary"
        >
          <Icon name="lucide:history" size="18" />
          History
        </NuxtLink>

        <NuxtLink
          to="/dashboard/settings"
          class="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          active-class="bg-primary/10 text-primary"
        >
          <Icon name="lucide:settings" size="18" />
          Settings
        </NuxtLink>
      </nav>

      <div class="border-t border-border p-3">
        <button
          class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          @click="handleLogout"
        >
          <Icon name="lucide:log-out" size="18" />
          Log out
        </button>
      </div>
    </aside>

    <div class="flex flex-1 flex-col pl-64">
      <header
        class="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-bright-snow/80 backdrop-blur-sm px-6"
      >
        <button
          class="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors lg:hidden"
          @click="sidebarOpen = !sidebarOpen"
        >
          <Icon name="lucide:menu" size="20" />
        </button>

        <div class="flex flex-1 items-center justify-end gap-4">
          <button
            class="relative rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Icon name="lucide:bell" size="20" />
            <span class="sr-only">Notifications</span>
          </button>

          <div class="flex items-center gap-3">
            <div class="hidden text-right sm:block">
              <p class="text-sm font-medium text-foreground">Alex Johnson</p>
              <p class="text-xs text-muted-foreground">alex@example.com</p>
            </div>
            <div
              class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary"
            >
              AJ
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>

    <Teleport to="body">
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-50 lg:hidden"
        @click.self="sidebarOpen = false"
      >
        <div class="fixed inset-0 bg-black/50" />
        <aside
          class="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-bright-snow"
        >
          <div class="flex h-16 items-center justify-between gap-2 border-b border-border px-6">
            <NuxtLink
              to="/dashboard"
              class="flex items-center gap-2 font-bold text-lg text-primary"
              @click="sidebarOpen = false"
            >
              <Icon name="lucide:scan-search" size="22" />
              <span>JEC</span>
            </NuxtLink>
            <button
              class="rounded-md p-1.5 text-muted-foreground hover:bg-muted"
              @click="sidebarOpen = false"
            >
              <Icon name="lucide:x" size="18" />
            </button>
          </div>

          <nav class="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            <NuxtLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              active-class="bg-primary/10 text-primary"
              @click="sidebarOpen = false"
            >
              <Icon :name="link.icon" size="18" />
              {{ link.label }}
            </NuxtLink>
          </nav>

          <div class="border-t border-border p-3">
            <button
              class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              @click="handleLogout"
            >
              <Icon name="lucide:log-out" size="18" />
              Log out
            </button>
          </div>
        </aside>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const sidebarOpen = ref(false)
const route = useRoute()

const navLinks = [
  { to: '/dashboard', icon: 'lucide:layout-dashboard', label: 'Dashboard' },
  { to: '/dashboard/profile', icon: 'lucide:user-circle', label: 'My Profile' },
  { to: '/dashboard/analyze', icon: 'lucide:search-check', label: 'Analyze Job' },
  { to: '/dashboard/history', icon: 'lucide:history', label: 'History' },
  { to: '/dashboard/settings', icon: 'lucide:settings', label: 'Settings' },
]

watch(
  () => route.path,
  () => {
    sidebarOpen.value = false
  },
)

function handleLogout() {
  // TODO: Implement logout via auth store
  navigateTo('/auth/login')
}
</script>
