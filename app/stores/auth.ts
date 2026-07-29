import { defineStore } from 'pinia'
import type { User } from '~/services/api'

interface AuthState {
  user: User | null
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
    setSession(token: string, user: User) {
      this.token = token
      this.user = user
      this.initialized = true
      if (import.meta.client) {
        localStorage.setItem('auth_token', token)
      }
    },

    setUser(user: User) {
      this.user = user
      this.initialized = true
    },

    clearSession() {
      this.token = null
      this.user = null
      this.initialized = false
      if (import.meta.client) {
        localStorage.removeItem('auth_token')
      }
    },
  },
})
