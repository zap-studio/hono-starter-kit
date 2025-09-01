import type { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import type { AppError } from '@/lib/errors';

export type ApiSuccess<T> = {
  ok: true;
  data: T;
  meta?: Record<string, unknown>;
};

export type ApiError = {
  ok: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
    requestId?: string;
  };
};

/**
 * Sends a successful API response.
 * @param c The context object.
 * @param data The data to include in the response.
 * @param status The HTTP status code to send (default: 200).
 * @param meta Optional metadata to include in the response.
 * @returns The JSON response.
 */
export function send<T>(
  c: Context,
  data: T,
  status: ContentfulStatusCode = 200,
  meta?: Record<string, unknown>
) {
  return c.json<ApiSuccess<T>>({ ok: true, data, meta }, status);
}

/**
 * Sends an error response.
 * @param c The context object.
 * @param e The AppError to send.
 * @returns The JSON response.
 */
export function sendError(c: Context, e: AppError) {
  const requestId = c.get('requestId') as string | undefined;
  const body: ApiError = {
    ok: false,
    error: { code: e.code, message: e.message, details: e.details, requestId },
  };
  return c.json(body, e.status);
}
