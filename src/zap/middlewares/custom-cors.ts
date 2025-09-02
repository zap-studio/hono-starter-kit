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
        .map((origin) => origin.trim())
        .filter(Boolean);
    } else if (Array.isArray(origins)) {
      normalizedOrigins = origins
        .map((origin) => origin.trim())
        .filter(Boolean);
    } else {
      normalizedOrigins = [CORS_DEFAULT_ORIGIN];
    }

    const uniqueOrigins = Array.from(new Set(normalizedOrigins));

    const corsMiddlewareHandler = cors({
      origin: uniqueOrigins,
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"],
      maxAge: CORS_MAX_AGE_SECONDS,
      credentials: !uniqueOrigins.includes("*"),
    });

    return corsMiddlewareHandler(c, next);
  });
};
