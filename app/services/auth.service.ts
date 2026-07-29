import { api, type User } from './api'

export interface LoginPayload {
  email: string
  password: string
  remember?: boolean
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export const authService = {
  async login(payload: LoginPayload): Promise<User> {
    const { data } = await api.auth.login(payload)
    const authStore = useAuthStore()
    authStore.setSession(data.data.token, data.data.user)
    return data.data.user
  },

  async register(payload: RegisterPayload): Promise<User> {
    const { data } = await api.auth.register(payload)
    const authStore = useAuthStore()
    authStore.setSession(data.data.token, data.data.user)
    return data.data.user
  },

  async logout(): Promise<void> {
    const authStore = useAuthStore()
    try {
      await api.auth.logout()
    } catch {
      // Proceed with local logout even if server request fails
    } finally {
      authStore.clearSession()
      await navigateTo('/auth/login')
    }
  },

  async me(): Promise<User | null> {
    try {
      const { data } = await api.user.me()
      if (data.success) {
        const authStore = useAuthStore()
        authStore.setUser(data.data)
        return data.data
      }
      return null
    } catch {
      const authStore = useAuthStore()
      authStore.clearSession()
      return null
    }
  },

  async forgotPassword(email: string): Promise<void> {
    await api.auth.forgotPassword({ email })
  },

  async resetPassword(payload: {
    token: string
    email: string
    password: string
    password_confirmation: string
  }): Promise<void> {
    await api.auth.resetPassword(payload)
  },

  async initAuth(): Promise<void> {
    const authStore = useAuthStore()

    if (!authStore.isAuthenticated) {
      authStore.initialized = true
      return
    }

    try {
      await this.me()
    } finally {
      authStore.initialized = true
    }
  },
}
