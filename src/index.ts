import { OpenAPIHono } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { poweredBy } from "hono/powered-by";
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
import { sendJson } from "@/zap/utils/response";

export const app = new OpenAPIHono<{
  Bindings: Bindings;
  Variables: RequestIdVariables;
}>();

// core middlewares
const SERVER_NAME = "Zap Studio";

app.use(poweredBy({ serverName: SERVER_NAME }));
app.use(secureHeaders());
app.use(requestId());
app.use(logger());
app.use(customCors());
app.use(prettyJSON());

// API routes
const PREFIX = "/api";
const VERSION = "/v1";
const api = app.basePath(`${PREFIX}${VERSION}`);

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
    throw new HTTPException(HttpStatus.NOT_FOUND, {
      message: "User not found",
    });
  }
  return sendJson(c, user, HttpStatus.OK);
});

api.openapi(createUserRoute, (c) => {
  const input = c.req.valid("json");
  const user = createUser(input);
  return sendJson(c, user, HttpStatus.CREATED);
});

// OpenAPI documentation
const OPENAPI_DOC_ROUTE = "/doc";
const OPENAPI_VERSION = "3.0.0";
const API_VERSION = "1.0.0";
const API_NAME = "Zap Studio";

api.doc(OPENAPI_DOC_ROUTE, {
  openapi: OPENAPI_VERSION,
  info: {
    version: API_VERSION,
    title: API_NAME,
  },
});

// not found
app.notFound((c) => {
  return sendJson(c, { message: "Not Found" }, HttpStatus.NOT_FOUND);
});

// global error handler
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  return sendJson(
    c,
    { message: "Internal Server Error" },
    HttpStatus.INTERNAL_SERVER_ERROR
  );
});

export type App = typeof app;
export default app;
