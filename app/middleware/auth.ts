export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  // Ensure auth state is loaded from the server before making decisions
  if (!authStore.initialized) {
    const { authService } = await import('~/services/auth.service')
    await authService.initAuth()
  }

  // Redirect unauthenticated users to the login page
  if (!authStore.isAuthenticated) {
    return navigateTo({
      path: '/auth/login',
      query: { redirect: to.fullPath },
    })
  }

  // First-time users with an incomplete profile must complete onboarding.
  // Skip redirect if already on a profile-related page to avoid a redirect loop.
  if (!authStore.isProfileComplete && !to.path.startsWith('/dashboard/profile')) {
    return navigateTo('/dashboard/profile/setup')
  }
})
