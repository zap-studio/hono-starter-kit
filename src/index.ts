import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { createMarkdownFromOpenApi } from "@scalar/openapi-to-markdown";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";
import { BASE_PATH, PREFIX, VERSION } from "@/data/base-path";
import {
  API_NAME,
  API_VERSION,
  OPENAPI_DOC_ROUTE,
  OPENAPI_VERSION,
  SCALAR_UI_ROUTE,
} from "@/data/openapi";
import { healthRouter } from "@/routers/health.router";
import { customCors } from "@/zap/middlewares/custom-cors.middleware";
import type { Env } from "@/zap/utils/env";
import { HttpStatus } from "@/zap/utils/http";
import { sendError } from "@/zap/utils/response";
import { formatZodErrors } from "@/zap/utils/zod";
import { exampleRouter } from "./routers/example.router";

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

// core middlewares
api.use(secureHeaders());
api.use(requestId());
api.use(logger());
api.use(customCors());
api.use(prettyJSON());

// API routes
export const routes = api
  .route("/health", healthRouter)
  .route("/users", exampleRouter);

// OpenAPI documentation
api.doc(OPENAPI_DOC_ROUTE, {
  openapi: OPENAPI_VERSION,
  info: {
    title: API_NAME,
    version: API_VERSION,
  },
});

api.get(
  SCALAR_UI_ROUTE,
  Scalar({ url: `${PREFIX}${VERSION}${OPENAPI_DOC_ROUTE}` })
);

// llms.txt
const content = api.getOpenAPI31Document({
  openapi: OPENAPI_VERSION,
  info: { title: API_NAME, version: API_VERSION },
});

const markdown = await createMarkdownFromOpenApi(JSON.stringify(content));

api.get("/llms.txt", (c) => {
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

  return sendError(
    c,
    "Internal Server Error",
    HttpStatus.INTERNAL_SERVER_ERROR,
    { cause: err, requestId: c.get("requestId") }
  );
});

export default app;
