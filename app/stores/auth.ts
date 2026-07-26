import { defineStore } from 'pinia'
import type { UserProfile } from '~/services/api'

interface AuthState {
  user: UserProfile | null
  token: string | null
  initialized: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: import.meta.client ? localStorage.getItem('auth_token') : null,
    initialized: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
  },

  actions: {
    setSession(token: string, user: UserProfile) {
      this.token = token
      this.user = user
      if (import.meta.client) {
        localStorage.setItem('auth_token', token)
      }
    },

    async fetchUser() {
      try {
        const { api } = await import('~/services/api')
        const { data } = await api.auth.me()
        this.user = data.data
        this.initialized = true
      } catch {
        this.clearSession()
      }
    },

    clearSession() {
      this.token = null
      this.user = null
      if (import.meta.client) {
        localStorage.removeItem('auth_token')
      }
    },
  },
})
