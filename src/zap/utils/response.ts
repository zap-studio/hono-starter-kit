import type { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { HttpStatus } from './http';

/**
 * Represents a successful API response.
 */
export type ApiSuccess<T> = {
  /**
   * Indicates whether the API request was successful.
   */
  ok: true;
  /**
   * The data returned by the API.
   */
  data: T;
  /**
   * Optional metadata about the response.
   */
  meta?: Record<string, unknown>;
};

/**
 * Sends a successful API response with a consistent structure.
 * @param c The context object.
 * @param data The data to include in the response.
 * @param status The HTTP status code to send (default: 200).
 * @param meta Optional metadata to include in the response.
 * @returns The JSON response.
 *
 * @example
 * // Returning a paginated response
 * sendJson(c, paginated, HttpStatus.OK, {
 *   total,
 *   page: pageNum,
 *   limit: limitNum,
 * });
 *
 * // It will look like
 * {
 *   ok: true,
 *   data: [...],
 *   meta: {
 *     total,
 *     page: pageNum,
 *     limit: limitNum,
 *   },
 * }
 */
export function sendJson<
  T,
  S extends ContentfulStatusCode,
  M extends Record<string, unknown>,
>(c: Context, data: T, status: S = HttpStatus.OK as S, meta?: M) {
  return c.json<ApiSuccess<T>, S>({ ok: true, data, meta }, status);
}
