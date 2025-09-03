import { z } from "@hono/zod-openapi";

export const HealthResponseSchema = z.object({
  ok: z.literal(true).openapi({
    description: "Indicates the health status of the service",
    example: true,
  }),
  data: z.any().openapi({
    description: "Additional data about the health status",
    example: { timestamp: Date.now() },
  }),
});
