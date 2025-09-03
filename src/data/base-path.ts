/**
 * Base path for the API routes.
 */

export const PREFIX = "/api" as const;
export const VERSION = "/v1" as const;
export const BASE_PATH = `${PREFIX}${VERSION}` as const;
