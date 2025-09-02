import type { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { HttpStatus } from './http';

/**
 * Represents a successful API response.
 *
 * @template T - The type of the data returned in the response.
 * @template M - The type of the metadata included in the response (optional).
 */
export type ApiSuccess<T, M = undefined> = M extends undefined
  ? {
      ok: true;
      data: T;
    }
  : {
      ok: true;
      data: T;
      meta: M;
    };

/**
 * Sends a successful API response with a consistent structure.
 *
 * @template T - The type of the data returned in the response.
 * @template S - The HTTP status code (default: 200).
 * @template M - The type of the metadata included in the response (optional).
 *
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
  S extends ContentfulStatusCode = typeof HttpStatus.OK,
  M extends Record<string, unknown> | undefined = undefined,
>(c: Context, data: T, status: S = HttpStatus.OK as S, meta?: M) {
  return c.json<ApiSuccess<T, M>, S>(
    meta
      ? ({ ok: true, data, meta } as ApiSuccess<T, M>)
      : ({ ok: true, data } as ApiSuccess<T, M>),
    status
  );
}
