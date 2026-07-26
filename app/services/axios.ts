import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'

const config = useRuntimeConfig()

const apiClient = axios.create({
  baseURL: config.public.apiBase + '/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  withCredentials: true,
  withXSRFToken: true,
})

export { apiClient }

async function attachToken(
  config: InternalAxiosRequestConfig,
): Promise<InternalAxiosRequestConfig> {
  if (import.meta.client) {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  if (import.meta.server) {
    try {
      const { useRequestEvent } = await import('nuxt/app')
      const event = useRequestEvent()
      if (event) {
        const cookieHeader = event.headers.get('cookie') || ''
        const match = cookieHeader.match(/auth_token=([^;]+)/)
        if (match) {
          config.headers.Authorization = `Bearer ${match[1]}`
        }
      }
    } catch {
      // Server-side auth token extraction not available
    }
  }

  return config
}

function handleResponseSuccess(response: AxiosResponse): AxiosResponse {
  return response
}

async function handleResponseError(error: AxiosError): Promise<never> {
  const originalRequest = error.config as InternalAxiosRequestConfig & {
    _retry?: boolean
  }

  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true

    try {
      await apiClient.get('/auth/refresh')
      return apiClient(originalRequest)
    } catch {
      if (import.meta.client) {
        localStorage.removeItem('auth_token')
        navigateTo('/auth/login')
      }
    }
  }

  const { createApiError, handleAuthError } = await import('../utils/error-handler')
  handleAuthError(error)

  return Promise.reject(createApiError(error))
}

apiClient.interceptors.request.use(
  (config) => attachToken(config),
  (error) => Promise.reject(error),
)

apiClient.interceptors.response.use(
  (response) => handleResponseSuccess(response),
  (error) => handleResponseError(error),
)
