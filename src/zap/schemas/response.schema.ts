import { z } from "@hono/zod-openapi";

export const ApiSuccessSchema = z
  .object({
    ok: z.literal(true).openapi({
      description: "Indicates a successful response",
      example: true,
    }),
  })
  .openapi({
    description: "API success response",
    example: { ok: true },
  });

export const ApiErrorSchema = z
  .object({
    ok: z
      .literal(false)
      .openapi({ description: "Indicates an error response", example: false }),
    error: z.string().openapi({
      description: "Error message",
      example: "Something went wrong",
    }),
  })
  .openapi({
    description: "API error response",
    example: { ok: false, error: "Something went wrong" },
  });

export const PaginatedMetaSchema = z
  .object({
    total: z
      .number()
      .openapi({ description: "Total number of items", example: 100 }),
    page: z
      .number()
      .openapi({ description: "Current page number", example: 1 }),
    limit: z.number().openapi({ description: "Items per page", example: 10 }),
  })
  .openapi({
    description: "Pagination metadata",
    example: { total: 100, page: 1, limit: 10 },
  });
