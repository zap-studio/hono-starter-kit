import type { MiddlewareHandler } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { createMiddleware } from "hono/factory";
import { getEnv } from "../utils/env";
import { HttpStatus } from "../utils/http";
import { sendError } from "../utils/response";

/**
 * Custom Bearer token middleware
 * @returns {MiddlewareHandler}
 */
export function customBearer(): MiddlewareHandler {
  return createMiddleware((c, next) => {
    const token = getEnv(c).AUTH_TOKEN;
    if (!token) {
      return Promise.resolve(
        sendError(c, "Missing AUTH_TOKEN", HttpStatus.UNAUTHORIZED)
      );
    }
    return bearerAuth({ token })(c, next);
  });
}
