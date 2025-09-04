import { OpenAPIHono } from "@hono/zod-openapi";
import { createMarkdownFromOpenApi } from "@scalar/openapi-to-markdown";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";
import {
  AUTH_PATH,
  BASE_PATH,
  GLOB_AUTH_PATH,
  HEALTH_ROUTE,
  LLMS_TXT_ROUTE,
  OPENAPI_DOC_ROUTE,
  SCALAR_UI_ROUTE,
} from "@/data/base-path";
import { API_NAME, API_VERSION, OPENAPI_VERSION } from "@/data/openapi";
import {
  contentSecurityPolicy,
  permissionsPolicy,
} from "@/data/secure-headers";
import { exampleRouter } from "@/routers/example.router";
import { healthRouter } from "@/routers/health.router";
import { scalarRouter } from "@/routers/scalar.router";
import { customCors } from "@/zap/middlewares/cors.middleware";
import { customRateLimit } from "@/zap/middlewares/rate-limit.middleware";
import type { Env } from "@/zap/utils/env";
import { HttpStatus } from "@/zap/utils/http";
import { sendError } from "@/zap/utils/response";
import { formatZodErrors } from "@/zap/utils/zod";
import { customBearer } from "./zap/middlewares/bearer.middleware";

export const app = new OpenAPIHono<Env>({
  defaultHook: (result, c) => {
    if (!result.success) {
      return sendError(c, "Validation Error", HttpStatus.UNPROCESSABLE_ENTITY, {
        errors: formatZodErrors(result),
      });
    }
  },
});

export const api = app.basePath(BASE_PATH);
export const authApi = api.basePath(AUTH_PATH);

// core middlewares
api.use(
  secureHeaders({
    permissionsPolicy,
    contentSecurityPolicy,
  })
);
api.use(requestId());
api.use(logger());
api.use(customCors());
api.use(customRateLimit());
api.use(GLOB_AUTH_PATH, customBearer());

if (process.env.NODE_ENV === "development") {
  api.use(prettyJSON());
}

// API routes
export const routes = api
  .route(HEALTH_ROUTE, healthRouter)
  .route(SCALAR_UI_ROUTE, scalarRouter)
  .route("/users", exampleRouter);

// OpenAPI documentation
api.doc(OPENAPI_DOC_ROUTE, {
  openapi: OPENAPI_VERSION,
  info: {
    title: API_NAME,
    version: API_VERSION,
  },
});

// llms.txt
const content = api.getOpenAPI31Document({
  openapi: OPENAPI_VERSION,
  info: { title: API_NAME, version: API_VERSION },
});

const markdown = await createMarkdownFromOpenApi(JSON.stringify(content));

api.get(LLMS_TXT_ROUTE, (c) => {
  return c.text(markdown);
});

// not found
api.notFound((c) => {
  return sendError(c, "Not Found", HttpStatus.NOT_FOUND);
});

// global error handler
api.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  // biome-ignore lint/suspicious/noConsole: log the error server-side with requestId
  console.error({ requestId: c.get("requestId"), err }, "Unhandled error");

  return sendError(
    c,
    "Internal Server Error",
    HttpStatus.INTERNAL_SERVER_ERROR,
    { requestId: c.get("requestId") }
  );
});

export default app;
