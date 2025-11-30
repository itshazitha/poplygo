interface RetryOptions {
  maxRetries?: number
  delay?: number
  onRetry?: (attempt: number, error: any) => void
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxRetries = 2, delay = 1000, onRetry } = options
  let lastError: any

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      
      if (attempt < maxRetries) {
        if (onRetry) {
          onRetry(attempt + 1, error)
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)))
      }
    }
  }

  throw lastError
}

// Check if error is network-related (retry-able)
export function isNetworkError(error: any): boolean {
  return (
    error.message?.includes('fetch') ||
    error.message?.includes('network') ||
    error.message?.includes('timeout') ||
    error.code === 'ECONNABORTED'
  )
}
