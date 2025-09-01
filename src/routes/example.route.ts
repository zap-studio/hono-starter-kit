import { createRoute, z } from '@hono/zod-openapi';
import { UserCreateSchema, UserSchema } from '@/schemas/example.schema';

// List users
export const listUsersRoute = createRoute({
  method: 'get',
  path: '/users',
  responses: {
    200: {
      description: 'List all users',
      content: {
        'application/json': {
          schema: z.object({
            ok: z.literal(true),
            data: z.array(UserSchema),
          }),
        },
      },
    },
  },
});

// Get user by ID
export const getUserRoute = createRoute({
  method: 'get',
  path: '/users/{id}',
  request: {
    params: z.object({
      id: z.uuid(),
    }),
  },
  responses: {
    200: {
      description: 'Get user by ID',
      content: {
        'application/json': {
          schema: z.object({
            ok: z.literal(true),
            data: UserSchema,
          }),
        },
      },
    },
    404: {
      description: 'User not found',
      content: {
        'application/json': {
          schema: z.object({
            ok: z.literal(false),
            error: z.string(),
          }),
        },
      },
    },
  },
});

// Create user
export const createUserRoute = createRoute({
  method: 'post',
  path: '/users',
  request: {
    body: {
      content: {
        'application/json': {
          schema: UserCreateSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'User created',
      content: {
        'application/json': {
          schema: z.object({
            ok: z.literal(true),
            data: UserSchema,
          }),
        },
      },
    },
    400: {
      description: 'Invalid input',
      content: {
        'application/json': {
          schema: z.object({
            ok: z.literal(false),
            error: z.string(),
          }),
        },
      },
    },
  },
});
