import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { HttpStatus } from "./http";

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
 * Represents an error API response.
 *
 * @template E - The type of the error message or object.
 * @template M - The type of the metadata included in the response (optional).
 */
export type ApiError<E = string, M = undefined> = M extends undefined
  ? {
      ok: false;
      error: E;
    }
  : {
      ok: false;
      error: E;
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

/**
 * Sends an error API response with a consistent structure.
 *
 * @template E - The type of the error message or object.
 * @template S - The HTTP status code (default: 400).
 * @template M - The type of the metadata included in the response (optional).
 *
 * @param c The context object.
 * @param error The error message or object to include in the response.
 * @param status The HTTP status code to send (default: 400).
 * @param meta Optional metadata to include in the response.
 * @returns The JSON error response.
 *
 * @example
 * // Returning a not found error
 * sendError(c, "User not found", HttpStatus.NOT_FOUND);
 *
 * // It will look like
 * {
 *   ok: false,
 *   error: "User not found"
 * }
 */
export function sendError<
  E = string,
  S extends ContentfulStatusCode = typeof HttpStatus.BAD_REQUEST,
  M extends Record<string, unknown> | undefined = undefined,
>(c: Context, error: E, status: S = HttpStatus.BAD_REQUEST as S, meta?: M) {
  return c.json<ApiError<E, M>, S>(
    meta
      ? ({ ok: false, error, meta } as ApiError<E, M>)
      : ({ ok: false, error } as ApiError<E, M>),
    status
  );
}
