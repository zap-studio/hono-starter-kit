import { z } from "@hono/zod-openapi";
import {
  ApiErrorSchema,
  ApiSuccessSchema,
  PaginatedMetaSchema,
} from "../schemas/response.schema";

/**
 * Wraps a successful response with data
 * @param schema The schema for the response data
 * @returns A schema for a successful response with the given data schema
 */
export function successWithData<T extends z.ZodTypeAny>(schema: T) {
  return ApiSuccessSchema.extend({ data: schema });
}

/**
 * Wraps a successful response with pagination
 * @param schema The schema for the response data
 * @returns A schema for a successful response with pagination
 */
export function successWithPagination<T extends z.ZodTypeAny>(schema: T) {
  return ApiSuccessSchema.extend({
    data: z.array(schema),
    meta: PaginatedMetaSchema,
  });
}

/**
 * Wraps an error response with a message
 * @param description The description of the error
 * @param example An example error message
 * @returns A schema for an error response with the given description and example
 */
export function errorWithMessage(description: string, example: string) {
  return ApiErrorSchema.openapi({
    description,
    example: { ok: false, error: example },
  });
}
