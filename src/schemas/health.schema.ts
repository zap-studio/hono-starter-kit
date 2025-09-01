import { z } from '@hono/zod-openapi';

export const HealthResponseSchema = z.object({
  ok: z.literal(true),
  data: z.any(),
});
