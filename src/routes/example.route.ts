import { createRoute } from "@hono/zod-openapi";
import {
  CreateUserBadRequestResponseSchema,
  CreateUserResponseSchema,
  GetUserNotFoundResponseSchema,
  GetUserParamsSchema,
  GetUserResponseSchema,
  ListUsersQuerySchema,
  ListUsersResponseSchema,
  UserCreateSchema,
} from "@/schemas/example.schema";

// List users (with pagination and filter)
export const listUsersRoute = createRoute({
  method: "get",
  path: "/",
  request: {
    query: ListUsersQuerySchema,
  },
  responses: {
    200: {
      description: "List all users with pagination and filter",
      content: {
        "application/json": {
          schema: ListUsersResponseSchema,
        },
      },
    },
  },
});

// Get user by ID
export const getUserRoute = createRoute({
  method: "get",
  path: "/{id}",
  request: {
    params: GetUserParamsSchema,
  },
  responses: {
    200: {
      description: "Get user by ID",
      content: {
        "application/json": {
          schema: GetUserResponseSchema,
        },
      },
    },
    404: {
      description: "User not found",
      content: {
        "application/json": {
          schema: GetUserNotFoundResponseSchema,
        },
      },
    },
  },
});

// Create user
export const createUserRoute = createRoute({
  method: "post",
  path: "/",
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
          schema: CreateUserResponseSchema,
        },
      },
    },
    400: {
      description: "Invalid input",
      content: {
        "application/json": {
          schema: CreateUserBadRequestResponseSchema,
        },
      },
    },
  },
});
