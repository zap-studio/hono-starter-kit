import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { logger } from 'hono/logger';
import { poweredBy } from 'hono/powered-by';
import { prettyJSON } from 'hono/pretty-json';
import type { RequestIdVariables } from 'hono/request-id';
import { requestId } from 'hono/request-id';
import { secureHeaders } from 'hono/secure-headers';
import { timeout } from 'hono/timeout';
import type { Bindings } from '@/lib/env';
import { HttpStatus, toAppError } from '@/lib/errors';
import {
  createUserRoute,
  getUserRoute,
  listUsersRoute,
} from '@/routes/example.route';
import { health } from '@/routes/health.route';
import { sendError } from '@/utils/response';
import { createUser, getUser, listUsers } from './services/example.service';

export const app = new OpenAPIHono<{
  Bindings: Bindings;
  Variables: RequestIdVariables;
}>();

// custom exceptions
const TIMEOUT_IN_MS = 300_000; // 5 minutes
const SECONDS_IN_MS = 1000;
const customTimeoutException = () =>
  new HTTPException(HttpStatus.REQUEST_TIMEOUT, {
    message: `Request timeout after waiting ${TIMEOUT_IN_MS / SECONDS_IN_MS} seconds. Please try again later.`,
  });

// core middlewares
const SERVER_NAME = 'Zap Studio';
const CORS_MAX_AGE_SECONDS = 600;
const CORS_DEFAULT_ORIGIN = '*';

app.use(poweredBy({ serverName: SERVER_NAME }));
app.use('*', secureHeaders());
app.use('*', requestId());
app.use('*', logger());
app.use('*', (c, next) => {
  const origins = c.env.CORS_ORIGINS;
  let normalizedOrigins: string[];

  if (typeof origins === 'string') {
    normalizedOrigins = origins
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);
  } else if (Array.isArray(origins)) {
    normalizedOrigins = origins.map((origin) => origin.trim()).filter(Boolean);
  } else {
    normalizedOrigins = [CORS_DEFAULT_ORIGIN];
  }

  const corsMiddlewareHandler = cors({
    origin: normalizedOrigins,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    maxAge: CORS_MAX_AGE_SECONDS,
    credentials: true,
  });
  return corsMiddlewareHandler(c, next);
});
app.use('*', prettyJSON());
app.use('*', timeout(TIMEOUT_IN_MS, customTimeoutException));

// API routes
const api = new OpenAPIHono<{
  Bindings: Bindings;
  Variables: RequestIdVariables;
}>();

// routes
api.openapi(health, (c) => {
  return c.json(
    {
      ok: true,
      data: { status: 'ok', timestamp: Date.now() },
    },
    HttpStatus.OK
  );
});

api.openapi(listUsersRoute, (c) => {
  return c.json({ ok: true, data: listUsers() }, HttpStatus.OK);
});

api.openapi(getUserRoute, (c) => {
  const { id } = c.req.valid('param');
  const user = getUser(id);
  if (!user) {
    return c.json({ ok: false, error: 'User not found' }, HttpStatus.NOT_FOUND);
  }
  return c.json({ ok: true, data: user }, HttpStatus.OK);
});

api.openapi(createUserRoute, (c) => {
  const input = c.req.valid('json');
  try {
    const user = createUser(input);
    return c.json({ ok: true, data: user }, HttpStatus.CREATED);
  } catch (error) {
    return c.json(
      { ok: false, error: (error as Error).message },
      HttpStatus.BAD_REQUEST
    );
  }
});

// Set API prefix and version
const PREFIX = '/api';
const VERSION = '/v1';
app.route(`${PREFIX}${VERSION}`, api);

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
