import { hc } from "hono/client";
import type { routes } from "..";

/**
 * Represents a typed Hono client instance for the application's routes.
 * Provides full type safety for API calls based on the defined route types.
 */
export type Client = ReturnType<typeof hc<typeof routes>>;

/**
 * Creates a Hono client instance with strict typing for all available routes.
 *
 * @param args - Arguments passed to the Hono client constructor, such as the base URL.
 * @returns A typed Hono client instance for making requests to the API.
 *
 * @example
 * ```typescript
 * const client = hcWithType("https://api.example.com");
 * const response = await client.api.v1.users.$get(); // you may want to encapsulate 'client.api.v1' in a separate variable
 * ```
 */
export function hcWithType(...args: Parameters<typeof hc>): Client {
  return hc<typeof routes>(...args);
}
