import type { MiddlewareHandler } from "hono";
import { createMiddleware } from "hono/factory";
import type { Bindings } from "@/lib/env";
import { HttpStatus } from "@/zap/utils/http";
import { sendError } from "@/zap/utils/response";

const RATE_LIMIT = 100; // requests
const WINDOW_MS = 60_000; // 1 minute

const MILLISECONDS_PER_SECOND = 1000;

// In-memory store for rate limiting, in production use a distributed store like Redis
const buckets = new Map<string, { tokens: number; last: number }>();

/**
 * Custom rate limit middleware
 * @returns {MiddlewareHandler}
 */
export function customRateLimit(): MiddlewareHandler {
  return createMiddleware<{ Bindings: Bindings }>((c, next) => {
    const ip =
      c.req.header("cf-connecting-ip") ??
      c.req.header("x-forwarded-for") ??
      "unknown";
    const now = Date.now();
    const bucket = buckets.get(ip) ?? { tokens: RATE_LIMIT, last: now };

    // refill tokens
    const elapsed = now - bucket.last;
    if (elapsed > WINDOW_MS) {
      bucket.tokens = RATE_LIMIT;
      bucket.last = now;
    }

    if (bucket.tokens > 0) {
      bucket.tokens -= 1;
      bucket.last = now;
      buckets.set(ip, bucket);
      return next();
    }

    return Promise.resolve(
      sendError(c, "Rate limit exceeded", HttpStatus.TOO_MANY_REQUESTS, {
        retryAfter: Math.ceil((WINDOW_MS - elapsed) / MILLISECONDS_PER_SECOND),
      })
    );
  });
}
