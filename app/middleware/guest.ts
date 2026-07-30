export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore()

  // Ensure auth state is loaded before checking authentication
  if (!authStore.initialized) {
    const { authService } = await import('~/services/auth.service')
    await authService.initAuth()
  }

  // Already authenticated users should be sent to the appropriate page:
  // first-time users go to profile setup, returning users to the dashboard
  if (authStore.isAuthenticated) {
    return navigateTo(authStore.postLoginRoute)
  }
})
