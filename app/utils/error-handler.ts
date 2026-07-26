import type { AxiosError } from 'axios'

export interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>
  code?: string
}

export function createApiError(error: AxiosError): ApiError {
  const { response } = error

  if (!response) {
    return {
      message: error.message || 'Network error. Please check your connection.',
      status: 0,
      code: 'NETWORK_ERROR',
    }
  }

  const data = response.data as Record<string, unknown> | undefined

  return {
    message: (data?.message as string) || `Request failed with status ${response.status}`,
    status: response.status,
    errors: data?.errors as Record<string, string[]> | undefined,
    code: (data?.code as string) || `HTTP_${response.status}`,
  }
}

export function handleAuthError(error: AxiosError): void {
  const status = error.response?.status

  if (status === 401) {
    const authStore = useAuthStore()
    authStore.clearSession()
    navigateTo('/auth/login')
  }
}

export function isNetworkError(error: unknown): boolean {
  return error instanceof Error && !('response' in (error as AxiosError))
}

export function isValidationError(error: AxiosError): boolean {
  return error.response?.status === 422
}

export function getValidationErrors(error: AxiosError): Record<string, string> {
  const data = error.response?.data as { errors?: Record<string, string[]> } | undefined
  const errors: Record<string, string> = {}

  if (data?.errors) {
    for (const [field, messages] of Object.entries(data.errors)) {
      errors[field] = messages[0] || 'Invalid value'
    }
  }

  return errors
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred'
}
