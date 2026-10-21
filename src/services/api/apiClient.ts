export class ApiError extends Error {
  public status: number
  public isNetworkError: boolean
  public canRetry: boolean

  constructor(message: string, status = 500, isNetworkError = false, canRetry = true) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.isNetworkError = isNetworkError
    this.canRetry = canRetry
  }
}

interface FetchOptions extends RequestInit {
  timeoutMs?: number;
}

export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.harvesthearth.com/v1'
  const url = `${baseUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`
  const timeoutMs = options.timeoutMs ?? 10000

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  // Link caller signal if provided
  if (options.signal) {
    options.signal.addEventListener('abort', () => controller.abort())
  }

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new ApiError('The requested resource was not found.', 404, false, false)
      }
      if (response.status >= 500) {
        throw new ApiError('The server encountered an error. Please try again later.', response.status, false, true)
      }
      throw new ApiError(`Request failed with status: ${response.status}`, response.status, false, true)
    }

    try {
      const data: T = await response.json()
      return data
    } catch {
      throw new ApiError('Received an invalid or malformed data response.', 502, false, false)
    }
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError('Request timed out or was cancelled.', 408, true, true)
    }

    throw new ApiError(
      'Unable to connect to service. Please check your network connection.',
      0,
      true,
      true
    )
  } finally {
    clearTimeout(timeoutId)
  }
}
