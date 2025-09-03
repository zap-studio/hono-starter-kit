import type { ValidationTargets } from "hono";
import type { ZodError } from "zod";

/**
 * Parameters for formatting Zod errors.
 */
type FormatZodErrorsParams<T = unknown> = {
  /**
   * The target of the validation (e.g., "body", "query", "params").
   */
  target: keyof ValidationTargets;
  /**
   * Indicates whether the validation was successful.
   */
  success: false;
  /**
   * The error object returned by Zod.
   */
  error: ZodError<T>;
};

/**
 * Format Zod errors for API responses.
 * @param result The validation result from Zod.
 * @returns An array of formatted error messages.
 */
export function formatZodErrors<T = unknown>(result: FormatZodErrorsParams<T>) {
  return result.error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
    code: issue.code,
    target: result.target,
  }));
}
