import { apiClient } from './axios'

export interface PaginatedResponse<T> {
  data: T[]
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number | null
    last_page: number
    path: string
    per_page: number
    to: number | null
    total: number
  }
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface JobAnalysis {
  id: number
  job_title: string
  company: string
  eligibility_score: number
  matched_skills: string[]
  missing_skills: string[]
  recommendations: string[]
  status: string
  created_at: string
}

export interface UserProfile {
  id: number
  name: string
  email: string
  skills: string[]
  experience_years: number
  education: string
  certifications: string[]
  languages: string[]
  avatar_url?: string
}

export const api = {
  auth: {
    login: (data: { email: string; password: string }) =>
      apiClient.post<ApiResponse<{ token: string; user: UserProfile }>>('/auth/login', data),

    register: (data: {
      name: string
      email: string
      password: string
      password_confirmation: string
    }) => apiClient.post<ApiResponse<{ token: string; user: UserProfile }>>('/auth/register', data),

    logout: () => apiClient.post('/auth/logout'),

    refresh: () => apiClient.get<ApiResponse<{ token: string }>>('/auth/refresh'),

    forgotPassword: (data: { email: string }) =>
      apiClient.post<ApiResponse<null>>('/auth/forgot-password', data),

    resetPassword: (data: {
      token: string
      email: string
      password: string
      password_confirmation: string
    }) => apiClient.post<ApiResponse<null>>('/auth/reset-password', data),

    me: () => apiClient.get<ApiResponse<UserProfile>>('/auth/me'),
  },

  profile: {
    get: () => apiClient.get<ApiResponse<UserProfile>>('/profile'),

    update: (data: Partial<UserProfile>) =>
      apiClient.put<ApiResponse<UserProfile>>('/profile', data),

    updateAvatar: (file: File) => {
      const form = new FormData()
      form.append('avatar', file)
      return apiClient.post<ApiResponse<{ avatar_url: string }>>('/profile/avatar', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    },
  },

  analysis: {
    list: (params?: { page?: number; per_page?: number }) =>
      apiClient.get<PaginatedResponse<JobAnalysis>>('/analysis', { params }),

    get: (id: number) => apiClient.get<ApiResponse<JobAnalysis>>(`/analysis/${id}`),

    create: (data: { job_url?: string; job_description?: string }) =>
      apiClient.post<ApiResponse<JobAnalysis>>('/analysis', data),

    destroy: (id: number) => apiClient.delete(`/analysis/${id}`),
  },

  dashboard: {
    stats: () =>
      apiClient.get<
        ApiResponse<{
          total_analyses: number
          average_score: number
          top_missing_skills: { skill: string; count: number }[]
          recent_analyses: JobAnalysis[]
          score_trend: { date: string; score: number }[]
        }>
      >('/dashboard/stats'),
  },
}
