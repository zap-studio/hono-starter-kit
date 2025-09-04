import { z } from "@hono/zod-openapi";

export const HealthDataSchema = z.object({
  status: z.literal("ok").openapi({
    description: "Service status",
    example: "ok",
  }),
  version: z.string().openapi({
    description: "API version",
    example: "1.0.0",
  }),
  timestamp: z.number().openapi({
    description: "Current server timestamp (ms since epoch)",
    example: 1_736_012_345_678,
  }),
});
