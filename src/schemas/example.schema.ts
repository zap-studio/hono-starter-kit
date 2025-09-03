import { z } from "@hono/zod-openapi";
import {
  ApiErrorSchema,
  ApiSuccessSchema,
  PaginatedMetaSchema,
} from "@/zap/schemas/response.schema";

export const UserCreateSchema = z
  .object({
    email: z.email().openapi({
      description: "The user's email address",
      example: "user@example.com",
    }),
    name: z
      .string()
      .min(1)
      .openapi({ description: "The user's name", example: "John Doe" }),
  })
  .openapi({
    description: "Schema for creating a new user",
    example: {
      email: "user@example.com",
      name: "John Doe",
    },
  });

export const UserSchema = UserCreateSchema.extend({
  id: z.uuid().openapi({
    param: {
      name: "id",
      in: "path",
      required: true,
    },
    description: "The user's unique identifier",
    example: "550e8400-e29b-41d4-a716-446655440000",
  }),
}).openapi({
  description: "Full user schema including ID",
  example: {
    id: "550e8400-e29b-41d4-a716-446655440000",
    email: "user@example.com",
    name: "John Doe",
  },
});

export const ListUsersQuerySchema = z
  .object({
    page: z
      .string()
      .regex(/^[1-9]\d*$/)
      .optional()
      .openapi({
        description: "Page number (positive integer as string)",
        example: "1",
      }),
    limit: z
      .string()
      .regex(/^[1-9]\d*$/)
      .optional()
      .openapi({
        description: "Items per page (positive integer as string)",
        example: "10",
      }),
    q: z
      .string()
      .optional()
      .openapi({ description: "Filter query", example: "john" }),
  })
  .openapi({
    description: "Query parameters for listing users",
    example: { page: "1", limit: "10", q: "john" },
  });

export const GetUserParamsSchema = z
  .object({
    id: z.uuid().openapi({
      param: {
        name: "id",
        in: "path",
        required: true,
      },
      description: "User ID (UUID)",
      example: "550e8400-e29b-41d4-a716-446655440000",
    }),
  })
  .openapi({
    description: "Path parameters for getting a user",
    example: { id: "550e8400-e29b-41d4-a716-446655440000" },
  });

export const ListUsersResponseSchema = ApiSuccessSchema.extend({
  data: z.array(UserSchema),
  meta: PaginatedMetaSchema,
}).openapi({
  description: "Successful response for listing users",
  example: {
    ok: true,
    data: [
      {
        id: "550e8400-e29b-41d4-a716-446655440000",
        email: "user@example.com",
        name: "John Doe",
      },
    ],
    meta: { total: 1, page: 1, limit: 10 },
  },
});

export const GetUserResponseSchema = ApiSuccessSchema.extend({
  data: UserSchema,
}).openapi({
  description: "Successful response for getting a user",
  example: {
    ok: true,
    data: {
      id: "550e8400-e29b-41d4-a716-446655440000",
      email: "user@example.com",
      name: "John Doe",
    },
  },
});

export const GetUserNotFoundResponseSchema = ApiErrorSchema.openapi({
  description: "Error response when user is not found",
  example: {
    ok: false,
    error: "User not found",
  },
});

export const CreateUserResponseSchema = ApiSuccessSchema.extend({
  data: UserSchema,
}).openapi({
  description: "Successful response for creating a user",
  example: {
    ok: true,
    data: {
      id: "550e8400-e29b-41d4-a716-446655440000",
      email: "user@example.com",
      name: "John Doe",
    },
  },
});

export const CreateUserBadRequestResponseSchema = ApiErrorSchema.openapi({
  description: "Error response for invalid user creation input",
  example: {
    ok: false,
    error: "Invalid input",
  },
});

export type User = z.infer<typeof UserSchema>;
