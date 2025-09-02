import { createRoute } from "@hono/zod-openapi";
import { HealthResponseSchema } from "@/schemas/health.schema";

export const health = createRoute({
  method: "get",
  path: "/health",
  responses: {
    200: {
      description: "Healthcheck",
      content: {
        "application/json": {
          schema: HealthResponseSchema,
        },
      },
    },
  },
});
