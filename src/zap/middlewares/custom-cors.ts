import { cors } from "hono/cors";
import { createMiddleware } from "hono/factory";

const CORS_MAX_AGE_SECONDS = 600;
const CORS_DEFAULT_ORIGIN = "*";

export const customCors = () => {
  return createMiddleware((c, next) => {
    const origins = c.env.CORS_ORIGINS;
    let normalizedOrigins: string[];

    if (typeof origins === "string") {
      normalizedOrigins = origins
        .split(",")
        .map((_origin) => _origin.trim())
        .filter(Boolean);
    } else if (Array.isArray(origins)) {
      normalizedOrigins = origins
        .map((_origin) => _origin.trim())
        .filter(Boolean);
    } else {
      normalizedOrigins = [CORS_DEFAULT_ORIGIN];
    }

    const uniqueOrigins = Array.from(new Set(normalizedOrigins));

    const hasWildcard = uniqueOrigins.includes(CORS_DEFAULT_ORIGIN);
    const origin = hasWildcard ? CORS_DEFAULT_ORIGIN : uniqueOrigins;

    const corsMiddlewareHandler = cors({
      origin,
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization", "X-Request-Id"],
      exposeHeaders: ["X-Request-Id"],
      maxAge: CORS_MAX_AGE_SECONDS,
      credentials: !hasWildcard,
    });

    return corsMiddlewareHandler(c, next);
  });
};
