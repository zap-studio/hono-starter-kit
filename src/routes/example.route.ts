import { createRoute } from "@hono/zod-openapi";
import {
  UserCreateSchema,
  UserParamsSchema,
  UserQuerySchema,
  UserSchema,
} from "@/schemas/example.schema";
import {
  errorWithMessage,
  successWithData,
  successWithPagination,
} from "@/zap/utils/schemas";

// List users (with pagination and filter)
export const listUsersRoute = createRoute({
  method: "get",
  path: "/",
  request: {
    query: UserQuerySchema,
  },
  responses: {
    200: {
      description: "List all users with pagination and filter",
      content: {
        "application/json": {
          schema: successWithPagination(UserSchema),
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
    params: UserParamsSchema,
  },
  responses: {
    200: {
      description: "Get user by ID",
      content: {
        "application/json": {
          schema: successWithData(UserSchema),
        },
      },
    },
    404: {
      description: "User not found",
      content: {
        "application/json": {
          schema: errorWithMessage("User not found", "User not found"),
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
          schema: successWithData(UserSchema),
        },
      },
    },
    422: {
      description: "Invalid input",
      content: {
        "application/json": {
          schema: errorWithMessage("Invalid input", "Invalid input"),
        },
      },
    },
  },
});
