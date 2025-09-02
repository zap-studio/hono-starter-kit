import { cors } from "hono/cors";
import { createMiddleware } from "hono/factory";
import type { Bindings } from "@/lib/env";
import { parseOrigins } from "../utils/parsing";

const CORS_MAX_AGE_SECONDS = 600;
export const CORS_DEFAULT_ORIGIN = "*";

export const customCors = () =>
  createMiddleware<{ Bindings: Bindings }>((c, next) => {
    const uniqueOrigins = Array.from(new Set(parseOrigins(c.env.CORS_ORIGINS)));

    const onlyWildcard =
      uniqueOrigins.length === 1 && uniqueOrigins[0] === CORS_DEFAULT_ORIGIN;

    const origin = onlyWildcard ? CORS_DEFAULT_ORIGIN : uniqueOrigins;

    return cors({
      origin,
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowHeaders: [
        "Content-Type",
        "Authorization",
        "X-Request-Id",
        "X-Powered-By",
      ],
      exposeHeaders: ["X-Request-Id", "X-Powered-By"],
      maxAge: CORS_MAX_AGE_SECONDS,
      credentials: !onlyWildcard,
    })(c, next);
  });
