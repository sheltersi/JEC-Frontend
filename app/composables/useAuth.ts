import { api } from '~/services/api'
import { useMutation, useQuery } from '@tanstack/vue-query'

export function useAuth() {
  const authStore = useAuthStore()

  const loginMutation = useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      api.auth.login(credentials).then((r) => r.data.data),
    onSuccess: (data) => {
      authStore.setSession(data.token, data.user)
    },
  })

  const registerMutation = useMutation({
    mutationFn: (data: {
      name: string
      email: string
      password: string
      password_confirmation: string
    }) => api.auth.register(data).then((r) => r.data.data),
    onSuccess: (data) => {
      authStore.setSession(data.token, data.user)
    },
  })

  const logoutMutation = useMutation({
    mutationFn: () => api.auth.logout(),
    onSuccess: () => {
      authStore.clearSession()
      navigateTo('/auth/login')
    },
  })

  const userQuery = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: () => api.auth.me().then((r) => r.data.data),
    enabled: computed(() => authStore.isAuthenticated),
    staleTime: 5 * 60 * 1000,
  })

  const forgotPasswordMutation = useMutation({
    mutationFn: (data: { email: string }) => api.auth.forgotPassword(data),
  })

  const resetPasswordMutation = useMutation({
    mutationFn: (data: {
      token: string
      email: string
      password: string
      password_confirmation: string
    }) => api.auth.resetPassword(data),
  })

  return {
    login: loginMutation,
    register: registerMutation,
    logout: logoutMutation,
    user: userQuery,
    forgotPassword: forgotPasswordMutation,
    resetPassword: resetPasswordMutation,
    isAuthenticated: computed(() => authStore.isAuthenticated),
  }
}
