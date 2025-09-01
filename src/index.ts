import { OpenAPIHono } from '@hono/zod-openapi';
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

export const app = new OpenAPIHono<{ Bindings: Bindings }>();

// attach the app instance so openapi routes can delegate
app.use(async (c, next) => {
  c.env.APP = app;
  await next();
});

// core middleware
// TODO: to implement: logging, rate limiting, cors, request id, etc.

// routes
app.openapi(health, (c) => {
  return c.json(
    {
      ok: true,
      data: { status: 'ok', timestamp: Date.now() },
    },
    HttpStatus.OK
  );
});

app.openapi(listUsersRoute, (c) => {
  return c.json({ ok: true, data: listUsers() }, HttpStatus.OK);
});

app.openapi(getUserRoute, (c) => {
  const { id } = c.req.valid('param');
  const user = getUser(id);
  if (!user) {
    return c.json({ ok: false, error: 'User not found' }, HttpStatus.NOT_FOUND);
  }
  return c.json({ ok: true, data: user }, HttpStatus.OK);
});

app.openapi(createUserRoute, (c) => {
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

// OpenAPI documentation
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'My API',
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
