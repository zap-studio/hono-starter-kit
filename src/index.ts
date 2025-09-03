import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { createMarkdownFromOpenApi } from "@scalar/openapi-to-markdown";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import type { RequestIdVariables } from "hono/request-id";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";
import type { Bindings } from "@/lib/env";
import {
  createUserRoute,
  getUserRoute,
  listUsersRoute,
} from "@/routes/example.route";
import { health } from "@/routes/health.route";
import { createUser, getUser, listUsers } from "@/services/example.service";
import { customCors } from "@/zap/middlewares/custom-cors";
import { HttpStatus } from "@/zap/utils/http";
import { sendError, sendJson } from "@/zap/utils/response";
import { formatZodErrors } from "@/zap/utils/zod";

export const app = new OpenAPIHono<{
  Bindings: Bindings;
  Variables: RequestIdVariables;
}>({
  defaultHook: (result, c) => {
    if (!result.success) {
      return sendError(c, "Validation Error", HttpStatus.UNPROCESSABLE_ENTITY, {
        errors: formatZodErrors(result),
      });
    }
  },
});

// API base path
const PREFIX = "/api";
const VERSION = "/v1";
const api = app.basePath(`${PREFIX}${VERSION}`);

// core middlewares
app.use(secureHeaders());
app.use(requestId());
app.use(logger());
app.use(customCors());
app.use(prettyJSON());

// API routes
api.get("/", (c) => {
  return sendJson(
    c,
    { message: "Welcome to hono-starter-kit by Zap Studio!" },
    HttpStatus.OK
  );
});

api.openapi(health, (c) => {
  return sendJson(
    c,
    { status: "ok", timestamp: Date.now(), version: API_VERSION },
    HttpStatus.OK
  );
});

api.openapi(listUsersRoute, (c) => {
  const { page = "1", limit = "10", q } = c.req.valid("query");
  const pageNum = Number.parseInt(page, 10);
  const limitNum = Number.parseInt(limit, 10);

  let users = listUsers();
  if (q) {
    const query = q.toLowerCase();
    users = users.filter((user) =>
      Object.values(user)
        .map((v) => String(v).toLowerCase())
        .some((v) => v.includes(query))
    );
  }
  const total = users.length;
  const start = (pageNum - 1) * limitNum;
  const paginated = users.slice(start, start + limitNum);

  return sendJson(c, paginated, HttpStatus.OK, {
    total,
    page: pageNum,
    limit: limitNum,
  });
});

api.openapi(getUserRoute, (c) => {
  const { id } = c.req.valid("param");
  const user = getUser(id);
  if (!user) {
    return sendError(c, "User not found", HttpStatus.NOT_FOUND);
  }
  return sendJson(c, user, HttpStatus.OK);
});

api.openapi(createUserRoute, (c) => {
  const input = c.req.valid("json");
  const user = createUser(input);
  return sendJson(c, user, HttpStatus.CREATED);
});

// OpenAPI documentation
const OPENAPI_DOC_ROUTE = "/docs";
const SCALAR_UI_ROUTE = "/scalar";

const API_NAME = "Zap Studio";
const API_VERSION = "1.0.0";
const OPENAPI_VERSION = "3.1.0";

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

// Get the OpenAPI document
const content = api.getOpenAPI31Document({
  openapi: OPENAPI_VERSION,
  info: { title: API_NAME, version: API_VERSION },
});

const markdown = await createMarkdownFromOpenApi(JSON.stringify(content));

api.get("/llms.txt", (c) => {
  return c.text(markdown);
});

// not found
app.notFound((c) => {
  return sendError(c, "Not Found", HttpStatus.NOT_FOUND);
});

// global error handler
app.onError((err, c) => {
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

export type App = typeof app;
export default app;
