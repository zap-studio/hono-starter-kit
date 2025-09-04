/**
 * Base path for the API routes.
 */

export const PREFIX = "/api" as const;
export const VERSION = "/v1" as const;
export const BASE_PATH = `${PREFIX}${VERSION}` as const;

export const HEALTH_ROUTE = "/health" as const;
export const PUBLIC_ROUTE = "/public" as const;
export const OPENAPI_DOC_ROUTE = "/docs" as const;
export const SCALAR_UI_ROUTE = "/scalar" as const;
export const LLMS_TXT_ROUTE = "/llms.txt" as const;

export const PUBLIC_PATHS = [
  HEALTH_ROUTE,
  PUBLIC_ROUTE,
  SCALAR_UI_ROUTE,
  OPENAPI_DOC_ROUTE,
  LLMS_TXT_ROUTE,
] as const;
