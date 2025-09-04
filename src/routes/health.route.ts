import { createRoute } from "@hono/zod-openapi";
import { HealthDataSchema } from "@/schemas/health.schema";
import { successWithData } from "@/zap/utils/schemas";

export const health = createRoute({
  method: "get",
  path: "/",
  responses: {
    200: {
      description: "Healthcheck",
      content: {
        "application/json": {
          schema: successWithData(HealthDataSchema),
        },
      },
    },
  },
});
