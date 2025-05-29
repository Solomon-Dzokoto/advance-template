// Simple timeout wrapper for any async operation
export async function withTimeout<T>(
  operation: () => Promise<T>,
  timeoutMs: number = 30000,
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error("Operation timed out"));
    }, timeoutMs);
  });

  return Promise.race([operation(), timeoutPromise]);
}

// Simple retry function with a fixed delay
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxAttempts: number = 2,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === maxAttempts) {
        throw lastError;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  throw lastError || new Error('Operation failed');
}
