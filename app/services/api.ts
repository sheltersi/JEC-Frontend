import type { AxiosInstance } from 'axios'

function client(): AxiosInstance {
  return useNuxtApp().$api as AxiosInstance
}

export interface BackendResponse<T> {
  success: boolean
  message: string
  data: T
}

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

export interface UserProfile {
  id: number
  user_id: number
  headline: string | null
  bio: string | null
  city: string | null
  phone: string | null
  date_of_birth: string | null
  years_experience: number | null
  highest_qualification: string | null
  current_job_title: string | null
  current_company: string | null
  linkedin_url: string | null
  github_url: string | null
  portfolio_url: string | null
  visa_status: string | null
  work_authorization: string | null
  remote_preference: string | null
  salary_expectation: string | null
  currency: string | null
  created_at: string
  updated_at: string
}

export interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
  profile: UserProfile
}

export interface Skill {
  id: number
  name: string
  category: string | null
  proficiency_level: string | null
  years_experience: number | null
}

export interface Experience {
  id: number
  company: string
  title: string
  start_date: string
  end_date: string | null
  description: string | null
  current: boolean
}

export interface Education {
  id: number
  institution: string
  degree: string
  field_of_study: string | null
  start_date: string
  end_date: string | null
  gpa: string | null
}

export interface Certification {
  id: number
  name: string
  issuer: string
  date_obtained: string | null
  expiry_date: string | null
  credential_id: string | null
}

export interface Language {
  id: number
  name: string
  proficiency: string
}

export interface JobAnalysis {
  id: number
  job_title: string
  company: string | null
  job_url: string | null
  job_description: string
  eligibility_score: number | null
  matched_skills: Skill[]
  missing_skills: Skill[]
  recommendations: string[]
  status: string
  created_at: string
  updated_at: string
}

export interface DashboardStats {
  total_analyses: number
  average_score: number
  top_missing_skills: { skill: string; count: number }[]
  recent_analyses: JobAnalysis[]
  score_trend: { date: string; score: number }[]
}

export const api = {
  auth: {
    login: (data: { email: string; password: string }) =>
      client().post<BackendResponse<{ user: User; token: string }>>('/login', data),

    register: (data: {
      name: string
      email: string
      password: string
      password_confirmation: string
    }) => client().post<BackendResponse<{ user: User; token: string }>>('/register', data),

    logout: () => client().post<BackendResponse<null>>('/logout'),

    forgotPassword: (data: { email: string }) =>
      client().post<BackendResponse<null>>('/forgot-password', data),

    resetPassword: (data: {
      token: string
      email: string
      password: string
      password_confirmation: string
    }) => client().post<BackendResponse<null>>('/reset-password', data),
  },

  user: {
    me: () => client().get<BackendResponse<User>>('/user'),

    update: (data: Partial<Pick<User, 'name' | 'email'>>) =>
      client().put<BackendResponse<User>>('/user', data),
  },

  profile: {
    get: () => client().get<BackendResponse<UserProfile>>('/profile'),

    update: (data: Partial<UserProfile>) =>
      client().put<BackendResponse<UserProfile>>('/profile', data),
  },

  skills: {
    list: () => client().get<BackendResponse<Skill[]>>('/skills'),

    create: (data: Partial<Skill>) => client().post<BackendResponse<Skill>>('/skills', data),

    update: (id: number, data: Partial<Skill>) =>
      client().put<BackendResponse<Skill>>(`/skills/${id}`, data),

    destroy: (id: number) => client().delete(`/skills/${id}`),
  },

  experience: {
    list: () => client().get<BackendResponse<Experience[]>>('/experience'),

    create: (data: Partial<Experience>) =>
      client().post<BackendResponse<Experience>>('/experience', data),

    update: (id: number, data: Partial<Experience>) =>
      client().put<BackendResponse<Experience>>(`/experience/${id}`, data),

    destroy: (id: number) => client().delete(`/experience/${id}`),
  },

  education: {
    list: () => client().get<BackendResponse<Education[]>>('/education'),

    create: (data: Partial<Education>) =>
      client().post<BackendResponse<Education>>('/education', data),

    update: (id: number, data: Partial<Education>) =>
      client().put<BackendResponse<Education>>(`/education/${id}`, data),

    destroy: (id: number) => client().delete(`/education/${id}`),
  },

  certifications: {
    list: () => client().get<BackendResponse<Certification[]>>('/certifications'),

    create: (data: Partial<Certification>) =>
      client().post<BackendResponse<Certification>>('/certifications', data),

    update: (id: number, data: Partial<Certification>) =>
      client().put<BackendResponse<Certification>>(`/certifications/${id}`, data),

    destroy: (id: number) => client().delete(`/certifications/${id}`),
  },

  languages: {
    list: () => client().get<BackendResponse<Language[]>>('/languages'),

    create: (data: Partial<Language>) =>
      client().post<BackendResponse<Language>>('/languages', data),

    update: (id: number, data: Partial<Language>) =>
      client().put<BackendResponse<Language>>(`/languages/${id}`, data),

    destroy: (id: number) => client().delete(`/languages/${id}`),
  },

  analysis: {
    list: (params?: { page?: number; per_page?: number }) =>
      client().get<BackendResponse<JobAnalysis[]>>('/analysis', { params }),

    get: (id: number) => client().get<BackendResponse<JobAnalysis>>(`/analysis/${id}`),

    create: (data: { job_url?: string; job_description?: string }) =>
      client().post<BackendResponse<JobAnalysis>>('/analysis', data),

    destroy: (id: number) => client().delete(`/analysis/${id}`),
  },

  dashboard: {
    stats: () => client().get<BackendResponse<DashboardStats>>('/dashboard/stats'),
  },
}
