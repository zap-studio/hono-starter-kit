import { z } from '@hono/zod-openapi';

export const UserCreateSchema = z.object({
  email: z.email(),
  name: z.string().min(1),
});

export const UserSchema = UserCreateSchema.extend({
  id: z.uuid(),
});

export type User = z.infer<typeof UserSchema>;
