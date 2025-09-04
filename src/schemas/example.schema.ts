import { z } from "@hono/zod-openapi";

// Input schema for creating a user
export const UserCreateSchema = z.object({
  email: z.email().openapi({
    description: "The user's email address",
    example: "user@example.com",
  }),
  name: z.string().min(1).openapi({
    description: "The user's name",
    example: "John Doe",
  }),
});

// Full user schema with ID
export const UserSchema = UserCreateSchema.extend({
  id: z.uuid().openapi({
    description: "The user's unique identifier",
    example: "550e8400-e29b-41d4-a716-446655440000",
  }),
});

export type User = z.infer<typeof UserSchema>;
