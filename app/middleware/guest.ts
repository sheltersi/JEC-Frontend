export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore()

  if (!authStore.initialized) {
    const { authService } = await import('~/services/auth.service')
    await authService.initAuth()
  }

  if (authStore.isAuthenticated) {
    return navigateTo('/dashboard')
  }
})
