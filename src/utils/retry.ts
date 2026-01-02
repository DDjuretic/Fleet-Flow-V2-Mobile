/**
 * Retry Utility - Exponential backoff retry logic for network operations
 */

export interface RetryResult<T> {
  success: boolean;
  data?: T;
  error?: any;
  attempts: number;
}

export interface RetryOptions {
  maxAttempts?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  retryCondition?: (error: any) => boolean;
}

/**
 * Retry network operation with exponential backoff
 */
export async function retryNetworkOperation<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<RetryResult<T>> {
  const {
    maxAttempts = 3,
    baseDelay = 1000, // 1 second
    maxDelay = 30000, // 30 seconds
    backoffMultiplier = 2,
    retryCondition = () => true // Retry all errors by default
  } = options;

  let lastError: any;
  let attempts = 0;

  while (attempts < maxAttempts) {
    attempts++;

    try {
      const data = await operation();
      return {
        success: true,
        data,
        attempts
      };
    } catch (error) {
      lastError = error;

      // Check if we should retry this error
      if (!retryCondition(error)) {
        break;
      }

      // Don't delay on the last attempt
      if (attempts < maxAttempts) {
        const delay = Math.min(
          baseDelay * Math.pow(backoffMultiplier, attempts - 1),
          maxDelay
        );

        console.log(`[Retry] Attempt ${attempts} failed, retrying in ${delay}ms:`, error.message);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  return {
    success: false,
    error: lastError,
    attempts
  };
}

/**
 * Default retry condition - retry network and server errors
 */
export function isRetryableError(error: any): boolean {
  if (!error) return false;

  const errorMessage = error.message || error.toString() || '';

  // Network errors
  if (errorMessage.toLowerCase().includes('network') ||
      errorMessage.toLowerCase().includes('connection') ||
      errorMessage.toLowerCase().includes('timeout') ||
      errorMessage.toLowerCase().includes('offline')) {
    return true;
  }

  // HTTP status codes that are retryable
  if (error.status) {
    const retryableStatusCodes = [408, 429, 500, 502, 503, 504]; // Timeout, rate limit, server errors
    return retryableStatusCodes.includes(error.status);
  }

  // Supabase specific errors
  if (errorMessage.includes('JWT') && errorMessage.includes('expired')) {
    return false; // Don't retry auth errors
  }

  return true; // Retry by default for unknown errors
}

/**
 * Retry with default network retry condition
 */
export async function retryWithNetworkBackoff<T>(
  operation: () => Promise<T>,
  options: Omit<RetryOptions, 'retryCondition'> = {}
): Promise<RetryResult<T>> {
  return retryNetworkOperation(operation, {
    ...options,
    retryCondition: isRetryableError
  });
}
