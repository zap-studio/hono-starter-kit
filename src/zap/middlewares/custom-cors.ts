import { cors } from "hono/cors";
import { createMiddleware } from "hono/factory";
import type { Bindings } from "@/lib/env";
import { parseOrigins } from "../utils/parsing";

const CORS_MAX_AGE_SECONDS = 600;
export const CORS_DEFAULT_ORIGIN = "*";

export const customCors = () =>
  createMiddleware<{ Bindings: Bindings }>((c, next) => {
    const rawOrigins = parseOrigins(c.env.CORS_ORIGINS);

    // Normalize, trim, remove empty and duplicates
    const uniqueOrigins = Array.from(
      new Set(rawOrigins.map((o) => o.trim()).filter(Boolean))
    );

    // Determine final origin(s)
    let origin: string | string[];
    if (uniqueOrigins.length === 0) {
      origin = CORS_DEFAULT_ORIGIN;
    } else if (
      uniqueOrigins.includes(CORS_DEFAULT_ORIGIN) &&
      uniqueOrigins.length > 1
    ) {
      origin = uniqueOrigins.filter((o) => o !== CORS_DEFAULT_ORIGIN);
    } else {
      origin = uniqueOrigins.length === 1 ? uniqueOrigins[0] : uniqueOrigins;
    }

    const credentials = origin !== CORS_DEFAULT_ORIGIN;

    return cors({
      origin,
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization", "X-Request-Id"],
      exposeHeaders: ["X-Request-Id"],
      maxAge: CORS_MAX_AGE_SECONDS,
      credentials,
    })(c, next);
  });
