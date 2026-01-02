/**
 * Error Handler Utility - Centralized error handling for FleetFlow
 */

export class ErrorHandler {
  /**
   * Log debug message
   */
  static debug(context: string, message: string, data?: any): void {
    console.log(`[${context}] ${message}`, data ? data : '');
  }

  /**
   * Log info message
   */
  static info(context: string, message: string, data?: any): void {
    console.info(`[${context}] ${message}`, data ? data : '');
  }

  /**
   * Log warning message
   */
  static warn(context: string, message: string, error?: any): void {
    console.warn(`[${context}] ${message}`, error ? error : '');
  }

  /**
   * Log error message
   */
  static error(context: string, message: string, error?: any): void {
    console.error(`[${context}] ${message}`, error ? error : '');
  }

  /**
   * Handle async operation errors
   */
  static async handleAsync<T>(
    operation: () => Promise<T>,
    context: string,
    fallback?: T
  ): Promise<T | null> {
    try {
      return await operation();
    } catch (error) {
      this.error(context, 'Async operation failed', error);
      return fallback || null;
    }
  }

  /**
   * Handle sync operation errors
   */
  static handleSync<T>(
    operation: () => T,
    context: string,
    fallback?: T
  ): T | null {
    try {
      return operation();
    } catch (error) {
      this.error(context, 'Sync operation failed', error);
      return fallback || null;
    }
  }

  /**
   * Create user-friendly error message
   */
  static getUserFriendlyMessage(error: any): string {
    if (typeof error === 'string') {
      return error;
    }

    if (error?.message) {
      // Handle common Supabase errors
      if (error.message.includes('JWT')) {
        return 'Session expired. Please log in again.';
      }
      if (error.message.includes('network')) {
        return 'Network error. Please check your connection.';
      }
      if (error.message.includes('permission')) {
        return 'You do not have permission for this action.';
      }
      return error.message;
    }

    return 'An unexpected error occurred.';
  }

  /**
   * Check if error is recoverable
   */
  static isRecoverableError(error: any): boolean {
    if (!error) return false;

    const recoverableErrors = [
      'network',
      'timeout',
      'connection',
      'offline',
      'JWT',
      'session'
    ];

    const errorMessage = error.message || error.toString() || '';
    return recoverableErrors.some(keyword =>
      errorMessage.toLowerCase().includes(keyword)
    );
  }

  /**
   * Report error to external service (future enhancement)
   */
  static reportError(error: any, context: string, userInfo?: any): void {
    // TODO: Implement error reporting to external service
    // For now, just log to console
    this.error('ErrorReporter', `Reported error in ${context}`, {
      error,
      userInfo,
      timestamp: new Date().toISOString()
    });
  }
}
