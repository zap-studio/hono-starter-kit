/**
 * Rate limiter configuration
 */

export const RATE_LIMIT_WINDOW_MS = 60_000 as const; // 1 minute
export const RATE_LIMIT_LIMIT = 100 as const; // 100 requests per window per IP
