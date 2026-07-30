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

    /**
     * Determine if the user's profile has been filled in.
     * A profile is considered complete when at least the headline or
     * current job title has been set, indicating the user has gone
     * through the onboarding flow.
     */
    isProfileComplete(): boolean {
      const profile = this.user?.profile
      if (!profile) return false

      return !!(profile.headline || profile.current_job_title)
    },

    /**
     * The route to redirect to after a successful login/registration.
     * First-time users go to profile setup; returning users go to the dashboard.
     */
    postLoginRoute(): string {
      return this.isProfileComplete ? '/dashboard' : '/dashboard/profile/setup'
    },
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
