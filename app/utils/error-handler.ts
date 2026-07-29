import type { AxiosError } from 'axios'

export function getBackendMessage(error: AxiosError<{ message?: string }>): string {
  return error.response?.data?.message || 'An unexpected error occurred'
}

export function getValidationErrors(
  error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>,
): Record<string, string> {
  const errors: Record<string, string> = {}
  const data = error.response?.data

  if (data?.errors) {
    for (const [field, messages] of Object.entries(data.errors)) {
      errors[field] = Array.isArray(messages) ? (messages[0] || '') : String(messages || '')
    }
  }

  return errors
}

export function isValidationError(error: AxiosError): boolean {
  return error.response?.status === 422
}

export function isAuthError(error: AxiosError): boolean {
  return error.response?.status === 401
}

export function handleAuthError(): void {
  const authStore = useAuthStore()
  authStore.clearSession()
  if (import.meta.client) {
    navigateTo('/auth/login')
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const axiosError = error as AxiosError<{ message?: string }>
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message
    }
    return error.message
  }
  return 'An unexpected error occurred'
}
