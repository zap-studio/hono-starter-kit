/**
 * Represents HTTP status codes.
 */
export const HttpStatus = {
  /** OK: The request has succeeded. */
  OK: 200,
  /** CREATED: The request has been fulfilled and has resulted in one or more new resources being created. */
  CREATED: 201,
  /** ACCEPTED: The request has been accepted for processing, but the processing has not been completed. */
  ACCEPTED: 202,
  /** BAD_REQUEST: The server cannot or will not process the request due to a client error. */
  BAD_REQUEST: 400,
  /** UNAUTHORIZED: Authentication is required and has failed or has not yet been provided. */
  UNAUTHORIZED: 401,
  /** FORBIDDEN: The request was valid, but the server is refusing action. */
  FORBIDDEN: 403,
  /** NOT_FOUND: The requested resource could not be found. */
  NOT_FOUND: 404,
  /** REQUEST_TIMEOUT: The server timed out waiting for the request. */
  REQUEST_TIMEOUT: 408,
  /** CONFLICT: The request could not be completed due to a conflict with the current state of the resource. */
  CONFLICT: 409,
  /** UNPROCESSABLE_ENTITY: The request was well-formed but could not be followed due to semantic errors. */
  UNPROCESSABLE_ENTITY: 422,
  /** RATE_LIMITED: The user has sent too many requests in a given amount of time. */
  RATE_LIMITED: 429,
  /** INTERNAL_SERVER_ERROR: An unexpected error occurred on the server. */
  INTERNAL_SERVER_ERROR: 500,
} as const;
