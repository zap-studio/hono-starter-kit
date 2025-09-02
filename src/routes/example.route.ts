import { createRoute, z } from "@hono/zod-openapi";
import { UserCreateSchema, UserSchema } from "@/schemas/example.schema";

// List users (with pagination and filter)
export const listUsersRoute = createRoute({
  method: "get",
  path: "/users",
  request: {
    query: z.object({
      page: z
        .string()
        .regex(/^[1-9]\d*$/)
        .optional(), // page number as string but must be a positive integer
      limit: z
        .string()
        .regex(/^[1-9]\d*$/)
        .optional(), // items per page as string but must be a positive integer
      q: z.string().optional(), // filter query
    }),
  },
  responses: {
    200: {
      description: "List all users with pagination and filter",
      content: {
        "application/json": {
          schema: z.object({
            ok: z.literal(true),
            data: z.array(UserSchema),
            meta: z.object({
              total: z.number(),
              page: z.number(),
              limit: z.number(),
            }),
          }),
        },
      },
    },
  },
});

// Get user by ID
export const getUserRoute = createRoute({
  method: "get",
  path: "/users/{id}",
  request: {
    params: z.object({
      id: z.uuid(),
    }),
  },
  responses: {
    200: {
      description: "Get user by ID",
      content: {
        "application/json": {
          schema: z.object({
            ok: z.literal(true),
            data: UserSchema,
          }),
        },
      },
    },
    404: {
      description: "User not found",
      content: {
        "application/json": {
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
  method: "post",
  path: "/users",
  request: {
    body: {
      content: {
        "application/json": {
          schema: UserCreateSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "User created",
      content: {
        "application/json": {
          schema: z.object({
            ok: z.literal(true),
            data: UserSchema,
          }),
        },
      },
    },
    400: {
      description: "Invalid input",
      content: {
        "application/json": {
          schema: z.object({
            ok: z.literal(false),
            error: z.string(),
          }),
        },
      },
    },
  },
});
