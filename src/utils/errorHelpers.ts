import { ApiError } from '@/services/api/apiClient'

export interface UserFriendlyError {
  title: string;
  message: string;
  canRetry: boolean;
}

export function getUserFriendlyError(error: unknown): UserFriendlyError {
  if (error instanceof ApiError) {
    if (error.status === 404) {
      return {
        title: 'Item Not Found',
        message: 'The food product or category you are looking for does not exist or may have been unlisted.',
        canRetry: false,
      }
    }

    if (error.isNetworkError) {
      return {
        title: 'Connection Interrupted',
        message: 'We were unable to connect to our catalog. Please verify your internet connection and try again.',
        canRetry: true,
      }
    }

    if (error.status >= 500) {
      return {
        title: 'Service Temporarily Unavailable',
        message: 'Our pantry servers are undergoing a brief refresh. Please retry in a few moments.',
        canRetry: true,
      }
    }

    return {
      title: 'Unable to Load Products',
      message: error.message || 'An unexpected error occurred while loading this page.',
      canRetry: error.canRetry,
    }
  }

  if (error instanceof DOMException && error.name === 'AbortError') {
    return {
      title: 'Request Cancelled',
      message: 'The previous request was superseded.',
      canRetry: false,
    }
  }

  return {
    title: 'Something Went Wrong',
    message: 'We experienced an unexpected glitch. Please refresh the page or try again.',
    canRetry: true,
  }
}
