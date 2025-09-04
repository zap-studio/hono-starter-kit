/**
 * Base path for the API routes.
 */

export const PREFIX = "/api" as const;
export const VERSION = "/v1" as const;
export const BASE_PATH = `${PREFIX}${VERSION}` as const;

export const AUTH_ROUTE = "/auth" as const;
export const AUTH_PATH = `${BASE_PATH}${AUTH_ROUTE}` as const;
export const GLOB_AUTH_PATH = `${AUTH_PATH}/*` as const;

export const HEALTH_ROUTE = "/health" as const;
export const OPENAPI_DOC_ROUTE = "/docs" as const;
export const SCALAR_UI_ROUTE = "/scalar" as const;
export const LLMS_TXT_ROUTE = "/llms.txt" as const;
