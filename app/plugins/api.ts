import axios, { type AxiosError } from 'axios'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const apiClient = axios.create({
    baseURL: config.public.apiBase + '/api/v1',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    timeout: 30000,
  })

  apiClient.interceptors.request.use(
    async (reqConfig) => {
      if (import.meta.client) {
        const token = localStorage.getItem('auth_token')
        if (token) {
          reqConfig.headers.Authorization = `Bearer ${token}`
        }
      }
      return reqConfig
    },
    (error) => Promise.reject(error),
  )

  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        if (import.meta.client) {
          localStorage.removeItem('auth_token')
          navigateTo('/auth/login')
        }
      }

      return Promise.reject(error)
    },
  )

  return {
    provide: {
      api: apiClient,
    },
  }
})
