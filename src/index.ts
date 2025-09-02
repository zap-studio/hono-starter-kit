import { OpenAPIHono } from '@hono/zod-openapi';
import { HTTPException } from 'hono/http-exception';
import { logger } from 'hono/logger';
import { poweredBy } from 'hono/powered-by';
import { prettyJSON } from 'hono/pretty-json';
import type { RequestIdVariables } from 'hono/request-id';
import { requestId } from 'hono/request-id';
import { secureHeaders } from 'hono/secure-headers';
import { timeout } from 'hono/timeout';
import type { Bindings } from '@/lib/env';
import { AppError, HttpStatus, toAppError } from '@/lib/errors';
import { customCors } from '@/middlewares/custom-cors';
import {
  createUserRoute,
  getUserRoute,
  listUsersRoute,
} from '@/routes/example.route';
import { health } from '@/routes/health.route';
import { createUser, getUser, listUsers } from '@/services/example.service';
import { send, sendError } from '@/utils/response';

export const app = new OpenAPIHono<{
  Bindings: Bindings;
  Variables: RequestIdVariables;
}>();

// core middlewares
const SERVER_NAME = 'Zap Studio';

const TIMEOUT_IN_MS = 300_000; // 5 minutes
const SECONDS_IN_MS = 1000;
const customTimeoutException = () =>
  new HTTPException(HttpStatus.REQUEST_TIMEOUT, {
    message: `Request timeout after waiting ${TIMEOUT_IN_MS / SECONDS_IN_MS} seconds. Please try again later.`,
  });

app.use(poweredBy({ serverName: SERVER_NAME }));
app.use(secureHeaders());
app.use(requestId());
app.use(logger());
app.use(customCors());
app.use(prettyJSON());
app.use(timeout(TIMEOUT_IN_MS, customTimeoutException));

// API routes

app.get('/', (c) => {
  return send(
    c,
    { message: 'Welcome to hono-starter-kit by Zap Studio!' },
    HttpStatus.OK
  );
});

const PREFIX = '/api';
const VERSION = '/v1';
const api = app.basePath(`${PREFIX}${VERSION}`);

// routes
api.openapi(health, (c) => {
  return send(
    c,
    { status: 'ok', timestamp: Date.now(), version: API_VERSION },
    HttpStatus.OK
  );
});

api.openapi(listUsersRoute, (c) => {
  const { page = '1', limit = '10', q } = c.req.valid('query');
  const pageNum = Number.parseInt(page, 10);
  const limitNum = Number.parseInt(limit, 10);

  let users = listUsers();
  if (q) {
    users = users.filter((user) =>
      Object.values(user)
        .map((v) => String(v).toLowerCase())
        .some((v) => v.includes(q.toLowerCase()))
    );
  }
  const total = users.length;
  const start = (pageNum - 1) * limitNum;
  const paginated = users.slice(start, start + limitNum);

  return send(c, paginated, HttpStatus.OK, {
    total,
    page: pageNum,
    limit: limitNum,
  });
});

api.openapi(getUserRoute, (c) => {
  const { id } = c.req.valid('param');
  const user = getUser(id);
  if (!user) {
    return sendError(c, toAppError(AppError.notFound('User not found')));
  }
  return send(c, user, HttpStatus.OK);
});

api.openapi(createUserRoute, (c) => {
  const input = c.req.valid('json');
  try {
    const user = createUser(input);
    return send(c, user, HttpStatus.CREATED);
  } catch (error) {
    return sendError(
      c,
      toAppError(AppError.badRequest((error as Error).message))
    );
  }
});

// OpenAPI documentation
const OPENAPI_DOC_ROUTE = '/doc';
const OPENAPI_VERSION = '3.0.0';
const API_VERSION = '1.0.0';
const API_NAME = 'Zap Studio';

app.doc(OPENAPI_DOC_ROUTE, {
  openapi: OPENAPI_VERSION,
  info: {
    version: API_VERSION,
    title: API_NAME,
  },
});

// not found
app.notFound((c) => {
  return sendError(c, toAppError(new Error('Not Found')));
});

// global error handler
app.onError((err, c) => {
  const e = toAppError(err);
  return sendError(c, e);
});

export type App = typeof app;
export default app;
