import type { Context } from "hono";
import { env } from "hono/adapter";
import type { RequestIdVariables } from "hono/request-id";
import type { Bindings } from "@/lib/env";

/**
 * Environment variables for the application.
 */
export type Env = {
  /**
   * The bindings for the application.
   */
  Bindings: Bindings;
  /**
   * The variables for the application.
   */
  Variables: RequestIdVariables;
};

/**
 * Typed wrapper for hono's env function using Bindings.
 * This function retrieves the environment variables for the application.
 *
 * @template T - The type of the environment variables that extend Bindings.
 *
 * @param c - The Hono context.
 * @returns The environment variables typed as Bindings.
 *
 * @example
 * const { CORS_ORIGINS } = getEnv(c);
 */
export function getEnv<T extends Bindings>(c: Context): T {
  return env<T>(c);
}
